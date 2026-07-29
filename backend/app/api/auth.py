from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, verify_password
from app.models.admin import Admin
from app.schemas.auth import AdminLogin, TokenResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def admin_login(
    credentials: AdminLogin,
    db: Session = Depends(get_db),
):
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()

    if not admin or not verify_password(
        credentials.password,
        admin.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(str(admin.id))

    return TokenResponse(
        access_token=token,
    )
