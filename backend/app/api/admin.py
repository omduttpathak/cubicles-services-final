from app.models.blog import Blog
from app.models.case_study import CaseStudy
from app.models.site_setting import SiteSetting
from app.models.technology import Technology
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote
from fastapi import Response
from pathlib import Path
from uuid import uuid4

from app.schemas.case_studies_page import (
    CaseStudiesPageResponse,
    CaseStudiesPageUpdate,
)
from app.services.case_studies_page_service import (
    CaseStudiesPageService,
)

from app.schemas.blog_page import (
    BlogPageResponse,
    BlogPageUpdate,
)
from app.services.blog_page_service import (
    BlogPageService,
)

from app.schemas.technology_page import (
    TechnologyPageResponse,
    TechnologyPageUpdate,
)
from app.services.technology_page_service import (
    TechnologyPageService,
)

from app.schemas.services_page import (
    ServicesPageResponse,
    ServicesPageUpdate,
)

from app.services.services_page_service import (
    ServicesPageService,
)

from app.schemas.job_opening import (
    AdminJobOpeningResponse,
    JobOpeningCreate,
    JobOpeningOrderUpdate,
    JobOpeningUpdate,
)
from app.services.job_opening_service import (
    JobOpeningService,
)

from app.schemas.career_page import (
    CareerPageResponse,
    CareerPageUpdate,
)
from app.services.career_page_service import (
    CareerPageService,
)

from app.schemas.contact_page import (
    ContactPageResponse,
    ContactPageUpdate,
)

from app.services.contact_page_service import (
    ContactPageService,
)

from app.schemas.about_page import (
    AboutPageResponse,
    AboutPageUpdate,
)
from app.schemas.about_stat import (
    AboutStatCreate,
    AboutStatResponse,
    AboutStatUpdate,
)
from app.schemas.about_value import (
    AboutValueCreate,
    AboutValueResponse,
    AboutValueUpdate,
)
from app.services.about_page_service import AboutPageService
from app.services.about_stat_service import AboutStatService
from app.services.about_value_service import AboutValueService

from app.schemas.footer_link import (
    FooterLinkCreate,
    FooterLinkOrderUpdate,
    FooterLinkResponse,
    FooterLinkUpdate,
)

from app.services.footer_link_service import (
    FooterLinkService,
)

from app.core.dependencies import (
    get_current_admin,
)

from app.schemas.navigation_item import (
    NavigationItemCreate,
    NavigationItemOrderUpdate,
    NavigationItemResponse,
    NavigationItemUpdate,
)
from app.services.navigation_item_service import (
    NavigationItemService,
)


from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)

from app.schemas.site_setting import (
    SiteSettingResponse,
    SiteSettingUpdate,
)
from app.services.site_setting_service import (
    SiteSettingService,
)

from app.services.media_asset_service import (
    MAX_IMAGE_SIZE,
    MediaAssetService,
)

from app.schemas.homepage_faq import (
    HomepageFaqCreate,
    HomepageFaqResponse,
    HomepageFaqUpdate,
)
from app.services.homepage_faq_service import (
    HomepageFaqService,
)

from app.schemas.homepage_testimonial import (
    HomepageTestimonialCreate,
    HomepageTestimonialResponse,
    HomepageTestimonialUpdate,
)
from app.services.homepage_testimonial_service import (
    HomepageTestimonialService,
)

from app.schemas.homepage_industry import (
    HomepageIndustryCreate,
    HomepageIndustryResponse,
    HomepageIndustryUpdate,
)
from app.services.homepage_industry_service import (
    HomepageIndustryService,
)

from app.schemas.homepage_benefit import (
    HomepageBenefitCreate,
    HomepageBenefitResponse,
    HomepageBenefitUpdate,
)
from app.services.homepage_benefit_service import (
    HomepageBenefitService,
)

from app.schemas.homepage_stat import (
    HomepageStatCreate,
    HomepageStatResponse,
    HomepageStatUpdate,
)
from app.services.homepage_stat_service import (
    HomepageStatService,
)

from app.schemas.homepage import (
    HomepageResponse,
    HomepageUpdate,
)
from app.services.homepage_service import (
    HomepageService,
)

from app.schemas.service import (
    ServiceResponse,
    ServiceCreate,
    ServiceUpdate,
)

from app.schemas.technology import (
    AdminTechnologyResponse,
    TechnologyCreate,
    TechnologyUpdate,
)
from app.services.technology_service import (
    TechnologyService,
)

from app.services.service_service import ServiceService
from datetime import date, datetime
from pydantic import BaseModel

from app.schemas.career_application import (
    AdminCareerApplicationResponse,
    CareerApplicationStatusUpdate,
)
from app.services.career_application_service import (
    CareerApplicationService,
)

from app.schemas.case_study import (
    AdminCaseStudyResponse,
    CaseStudyCreate,
    CaseStudyUpdate,
)
from app.services.case_study_service import (
    CaseStudyService,
)


from app.schemas.blog import (
    AdminBlogResponse,
    BlogCreate,
    BlogUpdate,
)
from app.services.blog_service import BlogService


from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.admin import Admin
from app.models.contact import Contact

from pydantic import BaseModel


class JobOpeningOrderUpdate(BaseModel):
    job_ids: list[int]


class BlogPublishStatusUpdate(BaseModel):
    is_published: bool


class CaseStudyPublishStatusUpdate(BaseModel):
    is_published: bool


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get(
    "/homepage-stats",
    response_model=list[HomepageStatResponse],
)
def get_admin_homepage_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageStatService(db)

    return service.get_admin_stats()


@router.post(
    "/homepage-stats",
    response_model=HomepageStatResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_homepage_stat(
    payload: HomepageStatCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageStatService(db)

    return service.create_stat(payload)


@router.get(
    "/homepage-stats/{stat_id}",
    response_model=HomepageStatResponse,
)
def get_admin_homepage_stat_by_id(
    stat_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageStatService(db)

    stat = service.get_admin_stat_by_id(stat_id)

    if stat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage statistic not found",
        )

    return stat


@router.put(
    "/homepage-stats/{stat_id}",
    response_model=HomepageStatResponse,
)
def update_admin_homepage_stat(
    stat_id: int,
    payload: HomepageStatUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageStatService(db)

    try:
        return service.update_stat(
            stat_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/homepage-stats/{stat_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_homepage_stat(
    stat_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageStatService(db)

    try:
        service.delete_stat(stat_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/homepage-benefits",
    response_model=list[HomepageBenefitResponse],
)
def get_admin_homepage_benefits(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageBenefitService(db)

    return service.get_admin_benefits()


@router.post(
    "/homepage-benefits",
    response_model=HomepageBenefitResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_homepage_benefit(
    payload: HomepageBenefitCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageBenefitService(db)

    return service.create_benefit(
        payload,
    )


@router.get(
    "/homepage-benefits/{benefit_id}",
    response_model=HomepageBenefitResponse,
)
def get_admin_homepage_benefit_by_id(
    benefit_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageBenefitService(db)

    benefit = service.get_admin_benefit_by_id(
        benefit_id,
    )

    if benefit is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage benefit not found",
        )

    return benefit


@router.put(
    "/homepage-benefits/{benefit_id}",
    response_model=HomepageBenefitResponse,
)
def update_admin_homepage_benefit(
    benefit_id: int,
    payload: HomepageBenefitUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageBenefitService(db)

    try:
        return service.update_benefit(
            benefit_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/homepage-benefits/{benefit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_homepage_benefit(
    benefit_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageBenefitService(db)

    try:
        service.delete_benefit(
            benefit_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/homepage",
    response_model=HomepageResponse,
)
def get_admin_homepage(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageService(db)

    homepage = service.get_admin_homepage()

    if homepage is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage settings not found",
        )

    return homepage


@router.put(
    "/homepage",
    response_model=HomepageResponse,
)
def update_admin_homepage(
    payload: HomepageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageService(db)

    return service.update_homepage(payload)


@router.get("/contacts")
def get_contacts(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()


@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    today = date.today()

    month_start = datetime(
        year=today.year,
        month=today.month,
        day=1,
    )

    total_contacts = db.query(func.count(Contact.id)).scalar() or 0

    today_contacts = (
        db.query(func.count(Contact.id))
        .filter(func.date(Contact.created_at) == today)
        .scalar()
        or 0
    )

    month_contacts = (
        db.query(func.count(Contact.id))
        .filter(Contact.created_at >= month_start)
        .scalar()
        or 0
    )

    unread_contacts = (
        db.query(func.count(Contact.id)).filter(Contact.is_read.is_(False)).scalar()
        or 0
    )

    most_requested_service_row = (
        db.query(
            Contact.service,
            func.count(Contact.id).label("request_count"),
        )
        .filter(
            Contact.service.isnot(None),
            Contact.service != "",
        )
        .group_by(Contact.service)
        .order_by(func.count(Contact.id).desc())
        .first()
    )

    most_requested_service = (
        most_requested_service_row.service if most_requested_service_row else "No data"
    )

    return {
        "total_contacts": total_contacts,
        "today_contacts": today_contacts,
        "month_contacts": month_contacts,
        "unread_contacts": unread_contacts,
        "most_requested_service": most_requested_service,
    }


@router.patch("/contacts/{contact_id}/read")
def mark_contact_as_read(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if contact is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact request not found",
        )

    contact.is_read = True

    db.commit()
    db.refresh(contact)

    return {
        "message": "Contact request marked as read",
        "id": contact.id,
        "is_read": contact.is_read,
    }


@router.get(
    "/blogs",
    response_model=list[AdminBlogResponse],
)
def get_admin_blogs(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    return service.get_admin_blogs()


@router.post(
    "/blogs",
    response_model=AdminBlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_blog(
    blog_data: BlogCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    try:
        return service.create_blog(blog_data)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "/technologies/{technology_id}",
    response_model=AdminTechnologyResponse,
)
def get_admin_technology_by_id(
    technology_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = TechnologyService(db)

    technology = service.get_admin_technology_by_id(
        technology_id,
    )

    if technology is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology not found",
        )

    return technology


@router.put(
    "/technologies/{technology_id}",
    response_model=AdminTechnologyResponse,
)
def update_admin_technology(
    technology_id: int,
    payload: TechnologyUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = TechnologyService(db)

    try:
        return service.update_technology(
            technology_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/technologies/{technology_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_technology(
    technology_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = TechnologyService(db)

    try:
        service.delete_technology(
            technology_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/services/{service_id}",
    response_model=ServiceResponse,
)
def get_admin_service_by_id(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = ServiceService(db)

    result = service.get_admin_service_by_id(
        service_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return result


@router.put(
    "/services/{service_id}",
    response_model=ServiceResponse,
)
def update_admin_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = ServiceService(db)

    try:
        return service.update_service(
            service_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "/blogs/{blog_id}",
    response_model=AdminBlogResponse,
)
def get_admin_blog_by_id(
    blog_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    blog = service.get_admin_blog_by_id(blog_id)

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    return blog


@router.put(
    "/blogs/{blog_id}",
    response_model=AdminBlogResponse,
)
def update_admin_blog(
    blog_id: int,
    blog_data: BlogUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    try:
        return service.update_blog(
            blog_id,
            blog_data,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.patch(
    "/blogs/{blog_id}/publish-status",
    response_model=AdminBlogResponse,
)
def update_blog_publish_status(
    blog_id: int,
    payload: BlogPublishStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    try:
        return service.update_publish_status(
            blog_id,
            payload.is_published,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/blogs/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogService(db)

    try:
        service.delete_blog(blog_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/case-studies",
    response_model=list[AdminCaseStudyResponse],
)
def get_admin_case_studies(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudyService(db)

    return service.get_admin_case_studies()


@router.post(
    "/case-studies",
    response_model=AdminCaseStudyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_case_study(
    case_study_data: CaseStudyCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CaseStudyService(db)

    try:
        return service.create_case_study(
            case_study_data,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "/case-studies/{case_study_id}",
    response_model=AdminCaseStudyResponse,
)
def get_admin_case_study_by_id(
    case_study_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CaseStudyService(db)

    case_study = (
        service.get_admin_case_study_by_id(
            case_study_id,
        )
    )

    if case_study is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case study not found",
        )

    return case_study

@router.put(
    "/case-studies/{case_study_id}",
    response_model=AdminCaseStudyResponse,
)
def update_admin_case_study(
    case_study_id: int,
    case_study_data: CaseStudyUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudyService(db)

    try:
        return service.update_case_study(
            case_study_id,
            case_study_data,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/services/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = ServiceService(db)

    try:
        service.delete_service(service_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.patch(
    "/case-studies/{case_study_id}/publish-status",
    response_model=AdminCaseStudyResponse,
)
def update_case_study_publish_status(
    case_study_id: int,
    payload: CaseStudyPublishStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudyService(db)

    try:
        return service.update_publish_status(
            case_study_id,
            payload.is_published,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/career-applications",
    response_model=list[AdminCareerApplicationResponse],
)
def get_admin_career_applications(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CareerApplicationService(db)

    return service.get_admin_applications()


@router.get(
    "/career-applications/{application_id}",
    response_model=AdminCareerApplicationResponse,
)
def get_admin_career_application_by_id(
    application_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CareerApplicationService(db)

    application = service.get_admin_application_by_id(
        application_id,
    )

    if application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career application not found",
        )

    return application


@router.patch(
    "/career-applications/{application_id}/status",
    response_model=AdminCareerApplicationResponse,
)
def update_career_application_status(
    application_id: int,
    payload: CareerApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CareerApplicationService(db)

    try:
        return service.update_application_status(
            application_id,
            payload.status,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.get(
    "/services",
    response_model=list[ServiceResponse],
)
def get_admin_services(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = ServiceService(db)

    return service.get_admin_services()


@router.post(
    "/services",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = ServiceService(db)

    try:
        return service.create_service(
            payload,
        )

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error


@router.delete(
    "/career-applications/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_career_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = CareerApplicationService(db)

    try:
        service.delete_application(
            application_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.delete(
    "/case-studies/{case_study_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_case_study(
    case_study_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudyService(db)

    try:
        service.delete_case_study(
            case_study_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )




@router.delete(
    "/contacts/{contact_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()

    if contact is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact request not found",
        )

    db.delete(contact)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/technologies",
    response_model=list[AdminTechnologyResponse],
)
def get_admin_technologies(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = TechnologyService(db)

    return service.get_admin_technologies()


@router.get(
    "/site-settings",
    response_model=SiteSettingResponse,
)
def get_admin_site_settings(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = SiteSettingService(db)

    settings = service.get_admin_site_settings()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site settings not found",
        )

    return settings


@router.put(
    "/site-settings",
    response_model=SiteSettingResponse,
)
def update_admin_site_settings(
    payload: SiteSettingUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = SiteSettingService(db)

    return service.update_site_settings(
        payload,
    )


@router.get(
    "/homepage-industries",
    response_model=list[HomepageIndustryResponse],
)
def get_admin_homepage_industries(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageIndustryService(db)

    return service.get_admin_industries()


@router.post(
    "/homepage-industries",
    response_model=HomepageIndustryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_homepage_industry(
    payload: HomepageIndustryCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageIndustryService(db)

    return service.create_industry(payload)


@router.get(
    "/homepage-industries/{industry_id}",
    response_model=HomepageIndustryResponse,
)
def get_admin_homepage_industry_by_id(
    industry_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageIndustryService(db)

    industry = service.get_admin_industry_by_id(
        industry_id,
    )

    if industry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage industry not found",
        )

    return industry


@router.put(
    "/homepage-industries/{industry_id}",
    response_model=HomepageIndustryResponse,
)
def update_admin_homepage_industry(
    industry_id: int,
    payload: HomepageIndustryUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageIndustryService(db)

    try:
        return service.update_industry(
            industry_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/homepage-industries/{industry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_homepage_industry(
    industry_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageIndustryService(db)

    try:
        service.delete_industry(
            industry_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.post(
    "/technologies",
    response_model=AdminTechnologyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_technology(
    payload: TechnologyCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = TechnologyService(db)

    try:
        return service.create_technology(
            payload,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get(
    "/homepage-testimonials",
    response_model=list[HomepageTestimonialResponse],
)
def get_admin_homepage_testimonials(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageTestimonialService(db)

    return service.get_admin_testimonials()


@router.post(
    "/homepage-testimonials",
    response_model=HomepageTestimonialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_homepage_testimonial(
    payload: HomepageTestimonialCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageTestimonialService(db)

    return service.create_testimonial(
        payload,
    )


@router.get(
    "/homepage-testimonials/{testimonial_id}",
    response_model=HomepageTestimonialResponse,
)
def get_admin_homepage_testimonial_by_id(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageTestimonialService(db)

    testimonial = service.get_admin_testimonial_by_id(
        testimonial_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=("Homepage testimonial not found"),
        )

    return testimonial


@router.put(
    "/homepage-testimonials/{testimonial_id}",
    response_model=HomepageTestimonialResponse,
)
def update_admin_homepage_testimonial(
    testimonial_id: int,
    payload: HomepageTestimonialUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageTestimonialService(db)

    try:
        return service.update_testimonial(
            testimonial_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/homepage-testimonials/{testimonial_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_homepage_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageTestimonialService(db)

    try:
        service.delete_testimonial(
            testimonial_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/homepage-faqs",
    response_model=list[HomepageFaqResponse],
)
def get_admin_homepage_faqs(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageFaqService(db)

    return service.get_admin_faqs()


@router.post(
    "/homepage-faqs",
    response_model=HomepageFaqResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_homepage_faq(
    payload: HomepageFaqCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageFaqService(db)

    return service.create_faq(payload)


@router.get(
    "/homepage-faqs/{faq_id}",
    response_model=HomepageFaqResponse,
)
def get_admin_homepage_faq_by_id(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageFaqService(db)

    faq = service.get_admin_faq_by_id(
        faq_id,
    )

    if faq is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage FAQ not found",
        )

    return faq


@router.put(
    "/homepage-faqs/{faq_id}",
    response_model=HomepageFaqResponse,
)
def update_admin_homepage_faq(
    faq_id: int,
    payload: HomepageFaqUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageFaqService(db)

    try:
        return service.update_faq(
            faq_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/homepage-faqs/{faq_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_homepage_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = HomepageFaqService(db)

    try:
        service.delete_faq(faq_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )

@router.post(
    "/uploads/images",
    status_code=status.HTTP_201_CREATED,
)
async def upload_admin_image(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    try:
        file_content = await file.read(
            MAX_IMAGE_SIZE + 1,
        )

        service = MediaAssetService(db)

        try:
            asset = service.create_image(
                original_filename=file.filename or "",
                content_type=file.content_type,
                file_content=file_content,
            )
        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error),
            ) from error

        file_url = f"/api/media/{asset.public_id}"

        return {
            "message": "Image uploaded successfully.",
            "filename": asset.filename,
            "file_url": file_url,
        }
    finally:
        await file.close()


@router.get(
    "/media",
)
def get_admin_media_library(
    request: Request,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = MediaAssetService(db)
    media_items = []

    for asset in service.list_assets():
        usage = service.get_usage(asset)

        media_items.append(
            {
                "filename": asset.filename,
                "file_url": f"/api/media/{asset.public_id}",
                "extension": asset.extension,
                "size_bytes": asset.file_size,
                "created_at": asset.created_at.isoformat(),
                "is_used": bool(usage),
                "usage": usage,
            }
        )

    return media_items


@router.get(
    "/navigation",
    response_model=list[
        NavigationItemResponse
    ],
)
def get_admin_navigation(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    return service.get_admin_navigation()


@router.post(
    "/navigation",
    response_model=NavigationItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_navigation_item(
    payload: NavigationItemCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    return service.create_navigation_item(
        payload,
    )


@router.get(
    "/navigation/{navigation_item_id}",
    response_model=NavigationItemResponse,
)
def get_admin_navigation_item(
    navigation_item_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    navigation_item = (
        service.get_navigation_item_by_id(
            navigation_item_id,
        )
    )

    if navigation_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Navigation item not found.",
        )

    return navigation_item


@router.put(
    "/navigation/{navigation_item_id}",
    response_model=NavigationItemResponse,
)
def update_admin_navigation_item(
    navigation_item_id: int,
    payload: NavigationItemUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    try:
        return service.update_navigation_item(
            navigation_item_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.put(
    "/navigation-order",
    response_model=list[
        NavigationItemResponse
    ],
)
def update_admin_navigation_order(
    payload: NavigationItemOrderUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    try:
        return (
            service.update_navigation_order(
                payload.item_ids,
            )
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error


@router.delete(
    "/navigation/{navigation_item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_navigation_item(
    navigation_item_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = NavigationItemService(db)

    try:
        service.delete_navigation_item(
            navigation_item_id,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.delete(
    "/media/{filename}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_media_file(
    filename: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid media filename.",
        )

    service = MediaAssetService(db)
    asset = service.get_by_filename(safe_filename)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media asset not found.",
        )

    usage = service.get_usage(asset)

    if usage:
        usage_labels = ", ".join(
            str(item["label"])
            for item in usage
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This media file is currently "
                f"in use by: {usage_labels}. "
                "Remove or replace those references "
                "before deleting it."
            ),
        )

    service.delete_asset(asset)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


@router.get(
    "/footer-links",
    response_model=list[FooterLinkResponse],
)
def get_footer_links(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return FooterLinkService(db).get_admin_footer_links()


@router.post(
    "/footer-links",
    response_model=FooterLinkResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_footer_link(
    data: FooterLinkCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    return FooterLinkService(db).create_footer_link(data)


@router.put("/footer-links/order")
def update_footer_link_order(
    data: FooterLinkOrderUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    try:
        return FooterLinkService(db).update_footer_link_order(
            data.items,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

@router.put(
    "/footer-links/{footer_link_id}",
    response_model=FooterLinkResponse,
)
def update_footer_link(
    footer_link_id: int,
    data: FooterLinkUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    try:
        return FooterLinkService(db).update_footer_link(
            footer_link_id,
            data,
        )
    except LookupError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


@router.delete(
    "/footer-links/{footer_link_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_footer_link(
    footer_link_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    try:
        FooterLinkService(db).delete_footer_link(
            footer_link_id,
        )

        return Response(status_code=status.HTTP_204_NO_CONTENT)

    except LookupError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

@router.get(
    "/about",
    response_model=AboutPageResponse,
)
def get_admin_about_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    about = AboutPageService(db).get_admin_about_page()

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About page settings not found.",
        )

    return about


@router.put(
    "/about",
    response_model=AboutPageResponse,
)
def update_admin_about_page(
    payload: AboutPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return AboutPageService(db).update_about_page(payload)


@router.get(
    "/about-stats",
    response_model=list[AboutStatResponse],
)
def get_admin_about_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return AboutStatService(db).get_admin_about_stats()


@router.post(
    "/about-stats",
    response_model=AboutStatResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_about_stat(
    payload: AboutStatCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return AboutStatService(db).create_about_stat(payload)


@router.put(
    "/about-stats/{stat_id}",
    response_model=AboutStatResponse,
)
def update_admin_about_stat(
    stat_id: int,
    payload: AboutStatUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    try:
        return AboutStatService(db).update_about_stat(
            stat_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error


@router.delete(
    "/about-stats/{stat_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_about_stat(
    stat_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    try:
        AboutStatService(db).delete_about_stat(stat_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/about-values",
    response_model=list[AboutValueResponse],
)
def get_admin_about_values(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return AboutValueService(db).get_admin_about_values()


@router.post(
    "/about-values",
    response_model=AboutValueResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_about_value(
    payload: AboutValueCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return AboutValueService(db).create_about_value(payload)


@router.put(
    "/about-values/{value_id}",
    response_model=AboutValueResponse,
)
def update_admin_about_value(
    value_id: int,
    payload: AboutValueUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    try:
        return AboutValueService(db).update_about_value(
            value_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

@router.get(
    "/contact-page",
    response_model=ContactPageResponse,
)
def get_admin_contact_page(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    service = ContactPageService(db)

    settings = service.get_admin_contact_page()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact page settings not found",
        )

    return settings

@router.put(
    "/contact-page",
    response_model=ContactPageResponse,
)
def update_contact_page(
    data: ContactPageUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    service = ContactPageService(db)

    return service.update_contact_page(data)


@router.delete(
    "/about-values/{value_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_about_value(
    value_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    try:
        AboutValueService(db).delete_about_value(value_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get(
    "/career-page",
    response_model=CareerPageResponse,
)
def get_admin_career_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CareerPageService(db)

    settings = service.get_admin_career_page()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career page settings not found",
        )

    return settings


@router.put(
    "/career-page",
    response_model=CareerPageResponse,
)
def update_admin_career_page(
    payload: CareerPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CareerPageService(db)

    return service.update_career_page(payload)

@router.put(
    "/job-openings/order",
    response_model=list[AdminJobOpeningResponse],
)
def update_admin_job_opening_order(
    payload: JobOpeningOrderUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    try:
        return service.update_display_order(
            payload.job_ids,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

@router.get(
    "/job-openings",
    response_model=list[AdminJobOpeningResponse],
)
def get_admin_job_openings(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    return service.get_admin_job_openings()


@router.get(
    "/job-openings/{job_id}",
    response_model=AdminJobOpeningResponse,
)
def get_admin_job_opening_by_id(
    job_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    job = service.get_admin_job_opening_by_id(job_id)

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job opening not found",
        )

    return job


@router.post(
    "/job-openings",
    response_model=AdminJobOpeningResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_job_opening(
    payload: JobOpeningCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    try:
        return service.create_job_opening(payload)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.put(
    "/job-openings/{job_id}",
    response_model=AdminJobOpeningResponse,
)
def update_admin_job_opening(
    job_id: int,
    payload: JobOpeningUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    try:
        return service.update_job_opening(
            job_id,
            payload,
        )
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.delete(
    "/job-openings/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_job_opening(
    job_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = JobOpeningService(db)

    try:
        service.delete_job_opening(job_id)
    except LookupError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        ) from error

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/services-page",
    response_model=ServicesPageResponse,
)
def get_admin_services_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = ServicesPageService(db)

    page = service.get_admin_services_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Services page not found",
        )

    return page


@router.put(
    "/services-page",
    response_model=ServicesPageResponse,
)
def update_admin_services_page(
    data: ServicesPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = ServicesPageService(db)

    return service.update_services_page(
        data,
    )

@router.get(
    "/technology-page",
    response_model=TechnologyPageResponse,
)
def get_admin_technology_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = TechnologyPageService(db)

    page = service.get_admin_technology_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology page settings not found",
        )

    return page


@router.put(
    "/technology-page",
    response_model=TechnologyPageResponse,
)
def update_admin_technology_page(
    payload: TechnologyPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = TechnologyPageService(db)

    return service.update_technology_page(
        payload,
    )

@router.get(
    "/blog-page",
    response_model=BlogPageResponse,
)
def get_admin_blog_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogPageService(db)

    page = service.get_admin_blog_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog page settings not found",
        )

    return page


@router.put(
    "/blog-page",
    response_model=BlogPageResponse,
)
def update_admin_blog_page(
    payload: BlogPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = BlogPageService(db)

    return service.update_blog_page(
        payload,
    )

@router.get(
    "/case-studies-page",
    response_model=CaseStudiesPageResponse,
)
def get_admin_case_studies_page(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudiesPageService(db)

    page = service.get_admin_case_studies_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case Studies page settings not found",
        )

    return page


@router.put(
    "/case-studies-page",
    response_model=CaseStudiesPageResponse,
)
def update_admin_case_studies_page(
    payload: CaseStudiesPageUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    service = CaseStudiesPageService(db)

    return service.update_case_studies_page(
        payload,
    )
