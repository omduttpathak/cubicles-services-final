from datetime import datetime

from app.core.database import SessionLocal
from app.models.case_study import CaseStudy

CASE_STUDIES = [
    {
        "title": ("AWS Cloud Migration for a Financial Services Platform"),
        "slug": ("aws-cloud-migration-financial-services"),
        "industry": "Financial Services",
        "service": "Cloud Migration",
        "summary": (
            "Migrated a business-critical financial "
            "platform to AWS while improving security, "
            "availability and operational efficiency."
        ),
        "challenge": (
            "The organization operated a legacy "
            "on-premises platform with limited "
            "scalability, high infrastructure costs and "
            "manual disaster recovery processes."
        ),
        "solution": (
            "Cubicles Services designed a secure AWS "
            "landing zone, migrated applications in "
            "controlled waves and introduced automated "
            "infrastructure provisioning, monitoring and "
            "backup processes."
        ),
        "results": [
            "40% reduction in infrastructure costs",
            "Improved platform availability",
            "Automated backup and disaster recovery",
            "Faster provisioning of environments",
        ],
        "technologies": [
            "AWS",
            "Terraform",
            "Docker",
            "CloudWatch",
        ],
        "image_url": None,
        "seo_title": ("AWS Migration Case Study | Cubicles Services"),
        "seo_description": (
            "Learn how Cubicles Services migrated a financial services platform to AWS."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            1,
            20,
            9,
            0,
        ),
    },
    {
        "title": ("DevOps Automation for an Enterprise Software Team"),
        "slug": ("devops-automation-enterprise-software"),
        "industry": "Technology",
        "service": "DevOps Engineering",
        "summary": (
            "Implemented automated CI/CD pipelines and "
            "cloud-native deployment workflows for a "
            "growing software organization."
        ),
        "challenge": (
            "Application deployments were manual, slow "
            "and inconsistent across development, testing "
            "and production environments."
        ),
        "solution": (
            "Cubicles Services introduced standardized "
            "CI/CD pipelines, Infrastructure as Code, "
            "containerized workloads and Kubernetes-based "
            "deployment automation."
        ),
        "results": [
            "Deployment time reduced from hours to minutes",
            "Improved release reliability",
            "Consistent infrastructure environments",
            "Faster recovery from failed deployments",
        ],
        "technologies": [
            "GitHub Actions",
            "Kubernetes",
            "Docker",
            "Terraform",
        ],
        "image_url": None,
        "seo_title": ("DevOps Automation Case Study | Cubicles Services"),
        "seo_description": (
            "See how automated CI/CD and Kubernetes "
            "improved enterprise software delivery."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            2,
            18,
            9,
            0,
        ),
    },
    {
        "title": ("Modernizing a Legacy Retail Application"),
        "slug": ("legacy-retail-application-modernization"),
        "industry": "Retail",
        "service": "Application Modernization",
        "summary": (
            "Transformed a legacy monolithic retail "
            "application into a scalable cloud-native "
            "platform."
        ),
        "challenge": (
            "The existing application was difficult to "
            "scale, required long release cycles and "
            "created operational bottlenecks during peak "
            "shopping periods."
        ),
        "solution": (
            "The application was incrementally decomposed "
            "into services, containerized and integrated "
            "with modern APIs and automated delivery "
            "pipelines."
        ),
        "results": [
            "Improved application scalability",
            "Shorter software release cycles",
            "Reduced production incidents",
            "Better performance during peak demand",
        ],
        "technologies": [
            "Microservices",
            "Docker",
            "Kubernetes",
            "REST APIs",
        ],
        "image_url": None,
        "seo_title": ("Retail Application Modernization Case Study"),
        "seo_description": (
            "Discover how a legacy retail platform was "
            "modernized using microservices and containers."
        ),
        "is_published": True,
        "published_at": datetime(
            2026,
            3,
            12,
            9,
            0,
        ),
    },
]


def seed_case_studies() -> None:
    db = SessionLocal()

    try:
        for case_study_data in CASE_STUDIES:
            existing_case_study = (
                db.query(CaseStudy)
                .filter(CaseStudy.slug == case_study_data["slug"])
                .first()
            )

            if existing_case_study is None:
                db.add(
                    CaseStudy(
                        **case_study_data,
                    )
                )

        db.commit()

        print("Case studies seeded successfully.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_case_studies()
