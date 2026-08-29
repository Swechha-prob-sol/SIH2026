# BIS Standards Domain Dataset

This directory contains the structured domain dataset of Indian Standards (Bureau of Indian Standards — BIS) designed for the **BIS Standards RAG Assistant** and **Compliance Checker**.

---

## 📌 Overview

The dataset provides machine-readable, schema-validated JSON representations of official Indian Standards across multiple strategic domains. It enables:
1. **Hybrid Retrieval (Semantic + Keyword)**: Clean metadata, keywords, and chunkable section hierarchies for vector embedding (`sentence-transformers/all-MiniLM-L6-v2`) and full-text search.
2. **Accurate Section-Level Citations**: Explicit section numbers, clause references, and page numbers matching official BIS documents.
3. **Automated Compliance Verification**: Structured `key_requirements` with quantifiable parameters, acceptable/permissible limits, units, and test methods.
4. **Inter-Standard Traversal**: Explicit `related_standards` relationships (`normative_reference`, `equivalent_to`, `related_test_method`).

---

## 📂 Directory Layout

```
data/
├── README.md                     # Domain dataset documentation & integration guide
├── standards_catalog.json        # Master catalog of 18 selected BIS standards across 10 domains
├── schema/
│   └── standard_schema.json     # Formal Draft-07 JSON Schema definition
└── standards/                   # Individual standard JSON files
    ├── IS_10500_2012.json       # Drinking Water — Specification (FAD 25)
    ├── IS_1599_2019.json       # Metallic Materials — Bend Test (MED 04)
    ├── IS_1599_2018.json       # Compatibility alias for IS 1599
    └── IS_1875_2020.json       # Carbon Steel Billets, Blooms, Slabs & Bars for Forgings (MTD 16)
```

---

## 📋 Master List of Selected BIS Standards (18 Standards across 10 Domains)

| # | Standard ID | Domain / Industry | Title / Scope | Status in Repo |
|---|---|---|---|---|
| 1 | **IS 10500:2012** | Food Safety & Water | Drinking Water — Specification (Potable water parameters & microbiological safety) | `converted_to_json` |
| 2 | **IS 1599:2019** | Mechanical Testing | Metallic Materials — Bend Test (Plastic deformation & crack evaluation) | `converted_to_json` |
| 3 | **IS 1875:2020** | Manufacturing / Steel | Carbon Steel Billets, Blooms, Slabs and Bars for Forgings (Classes 1–6) | `converted_to_json` |
| 4 | **IS 456:2000** | Civil & Construction | Plain and Reinforced Concrete — Code of Practice | `planned` |
| 5 | **IS 814:2004** | Welding & Consumables | Covered Electrodes for Manual Metal Arc Welding of Carbon Steel | `planned` |
| 6 | **IS 1786:2008** | Civil & Reinforcement | High Strength Deformed Steel Bars and Wires (TMT Rebars Fe 415/500/550) | `planned` |
| 7 | **IS 694:2010** | Electrical Engineering | PVC Insulated Cables for Working Voltages up to and Including 1100 V | `planned` |
| 8 | **IS 732:2019** | Electrical Installations | Code of Practice for Electrical Wiring Installations | `planned` |
| 9 | **IS 12269:2013** | Construction Materials | 53 Grade Ordinary Portland Cement — Specification | `planned` |
| 10 | **IS 2062:2011** | Structural Steel | Hot Rolled Medium and High Tensile Structural Steel — Specification | `planned` |
| 11 | **IS 1293:2019** | Consumer Electricals | Plugs and Socket-Outlets (250V / 16A) — Specification | `planned` |
| 12 | **IS 9873 (Part 1):2019** | Consumer Safety / Toys | Safety of Toys — Mechanical and Physical Safety Properties | `planned` |
| 13 | **IS 16046 (Part 2):2018** | Electronics & Batteries | Secondary Lithium-Ion Cells and Batteries for Portable Applications | `planned` |
| 14 | **IS 14697:1999** | Electrical Metering | AC Static Transformer Operated Watthour and VAR-Hour Meters (0.2S, 0.5S) | `planned` |
| 15 | **IS 15820:2009** | Assaying & Hallmarking | General Requirements for Competence of Assay and Hallmarking Centres | `planned` |
| 16 | **IS 516 (Part 1/Sec 1):2021** | Concrete Testing | Hardened Concrete Testing — Compressive, Flexural & Tensile Strength | `planned` |
| 17 | **IS 302 (Part 1):2008** | Domestic Appliances | Safety of Household and Similar Electrical Appliances — General | `planned` |
| 18 | **IS 1448 (Part 34):2013** | Petroleum & Fuels | Flash Point Determination by Pensky-Martens Closed Cup Tester | `planned` |

---

## 📐 JSON Schema Specification

All standard documents strictly adhere to `data/schema/standard_schema.json`.

### Schema Field Reference

| Field Name | Type | Description & Purpose |
|---|---|---|
| `standard_id` | `string` | Canonical ID formatted as `IS_<NUMBER>_<YEAR>` (e.g. `IS_10500_2012`). Primary key. |
| `standard_number` | `string` | Official BIS standard code (e.g. `IS 10500`). |
| `title` | `string` | Full official BIS standard title. |
| `short_title` | `string` | Display-friendly short title for UI header & cards. |
| `edition` | `string` | Revision details (e.g. `Second Revision`, `Fifth Revision`). |
| `year` | `integer` | Publication / revision year. |
| `reaffirmation_year` | `integer / null` | Latest committee reaffirmation year. |
| `status` | `string` | Lifecycle status (`Active`, `Superseded`, `Withdrawn`, `Under Revision`). |
| `domain` | `string` | Broad industrial/technical domain for high-level filtering. |
| `category` | `string` | Specialized subcategory for facet filtering. |
| `department` | `string` | BIS technical division (e.g. `Food and Agriculture Division (FAD)`). |
| `technical_committee` | `string` | BIS sectional committee code and name (e.g. `FAD 25`). |
| `ics_code` | `string` | International Classification for Standards (ICS) code. |
| `scope` | `string` | Complete verbatim/comprehensive scope text. |
| `description` | `string` | Concise abstract providing foundational context for RAG embeddings. |
| `key_requirements` | `array[object]` | Structured parameters with `parameter`, `requirement`, `acceptable_limit`, `permissible_limit`, `unit`, `test_method`, and `clause_reference`. Used directly by `/compliance-check`. |
| `sections` | `array[object]` | Hierarchical text sections (`section_number`, `title`, `content`, `page_number`, `subsections`) used for RAG text chunking and cited section returns. |
| `applicable_products_or_industries` | `array[string]` | Target industries and product classes for relevance matching. |
| `keywords` | `array[string]` | High-density semantic & keyword search tokens for BM25 and hybrid scoring. |
| `related_standards` | `array[object]` | Normative references and related standards with relationship types. |
| `source` | `string` | Authoritative body (`Bureau of Indian Standards`). |
| `source_url` | `string` | Official BIS Manakonline / Standards Portal hyperlink. |
| `citation` | `object` | Formatted citation object (`citation_text`, `standard`, `year`). |
| `metadata` | `object` | Administrative metadata (`mandatory_certification`, `quality_control_order`, `version_tag`). |

---

## 🛠️ Instructions for Member 2 (Backend & RAG Pipeline)

### 1. Ingestion & Embedding Chunking
To ingest a standard into PostgreSQL / Pinecone:
```python
import json
from pathlib import Path

def load_standard_chunks(json_path: Path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    chunks = []
    # 1. Overview chunk
    chunks.append({
        "id": f"{data['standard_id']}_overview",
        "text": f"{data['title']} ({data['standard_number']}:{data['year']}): {data['description']} Scope: {data['scope']}",
        "metadata": {
            "standard": data["standard_number"],
            "year": data["year"],
            "section": "Overview",
            "page": 1,
            "domain": data["domain"]
        }
    })
    
    # 2. Section chunks
    for sec in data["sections"]:
        chunks.append({
            "id": f"{data['standard_id']}_sec_{sec['section_number']}",
            "text": f"{data['standard_number']} Section {sec['section_number']} - {sec['title']}: {sec['content']}",
            "metadata": {
                "standard": data["standard_number"],
                "year": data["year"],
                "section": sec["section_number"],
                "page": sec["page_number"],
                "domain": data["domain"]
            }
        })
        for sub in sec.get("subsections", []):
            chunks.append({
                "id": f"{data['standard_id']}_clause_{sub['clause_number']}",
                "text": f"{data['standard_number']} Clause {sub['clause_number']} - {sub['title']}: {sub['content']}",
                "metadata": {
                    "standard": data["standard_number"],
                    "year": data["year"],
                    "section": sub["clause_number"],
                    "page": sub.get("page_number", sec["page_number"]),
                    "domain": data["domain"]
                }
            })
    return chunks
```

### 2. Compliance Evaluation
The `key_requirements` field directly feeds the `/compliance-check` endpoint:
```python
def evaluate_compliance(product_specs: dict, standard_data: dict):
    results = []
    for req in standard_data["key_requirements"]:
        param = req["parameter"]
        # Match against product specs and check thresholds
        results.append({
            "parameter": param,
            "rule": req["requirement"],
            "acceptable_limit": req["acceptable_limit"],
            "permissible_limit": req["permissible_limit"],
            "clause": req["clause_reference"]
        })
    return results
```

---

## 🧪 Validation

Run the automated data test suite:
```bash
python3 -m unittest backend/tests/test_standards_data.py
```
