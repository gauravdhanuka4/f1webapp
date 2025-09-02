"""
Script to pre-load the FastF1 cache for a given year.
"""

import fastf1
import time
import logging
import os
from api.config import get_config

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('f1webapp')

def preload_cache(year):
    """
    Pre-load the FastF1 cache for all sessions in a given year.
    """
    logger.info(f"Starting cache pre-loading for the {year} season.")

    # Get the event schedule for the year
    try:
        schedule = fastf1.get_event_schedule(year, include_testing=False)
    except Exception as e:
        logger.error(f"Could not get event schedule for {year}: {e}")
        return

    # Loop through each event in the schedule
    for index, event in schedule.iterrows():
        logger.info(f"Processing event: {event['EventName']}")
        
        # Loop through each session type
        for session_name in ['FP1', 'FP2', 'FP3', 'Q', 'R']:
            try:
                logger.info(f"  Loading session: {session_name}")
                session = fastf1.get_session(year, event['EventName'], session_name)
                session.load()
                logger.info(f"  Successfully loaded {session_name} for {event['EventName']}")
            except Exception as e:
                logger.error(f"  Could not load session {session_name} for {event['EventName']}: {e}")
            
            # Wait for 60 seconds between each session load to avoid rate limiting
            logger.info("  Waiting for 60 seconds before next session...")
            time.sleep(60)

    logger.info(f"Cache pre-loading for the {year} season is complete.")

if __name__ == "__main__":
    # Get configuration
    config = get_config()

    # Enable FastF1 cache
    if not os.path.exists(config.CACHE_DIR):
        os.makedirs(config.CACHE_DIR)
    fastf1.Cache.enable_cache(config.CACHE_DIR)
    
    # Pre-load the cache for the 2023 season
    preload_cache(2023)
