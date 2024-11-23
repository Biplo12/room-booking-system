# Conference Room Booking System

A full-stack application for managing conference room bookings with a Flask backend API and Next.js frontend.

## Quick Start

1. Backend Setup:

   - Clone repository,
   - Create Python virtual environment,
   - Install dependencies: `pip install -r requirements.txt`,
   - Configure environment variables,
   - Run migrations: `flask db upgrade`,
   - Start server: `flask run`

2. Frontend Setup:
   - Navigate to client directory,
   - Install dependencies: `yarn install`,
   - Configure environment variables,
   - Start development server: `yarn dev`

## Environment Variables

Backend (.env):

- SECRET_KEY=your-secret-key,
- DATABASE_URL=postgresql://username:password@localhost:5432/database_name,
- JWT_SECRET_KEY=your-jwt-secret,
- SENTRY_DSN=your-sentry-dsn,
- CORS_ORIGINS=http://localhost:3000,
- FLASK_ENV=development

Frontend (.env.local):

- NEXT_PUBLIC_API_URL=http://localhost:5000

## Features

User Management:

- Authentication with JWT,
- Role-based authorization,
- User profiles,
- Admin dashboard access

Room Management:

- Room creation, editing and deletion,
- Capacity tracking,
- Equipment management,
- Location mapping

Booking System:

- availability checking,
- Conflict prevention,
- Booking confirmation,
- Calendar integration

Analytics:

- Usage statistics,
- Room utilization metrics,
- Booking trends

## Tech Stack

Backend:

- Flask,
- SQLAlchemy,
- PostgreSQL,
- JWT Authentication,
- Swagger Documentation

Frontend:

- Next.js 15+,
- TypeScript,
- React Query,
- Zustand,
- Tailwind CSS,
- Shadcn UI

## Development

Testing:

- Backend: `pytest`,
- Frontend: `yarn test`,
- Linting: `yarn lint`

Documentation:

- API docs at `/docs`,
- Technical documentation in `TECHNICAL.md`

## License

MIT License - see LICENSE file for details
