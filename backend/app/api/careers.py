from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.career_application import (
    CareerApplicationCreate,
    CareerApplicationCreateResponse,
)
from app.services.career_application_service import (
    CareerApplicationService,
)

router = APIRouter(
    prefix="/api/careers",
    tags=["Careers"],
)

UPLOAD_DIRECTORY = Path("uploads/resumes")

ALLOWED_RESUME_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
}

MAX_RESUME_SIZE = 5 * 1024 * 1024


@router.post(
    "/applications",
    response_model=CareerApplicationCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_career_application(
    full_name: str = Form(...),
    email: str = Form(...),
    position: str = Form(...),
    phone: str | None = Form(None),
    experience: str | None = Form(None),
    current_company: str | None = Form(None),
    location: str | None = Form(None),
    linkedin_url: str | None = Form(None),
    cover_letter: str | None = Form(None),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    original_filename = resume.filename or ""

    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_RESUME_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=("Résumé must be a PDF, DOC or DOCX file."),
        )

    file_content = await resume.read()

    if len(file_content) > MAX_RESUME_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Résumé file must not exceed 5 MB.",
        )

    UPLOAD_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    stored_filename = f"{uuid4().hex}{extension}"

    stored_path = UPLOAD_DIRECTORY / stored_filename

    try:
        stored_path.write_bytes(file_content)

        application_data = CareerApplicationCreate(
            full_name=full_name,
            email=email,
            phone=phone,
            position=position,
            experience=experience,
            current_company=current_company,
            location=location,
            linkedin_url=linkedin_url,
            resume_url=f"/uploads/resumes/{stored_filename}",
            cover_letter=cover_letter,
        )

        service = CareerApplicationService(db)

        application = service.create_application(
            application_data,
        )
    except Exception:
        if stored_path.exists():
            stored_path.unlink()

        raise
    finally:
        await resume.close()

    return {
        "message": ("Career application submitted successfully."),
        "id": application.id,
    }
