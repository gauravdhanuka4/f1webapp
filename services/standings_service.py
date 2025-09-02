import logging
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import time
import fastf1

logger = logging.getLogger('f1webapp')

class StandingsService:
    _cache = {}
    _cache_expiry = timedelta(hours=24)
    """
    Service for handling F1 standings data by scraping the official F1 website.
    """
    BASE_URL = "https://www.formula1.com/en/results"

    def _get_standings_data(self, year, standings_type):
        """
        Generic method to fetch and parse standings data.
        
        Args:
            year (int): The year to get standings for.
            standings_type (str): 'drivers' or 'team'.
            
        Returns:
            list: A list of dictionaries containing standings data, or an empty list on error.
        """
        try:
            url = f"{self.BASE_URL}/{year}/{standings_type}"
            response = requests.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')
            table = soup.find('table', class_='f1-table f1-table-with-data w-full')
            if not table:
                logger.warning(f"No {standings_type} standings table found for {year}")
                return []

            tbody = table.find('tbody')
            if not tbody:
                logger.warning(f"No tbody found in {standings_type} standings table for {year}")
                return []

            rows = tbody.find_all('tr')
            standings = []

            for row in rows:
                cols = row.find_all('td')
                if not cols:
                    continue

                if standings_type == 'drivers':
                    position = cols[0].text.strip()
                    
                    driver_cell = cols[1]
                    full_text = driver_cell.text.replace('\xa0', ' ').strip()
                    
                    # Find the 3-letter abbreviation and take the text before it
                    match = re.search(r'[A-Z]{3}', full_text)
                    if match:
                        driver_name = full_text[:match.start()].strip()
                    else:
                        driver_name = full_text

                    team_name = cols[3].text.strip()
                    points = cols[4].text.strip()
                    
                    standings.append({
                        "position": position,
                        "driverName": driver_name,
                        "teamName": team_name,
                        "points": points
                    })
                elif standings_type == 'team':
                    position = cols[0].text.strip()
                    team_name = cols[1].text.strip()
                    points = cols[2].text.strip()

                    standings.append({
                        "position": position,
                        "teamName": team_name,
                        "points": points
                    })
            
            return standings

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {standings_type} standings for {year}: {e}")
            return []
        except Exception as e:
            logger.error(f"Error parsing {standings_type} standings for {year}: {e}")
            return []

    def get_driver_standings(self, year=None):
        """
        Get driver standings for a specific year.
        
        Args:
            year: The year to get the standings for (defaults to current year)
            
        Returns:
            dict: Driver standings data
        """
        if not year:
            year = datetime.now().year
        
        cache_key = f"driver_standings_{year}"
        if cache_key in self._cache and (time.time() - self._cache[cache_key]['timestamp']) < self._cache_expiry.total_seconds():
            logger.info(f"Using cached driver standings for {year}")
            return self._cache[cache_key]['data']

        standings_data = self._get_standings_data(year, 'drivers')
        
        result = {
            "year": year,
            "standings": standings_data
        }
        
        self._cache[cache_key] = {
            'data': result,
            'timestamp': time.time()
        }
        
        return result
    
    def get_constructor_standings(self, year=None):
        """
        Get constructor standings for a specific year.
        
        Args:
            year: The year to get the standings for (defaults to current year)
            
        Returns:
            dict: Constructor standings data
        """
        if not year:
            year = datetime.now().year
            
        cache_key = f"constructor_standings_{year}"
        if cache_key in self._cache and (time.time() - self._cache[cache_key]['timestamp']) < self._cache_expiry.total_seconds():
            logger.info(f"Using cached constructor standings for {year}")
            return self._cache[cache_key]['data']

        standings_data = self._get_standings_data(year, 'team')
            
        result = {
            "year": year,
            "standings": standings_data
        }
        
        self._cache[cache_key] = {
            'data': result,
            'timestamp': time.time()
        }
        
        return result

    @classmethod
    def clear_cache(cls):
        """Clears the in-memory cache."""
        cls._cache.clear()
        logger.info("StandingsService cache cleared.")
