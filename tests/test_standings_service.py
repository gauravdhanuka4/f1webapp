import sys
import os
import unittest
from unittest.mock import patch
import logging
from datetime import datetime

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.standings_service import StandingsService

class TestStandingsService(unittest.TestCase):

    def setUp(self):
        # Clear the cache before each test
        StandingsService.clear_cache()

    def test_get_driver_standings_live(self):
        """Tests getting live driver standings for the previous year."""
        service = StandingsService()
        # Use a recent, completed year for stable test data
        year = 2023
        result = service.get_driver_standings(year)
        print(result)
        self.assertEqual(result['year'], year)
        self.assertIsInstance(result['standings'], list)
        self.assertGreater(len(result['standings']), 0, "Standings list should not be empty")
        
        # Check the structure of the first standing entry
        first_standing = result['standings'][0]
        self.assertIn('position', first_standing)
        self.assertIn('driverName', first_standing)
        self.assertIn('teamName', first_standing)
        self.assertIn('points', first_standing)

    def test_get_constructor_standings_live(self):
        """Tests getting live constructor standings for the previous year."""
        service = StandingsService()
        year = 2023
        result = service.get_constructor_standings(year)
        self.assertEqual(result['year'], year)
        self.assertIsInstance(result['standings'], list)
        self.assertGreater(len(result['standings']), 0, "Standings list should not be empty")

        first_standing = result['standings'][0]
        self.assertIn('position', first_standing)
        self.assertIn('teamName', first_standing)
        self.assertIn('points', first_standing)

    @patch('services.standings_service.StandingsService._get_standings_data')
    def test_caching_logic(self, mock_get_standings_data):
        """Tests that standings data is cached correctly."""
        # Configure the mock to return some data
        mock_get_standings_data.return_value = [{'position': '1', 'driverName': 'TEST DRIVER', 'teamName': 'TEST TEAM', 'points': '100'}]
        
        service = StandingsService()
        year = 2023

        # First call - should call the underlying method
        result1 = service.get_driver_standings(year)
        self.assertEqual(mock_get_standings_data.call_count, 1)
        self.assertEqual(result1['standings'][0]['driverName'], 'TEST DRIVER')

        # Second call - should use the cache and not call the method again
        result2 = service.get_driver_standings(year)
        self.assertEqual(mock_get_standings_data.call_count, 1) # Should still be 1
        self.assertIs(result1, result2) # Should be the same object from cache

if __name__ == '__main__':
    unittest.main()
