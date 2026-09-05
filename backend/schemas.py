from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


# ---------------------------------------------------------
# Existing Schemas
# ---------------------------------------------------------

class StandardBase(BaseModel):
    code: Optional[str] = None
    standard_number: Optional[str] = None
    title: str
    description: Optional[str] = None


class StandardResponse(StandardBase):
    id: Optional[int] = None
    standard_id: Optional[str] = None
    domain: Optional[str] = None
    category: Optional[str] = None
    year: Optional[int] = None
    status: Optional[str] = None
    mandatory_certification: Optional[bool] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QueryRequest(BaseModel):
    query_text: str
    top_k: Optional[int] = 2


class QueryMatch(BaseModel):
    standard_id: Optional[str] = None
    standard_number: Optional[str] = None
    title: Optional[str] = None
    type: Optional[str] = None
    text: Optional[str] = None
    score: float


class QueryResponse(BaseModel):
    query: str
    cached: bool
    results: List[QueryMatch]


# ---------------------------------------------------------
# Standards Recommender Schemas (Recommend Standards Mode)
# ---------------------------------------------------------

class RecommendStandardsRequest(BaseModel):
    product_name: Optional[str] = Field(None, description="Name or title of the product")
    product_description: str = Field(
        ...,
        description="Detailed plain-language description of the product, materials, intended use, or manufacturing process."
    )
    industry_or_domain: Optional[str] = Field(
        None,
        description="Optional industry sector or domain (e.g. Food Safety, Metallurgy, Electrical, Construction)."
    )
    intended_use: Optional[str] = Field(
        None,
        description="Intended application, target audience, or distribution channel."
    )
    top_k: Optional[int] = Field(
        3,
        ge=1,
        le=10,
        description="Maximum number of recommended standards to return."
    )


class TestingLaboratoryInfo(BaseModel):
    lab_id: str
    name: str
    category: str
    city: str
    state: str
    region: str
    recognition_status: str
    primary_standards_tested: List[str] = []


class RecommendedStandardItem(BaseModel):
    standard_id: str
    standard_number: str
    title: str
    domain: Optional[str] = None
    category: Optional[str] = None
    year: Optional[int] = None
    relevance_score: float
    applicability_reason: str
    mandatory_certification: bool
    quality_control_order: Optional[str] = None
    applicable_schemes: List[str] = []
    key_requirements_summary: List[str] = []
    recommended_laboratories: List[TestingLaboratoryInfo] = []


class RecommendStandardsResponse(BaseModel):
    query: str
    product_name: Optional[str] = None
    industry_or_domain: Optional[str] = None
    total_found: int
    cached: bool
    recommendations: List[RecommendedStandardItem]
    general_guidance: Optional[str] = None
    next_steps: List[str] = []


# ---------------------------------------------------------
# Compliance Checker Schemas (Check Specs against Standard)
# ---------------------------------------------------------

class SpecificationItem(BaseModel):
    parameter: str = Field(..., description="Parameter name (e.g., 'pH Value', 'TDS', 'Tensile Strength')")
    value: Union[float, int, str] = Field(..., description="Measured test value or qualitative observation")
    unit: Optional[str] = Field(None, description="Unit of measurement (e.g., 'mg/l', 'NTU', 'MPa', '%')")


class ComplianceCheckRequest(BaseModel):
    standard_id: Optional[str] = Field(None, description="Standard ID (e.g., 'IS_10500_2012' or 'IS_1875_2020')")
    standard_number: Optional[str] = Field(None, description="Standard Number (e.g., 'IS 10500' or 'IS 1875')")
    product_name: Optional[str] = Field(None, description="Optional name/batch of the product being tested")
    specifications: Optional[List[SpecificationItem]] = Field(
        default_factory=list,
        description="List of structured test parameter specifications"
    )
    raw_specs_text: Optional[str] = Field(
        None,
        description="Free-text paragraph of specifications/test results to be automatically parsed"
    )


class ParameterEvaluation(BaseModel):
    parameter: str
    user_value: str
    acceptable_limit: Optional[str] = None
    permissible_limit: Optional[str] = None
    unit: Optional[str] = None
    status: str = Field(..., description="'PASS', 'FAIL', 'WARNING', or 'NOT_SPECIFIED'")
    remarks: str
    clause_reference: Optional[str] = None
    test_method: Optional[str] = None


class ComplianceCheckResponse(BaseModel):
    standard_id: str
    standard_number: str
    standard_title: str
    product_name: Optional[str] = None
    verdict: str = Field(..., description="'COMPLIANT', 'PARTIALLY_COMPLIANT', 'NON_COMPLIANT', or 'INSUFFICIENT_DATA'")
    compliance_score: float = Field(..., description="Compliance percentage score between 0.0 and 100.0")
    total_evaluated: int
    passed_count: int
    failed_count: int
    warning_count: int
    parameter_evaluations: List[ParameterEvaluation]
    missing_mandatory_parameters: List[str] = []
    corrective_actions: List[str] = []
    applicable_scheme: Optional[str] = None
    testing_laboratories: List[TestingLaboratoryInfo] = []
    cached: bool