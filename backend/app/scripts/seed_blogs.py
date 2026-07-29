from datetime import datetime

from app.core.database import SessionLocal
from app.models.blog import Blog

BLOGS = [
    {
        "title": "AWS Cloud Migration Best Practices in 2026",
        "slug": "aws-cloud-migration-best-practices-2026",
        "category": "Cloud",
        "excerpt": (
            "Learn proven strategies to migrate enterprise "
            "workloads to AWS with minimal downtime and "
            "maximum reliability."
        ),
        "content": (
            "Cloud migration requires careful planning, "
            "application assessment and a clear migration "
            "strategy.\n\n"
            "Organizations should begin by evaluating their "
            "existing infrastructure, application "
            "dependencies and security requirements.\n\n"
            "A successful AWS migration commonly includes "
            "discovery, architecture design, migration waves, "
            "testing, optimization and ongoing monitoring.\n\n"
            "Automation using Infrastructure as Code and "
            "CI/CD pipelines helps reduce risk and improve "
            "delivery consistency."
        ),
        "author": "Cubicles Services",
        "image_url": None,
        "seo_title": ("AWS Cloud Migration Best Practices in 2026"),
        "seo_description": (
            "Enterprise AWS cloud migration strategies for "
            "secure, reliable and scalable modernization."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            1,
            15,
            9,
            0,
        ),
    },
    {
        "title": "How DevOps Automation Accelerates Software Delivery",
        "slug": "devops-automation-software-delivery",
        "category": "DevOps",
        "excerpt": (
            "Discover how CI/CD, Infrastructure as Code and "
            "container platforms improve software delivery."
        ),
        "content": (
            "DevOps automation helps engineering teams "
            "release software faster and more reliably.\n\n"
            "Continuous integration validates application "
            "changes early, while continuous delivery "
            "automates deployment workflows.\n\n"
            "Infrastructure as Code provides repeatable "
            "environments, and Kubernetes enables scalable "
            "application deployment.\n\n"
            "Together, these practices reduce manual effort, "
            "improve quality and shorten release cycles."
        ),
        "author": "Cubicles Services",
        "image_url": None,
        "seo_title": ("DevOps Automation for Faster Software Delivery"),
        "seo_description": (
            "Learn how CI/CD, Kubernetes and Infrastructure "
            "as Code accelerate modern software delivery."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            2,
            10,
            9,
            0,
        ),
    },
    {
        "title": "Modernizing Legacy Applications with Microservices",
        "slug": "modernizing-legacy-applications-microservices",
        "category": "Application Modernization",
        "excerpt": (
            "Understand how organizations can transform "
            "legacy applications into scalable cloud-native "
            "platforms."
        ),
        "content": (
            "Legacy applications often become difficult to "
            "maintain, scale and deploy.\n\n"
            "Application modernization can decompose large "
            "monolithic systems into independently deployable "
            "microservices.\n\n"
            "Containers, APIs, automated testing and modern "
            "observability platforms help improve reliability "
            "and development speed.\n\n"
            "Modernization should be performed incrementally "
            "to reduce business risk and preserve critical "
            "functionality."
        ),
        "author": "Cubicles Services",
        "image_url": None,
        "seo_title": ("Legacy Application Modernization with Microservices"),
        "seo_description": (
            "A practical guide to modernizing legacy "
            "applications using microservices and containers."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            3,
            5,
            9,
            0,
        ),
    },
]


def seed_blogs() -> None:
    db = SessionLocal()

    try:
        for blog_data in BLOGS:
            existing_blog = (
                db.query(Blog).filter(Blog.slug == blog_data["slug"]).first()
            )

            if existing_blog is None:
                db.add(Blog(**blog_data))

        db.commit()

        print("Blogs seeded successfully.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_blogs()
