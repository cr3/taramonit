"""Testing fixtures."""

import os
from unittest.mock import patch

import httpx
import pytest
from fastapi.testclient import TestClient

from taramonit.api import (
    app,
    get_prometheus,
)
from taramonit.prometheus import Prometheus


@pytest.fixture
def api_app(prometheus, prometheus_url):
    """API testing app."""
    app.dependency_overrides[get_prometheus] = lambda: prometheus

    env = {
        "PROMETHEUS_URL": prometheus_url,
    }

    with patch.dict(os.environ, env), TestClient(app) as client:
        yield client


@pytest.fixture
def prometheus_url():
    return "http://localhost"


@pytest.fixture
def prometheus(prometheus_url):
    """Prometheus fixture with success results."""
    transport = httpx.MockTransport(lambda req: httpx.Response(200, json={
        "status": "success",
        "data": {"result": [{"value": [None, 1.0]}]},
    }))
    mock_client = httpx.AsyncClient(base_url=prometheus_url, transport=transport)
    return Prometheus(mock_client)
