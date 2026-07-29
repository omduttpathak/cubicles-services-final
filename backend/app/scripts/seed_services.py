from app.core.database import SessionLocal
from app.models.service import Service

SERVICES = [
    {
        "title": "Cloud Migration",
        "slug": "cloud-migration",
        "icon": "cloud",
        "short_description": (
            "Securely migrate enterprise applications and workloads to AWS and Azure."
        ),
        "description": (
            "Cubicles Services helps organizations migrate "
            "workloads from on-premises environments to AWS "
            "and Azure with minimal downtime, improved "
            "scalability and enterprise-grade security."
        ),
        "highlights": [
            "AWS Migration",
            "Azure Migration",
            "Hybrid Cloud",
            "Cloud Architecture",
        ],
        "hero_title": "Cloud Migration Services",
        "hero_description": (
            "Accelerate your cloud journey with secure "
            "migration strategies, modernization and "
            "optimization services."
        ),
        "seo_title": ("Cloud Migration Services | Cubicles Services"),
        "seo_description": ("Enterprise AWS and Azure cloud migration services."),
    },
    {
        "title": "DevOps Engineering",
        "slug": "devops-engineering",
        "icon": "workflow",
        "short_description": (
            "Accelerate software delivery using CI/CD, "
            "Kubernetes and Infrastructure as Code."
        ),
        "description": (
            "Modern DevOps practices helping teams deliver "
            "software faster through automation, "
            "Infrastructure as Code and cloud-native "
            "engineering."
        ),
        "highlights": [
            "CI/CD Automation",
            "Kubernetes",
            "Terraform",
            "Monitoring",
        ],
        "hero_title": "DevOps Engineering",
        "hero_description": (
            "Automate your software delivery lifecycle using modern DevOps practices."
        ),
        "seo_title": ("DevOps Services | Cubicles Services"),
        "seo_description": ("CI/CD, Kubernetes, IaC and DevOps automation."),
    },
    {
        "title": "Application Modernization",
        "slug": "application-modernization",
        "icon": "refresh",
        "short_description": (
            "Modernize legacy applications into scalable cloud-native platforms."
        ),
        "description": (
            "Transform monolithic enterprise applications "
            "into secure, scalable and resilient "
            "microservices."
        ),
        "highlights": [
            "Microservices",
            "Containerization",
            "API Modernization",
            "Legacy Transformation",
        ],
        "hero_title": "Application Modernization",
        "hero_description": (
            "Modern software architecture for future-ready businesses."
        ),
        "seo_title": ("Application Modernization | Cubicles Services"),
        "seo_description": ("Legacy modernization and cloud-native transformation."),
    },
    {
        "title": "Managed IT Services",
        "slug": "managed-it-services",
        "icon": "shield",
        "short_description": (
            "24×7 monitoring, cloud operations and managed infrastructure support."
        ),
        "description": (
            "Keep your cloud environment secure, optimized "
            "and available through proactive monitoring and "
            "managed support."
        ),
        "highlights": [
            "24x7 Monitoring",
            "Cloud Operations",
            "Security",
            "Performance Optimization",
        ],
        "hero_title": "Managed IT Services",
        "hero_description": (
            "Managed cloud operations that keep your business running smoothly."
        ),
        "seo_title": ("Managed IT Services | Cubicles Services"),
        "seo_description": ("Managed cloud infrastructure and operational support."),
    },
]


def seed_services() -> None:
    db = SessionLocal()

    try:
        for service_data in SERVICES:
            existing_service = (
                db.query(Service).filter(Service.slug == service_data["slug"]).first()
            )

            if existing_service is None:
                db.add(Service(**service_data))

        db.commit()

        print("Services seeded successfully.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_services()
