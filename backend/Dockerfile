FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN apt-get update \
    && apt-get install --no-install-recommends -y curl default-mysql-client build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && python -m venv /opt/venv

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY alembic ./alembic
COPY alembic.ini .
COPY app ./app
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh \
    && groupadd --system --gid 10001 appgroup \
    && useradd --system --uid 10001 --gid appgroup --home-dir /app appuser \
    && mkdir -p /app/uploads/images \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl --fail --silent http://127.0.0.1:8000/api/health/ready || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--proxy-headers", "--forwarded-allow-ips=*"]
