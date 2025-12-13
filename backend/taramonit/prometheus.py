import logging

from attrs import define
from httpx import AsyncClient

logger = logging.getLogger(__name__)


@define(frozen=True)
class Prometheus:

    endpoint: str
    timeout: float = 10.0

    async def query(self, query: str) -> float | None:
        """Query Prometheus and return the first result value."""
        try:
            async with AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.endpoint}/api/v1/query",
                    params={"query": query}
                )
                response.raise_for_status()
                data = response.json()

                if data["status"] == "success" and data["data"]["result"]:
                    return float(data["data"]["result"][0]["value"][1])
        except Exception:
            logger.exception(f"Error querying Prometheus at {self.endpoint}")

        return None


