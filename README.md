# Cubicles Services

Cubicles Services is a full-stack company website and content management system built with React, TypeScript, FastAPI and MySQL.

## Features

- Public company website
- Secure admin panel
- Homepage content management
- Services and technologies management
- Blogs and case studies
- Careers and job applications
- Contact enquiries
- Navigation and footer management
- Site settings
- Media library and image variants
- Docker-based deployment
- Alembic database migrations
- Database backup and restore utilities

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod
- TipTap
- Framer Motion

### Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic
- PyMySQL
- JWT authentication
- Pillow

### Infrastructure

- Docker
- Docker Compose
- MySQL 8.4
- Nginx

## Project Structure

```text
cubicles-services-latest/
├── backend/
│   ├── alembic/
│   ├── app/
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── database/
│   └── cubicles_services_complete_backup.sql.gz
├── scripts/
│   ├── backup-db.sh
│   ├── restore-db.sh
│   └── reset-db.sh
├── compose.yaml
├── .env.example
├── .gitignore
└── README.md


git clone <repository>

cd cubicles-services-final

cp .env.example .env

# Update:
# MYSQL_ROOT_PASSWORD
# MYSQL_PASSWORD
# JWT_SECRET_KEY  (generate with : --> #openssl rand -hex 64)

docker compose up -d --build

Open:
http://localhost:8080

##############################################################################

ENVIRONMENT=development means: “I’m running this on a laptop, test VM, EC2 IP, Azure VM IP, or any temporary machine. Be flexible.” That is why ALLOWED_HOSTS=* and HTTP URLs are acceptable in this mode. Use it while developing, testing, validating Docker, or checking the app through a raw IP such as http://EC2-IP:8080.

ENVIRONMENT=production means: “This is the real live website.” In that mode, your backend deliberately becomes stricter. Your current code requires HTTPS for FRONTEND_URLS, does not allow ALLOWED_HOSTS=*, and expects real production hostnames. That is why production failed when you still had localhost HTTP URLs.
