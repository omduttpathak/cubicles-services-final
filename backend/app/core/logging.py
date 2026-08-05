import logging
import sys
from contextvars import ContextVar

from app.core.config import settings


request_id_context: ContextVar[str] = ContextVar(
    "request_id",
    default="-",
)


class RequestContextFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_context.get()
        return True


def configure_logging() -> None:
    log_level = (
        logging.DEBUG
        if settings.is_development
        else logging.INFO
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.addFilter(RequestContextFilter())
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s "
            "%(levelname)s "
            "%(name)s "
            "request_id=%(request_id)s "
            "%(message)s"
        )
    )

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.setLevel(log_level)
    root_logger.addHandler(handler)

    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO
        if settings.database_echo
        else logging.WARNING
    )

    logging.getLogger("uvicorn.access").handlers.clear()
    logging.getLogger("uvicorn.access").propagate = True
