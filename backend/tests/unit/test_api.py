"""Unit tests for the api module."""

from hamcrest import (
    assert_that,
    has_entries,
)


def test_api_health(api_app):
    """The health endpoint should return an "ok" status."""
    response = api_app.get("/health")

    assert_that(response.json(), has_entries(status="ok"))
