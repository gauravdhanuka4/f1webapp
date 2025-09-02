import sys
import os
import unittest
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.telemetry_service import TelemetryService, MiniSectorAnalyzer
from services.session_service import SessionService

class TestTelemetryService(unittest.TestCase):

    def setUp(self):
        self.telemetry_service = TelemetryService()
        self.session = SessionService.get_session(2023, 'Bahrain', 'R')
        self.charts_dir = os.path.join(os.path.dirname(__file__), 'charts')
        os.makedirs(self.charts_dir, exist_ok=True)

    def test_get_session(self):
        # Call the function to be tested
        session = self.telemetry_service.get_session(2023, 'Bahrain', 'R')

        # Assert that the returned session is not None
        self.assertIsNotNone(session)

    def test_get_driver_fastest_lap(self):
        # Call the function to be tested
        fastest_lap = self.telemetry_service.get_driver_fastest_lap(self.session, 'VER')
        
        # Assert that the returned value is not None
        self.assertIsNotNone(fastest_lap)

    def test_get_speed_trace_data_and_plot(self):
        # Call the function to be tested
        data = self.telemetry_service.get_speed_trace_data(self.session, 'VER', 'HAM')

        # Assertions
        self.assertEqual(data['driver1']['name'], 'VER')
        self.assertEqual(data['driver2']['name'], 'HAM')
        self.assertIsInstance(data['driver1']['speed'], list)
        self.assertIsInstance(data['driver2']['speed'], list)
        self.assertGreater(len(data['driver1']['speed']), 0)
        self.assertGreater(len(data['driver2']['speed']), 0)

        # Create plot
        plt.figure(figsize=(15, 5))
        plt.plot(data['driver1']['distance'], data['driver1']['speed'], label='VER')
        plt.plot(data['driver2']['distance'], data['driver2']['speed'], label='HAM')
        plt.xlabel('Distance (m)')
        plt.ylabel('Speed (km/h)')
        plt.title('Speed Trace Comparison')
        plt.legend()
        plt.grid(True)
        plt.savefig(os.path.join(self.charts_dir, 'speed_trace.png'))
        plt.close()

    def test_get_gear_shifts_data_and_plot(self):
        # Call the function to be tested
        data = self.telemetry_service.get_gear_shifts_data(self.session, 'VER')

        # Assertions
        self.assertEqual(data['driver']['name'], 'VER')
        self.assertIsInstance(data['track']['x'], list)
        self.assertIsInstance(data['gears'], list)

        # Rotate track map
        x = np.array(data['track']['x'])
        y = np.array(data['track']['y'])
        rotation = np.deg2rad(data['track']['rotation'])
        
        x_rotated = x * np.cos(rotation) - y * np.sin(rotation)
        y_rotated = x * np.sin(rotation) + y * np.cos(rotation)

        # Create plot
        plt.figure(figsize=(10, 10))
        plt.scatter(x_rotated, y_rotated, c=data['gears'], cmap='viridis')
        plt.colorbar(label='Gear')
        plt.title('Gear Shifts')
        plt.savefig(os.path.join(self.charts_dir, 'gear_shifts.png'))
        plt.close()

    def test_get_track_dominance_data_and_plot(self):
        # Call the function to be tested
        data = self.telemetry_service.get_track_dominance_data(self.session, drivers=['VER', 'HAM', 'ALO'])

        # Assertions
        self.assertIn('track', data)
        self.assertIn('miniSectors', data)

        # Rotate track map
        x = np.array(data['track']['x'])
        y = np.array(data['track']['y'])
        rotation = np.deg2rad(data['track']['rotation'])
        
        x_rotated = x * np.cos(rotation) - y * np.sin(rotation)
        y_rotated = x * np.sin(rotation) + y * np.cos(rotation)
        
        # Create plot
        plt.figure(figsize=(10, 10))
        plt.plot(x_rotated, y_rotated, 'k-', alpha=0.5)
        for sector in data['miniSectors']:
            sector_x = np.array(sector['coordinates']['x'])
            sector_y = np.array(sector['coordinates']['y'])
            
            sector_x_rotated = sector_x * np.cos(rotation) - sector_y * np.sin(rotation)
            sector_y_rotated = sector_x * np.sin(rotation) + sector_y * np.cos(rotation)
            
            plt.plot(sector_x_rotated, sector_y_rotated, color=sector['color'], linewidth=3)
        plt.title('Track Dominance')
        plt.savefig(os.path.join(self.charts_dir, 'track_dominance.png'))
        plt.close()


class TestMiniSectorAnalyzer(unittest.TestCase):

    def setUp(self):
        session = SessionService.get_session(2023, 'Bahrain', 'R')
        lap = session.laps.pick_fastest()
        self.telemetry_data = lap.get_telemetry()
        self.analyzer = MiniSectorAnalyzer(self.telemetry_data, num_sectors=20)

    def test_create_mini_sectors(self):
        # Call the function to be tested
        result = self.analyzer.create_mini_sectors()
        
        # Assertions
        self.assertIn('MiniSector', result.columns)
        self.assertEqual(result['MiniSector'].nunique(), 20)

    def test_find_fastest_drivers(self):
        # Get telemetry for two drivers
        session = SessionService.get_session(2023, 'Bahrain', 'R')
        lap1 = session.laps.pick_driver('VER').pick_fastest()
        tel1 = lap1.get_telemetry()
        tel1['Driver'] = 'VER'
        
        lap2 = session.laps.pick_driver('HAM').pick_fastest()
        tel2 = lap2.get_telemetry()
        tel2['Driver'] = 'HAM'

        # Call the function to be tested
        fastest, _ = self.analyzer.find_fastest_drivers([tel1, tel2])

        # Assertions
        self.assertEqual(len(fastest), 20)
        self.assertIn('Driver', fastest.columns)

if __name__ == '__main__':
    unittest.main()
