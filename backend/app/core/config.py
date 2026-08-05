from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Cubicles Services API"
    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: str = "development"

    DATABASE_URL: str

    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URLS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "http://localhost:4173,"
        "http://127.0.0.1:4173"
    )

    ALLOWED_HOSTS: str = "localhost,127.0.0.1"

    SQL_ECHO: bool | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, value: str) -> str:
        normalized = value.strip().lower()

        if normalized not in {
            "development",
            "testing",
            "staging",
            "production",
        }:
            raise ValueError(
                "ENVIRONMENT must be development, testing, staging, or production."
            )

        return normalized

    @field_validator("DATABASE_URL", "JWT_SECRET_KEY")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        normalized = value.strip()

        if not normalized:
            raise ValueError("Required environment value must not be empty.")

        return normalized

    @model_validator(mode="after")
    def validate_production_settings(self):
        if not self.is_production:
            return self

        insecure_secret_values = {
            "change-me",
            "changeme",
            "secret",
            "development-secret",
        }

        if len(self.JWT_SECRET_KEY) < 32:
            raise ValueError(
                "JWT_SECRET_KEY must contain at least 32 characters in production."
            )

        if self.JWT_SECRET_KEY.lower() in insecure_secret_values:
            raise ValueError(
                "JWT_SECRET_KEY uses an insecure placeholder value."
            )

        if any(
            origin.startswith("http://")
            for origin in self.cors_origins
        ):
            raise ValueError(
                "FRONTEND_URLS must use HTTPS in production."
            )

        if "*" in self.trusted_hosts:
            raise ValueError(
                "ALLOWED_HOSTS must not contain '*' in production."
            )

        if any(
            host in {"localhost", "127.0.0.1"}
            for host in self.trusted_hosts
        ):
            raise ValueError(
                "ALLOWED_HOSTS must use production hostnames in production."
            )

        return self

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def database_echo(self) -> bool:
        if self.SQL_ECHO is not None:
            return self.SQL_ECHO

        return self.is_development

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.FRONTEND_URLS.split(",")
            if origin.strip()
        ]

    @property
    def trusted_hosts(self) -> list[str]:
        return [
            host.strip()
            for host in self.ALLOWED_HOSTS.split(",")
            if host.strip()
        ]


settings = Settings()
