ARG PYTHON_VERSION=3.13.10
FROM python:${PYTHON_VERSION}-alpine AS base

ARG POETRY_VERSION=2.1.1
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=${POETRY_VERSION} \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

FROM base AS build

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apk add --no-cache \
  build-base \
  curl \
  pkgconf \
  && curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

COPY poetry.lock pyproject.toml ./
RUN poetry install --no-root --without=test

COPY . ./
RUN poetry install --without=test

FROM base AS runtime

EXPOSE 80

ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

COPY --from=build /app ./
