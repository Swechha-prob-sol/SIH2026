import unittest
from fastapi.testclient import TestClient

from backend.compliance import (
    check_compliance,
    find_standard_by_identifier,
    parse_raw_specifications_text,
    recommend_standards,
)
from backend.main import app
from backend.schemas import (
    ComplianceCheckRequest,
    RecommendStandardsRequest,
    SpecificationItem,
)


class TestComplianceAndRecommendation(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_recommend_standards_drinking_water(self):
        req = RecommendStandardsRequest(
            product_name="Mineral Water Bottle",
            product_description="Packaged natural potable drinking water in 1 liter PET bottles for retail sale",
            industry_or_domain="Food Safety & Water Quality",
            top_k=2,
        )
        res = recommend_standards(req)

        self.assertGreaterEqual(res.total_found, 1)
        top_rec = res.recommendations[0]
        self.assertEqual(top_rec.standard_number, "IS 10500")
        self.assertIn("Drinking Water", top_rec.title)
        self.assertTrue(top_rec.mandatory_certification)
        self.assertGreater(top_rec.relevance_score, 80.0)
        self.assertTrue(len(top_rec.applicable_schemes) > 0)
        self.assertTrue(len(top_rec.recommended_laboratories) > 0)

    def test_recommend_standards_steel_forgings(self):
        req = RecommendStandardsRequest(
            product_name="Carbon Steel Billets",
            product_description="Fully killed carbon steel billets and blooms intended for hot forging components in automotive applications",
            industry_or_domain="Manufacturing & Metallurgy",
            top_k=2,
        )
        res = recommend_standards(req)

        self.assertGreaterEqual(res.total_found, 1)
        top_rec = res.recommendations[0]
        self.assertEqual(top_rec.standard_number, "IS 1875")
        self.assertIn("Forgings", top_rec.title)
        self.assertTrue(top_rec.mandatory_certification)

    def test_recommend_standards_electronics_battery(self):
        req = RecommendStandardsRequest(
            product_name="Lithium Ion Battery Pack",
            product_description="Portable rechargeable secondary lithium cells and battery packs for laptops and mobile devices",
            industry_or_domain="Electronics & Battery Safety",
            top_k=2,
        )
        res = recommend_standards(req)

        self.assertGreaterEqual(res.total_found, 1)
        top_rec = res.recommendations[0]
        self.assertEqual(top_rec.standard_number, "IS 16046 (Part 2)")
        self.assertIn("Compulsory Registration Scheme (CRS", top_rec.applicable_schemes[0])

    def test_compliance_check_pass_drinking_water(self):
        req = ComplianceCheckRequest(
            standard_number="IS 10500",
            product_name="Sample Bottled Water",
            specifications=[
                SpecificationItem(parameter="pH Value", value=7.2),
                SpecificationItem(parameter="Total Dissolved Solids (TDS)", value=320, unit="mg/l"),
                SpecificationItem(parameter="Turbidity", value=0.7, unit="NTU"),
                SpecificationItem(parameter="Arsenic (as As)", value=0.005, unit="mg/l"),
                SpecificationItem(parameter="Lead (as Pb)", value=0.004, unit="mg/l"),
                SpecificationItem(parameter="Escherichia coli (E. coli)", value="Absent"),
            ],
        )
        res = check_compliance(req)

        self.assertEqual(res.verdict, "COMPLIANT")
        self.assertEqual(res.compliance_score, 100.0)
        self.assertEqual(res.passed_count, 6)
        self.assertEqual(res.failed_count, 0)
        self.assertEqual(res.warning_count, 0)

    def test_compliance_check_fail_and_warnings(self):
        req = ComplianceCheckRequest(
            standard_number="IS 10500",
            product_name="Non-Compliant Water Batch",
            specifications=[
                SpecificationItem(parameter="pH Value", value=9.8),  # FAIL (> 8.5)
                SpecificationItem(parameter="Total Dissolved Solids (TDS)", value=1200, unit="mg/l"),  # WARNING (500 < x <= 2000)
                SpecificationItem(parameter="Turbidity", value=8.5, unit="NTU"),  # FAIL (> 5.0)
                SpecificationItem(parameter="Escherichia coli (E. coli)", value="Detected 5 organisms"),  # FAIL (must be 0)
            ],
        )
        res = check_compliance(req)

        self.assertEqual(res.verdict, "NON_COMPLIANT")
        self.assertEqual(res.failed_count, 3)
        self.assertEqual(res.warning_count, 1)
        self.assertLess(res.compliance_score, 50.0)
        self.assertTrue(len(res.corrective_actions) > 0)

    def test_raw_specifications_parsing(self):
        raw_text = "pH: 7.4; TDS: 450 mg/l, Turbidity = 0.9 NTU; Arsenic: 0.008 mg/l"
        items = parse_raw_specifications_text(raw_text)

        self.assertEqual(len(items), 4)
        self.assertEqual(items[0].parameter, "pH")
        self.assertEqual(items[0].value, 7.4)
        self.assertEqual(items[1].parameter, "TDS")
        self.assertEqual(items[1].value, 450.0)

    def test_compliance_check_with_raw_text(self):
        req = ComplianceCheckRequest(
            standard_number="IS 10500",
            raw_specs_text="pH Value: 7.5; TDS: 400 mg/l; Turbidity: 0.8 NTU",
        )
        res = check_compliance(req)

        self.assertEqual(res.verdict, "COMPLIANT")
        self.assertEqual(res.passed_count, 3)

    def test_api_recommend_endpoint(self):
        payload = {
            "product_name": "Structural Reinforcement Steel",
            "product_description": "High strength thermo mechanically treated TMT deformed steel bars for concrete buildings",
            "industry_or_domain": "Civil & Metallurgy",
            "top_k": 2,
        }
        response = self.client.post("/compliance/recommend", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("recommendations", data)
        self.assertGreaterEqual(len(data["recommendations"]), 1)
        self.assertIn("IS 1786", data["recommendations"][0]["standard_number"])

    def test_api_check_endpoint(self):
        payload = {
            "standard_number": "IS 10500",
            "product_name": "Bottled Mineral Water",
            "specifications": [
                {"parameter": "pH Value", "value": 7.0},
                {"parameter": "Total Dissolved Solids (TDS)", "value": 150, "unit": "mg/l"},
            ],
        }
        response = self.client.post("/compliance/check", json=payload)
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["verdict"], "COMPLIANT")
        self.assertEqual(data["compliance_score"], 100.0)

    def test_api_standards_list(self):
        response = self.client.get("/compliance/standards")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 10)


if __name__ == "__main__":
    unittest.main()
