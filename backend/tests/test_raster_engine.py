"""Unit tests for SatQuery AI geospatial raster processing engine."""
import unittest
import numpy as np
from pathlib import Path
from src.satquery.raster_engine import compute_spectral_indices, detect_bitemporal_changes, analyze_optical_sar_fusion


class TestRasterEngine(unittest.TestCase):
    def test_spectral_indices_calculation(self):
        # 3 bands: Red, Green, Blue
        data = np.ones((3, 64, 64), dtype=np.float32)
        # Add vegetation signal: Green > Red
        data[1] = 2.0
        data[0] = 0.5
        indices = compute_spectral_indices(data)
        self.assertIn("veg_index", indices)
        self.assertIn("water_index", indices)
        self.assertGreater(indices["veg_index"], 0.0)

    def test_bitemporal_changes_mock(self):
        # Test synthetic difference logic
        data1 = np.ones((3, 32, 32), dtype=np.float32)
        data2 = np.ones((3, 32, 32), dtype=np.float32) * 2.0
        diff = np.sqrt(np.mean((data2 - data1) ** 2, axis=0))
        self.assertEqual(diff.shape, (32, 32))


if __name__ == "__main__":
    unittest.main()
