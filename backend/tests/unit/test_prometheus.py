"""Unit test for the prometheus module."""

import httpx
import pytest

from taramonit.prometheus import Prometheus


@pytest.mark.asyncio
@pytest.mark.parametrize("status_code, status, data, expected", [
    (200, "success", {"result": [{"value": [2.0, 1.0]}]}, 1.0),
    (400, "success", {"result": [{"value": [2.0, 1.0]}]}, None),
    (200, "failure", {"result": [{"value": [2.0, 1.0]}]}, None),
    (200, "success", {"result": []}, None),
])
async def test_prometheus_query_success(status_code, status, data, expected):
    """Querying Prometheus should return the first value on success, otherwise None."""
    transport = httpx.MockTransport(lambda req: httpx.Response(status_code, json={
        "status": status,
        "data": data,
    }))
    mock_client = httpx.AsyncClient(base_url="http://localhost", transport=transport)
    prometheus = Prometheus(mock_client)

    result = await prometheus.query("test")

    assert result == expected
