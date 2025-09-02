import sys
import os
import unittest
import pandas as pd

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.prediction_service import PredictionService
from services.session_service import SessionService

class TestPredictionService(unittest.TestCase):

    def setUp(self):
        self.prediction_service = PredictionService()
        # We need to train a model for testing purposes
        self.prediction_service.train_model([2023], ['Bahrain Grand Prix'])

    def test_predict_lap_time(self):
        # Call the function to be tested
        prediction = self.prediction_service.predict_lap_time(2023, 'Bahrain Grand Prix', 'VER')

        # Assertions
        self.assertIsInstance(prediction, float)
        self.assertGreater(prediction, 0)

    def test_train_model(self):
        # The model is already trained in setUp, so we just check if it exists
        self.assertIsNotNone(self.prediction_service.model)

if __name__ == '__main__':
    unittest.main()
