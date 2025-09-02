import sys
import os
import unittest
import pandas as pd
import numpy as np
import xgboost as xgb
import json

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.prediction_service import PredictionService
from services.session_service import SessionService

class TestPredictionService(unittest.TestCase):

    def setUp(self):
        self.prediction_service = PredictionService()
        # Create a dummy model and feature names for testing
        self.dummy_model = xgb.XGBRegressor()
        self.dummy_model.fit(np.random.rand(10, 5), np.random.rand(10))
        self.dummy_feature_names = [f'feature_{i}' for i in range(5)]
        
        # Create dummy model and feature names files
        self.model_path = self.prediction_service.model_path
        self.feature_names_path = self.model_path.replace('.json', '_features.json')
        self.dummy_model.save_model(self.model_path)
        with open(self.feature_names_path, 'w') as f:
            json.dump(self.dummy_feature_names, f)

    def tearDown(self):
        # Clean up the dummy model and feature names files
        if os.path.exists(self.model_path):
            os.remove(self.model_path)
        if os.path.exists(self.feature_names_path):
            os.remove(self.feature_names_path)

    def test_predict_lap_time(self):
        # Call the function to be tested
        prediction = self.prediction_service.predict_lap_time(2023, 'Bahrain Grand Prix', 'VER')

        # Assertions
        self.assertIsInstance(prediction, float)
        self.assertGreater(prediction, 0)

    def test_train_model(self):
        # The model is already trained in setUp, so we just check if it exists
        self.prediction_service.train_model([2023], ['Bahrain Grand Prix'])
        self.assertIsNotNone(self.prediction_service.model)

if __name__ == '__main__':
    unittest.main()
