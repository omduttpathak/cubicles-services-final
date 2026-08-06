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
