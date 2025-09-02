import sys
import os
import unittest
import json

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.schedule_service import ScheduleService
from services.standings_service import StandingsService

class TestInfoService(unittest.TestCase):

    def setUp(self):
        self.schedule_service = ScheduleService()
        self.standings_service = StandingsService()

    def test_get_schedule(self):
        # Call the function to be tested
        data = self.schedule_service.get_schedule(2023)

        # Print the output
        print("\n--- Schedule ---")
        print(json.dumps(data, indent=2))

        # Assertions
        self.assertIn('races', data)
        self.assertGreater(len(data['races']), 0)
        self.assertIn('name', data['races'][0])
        self.assertIn('events', data['races'][0])

    def test_get_next_event(self):
        # Call the function to be tested
        data = self.schedule_service.get_next_event()

        # Print the output
        print("\n--- Next Event ---")
        print(json.dumps(data, indent=2))

        # Assertions
        self.assertIn('race', data)
        self.assertIn('name', data['race'])
        self.assertIn('events', data)

    def test_get_driver_standings(self):
        # Call the function to be tested
        data = self.standings_service.get_driver_standings(2023)

        # Assertions
        self.assertIn('standings', data)
        # self.assertGreater(len(data['standings']), 0)
        # self.assertIn('driverCode', data['standings'][0])
        # self.assertIn('points', data['standings'][0])

    def test_get_constructor_standings(self):
        # Call the function to be tested
        data = self.standings_service.get_constructor_standings(2023)

        # Assertions
        self.assertIn('standings', data)
        # self.assertGreater(len(data['standings']), 0)
        # self.assertIn('teamName', data['standings'][0])
        # self.assertIn('points', data['standings'][0])

if __name__ == '__main__':
    unittest.main()
