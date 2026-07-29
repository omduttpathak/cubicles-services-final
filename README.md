# Cubicles Services

Cubicles Services is a full-stack company website and content-management platform for managing cloud, DevOps, application-modernization, technology, case-study, blog, career and contact content.

The application includes a public website, protected admin portal, REST API, MySQL database, media uploads and deployment support for AWS EC2.

## Features

### Public website

- Dynamic homepage
- About page
- Services listing and detail pages
- Technologies listing and detail pages
- Blog listing and detail pages
- Case-study listing and detail pages
- Careers page and job openings
- Career application form with resume upload
- Contact form
- Dynamic navigation and footer
- Dynamic site settings and branding
- Responsive design
- Page-level SEO metadata
- Custom loading, error and Not Found states

### Admin portal

- JWT-based administrator authentication
- Dashboard statistics
- Homepage content management
- About-page content management
- Services management
- Technologies management
- Blogs management
- Case-studies management
- Careers-page management
- Job-openings management
- Career-applications management
- Contact-request management
- Navigation management
- Footer-link management
- Site-settings management
- Media library
- Image upload and validation
- Draft, published, active and visibility controls

## Technology stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- Sonner
- Lucide React
- React Helmet Async

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- PyMySQL
- Alembic
- JWT authentication
- bcrypt password hashing
- Uvicorn

### Database and infrastructure

- MySQL 8.4
- Docker Compose
- Nginx
- systemd
- AWS EC2
- Git and GitHub

## Repository structure

```text
cubicles-services/
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── uploads/
│   ├── .env.example
│   ├── alembic.ini
│   ├── docker-compose.yaml
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
├── docs/
├── .gitignore
├── CHANGELOG.md
└── README.md
