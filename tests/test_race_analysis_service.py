import sys
import os
import unittest
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.race_analysis_service import RaceAnalysisService
from services.session_service import SessionService

class TestRaceAnalysisService(unittest.TestCase):

    def setUp(self):
        self.race_analysis_service = RaceAnalysisService()
        self.session = SessionService.get_session(2023, 'Bahrain', 'R')
        self.charts_dir = os.path.join(os.path.dirname(__file__), 'charts')
        os.makedirs(self.charts_dir, exist_ok=True)

    def test_get_session(self):
        # Call the function to be tested
        session = self.race_analysis_service.get_session(2023, 'Bahrain', 'R')

        # Assert that the returned session is not None
        self.assertIsNotNone(session)

    def test_get_race_pace_data_and_plot(self):
        # Call the function to be tested
        data = self.race_analysis_service.get_race_pace_data(self.session)

        # Assertions
        self.assertIn('drivers', data)
        self.assertGreater(len(data['drivers']), 0)
        self.assertIn('lapTimes', data['drivers'][0])
        self.assertIn('compounds', data['drivers'][0])

        # Create a dataframe for plotting
        plot_data = []
        for driver in data['drivers']:
            for lap_time, compound in zip(driver['lapTimes'], driver['compounds']):
                plot_data.append({
                    'driver': driver['code'],
                    'lapTime': lap_time,
                    'compound': compound
                })
        df = pd.DataFrame(plot_data)

        # Create violin plot
        plt.figure(figsize=(15, 10))
        sns.violinplot(x='driver', y='lapTime', data=df, inner=None)
        
        # Add scatter plot for tire compounds
        sns.swarmplot(x='driver', y='lapTime', data=df, hue='compound', palette={'SOFT': 'red', 'MEDIUM': 'yellow', 'HARD': 'white'}, size=5)

        plt.xlabel('Driver')
        plt.ylabel('Lap Time (s)')
        plt.title('Race Pace')
        plt.legend(title='Compound')
        plt.grid(True)
        plt.savefig(os.path.join(self.charts_dir, 'race_pace_violin.png'))
        plt.close()

    def test_get_team_pace_data_and_plot(self):
        # Call the function to be tested
        data = self.race_analysis_service.get_team_pace_data(self.session)

        # Assertions
        self.assertIn('teams', data)
        self.assertGreater(len(data['teams']), 0)
        self.assertIn('lapTimes', data['teams'][0])
        self.assertIn('median', data['teams'][0]['lapTimes'])

        # Create plot
        team_names = [team['name'] for team in data['teams']]
        median_lap_times = [team['lapTimes']['median'] for team in data['teams']]
        
        plt.figure(figsize=(15, 10))
        plt.boxplot(median_lap_times)
        plt.xticks(range(1, len(team_names) + 1), team_names, rotation=45)
        plt.ylabel('Lap Time (s)')
        plt.title('Team Pace')
        plt.suptitle('')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.savefig(os.path.join(self.charts_dir, 'team_pace.png'))
        plt.close()


    def test_get_lap_sections_data_and_plot(self):
        # Call the function to be tested
        data = self.race_analysis_service.get_lap_sections_data(self.session, drivers=['VER', 'HAM'])

        # Assertions
        self.assertIn('sections', data)
        self.assertGreater(len(data['sections']), 0)
        self.assertIn('drivers', data['sections'][0])
        self.assertGreater(len(data['sections'][0]['drivers']), 0)
        self.assertIn('time', data['sections'][0]['drivers'][0])
        self.assertIn('speed', data['sections'][0]['drivers'][0])

        # Create plot
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        for i, section in enumerate(data['sections']):
            ax = axes.flat[i]
            for driver in section['drivers']:
                ax.plot(driver['time'], driver['speed'], label=driver['code'])
            ax.set_title(section['name'])
            ax.set_xlabel('Time (s)')
            ax.set_ylabel('Speed (km/h)')
            ax.legend()
            ax.grid(True)
        plt.tight_layout()
        plt.savefig(os.path.join(self.charts_dir, 'lap_sections.png'))
        plt.close()

if __name__ == '__main__':
    unittest.main()
