"""Testing fixtures."""

import pytest
from fastapi.testclient import TestClient

from taramonit.api import app


@pytest.fixture
def api_app():
    """API testing app."""
    with TestClient(app) as client:
        yield client
