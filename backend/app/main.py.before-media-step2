from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.api.about import router as about_router
from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.blog_page import router as blog_page_router
from app.api.blogs import router as blogs_router
from app.api.career_page import router as career_page_router
from app.api.careers import router as careers_router
from app.api.case_studies import router as case_studies_router
from app.api.case_studies_page import router as case_studies_page_router
from app.api.contact import router as contact_router
from app.api.contact_page import router as contact_page_router
from app.api.footer_links import router as footer_links_router
from app.api.homepage import router as homepage_router
from app.api.homepage_benefits import router as homepage_benefits_router
from app.api.homepage_faqs import router as homepage_faqs_router
from app.api.homepage_industries import router as homepage_industries_router
from app.api.homepage_stats import router as homepage_stats_router
from app.api.homepage_testimonials import (
    router as homepage_testimonials_router,
)
from app.api.job_openings import router as job_openings_router
from app.api.navigation import router as navigation_router
from app.api.services import router as services_router
from app.api.services_page import router as services_page_router
from app.api.site_settings import router as site_settings_router
from app.api.technologies import router as technologies_router
from app.api.technology_page import router as technology_page_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.trusted_hosts,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
    ],
)


@app.middleware("http")
async def add_security_headers(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )

    return response


app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.include_router(contact_router)
app.include_router(admin_router)
app.include_router(auth_router)

app.include_router(homepage_router)
app.include_router(homepage_stats_router)
app.include_router(homepage_benefits_router)
app.include_router(homepage_industries_router)
app.include_router(homepage_testimonials_router)
app.include_router(homepage_faqs_router)

app.include_router(about_router)

app.include_router(services_page_router)
app.include_router(services_router)

app.include_router(technology_page_router)
app.include_router(technologies_router)

app.include_router(blog_page_router)
app.include_router(blogs_router)

app.include_router(case_studies_page_router)
app.include_router(case_studies_router)

app.include_router(contact_page_router)

app.include_router(career_page_router)
app.include_router(job_openings_router)
app.include_router(careers_router)

app.include_router(navigation_router)
app.include_router(footer_links_router)
app.include_router(site_settings_router)


@app.get("/")
def root():
    return {
        "message": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }
