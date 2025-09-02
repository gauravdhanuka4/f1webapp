import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
from services.schedule_service import ScheduleService
from services.standings_service import StandingsService

class TestServices(unittest.TestCase):

    def setUp(self):
        self.schedule_service = ScheduleService()
        self.standings_service = StandingsService()

    def test_get_schedule(self):
        # Call the function to be tested
        schedule = self.schedule_service.get_schedule(2023)

        # Assert that the returned schedule is the one we mocked
        self.assertGreater(len(schedule['races']), 0)
        self.assertEqual(schedule['races'][0]['name'], 'Bahrain Grand Prix')

    def test_get_driver_standings(self):
        # Call the function to be tested
        standings = self.standings_service.get_driver_standings(2023)

        # Assert that the returned standings are correct
        self.assertGreater(len(standings['standings']), 0)
        self.assertEqual(standings['standings'][0]['driverName'], 'Max Verstappen')

    def test_get_constructor_standings(self):
        # Call the function to be tested
        standings = self.standings_service.get_constructor_standings(2023)

        # Assert that the returned standings are correct
        self.assertGreater(len(standings['standings']), 0)
        self.assertEqual(standings['standings'][0]['teamName'], 'Red Bull Racing Honda RBPT')

if __name__ == '__main__':
    unittest.main()
