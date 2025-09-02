import sys
import os
import unittest
from unittest.mock import patch, MagicMock
import pandas as pd
import logging
import fastf1

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from services.session_service import SessionService

class TestSessionService(unittest.TestCase):

    def setUp(self):
        # Clear the in-memory cache before each test
        SessionService.clear_cache()

    def test_get_session_in_memory_caching(self):
        # Ensure the fastf1 disk cache is enabled
        fastf1.Cache.enable_cache('f1webapp/cache')
        
        # Create a logger to capture log messages
        logger = logging.getLogger('f1webapp')
        logger.setLevel(logging.INFO)
        
        # Create a list to store log messages
        log_messages = []
        
        # Create a handler to add log messages to the list
        class ListHandler(logging.Handler):
            def __init__(self, log_list):
                super().__init__()
                self.log_list = log_list
            
            def emit(self, record):
                self.log_list.append(self.format(record))
        
        handler = ListHandler(log_messages)
        stream_handler = logging.StreamHandler(sys.stdout)
        logger.addHandler(handler)
        logger.addHandler(stream_handler)
        
        # Call get_session for the first time. This will load from disk cache if available,
        # and populate the in-memory cache.
        session1 = SessionService.get_session(2023, 'Bahrain', 'R')
        
        # Call get_session for the second time. This should be served from the in-memory cache.
        session2 = SessionService.get_session(2023, 'Bahrain', 'R')
        
        # Remove the handlers to avoid interfering with other tests
        logger.removeHandler(handler)
        logger.removeHandler(stream_handler)
        
        # Assert that the sessions are the same object
        self.assertIs(session1, session2)
        
        # Assert that the log messages show that the in-memory cache was used
        self.assertTrue(any("Using cached session for 2023 Bahrain R" in msg for msg in log_messages))

if __name__ == '__main__':
    unittest.main()
