from pathlib import Path

path = Path("app/main.py")
text = path.read_text()

text = text.replace(
    "from collections.abc import Awaitable, Callable\n",
    "from collections.abc import Awaitable, Callable\n"
    "import logging\n"
    "from time import perf_counter\n"
    "from uuid import uuid4\n",
    1,
)

config_import = "from app.core.config import settings\n"
logging_import = (
    "from app.core.logging import (\n"
    "    configure_logging,\n"
    "    request_id_context,\n"
    ")\n"
)

if logging_import not in text:
    text = text.replace(
        config_import,
        config_import + logging_import,
        1,
    )

app_anchor = "app = FastAPI(\n"

if "configure_logging()\n\nlogger = logging.getLogger(__name__)" not in text:
    text = text.replace(
        app_anchor,
        "configure_logging()\n\n"
        "logger = logging.getLogger(__name__)\n\n"
        + app_anchor,
        1,
    )

middleware_anchor = '@app.middleware("http")\nasync def add_security_headers('

request_middleware = '''@app.middleware("http")
async def request_tracing_middleware(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    incoming_request_id = request.headers.get("X-Request-ID", "").strip()
    request_id = incoming_request_id or str(uuid4())

    token = request_id_context.set(request_id)
    started_at = perf_counter()

    try:
        response = await call_next(request)
    except Exception:
        duration_ms = (perf_counter() - started_at) * 1000

        logger.exception(
            "request_failed method=%s path=%s duration_ms=%.2f",
            request.method,
            request.url.path,
            duration_ms,
        )

        raise
    else:
        duration_ms = (perf_counter() - started_at) * 1000

        logger.info(
            "request_completed method=%s path=%s status_code=%s duration_ms=%.2f",
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )

        response.headers["X-Request-ID"] = request_id
        return response
    finally:
        request_id_context.reset(token)


'''

if "async def request_tracing_middleware(" not in text:
    if middleware_anchor not in text:
        raise RuntimeError("Could not find security middleware anchor.")

    text = text.replace(
        middleware_anchor,
        request_middleware + middleware_anchor,
        1,
    )

path.write_text(text)
print("Request tracing and logging patch applied.")
