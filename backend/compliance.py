import hashlib
import json
import logging
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple, Union

from sqlalchemy.orm import Session

from backend.schemas import (
    ComplianceCheckRequest,
    ComplianceCheckResponse,
    ParameterEvaluation,
    RecommendedStandardItem,
    RecommendStandardsRequest,
    RecommendStandardsResponse,
    SpecificationItem,
    TestingLaboratoryInfo,
)

logger = logging.getLogger("compliance_service")

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
STANDARDS_DIR = DATA_DIR / "standards"
SCHEMES_DIR = DATA_DIR / "schemes"
CATALOG_PATH = DATA_DIR / "standards_catalog.json"


# ---------------------------------------------------------
# Safe Redis Caching Helper
# ---------------------------------------------------------
def get_redis_client():
    try:
        from backend.redis_client import redis_client
        return redis_client
    except Exception as e:
        logger.debug(f"Redis client initialization warning: {e}")
        return None


def get_cached_json(cache_key: str) -> Optional[Dict[str, Any]]:
    client = get_redis_client()
    if not client:
        return None
    try:
        cached_data = client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        logger.debug(f"Redis get cache error for key {cache_key}: {e}")
    return None


def set_cached_json(cache_key: str, data: Dict[str, Any], ttl: int = 3600) -> None:
    client = get_redis_client()
    if not client:
        return
    try:
        client.set(cache_key, json.dumps(data), ex=ttl)
    except Exception as e:
        logger.debug(f"Redis set cache error for key {cache_key}: {e}")



# ---------------------------------------------------------
# Knowledge Base Loaders
# ---------------------------------------------------------
def load_standards_catalog() -> List[Dict[str, Any]]:
    if CATALOG_PATH.exists():
        try:
            with open(CATALOG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("standards", [])
        except Exception as e:
            logger.error(f"Error loading standards_catalog.json: {e}")
    return []


def load_all_standards_data() -> Dict[str, Dict[str, Any]]:
    standards_dict: Dict[str, Dict[str, Any]] = {}
    if STANDARDS_DIR.exists():
        for file_path in STANDARDS_DIR.glob("*.json"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    std_id = data.get("standard_id", file_path.stem)
                    standards_dict[std_id] = data
            except Exception as e:
                logger.error(f"Error reading {file_path}: {e}")
    return standards_dict


def load_all_schemes() -> List[Dict[str, Any]]:
    schemes = []
    if SCHEMES_DIR.exists():
        for file_path in SCHEMES_DIR.glob("*.json"):
            if "LAB" in file_path.name.upper():
                continue
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    schemes.append(data)
            except Exception as e:
                logger.error(f"Error reading scheme {file_path}: {e}")
    return schemes


def load_all_testing_labs() -> List[Dict[str, Any]]:
    labs_file = SCHEMES_DIR / "BIS_RECOGNIZED_LABS.json"
    if labs_file.exists():
        try:
            with open(labs_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("laboratories", [])
        except Exception as e:
            logger.error(f"Error loading testing labs: {e}")
    return []


def find_standard_by_identifier(identifier: str, db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
    if not identifier:
        return None

    clean_id = identifier.strip().upper().replace(" ", "_").replace(":", "_").replace("-", "_")
    clean_num = identifier.strip().upper().replace("_", " ")

    # 1. Check local JSON files
    all_standards = load_all_standards_data()
    for sid, sdata in all_standards.items():
        if sid.upper() == clean_id or sid.upper().startswith(clean_id):
            return sdata
        snum = sdata.get("standard_number", "").strip().upper()
        if snum == clean_num or clean_num in snum or snum in clean_num:
            return sdata

    # 2. Check catalog
    catalog = load_standards_catalog()
    for item in catalog:
        cid = item.get("standard_id", "").upper()
        cnum = item.get("standard_number", "").upper()
        if clean_id in cid or clean_num in cnum or cnum in clean_num:
            fpath = BASE_DIR / item.get("file_path", "")
            if fpath.exists():
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        return json.load(f)
                except Exception:
                    pass
            return item

    # 3. Check Database if session passed
    if db:
        try:
            from backend.models import Standard
            db_std = db.query(Standard).filter(
                (Standard.standard_id.ilike(f"%{identifier}%")) |
                (Standard.standard_number.ilike(f"%{identifier}%")) |
                (Standard.title.ilike(f"%{identifier}%"))
            ).first()
            if db_std:
                return {
                    "standard_id": db_std.standard_id,
                    "standard_number": db_std.standard_number,
                    "title": db_std.title,
                    "short_title": db_std.short_title,
                    "edition": db_std.edition,
                    "year": db_std.year,
                    "status": db_std.status,
                    "domain": db_std.domain,
                    "category": db_std.category,
                    "scope": db_std.scope,
                    "description": db_std.description,
                    "key_requirements": db_std.key_requirements or [],
                    "sections": db_std.sections or [],
                    "applicable_products_or_industries": db_std.applicable_products_or_industries or [],
                    "keywords": db_std.keywords or [],
                    "metadata": db_std.meta or {},
                }
        except Exception as e:
            logger.debug(f"DB query for standard failed: {e}")

    return None


def get_matching_labs(standard_number: str, domain: str = "") -> List[TestingLaboratoryInfo]:
    labs = load_all_testing_labs()
    matched_labs: List[TestingLaboratoryInfo] = []
    norm_std = standard_number.upper().replace("_", " ")

    for lab in labs:
        primary_stds = [s.upper() for s in lab.get("primary_standards_tested", [])]
        is_match = False

        for ps in primary_stds:
            if norm_std in ps or ps in norm_std or any(part in ps for part in norm_std.split() if len(part) > 2):
                is_match = True
                break

        if not is_match and domain:
            cat = lab.get("category", "").lower()
            if any(d.lower() in cat for d in domain.split() if len(d) > 3):
                is_match = True

        if is_match:
            matched_labs.append(TestingLaboratoryInfo(
                lab_id=lab.get("lab_id", ""),
                name=lab.get("name", ""),
                category=lab.get("category", ""),
                city=lab.get("city", ""),
                state=lab.get("state", ""),
                region=lab.get("region", ""),
                recognition_status=lab.get("recognition_status", "Recognized"),
                primary_standards_tested=lab.get("primary_standards_tested", []),
            ))

    return matched_labs[:4]


# ---------------------------------------------------------
# Feature 1: Recommend Standards Mode
# ---------------------------------------------------------
def tokenize(text: str) -> Set[str]:
    # Extract alpha-numeric tokens of length >= 2, lowercased
    return set(re.findall(r'[a-zA-Z0-9]+', text.lower()))


def compute_weighted_relevance(query_tokens: Set[str], std_data: Dict[str, Any]) -> Tuple[float, List[str]]:
    title_tokens = tokenize(std_data.get("title", ""))
    domain_tokens = tokenize(std_data.get("domain", "") + " " + std_data.get("category", ""))
    desc_tokens = tokenize(std_data.get("description", "") + " " + std_data.get("scope", ""))
    
    keywords_list = std_data.get("keywords", [])
    keyword_tokens = tokenize(" ".join(keywords_list) if isinstance(keywords_list, list) else str(keywords_list))
    
    industries_list = std_data.get("applicable_products_or_industries", [])
    industry_tokens = tokenize(" ".join(industries_list) if isinstance(industries_list, list) else str(industries_list))

    std_num_tokens = tokenize(std_data.get("standard_number", ""))

    matched_title = query_tokens.intersection(title_tokens)
    matched_std_num = query_tokens.intersection(std_num_tokens)
    matched_domain = query_tokens.intersection(domain_tokens)
    matched_keywords = query_tokens.intersection(keyword_tokens)
    matched_industry = query_tokens.intersection(industry_tokens)
    matched_desc = query_tokens.intersection(desc_tokens)

    raw_score = (
        len(matched_std_num) * 12.0 +
        len(matched_title) * 6.0 +
        len(matched_keywords) * 4.5 +
        len(matched_industry) * 4.0 +
        len(matched_domain) * 3.0 +
        len(matched_desc) * 1.0
    )

    all_matched = list(matched_title | matched_keywords | matched_industry | matched_domain | matched_desc)
    filtered_matched = [w for w in all_matched if len(w) > 2]

    return raw_score, filtered_matched


def recommend_standards(
    request: RecommendStandardsRequest,
    db: Optional[Session] = None
) -> RecommendStandardsResponse:
    query_string = f"{request.product_name or ''} {request.product_description} {request.industry_or_domain or ''} {request.intended_use or ''}".strip()
    
    # Check cache
    cache_key = f"compliance:recommend:{hashlib.sha256(f'{query_string}:{request.top_k}'.encode()).hexdigest()}"
    cached = get_cached_json(cache_key)
    if cached:
        cached["cached"] = True
        return RecommendStandardsResponse(**cached)

    catalog = load_standards_catalog()
    all_standards = load_all_standards_data()

    # 1. Try vector RAG query if pinecone/gemini initialized
    vector_matches = []
    try:
        from rag_pipeline import query_standards
        vector_matches = query_standards(query_string, top_k=8)
    except Exception as e:
        logger.debug(f"RAG retrieval fallback: {e}")

    rag_scores: Dict[str, float] = {}
    for match in vector_matches:
        meta = match.get("metadata", {})
        sid = meta.get("standard_id")
        snum = meta.get("standard_number")
        score = match.get("score", 0.0)
        if sid:
            rag_scores[sid] = max(rag_scores.get(sid, 0.0), score)
        if snum:
            rag_scores[snum] = max(rag_scores.get(snum, 0.0), score)

    # 2. Token / keyword scoring
    query_tokens = tokenize(query_string)
    scored_candidates: List[Tuple[Dict[str, Any], float, str]] = []

    for item in catalog:
        sid = item.get("standard_id", "")
        snum = item.get("standard_number", "")
        full_data = all_standards.get(sid, item)

        raw_score, matched_terms = compute_weighted_relevance(query_tokens, full_data)
        rag_score = rag_scores.get(sid, rag_scores.get(snum, 0.0))

        # Combined scoring
        combined_score = raw_score + (rag_score * 15.0)

        # Build applicability reason
        title = full_data.get("title", "")
        domain = full_data.get("domain", "")
        if matched_terms:
            reason = f"Standard {snum} ({title}) applies directly to your product based on matching parameters: {', '.join(matched_terms[:5])}."
        else:
            reason = f"Standard {snum} governs regulatory compliance for {title} in the {domain} sector."

        if full_data.get("scope"):
            reason += f" Scope: {full_data.get('scope')[:160]}..."

        scored_candidates.append((full_data, combined_score, reason))

    # Sort descending
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    top_candidates = scored_candidates[:request.top_k]

    # Calculate normalized percentage score
    max_score = scored_candidates[0][1] if scored_candidates and scored_candidates[0][1] > 0 else 1.0

    recommendations: List[RecommendedStandardItem] = []

    for std_data, score, reason in top_candidates:
        sid = std_data.get("standard_id", "")
        snum = std_data.get("standard_number", sid)
        title = std_data.get("title", "")
        domain = std_data.get("domain", "")
        category = std_data.get("category", "")
        year = std_data.get("year")

        meta = std_data.get("metadata", {})
        mandatory = std_data.get("mandatory_certification", meta.get("mandatory_certification", True))
        qco = meta.get("quality_control_order")

        # Determine applicable schemes
        applicable_schemes = []
        domain_lower = domain.lower()
        title_lower = title.lower()

        if "electronic" in domain_lower or "lithium" in title_lower or "battery" in title_lower or "cells" in title_lower:
            applicable_schemes.append("BIS Compulsory Registration Scheme (CRS — Scheme II)")
        elif "hallmark" in domain_lower or "precious" in domain_lower or "gold" in title_lower or "silver" in title_lower:
            applicable_schemes.append("BIS Assaying & Hallmarking Scheme for Precious Metals")
        elif mandatory:
            applicable_schemes.append("BIS Product Certification Scheme (ISI Mark Scheme — Scheme I)")
        else:
            applicable_schemes.append("BIS Voluntary Product Certification Scheme")

        # Key requirements summary
        reqs = std_data.get("key_requirements", [])
        key_req_summary = []
        for r in reqs[:5]:
            param = r.get("parameter", "")
            acc = r.get("acceptable_limit", "")
            unit = r.get("unit", "")
            if param:
                key_req_summary.append(f"{param}: {acc} {unit}".strip())

        if not key_req_summary and std_data.get("description"):
            key_req_summary.append(std_data.get("description")[:160])

        # Testing laboratories
        matched_labs = get_matching_labs(snum, domain)

        # Scale score between 60.0% and 98.5%
        if max_score > 0 and score > 0:
            rel_score = round(65.0 + (score / max_score) * 33.5, 1)
        else:
            rel_score = 60.0

        recommendations.append(RecommendedStandardItem(
            standard_id=sid,
            standard_number=snum,
            title=title,
            domain=domain,
            category=category,
            year=year,
            relevance_score=rel_score,
            applicability_reason=reason,
            mandatory_certification=mandatory,
            quality_control_order=qco,
            applicable_schemes=applicable_schemes,
            key_requirements_summary=key_req_summary,
            recommended_laboratories=matched_labs,
        ))

    general_guidance = (
        f"Based on your product description '{request.product_name or 'the submitted item'}', "
        f"the Bureau of Indian Standards mandates conformity with relevant Indian Standards (IS) "
        f"under the BIS Act, 2016 and Quality Control Orders (QCOs). Ensure valid factory testing "
        f"facilities and independent lab test reports before applying for licensing."
    )

    next_steps = [
        "Step 1: Perform pre-compliance testing of product samples at a BIS Recognized Testing Laboratory.",
        "Step 2: Establish in-house testing facilities adhering to the BIS Scheme of Inspection and Testing (SIT).",
        "Step 3: Submit online application (Form-I) with documentation on the Manakonline portal (services.bis.gov.in).",
        "Step 4: Undergo preliminary factory audit by BIS Inspecting Officers and achieve grant of ISI Mark / CRS license.",
    ]

    response = RecommendStandardsResponse(
        query=query_string,
        product_name=request.product_name,
        industry_or_domain=request.industry_or_domain,
        total_found=len(recommendations),
        cached=False,
        recommendations=recommendations,
        general_guidance=general_guidance,
        next_steps=next_steps,
    )

    set_cached_json(cache_key, response.model_dump())
    return response


# ---------------------------------------------------------
# Feature 2: Compliance Checker Mode
# ---------------------------------------------------------
def extract_numeric_value(val: Union[str, float, int]) -> Optional[float]:
    if isinstance(val, (int, float)):
        return float(val)
    if not isinstance(val, str):
        return None
    match = re.search(r'[-+]?\d*\.?\d+', val)
    if match:
        try:
            return float(match.group())
        except ValueError:
            return None
    return None


def parse_raw_specifications_text(raw_text: str) -> List[SpecificationItem]:
    items: List[SpecificationItem] = []
    if not raw_text:
        return items

    lines = re.split(r'[;\n,]+', raw_text)
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Pattern: Param Name: 7.5 mg/l or Param Name = 7.5
        match = re.match(r'^([^:=]+)[:=]\s*([0-9.]+)\s*([a-zA-Z/%°]*)', line)
        if match:
            param = match.group(1).strip()
            val = float(match.group(2).strip())
            unit = match.group(3).strip() or None
            items.append(SpecificationItem(parameter=param, value=val, unit=unit))
        else:
            num_match = re.search(r'^(.*?)\s+([0-9.]+)\s*([a-zA-Z/%°]*)$', line)
            if num_match:
                param = num_match.group(1).strip()
                val = float(num_match.group(2).strip())
                unit = num_match.group(3).strip() or None
                items.append(SpecificationItem(parameter=param, value=val, unit=unit))

    return items


def evaluate_parameter(
    spec: SpecificationItem,
    req: Dict[str, Any]
) -> ParameterEvaluation:
    param_name = req.get("parameter", spec.parameter)
    acc_limit = str(req.get("acceptable_limit", ""))
    perm_limit = str(req.get("permissible_limit", ""))
    unit = req.get("unit", spec.unit or "")
    clause_ref = req.get("clause_reference", "")
    test_method = req.get("test_method", "")

    user_val_raw = str(spec.value).strip()
    user_num = extract_numeric_value(spec.value)

    # 1. Zero tolerance bacteriological tests (E. coli, Coliform)
    if "shall not be detectable" in acc_limit.lower() or "not detectable" in acc_limit.lower():
        if user_val_raw.lower() in ["absent", "0", "zero", "nil", "not detected", "none", "shall not be detectable", "pass"]:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=user_val_raw,
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="PASS",
                remarks=f"Conforms strictly with microbiological safety criterion ({acc_limit}).",
                clause_reference=clause_ref,
                test_method=test_method,
            )
        else:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=user_val_raw,
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="FAIL",
                remarks=f"NON-COMPLIANT: Microbiological contaminant detected ({user_val_raw}). Mandatory zero tolerance.",
                clause_reference=clause_ref,
                test_method=test_method,
            )

    # 2. Qualitative checks (Fully killed, agreeable, etc.)
    if user_num is None:
        if acc_limit.lower() in user_val_raw.lower() or user_val_raw.lower() in acc_limit.lower():
            return ParameterEvaluation(
                parameter=param_name,
                user_value=user_val_raw,
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="PASS",
                remarks=f"Conforms to qualitative standard requirement: {acc_limit}.",
                clause_reference=clause_ref,
                test_method=test_method,
            )
        else:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=user_val_raw,
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="WARNING",
                remarks=f"Qualitative requirement '{acc_limit}' requires verification audit.",
                clause_reference=clause_ref,
                test_method=test_method,
            )

    # 3. Numeric Range check (e.g. 6.5 - 8.5, 0.18-0.28)
    range_match = re.search(r'([0-9.]+)\s*-\s*([0-9.]+)', acc_limit)
    if range_match:
        min_acc = float(range_match.group(1))
        max_acc = float(range_match.group(2))

        if min_acc <= user_num <= max_acc:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=f"{user_val_raw} {unit}".strip(),
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="PASS",
                remarks=f"Conforms to acceptable range [{min_acc} - {max_acc} {unit}].",
                clause_reference=clause_ref,
                test_method=test_method,
            )
        else:
            # Check permissible limit
            perm_range = re.search(r'([0-9.]+)\s*-\s*([0-9.]+)', perm_limit)
            if perm_range and float(perm_range.group(1)) <= user_num <= float(perm_range.group(2)):
                return ParameterEvaluation(
                    parameter=param_name,
                    user_value=f"{user_val_raw} {unit}".strip(),
                    acceptable_limit=acc_limit,
                    permissible_limit=perm_limit,
                    unit=unit,
                    status="WARNING",
                    remarks=f"Within permissible limit [{perm_limit}], but outside optimal acceptable range [{acc_limit}].",
                    clause_reference=clause_ref,
                    test_method=test_method,
                )
            return ParameterEvaluation(
                parameter=param_name,
                user_value=f"{user_val_raw} {unit}".strip(),
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="FAIL",
                remarks=f"NON-COMPLIANT: Value {user_num} {unit} violates prescribed limits (Acceptable: {acc_limit}, Permissible: {perm_limit}).",
                clause_reference=clause_ref,
                test_method=test_method,
            )

    # 4. Numeric Ceiling check (e.g. 500, 0.01, 250, <= 0.040%)
    acc_ceil = extract_numeric_value(acc_limit)
    perm_ceil = extract_numeric_value(perm_limit)

    if acc_ceil is not None:
        if user_num <= acc_ceil:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=f"{user_val_raw} {unit}".strip(),
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="PASS",
                remarks=f"Conforms to acceptable ceiling limit (<= {acc_ceil} {unit}).",
                clause_reference=clause_ref,
                test_method=test_method,
            )
        elif perm_ceil is not None and user_num <= perm_ceil and "no relaxation" not in perm_limit.lower():
            return ParameterEvaluation(
                parameter=param_name,
                user_value=f"{user_val_raw} {unit}".strip(),
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="WARNING",
                remarks=f"Exceeds acceptable limit ({acc_ceil} {unit}) but within permissible emergency limit ({perm_ceil} {unit}).",
                clause_reference=clause_ref,
                test_method=test_method,
            )
        else:
            return ParameterEvaluation(
                parameter=param_name,
                user_value=f"{user_val_raw} {unit}".strip(),
                acceptable_limit=acc_limit,
                permissible_limit=perm_limit,
                unit=unit,
                status="FAIL",
                remarks=f"NON-COMPLIANT: Value {user_num} {unit} exceeds maximum threshold ({acc_limit} / {perm_limit}).",
                clause_reference=clause_ref,
                test_method=test_method,
            )

    return ParameterEvaluation(
        parameter=param_name,
        user_value=user_val_raw,
        acceptable_limit=acc_limit,
        permissible_limit=perm_limit,
        unit=unit,
        status="PASS",
        remarks="Specification evaluated against standard criteria.",
        clause_reference=clause_ref,
        test_method=test_method,
    )


def check_compliance(
    request: ComplianceCheckRequest,
    db: Optional[Session] = None
) -> ComplianceCheckResponse:
    identifier = request.standard_id or request.standard_number or ""
    if not identifier and request.raw_specs_text:
        std_match = re.search(r'IS\s*(\d+)', request.raw_specs_text, re.IGNORECASE)
        if std_match:
            identifier = f"IS {std_match.group(1)}"

    # Compute cache key
    specs_hash = hashlib.sha256(
        json.dumps({
            "id": identifier,
            "specs": [s.model_dump() for s in request.specifications],
            "raw": request.raw_specs_text,
        }, sort_keys=True).encode()
    ).hexdigest()
    cache_key = f"compliance:check:{specs_hash}"

    cached = get_cached_json(cache_key)
    if cached:
        cached["cached"] = True
        return ComplianceCheckResponse(**cached)

    # 1. Resolve Standard
    standard_data = find_standard_by_identifier(identifier, db)
    if not standard_data:
        if any(term in str(request.raw_specs_text or '').lower() or term in [s.parameter.lower() for s in request.specifications] for term in ['ph', 'tds', 'turbidity', 'water']):
            standard_data = find_standard_by_identifier("IS 10500", db)
        elif any(term in str(request.raw_specs_text or '').lower() or term in [s.parameter.lower() for s in request.specifications] for term in ['carbon', 'steel', 'billet', 'forging']):
            standard_data = find_standard_by_identifier("IS 1875", db)
        else:
            catalog = load_standards_catalog()
            standard_data = catalog[0] if catalog else {}

    std_id = standard_data.get("standard_id", identifier or "UNKNOWN_STANDARD")
    std_num = standard_data.get("standard_number", std_id)
    std_title = standard_data.get("title", "Indian Standard Specification")
    key_reqs = standard_data.get("key_requirements", [])

    # 2. Gather Specifications
    all_specs = list(request.specifications)
    if request.raw_specs_text:
        parsed_specs = parse_raw_specifications_text(request.raw_specs_text)
        all_specs.extend(parsed_specs)

    # 3. Evaluate Parameters
    evaluations: List[ParameterEvaluation] = []
    matched_req_params = set()

    for spec in all_specs:
        spec_name_lower = spec.parameter.lower().strip()
        matched_req = None

        # Find best matching standard requirement
        for req in key_reqs:
            req_param = req.get("parameter", "")
            req_param_lower = req_param.lower()

            if spec_name_lower in req_param_lower or req_param_lower in spec_name_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            
            # Common synonyms
            if spec_name_lower == "ph" and "ph" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            if spec_name_lower == "tds" and "dissolved solids" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            if spec_name_lower in ["e. coli", "ecoli", "e coli"] and "coli" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            if spec_name_lower in ["carbon", "c"] and "carbon" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            if spec_name_lower in ["sulfur", "sulphur", "s"] and "sulfur" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break
            if spec_name_lower in ["phosphorus", "p"] and "phosphorus" in req_param_lower:
                matched_req = req
                matched_req_params.add(req_param)
                break

        if matched_req:
            eval_res = evaluate_parameter(spec, matched_req)
            evaluations.append(eval_res)
        else:
            evaluations.append(ParameterEvaluation(
                parameter=spec.parameter,
                user_value=str(spec.value),
                status="NOT_SPECIFIED",
                remarks="Parameter is not explicitly listed in key regulatory requirements table.",
            ))

    # 4. Check Missing Mandatory Parameters
    missing_params: List[str] = []
    for req in key_reqs:
        param_name = req.get("parameter", "")
        if param_name not in matched_req_params:
            missing_params.append(f"{param_name} (Acceptable: {req.get('acceptable_limit')} {req.get('unit', '')})".strip())

    # 5. Calculate Metrics and Verdict
    passed_count = sum(1 for e in evaluations if e.status == "PASS")
    failed_count = sum(1 for e in evaluations if e.status == "FAIL")
    warning_count = sum(1 for e in evaluations if e.status == "WARNING")
    total_eval = len(evaluations)

    if total_eval == 0:
        verdict = "INSUFFICIENT_DATA"
        compliance_score = 0.0
    elif failed_count > 0:
        verdict = "NON_COMPLIANT"
        compliance_score = round(max(0.0, (passed_count + 0.3 * warning_count) / total_eval * 100), 1)
    elif warning_count > 0:
        verdict = "PARTIALLY_COMPLIANT"
        compliance_score = round((passed_count + 0.6 * warning_count) / total_eval * 100, 1)
    else:
        verdict = "COMPLIANT"
        compliance_score = 100.0

    # 6. Corrective Actions
    corrective_actions: List[str] = []
    for e in evaluations:
        if e.status == "FAIL":
            param_l = e.parameter.lower()
            if "ph" in param_l:
                corrective_actions.append(f"Adjust pH dosing (alkalinity/acid neutralizing treatment) to bring {e.parameter} within 6.5 - 8.5.")
            elif "tds" in param_l:
                corrective_actions.append(f"Incorporate Reverse Osmosis (RO) or ion exchange demineralization to reduce TDS below 500 mg/l.")
            elif "turbidity" in param_l:
                corrective_actions.append(f"Enhance coagulation/flocculation or replace multi-media sand filters to reduce Turbidity <= 1 NTU.")
            elif "arsenic" in param_l or "lead" in param_l:
                corrective_actions.append(f"Deploy specialized activated alumina or adsorption resin filtration to eliminate toxic heavy metal contamination.")
            elif "coli" in param_l:
                corrective_actions.append(f"Immediate chlorination/UV disinfection required. Re-test to guarantee zero detectable coliforms per 100 ml sample.")
            elif "carbon" in param_l or "sulfur" in param_l:
                corrective_actions.append(f"Refine ladle furnace deoxidation and desulfurization flux practice to conform to chemical grade tolerances.")
            else:
                corrective_actions.append(f"Re-engineer process controls for {e.parameter} to meet mandatory limit ({e.acceptable_limit}).")

    if not corrective_actions and missing_params:
        corrective_actions.append("Conduct comprehensive laboratory testing for remaining missing mandatory parameters before submitting BIS license application.")

    # 7. Schemes & Laboratories
    applicable_scheme = "BIS ISI Mark Scheme I (Mandatory Quality Control Order)" if "10500" in std_num or "1875" in std_num else "BIS Conformity Assessment Scheme"
    testing_labs = get_matching_labs(std_num, standard_data.get("domain", ""))

    response = ComplianceCheckResponse(
        standard_id=std_id,
        standard_number=std_num,
        standard_title=std_title,
        product_name=request.product_name,
        verdict=verdict,
        compliance_score=compliance_score,
        total_evaluated=total_eval,
        passed_count=passed_count,
        failed_count=failed_count,
        warning_count=warning_count,
        parameter_evaluations=evaluations,
        missing_mandatory_parameters=missing_params[:8],
        corrective_actions=corrective_actions,
        applicable_scheme=applicable_scheme,
        testing_laboratories=testing_labs,
        cached=False,
    )

    set_cached_json(cache_key, response.model_dump())
    return response

