import asyncio
import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

import httpx
from fastapi import (
    Depends,
    FastAPI,
    Request,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from taramonit.prometheus import Prometheus

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.http_client = httpx.AsyncClient(
        base_url=os.environ["PROMETHEUS_URL"],
        timeout=httpx.Timeout(10.0),
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20),
        # http2=True,  # optional
    )
    try:
        yield
    finally:
        await app.state.http_client.aclose()

app = FastAPI(lifespan=lifespan)

# Allow CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ServiceStatus(BaseModel):
    name: str
    status: str  # "up" or "down"
    availability_24h: float | None = None


class OverallStatus(BaseModel):
    status: str  # "operational" or "degraded"
    services: list[ServiceStatus]


def get_prometheus(request: Request):
    http_client = request.app.state.http_client
    return Prometheus(http_client)

PrometheusDep = Annotated[Prometheus, Depends(get_prometheus)]


@app.get("/api/status", response_model=OverallStatus)
async def get_status(prometheus: PrometheusDep):
    """Get overall status of all services."""

    (
        mail_status,
        mail_availability,
        dovecot_status,
        dovecot_availability,
        rspamd_status,
        rspamd_availability,
        wiki_status,
        wiki_availability,
    ) = await asyncio.gather(
        prometheus.query('probe_success{instance="https://mail.taram.ca"}'),
        prometheus.query('avg_over_time(probe_success{instance="https://mail.taram.ca"}[24h]) * 100'),
        prometheus.query('clamp_max(count(dovecot_build_info), 1)'),
        prometheus.query('avg_over_time(clamp_max(count(dovecot_build_info), 1)[24h:]) * 100'),
        prometheus.query('clamp_max(count(rspamd_config), 1)'),
        prometheus.query('avg_over_time(clamp_max(count(rspamd_config), 1)[24h:]) * 100'),
        prometheus.query('probe_success{instance="https://wiki.taram.ca"}'),
        prometheus.query('avg_over_time(probe_success{instance="https://wiki.taram.ca"}[24h]) * 100'),
    )

    services = [
        ServiceStatus(
            name="Mail (web)",
            status="up" if mail_status else "down",
            availability_24h=mail_availability
        ),
        ServiceStatus(
            name="Dovecot",
            status="up" if dovecot_status else "down",
            availability_24h=dovecot_availability
        ),
        ServiceStatus(
            name="Rspamd",
            status="up" if rspamd_status else "down",
            availability_24h=rspamd_availability
        ),
        ServiceStatus(
            name="Wiki",
            status="up" if wiki_status else "down",
            availability_24h=wiki_availability
        ),
    ]

    # Determine overall status
    all_up = all(s.status == "up" for s in services)
    overall_status = "operational" if all_up else "degraded"

    return OverallStatus(
        status=overall_status,
        services=services
    )
