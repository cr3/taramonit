import asyncio
import logging
from typing import Annotated

from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from taramonit.prometheus import Prometheus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Taram Status API", version="1.0.0")

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


def get_prometheus():
    return Prometheus("http://prometheus:9090")

PrometheusDep = Annotated[Prometheus, Depends(get_prometheus)]


@app.get("/health")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Taram Status API"}


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
            status="up" if mail_status == 1 else "down",
            availability_24h=mail_availability
        ),
        ServiceStatus(
            name="Dovecot",
            status="up" if dovecot_status == 1 else "down",
            availability_24h=dovecot_availability
        ),
        ServiceStatus(
            name="Rspamd",
            status="up" if rspamd_status == 1 else "down",
            availability_24h=rspamd_availability
        ),
        ServiceStatus(
            name="Wiki",
            status="up" if wiki_status == 1 else "down",
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


@app.get("/api/services/{service_name}")
async def get_service_status(service_name: str, prometheus: PrometheusDep):
    """Get detailed status for a specific service."""
    # This could be expanded to return more detailed metrics
    status = await get_status(prometheus)

    for service in status.services:
        if service.name.lower().replace(" ", "-") == service_name.lower():
            return service

    raise HTTPException(status_code=404, detail="Service not found")
