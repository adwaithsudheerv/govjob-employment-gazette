import httpx
from typing import List, Dict, Any, Optional
import logging
from abc import ABC, abstractmethod
from app.schemas import JobCreate

logger = logging.getLogger(__name__)

DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
}

class BaseScraper(ABC):
    def __init__(self, name: str):
        self.name = name

    def fetch_page(self, url: str, timeout: float = 12.0) -> Optional[str]:
        try:
            with httpx.Client(timeout=timeout, follow_redirects=True, headers=DEFAULT_HEADERS) as client:
                res = client.get(url)
                if res.status_code == 200:
                    return res.text
                logger.warning(f"[{self.name}] Failed to fetch {url}, status code: {res.status_code}")
                return None
        except Exception as e:
            logger.error(f"[{self.name}] Error fetching {url}: {e}")
            return None

    def fetch_json(self, url: str, timeout: float = 12.0) -> Optional[Dict[str, Any]]:
        try:
            with httpx.Client(timeout=timeout, follow_redirects=True, headers=DEFAULT_HEADERS) as client:
                res = client.get(url)
                if res.status_code == 200:
                    return res.json()
                logger.warning(f"[{self.name}] Failed JSON fetch from {url}, status: {res.status_code}")
                return None
        except Exception as e:
            logger.error(f"[{self.name}] Error fetching JSON from {url}: {e}")
            return None

    @abstractmethod
    def scrape(self) -> List[JobCreate]:
        pass
