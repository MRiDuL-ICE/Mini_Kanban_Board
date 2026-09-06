# Mini Kanban Board

A full-stack Kanban workspace with JWT authentication, boards, columns, tasks, drag-and-drop task movement, member roles, and a responsive Next.js interface.

## Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, React Query, Zustand
- **Backend:** NestJS, TypeScript, Prisma, PostgreSQL
- **Authentication:** JWT access and refresh tokens
- **API documentation:** Swagger in development

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL 14 or newer, or a hosted PostgreSQL provider such as Supabase or Neon
- Git

Docker users can run the application services with Docker Compose, but PostgreSQL must still be available through the `DATABASE_URL` and `DIRECT_URL` values.

## Project Structure

```text
backend/    NestJS API and Prisma schema/migrations
frontend/   Next.js web application
docker-compose.yml
```

## 1. Clone the Repository

```bash
git clone <repository-url>
cd Mini_Kanban_Board
```

## 2. Configure the Backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=4000

# PostgreSQL connection strings
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_kanban?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/mini_kanban?schema=public"

# Use a long random value outside local development
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
```

For hosted PostgreSQL providers, use the provider's pooled connection string for `DATABASE_URL` and its direct connection string for `DIRECT_URL` when they differ.

Install dependencies, generate Prisma Client, and apply migrations:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
```

Start the API in watch mode:

```bash
npm run start:dev
```

The API is available at `http://localhost:4000/api/v1`.
Swagger is available at `http://localhost:4000/api/docs` while `NODE_ENV` is not `production`.

## 3. Configure the Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

Install dependencies and start Next.js:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Docker Compose

Create a root `.env` file for Compose:

```env
DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/mini_kanban?schema=public"
DIRECT_URL="postgresql://postgres:postgres@host.docker.internal:5432/mini_kanban?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:3000"
BACKEND_PORT=4000
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
```

Start both services:

```bash
docker compose up --build
```

Run Prisma migrations from the backend container when needed:

```bash
docker compose exec backend npx prisma migrate deploy
```

Stop the services:

```bash
docker compose down
```

## Useful Commands

### Backend

```bash
npm run build          # Compile NestJS
npm run start:dev      # Development server with watch mode
npm run test           # Run tests
npm run test:cov       # Run tests with coverage
npm run prisma:studio  # Open Prisma Studio
```

### Frontend

```bash
npm run dev            # Start the development server
npm run build          # Create a production build
npm run start          # Start the production build
```

## Verification

After starting both applications:

1. Open `http://localhost:3000`.
2. Register a user and sign in.
3. Create a board and add columns.
4. Create, edit, move, and delete tasks.
5. Add another registered user as an editor or viewer.
6. Confirm the API and database are reachable if an operation fails.

## Environment Variable Summary

| Variable              | Used by        | Purpose                                                |
| --------------------- | -------------- | ------------------------------------------------------ |
| `DATABASE_URL`        | Backend/Prisma | PostgreSQL connection used by the application          |
| `DIRECT_URL`          | Prisma         | Direct PostgreSQL connection used by Prisma migrations |
| `JWT_SECRET`          | Backend        | Signs JWT access tokens                                |
| `JWT_EXPIRES_IN`      | Backend        | Access token lifetime, for example `7d`                |
| `FRONTEND_URL`        | Backend        | Allowed frontend origin for CORS                       |
| `PORT`                | Backend        | API port, defaults to `4000`                           |
| `NEXT_PUBLIC_API_URL` | Frontend       | Full backend API base URL                              |
| `BACKEND_PORT`        | Docker Compose | Host port mapped to the backend                        |
| `FRONTEND_PORT`       | Docker Compose | Host port mapped to the frontend                       |

Never commit real secrets or production database credentials. Keep `.env` and `.env.local` files out of version control.
