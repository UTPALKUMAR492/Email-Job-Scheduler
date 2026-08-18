# 🚀 ReachInbox – Full-Stack Email Job Scheduler

A production-grade **email scheduling system** built using **Express + BullMQ + Redis + PostgreSQL** with a **React dashboard**.
This project demonstrates **reliable delayed job processing**, **rate limiting**, **persistence across restarts**, and a **clean frontend UI** as required by the ReachInbox hiring assignment.

---

## 📌 Features Implemented

### ✅ Backend

* Email scheduling via REST API
* Persistent delayed jobs using **BullMQ + Redis**
* PostgreSQL storage using **Prisma ORM**
* Fake SMTP delivery via **Ethereal Email**
* Worker concurrency support
* Hourly rate limiting using **Redis counters**
* Minimum delay between emails
* Safe retry & rescheduling when limits are exceeded
* Idempotent job handling
* Survives server restarts without losing jobs

### ✅ Frontend

* React + TypeScript dashboard
* Google OAuth login
* Schedule new emails
* View **Scheduled Emails**
* View **Sent Emails**
* Loading & empty states
* Clean UI inspired by provided Figma

---

## 🏗️ Architecture Overview

```
Frontend (React)
   |
   | REST API
   v
Backend (Express + TypeScript)
   |
   | Stores metadata
   v
PostgreSQL (Prisma ORM)
   |
   | Job scheduling
   v
BullMQ Queue (Redis)
   |
   | Worker processing
   v
Email Worker → Ethereal SMTP
```

---

## ⚙️ Tech Stack

| Layer              | Technology             |
| ------------------ | ---------------------- |
| Frontend           | React, TypeScript, CSS |
| Backend            | Express.js, TypeScript |
| Queue              | BullMQ                 |
| Cache / Rate Limit | Redis                  |
| Database           | PostgreSQL             |
| ORM                | Prisma                 |
| Email              | Nodemailer + Ethereal  |
| Auth               | Google OAuth           |
| Infra              | Docker (Redis + DB)    |

---

## 🧪 Rate Limiting & Delay Logic

### 📌 Hourly Rate Limiting

* Redis keys follow this pattern:

```
email_count:{sender}:{YYYY-MM-DD-HH}
```

Example:

```
email_count:no-reply@reachinbox.dev:2026-01-31-12
```

* Each email increments a Redis counter
* Keys auto-expire after 1 hour
* When limit is exceeded:

  * Job is **delayed to the next hour**
  * No job is dropped
  * Order is preserved

### 📌 Minimum Delay Between Emails

* Configurable via `.env`

```
MIN_DELAY_BETWEEN_EMAILS_MS=2000
```

* Enforced in worker logic

---

## 🧪 How to Run Locally

### 1️⃣ Start Redis & PostgreSQL

```bash
docker compose up -d
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

---

### 3️⃣ Start Worker

```bash
npx ts-node src/queue/email.worker.ts
```

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔐 Environment Variables

### backend/.env

```env
DATABASE_URL=postgresql://reachinbox:reachinbox@localhost:5432/reachinbox

ETHEREAL_HOST=smtp.ethereal.email
ETHEREAL_PORT=587
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_pass

MAX_EMAILS_PER_HOUR=2
MIN_DELAY_BETWEEN_EMAILS_MS=2000
```

---

## 🧪 Testing Scenarios (With Proof) 

📸 **Screenshot:**
![Single Email Test](Resultscreenshots/login.png)
![Google auth](Resultscreenshots/googleauth.png)
![Interphase](Resultscreenshots/interphase.png)
![Bulk Email Test](Resultscreenshots/bulkemailtest.png)


---

## 🎥 Demo Video

📹 **5-minute demo includes:**
- Google login
- Scheduling emails
- Scheduled → Sent flow
- Rate limiting behavior
- Restart proof

▶️ **Watch Demo Video:**  
🔗 https://drive.google.com/file/d/1fjrgDX1EKTESUQqgsP5gn7Tc4td_nRfh/view?usp=sharing


---

## 📦 GitHub Submission Details

* Repository: **Private**
* Collaborator added: `Mitrajit`
* Monorepo structure:

```
/backend
/frontend
/docker-compose.yml
/README.md
/screenshots/
```

---

## ✅ Assignment Checklist

✔ No cron jobs
✔ Persistent scheduling
✔ Redis-backed rate limiting
✔ Worker concurrency
✔ Restart safety
✔ Frontend dashboard
✔ Google OAuth
✔ Clean architecture

---

## 🙌 Final Note

This project is a **faithful implementation of a real-world email scheduling system**, designed to scale and survive failures—mirroring ReachInbox’s core backend responsibilities.


