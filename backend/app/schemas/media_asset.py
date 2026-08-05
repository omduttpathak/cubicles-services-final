from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MediaAssetResponse(BaseModel):
    id: int
    public_id: str
    filename: str
    original_filename: str
    mime_type: str
    extension: str
    file_size: int
    width: int | None
    height: int | None
    checksum: str
    title: str | None
    alt_text: str | None
    description: str | None
    file_url: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class MediaAssetMetadataUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        max_length=255,
    )

    alt_text: str | None = Field(
        default=None,
        max_length=500,
    )

    description: str | None = None


class MediaUploadResponse(BaseModel):
    message: str
    id: int
    public_id: str
    filename: str
    original_filename: str
    mime_type: str
    extension: str
    file_size: int
    width: int | None
    height: int | None
    checksum: str
    file_url: str
