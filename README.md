# Specto - Secure Log Management Web Application

Specto is a secure log management web application with a RESTful API and a modern web interface for browsing, searching, and analyzing logs.

## Features

- Organize logs into custom pages
- Each log entry includes timestamp, severity, message, and optional data
- Filter logs by page, severity, date, and keywords
- User authentication and access control
- Export logs for analysis
- Responsive UI with dark mode
- Log analytics, pattern and anomaly detection, performance insights

## Tech Stack

- **Backend:** Next.js API Routes, SQLite, Prisma ORM, NextAuth.js, Zod
- **Frontend:** Next.js (React), Tailwind CSS, React Context API, React Query, Recharts

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:8989](http://localhost:8989) with your browser to see the application.

## Database Schema

The application uses SQLite with the following main tables:

- **Users:** Authentication
- **Pages:** User-defined categories
- **Logs:** Log entries (linked to pages and users)
- **RetentionPolicies:** Log retention rules

## API Documentation

You can explore the full OpenAPI spec in Swagger Editor:
- [Swagger/OpenAPI YAML](https://editor.swagger.io/?url=https://raw.githubusercontent.com/dotshell-org/specto/main/docs/openapi.yaml)

### Authentication
All endpoints require authentication. For most endpoints, use a single password (no username):
- Send the password as the HTTP Basic Auth password (username can be anything or empty)
- Example: `curl -u :yourpassword ...`
- For log ingestion: use the `x-api-key` header

---

### Log Endpoints

#### `GET /api/logs`
Retrieve logs. Optional query params:
- `pageId`: filter by page
- `severity`: filter by severity (`info`, `warning`, `error`, `debug`, `critical`)

**Example:**
```bash
curl -u :yourpassword 'http://localhost:8989/api/logs?pageId=PAGE_ID&severity=error'
```

#### `POST /api/logs`
Create a new log entry.
- **Headers:** `x-api-key: ...`
- **Body:**
  ```json
  {
    "message": "Something went wrong",
    "severity": "error",
    "pageId": "PAGE_ID"
  }
  ```
**Example:**
```bash
curl -X POST http://localhost:8989/api/logs \
  -H 'x-api-key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"message":"Something went wrong","severity":"error","pageId":"PAGE_ID"}'
```

#### `GET /api/logs/analytics`
Get log statistics (counts, error rates, top pages, severity distribution).
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/logs/analytics
```

#### `GET /api/logs/anomalies`
Detect recent error/critical log spikes (last 24h).
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/logs/anomalies
```

#### `GET /api/logs/patterns`
Get most common log messages (top 3).
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/logs/patterns
```

#### `GET /api/logs/performance`
Get performance-related log metrics (slow queries, timeouts, API delays).
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/logs/performance
```

#### `DELETE /api/logs?id=...`
Delete a log by ID. Query param: `id`
**Example:**
```bash
curl -X DELETE -u :yourpassword 'http://localhost:8989/api/logs?id=LOG_ID'
```

---

### Page Endpoints

#### `GET /api/pages`
List all pages for the authenticated user.
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/pages
```

#### `POST /api/pages`
Create a new page.
- **Body:**
  ```json
  {
    "title": "My Page",
    "emoji": "📄"
  }
  ```
**Example:**
```bash
curl -X POST http://localhost:8989/api/pages \
  -u :yourpassword \
  -H 'Content-Type: application/json' \
  -d '{"title":"My Page","emoji":"📄"}'
```

#### `GET /api/pages/{id}`
Get a specific page by ID.
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/pages/PAGE_ID
```

#### `PUT /api/pages/{id}`
Update a page.
- **Body:**
  ```json
  {
    "title": "Updated Title",
    "emoji": "📝"
  }
  ```
**Example:**
```bash
curl -X PUT http://localhost:8989/api/pages/PAGE_ID \
  -u :yourpassword \
  -H 'Content-Type: application/json' \
  -d '{"title":"Updated Title","emoji":"📝"}'
```

#### `DELETE /api/pages/{id}`
Delete a page by ID.
**Example:**
```bash
curl -X DELETE -u :yourpassword http://localhost:8989/api/pages/PAGE_ID
```

#### `DELETE /api/pages/delete-all`
Delete all pages for the current user (dev only).
**Example:**
```bash
curl -X DELETE -u :yourpassword http://localhost:8989/api/pages/delete-all
```

---

### Retention Policy Endpoints

#### `GET /api/retention`
List retention policies.
**Example:**
```bash
curl -u :yourpassword http://localhost:8989/api/retention
```
#### `POST /api/retention`
Create a retention policy.
**Example:**
```bash
curl -X POST http://localhost:8989/api/retention \
  -u :yourpassword \
  -H 'Content-Type: application/json' \
  -d '{"name":"30 days","daysToRetain":30}'
```
#### `PUT /api/retention/:id`
Update a retention policy.
**Example:**
```bash
curl -X PUT http://localhost:8989/api/retention/RETENTION_ID \
  -u :yourpassword \
  -H 'Content-Type: application/json' \
  -d '{"name":"60 days","daysToRetain":60}'
```
#### `DELETE /api/retention/:id`
Delete a retention policy.
**Example:**
```bash
curl -X DELETE -u :yourpassword http://localhost:8989/api/retention/RETENTION_ID
```

---

For more details, see the code in `src/app/api/` or the [architecture document](src/architecture.md).
