"""Integration tests for SatQuery AI FastAPI endpoints (/health, /presets, /report)."""
import unittest
from src.satquery.report_generator import generate_html_report


class TestEndpoints(unittest.TestCase):
    def test_report_generation(self):
        sample_payload = {
            "query": "Test query for change detection",
            "task": "change",
            "answer": "Detected significant change",
            "confidence": 0.95,
            "observations": {"Land Cover": ["Urban growth"]},
            "execution_summary": {
                "model": "changeformer-cdvqa",
                "trace": ["[12:00:00] Task classified -> change"]
            }
        }
        html = generate_html_report(sample_payload)
        self.assertIn("ISRO / SAC", html)
        self.assertIn("Test query for change detection", html)
        self.assertIn("Detected significant change", html)
        self.assertIn("95.0%", html)


if __name__ == "__main__":
    unittest.main()
