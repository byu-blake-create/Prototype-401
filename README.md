# GYLT — Get Your Life Together

## App Summary

GYLT is a financial education web application that helps users build better money habits. The app addresses the need for approachable, structured financial literacy by offering goal tracking, short lessons, and section-based quizzes. The primary user is someone who wants to improve their financial knowledge and track progress (e.g., saving, credit, budgeting, investing). Users can view goals with step checklists, read lessons grouped by section (e.g., Financial Foundations, Building Wealth), take multiple-choice quizzes per section, and see progress (e.g., quiz completion and scores). All progress is stored in a database so it persists across sessions. The product is a full-stack vertical slice: the React frontend talks to an Express API, which reads and writes to PostgreSQL.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express, CORS, dotenv |
| **Database** | PostgreSQL, `pg` (node-postgres) |
| **Authentication** | None (single default user for demo) |
| **External services / APIs** | None |

## Architecture Diagram

```mermaid
flowchart LR
    subgraph Client
        User([User])
        Frontend[React App\nVite dev server\n:5173]
    end

    subgraph Server
        Backend[Express API\n:5000]
    end

    subgraph Data
        DB[(PostgreSQL\ngylt)]
    end

    User -->|"1. Uses browser"| Frontend
    Frontend -->|"2. HTTP /api/* (proxy)"| Backend
    Backend -->|"3. SQL"| DB
    DB -->|"4. Rows"| Backend
    Backend -->|"5. JSON"| Frontend
    Frontend -->|"6. Renders UI"| User
```

- **1.** User opens the app in the browser.  
- **2.** Frontend sends requests to `/api/*`; Vite proxies them to the backend.  
- **3.** Backend runs SQL (via `pg`) against PostgreSQL.  
- **4–5.** Database returns data; backend responds with JSON.  
- **6.** Frontend updates the UI from the API response.

## Prerequisites

Install and verify the following before running the project locally.

| Software | Purpose | Install | Verify |
|----------|---------|---------|--------|
| **Node.js** (v18+) | Runtime for frontend and backend | [nodejs.org](https://nodejs.org/) | `node -v` |
| **npm** | Package manager | Bundled with Node.js | `npm -v` |
| **PostgreSQL** (v12+) | Database | [postgresql.org/download](https://www.postgresql.org/download/) | `psql --version` |
| **psql** in PATH | Run schema and seed scripts | Included with PostgreSQL | `psql -U postgres -c "SELECT 1"` |

- Create a PostgreSQL user and database (e.g. `postgres` user and `gylt` database) and ensure `psql` can connect.

## Installation and Setup

### 1. Clone and install dependencies

```bash
# From the project root
cd backend
npm install

cd ../frontend
npm install
```

### 2. Create the database

Using a PostgreSQL user that can create databases (e.g. `postgres`):

```bash
psql -U postgres -c "CREATE DATABASE gylt;"
```

(If `gylt` already exists, skip or drop it first: `DROP DATABASE gylt;` then create again.)

### 3. Run schema and seed

From the project root:

```bash
psql -U postgres -d gylt -f db/schema.sql
psql -U postgres -d gylt -f db/seed.sql
```

### 4. Configure environment variables

```bash
# From project root
cp .env.example backend/.env
```

Edit `backend/.env` and set your PostgreSQL credentials:

- `DB_USER` — PostgreSQL username (e.g. `postgres`)
- `DB_HOST` — usually `localhost`
- `DB_NAME` — `gylt`
- `DB_PASSWORD` — your PostgreSQL password
- `DB_PORT` — usually `5432`
- `PORT` — backend port (default `5000`)

## Running the Application

1. **Start the backend** (Terminal 1):

   ```bash
   cd backend
   npm start
   ```

   You should see something like: `Server is running on port 5000` and `Connected to PostgreSQL database`.

2. **Start the frontend** (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```

3. **Open in the browser:**  
   [http://localhost:5173](http://localhost:5173)

The frontend proxies `/api` to the backend; keep both servers running while using the app.

## Verifying the Vertical Slice

This demonstrates the full path: **UI → API → database → persistence**.

### Step 1: Complete a quiz

1. Open [http://localhost:5173](http://localhost:5173).
2. Go to the **Quizzes** tab.
3. Under any section (e.g. “Section 1: Financial Foundations”), click a quiz (e.g. “Quiz: Financial Foundations”).
4. Answer all questions and click through to the end.
5. On the results screen, note your **score** (e.g. “You scored 4 out of 6 (67%)”).
6. Click **Back to Quiz List**.

### Step 2: Confirm the database was updated

Using the same PostgreSQL user and database as in setup:

```bash
psql -U postgres -d gylt -c "SELECT user_id, quiz_id, score, total_questions, completed_at FROM quizzes_completed ORDER BY completed_at DESC LIMIT 5;"
```

You should see a row for the quiz you just completed (e.g. `user_id=1`, `quiz_id=1`, your `score` and `total_questions`).

### Step 3: Confirm the change persists after refresh

1. In the browser, refresh the page (F5 or Ctrl+R).
2. Go to **Quizzes** again.
3. The same quiz should still show your previous score (e.g. “Score: 67%”) and the overall progress (e.g. “Your Progress: 33%” or “1 of 3 quizzes completed”) should reflect the saved result.

This shows that completing a quiz updates the database and that the frontend reads that data on load, confirming the vertical slice from UI through backend to PostgreSQL.
