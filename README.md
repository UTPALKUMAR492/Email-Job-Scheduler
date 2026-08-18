# ReachInbox Email Scheduler

A full-stack email scheduling application built with React, Express, PostgreSQL, Redis, and BullMQ. It allows users to schedule single or bulk emails, track scheduled and sent messages, and apply rate-limiting rules before jobs are delivered.

## Overview

This project is designed to simulate a real email-job scheduling platform where emails are queued, delayed, processed asynchronously, and stored in a database for tracking.

The app includes:
- Single email scheduling
- Bulk email scheduling
- Redis-backed job queue using BullMQ
- PostgreSQL persistence with Prisma
- Email sending through Nodemailer and Ethereal test SMTP
- Rate limiting to prevent sending too many emails in one hour
- Google OAuth-based login in the frontend
- Dashboard for viewing scheduled and sent emails

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Google OAuth

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- BullMQ
- Redis
- Nodemailer

## Project Structure

```text
reachinbox-email-scheduler/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   ├── prisma.ts
│   │   │   └── redis.ts
│   │   ├── queue/
│   │   │   ├── email.queue.ts
│   │   │   └── email.worker.ts
│   │   ├── utils/
│   │   │   ├── mailer.ts
│   │   │   └── rateLimiter.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── README.md
└── Resultscreenshots/
```

## Features

### Backend Features
- Schedule email jobs with a specific delivery time
- Schedule multiple emails in one request
- Store email metadata in PostgreSQL
- Process jobs asynchronously with BullMQ workers
- Use Redis to track hourly email counts
- Reschedule jobs when the hourly send limit is reached
- Maintain email status as scheduled or sent
- Return all scheduled or sent records via API

### Frontend Features
- Login with Google account
- Compose and send scheduling requests
- View scheduled emails
- View sent emails
- Auto-refresh dashboard data every few seconds

## Environment Variables

### Backend
Create a file named .env in the backend folder:

```env
DATABASE_URL=postgresql://reachinbox:reachinbox@localhost:5432/reachinbox
PORT=4000
MAX_EMAILS_PER_HOUR=25
MIN_DELAY_BETWEEN_EMAILS_MS=2000
WORKER_CONCURRENCY=5
ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_pass
```

### Frontend
Create a file named .env in the frontend folder:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Installation and Setup

### 1. Start supporting services

```bash
docker compose up -d
```

This starts:
- Redis on port 6379
- PostgreSQL on port 5432

### 2. Backend setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

The backend server starts on:
- http://localhost:4000

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend app runs on:
- http://localhost:5173

## API Endpoints

### Schedule a single email

```http
POST /schedule-email
```

Request body:

```json
{
  "toEmail": "user@example.com",
  "subject": "Test Email",
  "body": "Hello from ReachInbox",
  "scheduledAt": "2026-08-18T12:30:00.000Z"
}
```

### Schedule multiple emails

```http
POST /schedule-bulk
```

Request body:

```json
{
  "emails": ["a@example.com", "b@example.com", "c@example.com"],
  "subject": "Bulk Campaign",
  "body": "This is a bulk test email",
  "startTime": "2026-08-18T12:00:00.000Z",
  "delayBetween": 2000
}
```

### Get emails by status

```http
GET /emails?status=scheduled
GET /emails?status=sent
```

## Rate Limiting Logic

The worker checks a Redis counter per hour before sending an email.

- Key pattern: `email_count:global:<YYYY-MM-DD-HH>`
- Default hourly limit: `MAX_EMAILS_PER_HOUR`
- Default minimum delay between jobs: `MIN_DELAY_BETWEEN_EMAILS_MS`

If the limit is reached:
- the job is delayed to the next hour
- it is not dropped
- the queue continues processing it later

## Database Model

The Prisma schema defines a single Email model:

```prisma
model Email {
  id          String   @id @default(uuid())
  toEmail     String
  subject     String
  body        String
  scheduledAt DateTime
  sentAt      DateTime?
  status      String
  jobId       String   @unique
  createdAt   DateTime @default(now())
}
```

## Notes

- The app uses Ethereal Email as a test SMTP service for email preview and delivery testing.
- The frontend uses a Google OAuth client ID from the environment file.
- Screenshot assets are stored in the Resultscreenshots folder for reference.
- The project is set up as a monorepo with separate backend and frontend folders.

## License

This project is licensed under the ISC license.


