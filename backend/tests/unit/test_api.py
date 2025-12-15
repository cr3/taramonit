"""Unit tests for the api module."""

from hamcrest import (
    assert_that,
    has_entries,
    only_contains,
)


def test_api_status(api_app):
    """The status endpoint should return the overall status."""
    response = api_app.get("/api/status")

    assert_that(response.json(), has_entries(
        status="operational",
        services=only_contains(has_entries(status="up")),
    ))
