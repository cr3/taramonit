import logging

from attrs import define
from httpx import AsyncClient

logger = logging.getLogger(__name__)


@define(frozen=True)
class Prometheus:

    http_client: AsyncClient

    async def query(self, query: str) -> float | None:
        """Query Prometheus and return the first result value."""
        response = await self.http_client.get(
            "/api/v1/query",
            params={"query": query}
        )
        if not response.is_success:
            logger.info("Unexpected status code %(status_code)r for query: %(query)s", {
                "status_code": response.status_code,
                "query": query,
            })
            return None

        data = response.json()

        if data["status"] != "success":
            logger.info("Unexpected status %(status)r for query: %(query)s", {
                "status": data["status"],
                "query": query,
            })
            return None

        if not data["data"]["result"]:
            logger.info("Empty result for query: %(query)s", {
                "query": query,
            })
            return None

        return float(data["data"]["result"][0]["value"][1])
