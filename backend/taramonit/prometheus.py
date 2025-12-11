import logging

import httpx

logger = logging.getLogger(__name__)


async def query_prometheus(endpoint: str, query: str) -> float | None:
    """Query Prometheus and return the first result value."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{endpoint}/api/v1/query",
                params={"query": query}
            )
            response.raise_for_status()
            data = response.json()

            if data["status"] == "success" and data["data"]["result"]:
                return float(data["data"]["result"][0]["value"][1])
            return None
    except Exception:
        logger.exception(f"Error querying Prometheus at {endpoint}")
        return None


