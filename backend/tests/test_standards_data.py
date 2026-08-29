import json
import unittest
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
STANDARDS_DIR = DATA_DIR / "standards"
SCHEMA_FILE = DATA_DIR / "schema" / "standard_schema.json"
CATALOG_FILE = DATA_DIR / "standards_catalog.json"

REQUIRED_TOP_LEVEL_KEYS = [
    "standard_id",
    "standard_number",
    "title",
    "edition",
    "year",
    "status",
    "domain",
    "category",
    "scope",
    "description",
    "key_requirements",
    "sections",
    "keywords",
    "applicable_products_or_industries",
    "citation"
]

class TestBISStandardsData(unittest.TestCase):
    
    def test_schema_file_exists_and_valid(self):
        self.assertTrue(SCHEMA_FILE.exists(), f"Schema file not found at {SCHEMA_FILE}")
        with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
            schema = json.load(f)
        self.assertEqual(schema.get("title"), "BISStandardSchema")
        self.assertIn("required", schema)

    def test_catalog_file_exists_and_valid(self):
        self.assertTrue(CATALOG_FILE.exists(), f"Catalog file not found at {CATALOG_FILE}")
        with open(CATALOG_FILE, "r", encoding="utf-8") as f:
            catalog = json.load(f)
        
        standards = catalog.get("standards", [])
        self.assertGreaterEqual(len(standards), 15, "Catalog should have at least 15 BIS standards")
        self.assertLessEqual(len(standards), 20, "Catalog should have at most 20 BIS standards")
        
        # Verify unique IDs in catalog
        std_ids = [s["standard_id"] for s in standards]
        self.assertEqual(len(std_ids), len(set(std_ids)), "Duplicate standard_id in catalog")

    def test_standards_json_files_conformance(self):
        self.assertTrue(STANDARDS_DIR.exists(), f"Standards directory not found at {STANDARDS_DIR}")
        json_files = list(STANDARDS_DIR.glob("*.json"))
        self.assertGreaterEqual(len(json_files), 3, "At least 3 standards JSON files must exist")
        
        seen_ids = set()
        
        for file_path in json_files:
            with self.subTest(file=file_path.name):
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Check required fields
                for key in REQUIRED_TOP_LEVEL_KEYS:
                    self.assertIn(key, data, f"Missing required key '{key}' in {file_path.name}")
                    self.assertTrue(data[key], f"Key '{key}' is empty in {file_path.name}")
                
                # Check types
                self.assertIsInstance(data["standard_id"], str)
                self.assertIsInstance(data["year"], int)
                self.assertIn(data["status"], ["Active", "Superseded", "Withdrawn", "Under Revision"])
                self.assertIsInstance(data["key_requirements"], list)
                self.assertGreater(len(data["key_requirements"]), 0, f"No key requirements in {file_path.name}")
                
                for req in data["key_requirements"]:
                    self.assertIn("parameter", req)
                    self.assertIn("requirement", req)
                    self.assertIn("clause_reference", req)
                    self.assertTrue(req["parameter"])
                    self.assertTrue(req["requirement"])
                    self.assertTrue(req["clause_reference"])
                
                # Check sections
                self.assertIsInstance(data["sections"], list)
                self.assertGreater(len(data["sections"]), 0, f"No sections in {file_path.name}")
                for sec in data["sections"]:
                    self.assertIn("section_number", sec)
                    self.assertIn("title", sec)
                    self.assertIn("content", sec)
                    self.assertIn("page_number", sec)
                    self.assertIsInstance(sec["page_number"], int)
                
                # Check keywords
                self.assertIsInstance(data["keywords"], list)
                self.assertGreaterEqual(len(data["keywords"]), 5, f"Expected at least 5 keywords in {file_path.name}")
                
                # Check citation
                self.assertIn("citation_text", data["citation"])
                self.assertIn("standard", data["citation"])
                self.assertIn("year", data["citation"])
                
                # Check no placeholder / lorem ipsum text
                data_str = json.dumps(data).lower()
                self.assertNotIn("lorem ipsum", data_str)
                self.assertNotIn("todo", data_str)
                self.assertNotIn("test data", data_str)
                self.assertNotIn("example requirement", data_str)
                
                # Check uniqueness of standard_id among primary standards
                # Note: IS_1599_2018 is an alias for IS_1599_2019
                if file_path.name not in ["IS_1599_2018.json"]:
                    self.assertNotIn(data["standard_id"], seen_ids, f"Duplicate standard_id: {data['standard_id']}")
                    seen_ids.add(data["standard_id"])

if __name__ == "__main__":
    unittest.main()
