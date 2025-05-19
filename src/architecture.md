# Secure Log Management Web Application Architecture

## Overview

This document outlines the architecture for a secure log management web application built on top of the existing Specto application. The application will provide a RESTful API for receiving, storing, and retrieving logs, with a modern web interface for browsing, searching, and filtering logs.

## Technology Stack

### Backend
- **Framework**: Next.js API Routes (for serverless API endpoints)
- **Database**: SQLite (as specified in requirements)
- **ORM**: Prisma (for type-safe database access)
- **Authentication**: NextAuth.js (for user authentication and session management)
- **Validation**: Zod (for request validation)

### Frontend
- **Framework**: Next.js (React)
- **UI Components**: Existing component library (with Tailwind CSS)
- **State Management**: React Context API and React Query (for server state)
- **Data Visualization**: Recharts (for log statistics visualization)

## Database Schema

```prisma
// User model for authentication
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String    // Hashed password
  role          String    @default("user") // "user", "admin"
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  pages         Page[]    // User can have multiple pages
  logs          Log[]     // User can create multiple logs
}

// Page model (extends existing CustomPage concept)
model Page {
  id            String    @id @default(cuid())
  title         String
  emoji         String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  logs          Log[]     // Page can have multiple logs
}

// Log model for storing log entries
model Log {
  id            String    @id @default(cuid())
  timestamp     DateTime  @default(now())
  severity      String    // "info", "warning", "error", "debug", "critical"
  message       String
  additionalData Json?    // Optional JSON data
  pageId        String
  page          Page      @relation(fields: [pageId], references: [id], onDelete: Cascade)
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([pageId])
  @@index([severity])
  @@index([timestamp])
}

// Retention policy for automatic log cleanup
model RetentionPolicy {
  id            String    @id @default(cuid())
  name          String
  description   String?
  daysToRetain  Int
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/session` - Get current session information
- `POST /api/auth/logout` - Log out a user

### Page Management Endpoints
- `GET /api/pages` - Get all pages for the current user
- `GET /api/pages/:id` - Get a specific page
- `POST /api/pages` - Create a new page
- `PUT /api/pages/:id` - Update a page
- `DELETE /api/pages/:id` - Delete a page

### Log Management Endpoints
- `GET /api/logs` - Get logs with filtering options
- `GET /api/logs/:id` - Get a specific log
- `POST /api/logs` - Create a new log
- `DELETE /api/logs/:id` - Delete a log
- `GET /api/logs/stats` - Get log statistics

### Retention Policy Endpoints
- `GET /api/retention` - Get retention policies
- `POST /api/retention` - Create a retention policy
- `PUT /api/retention/:id` - Update a retention policy
- `DELETE /api/retention/:id` - Delete a retention policy

## Authentication and Access Control

The application will use NextAuth.js for authentication, with the following features:
- Email/password authentication
- Session-based authentication
- Role-based access control (user, admin)
- JWT tokens for API authentication

Access control rules:
- Users can only access their own pages and logs
- Admins can access all pages and logs
- Only authenticated users can access the application

## Frontend Components

### Log Management Components
- `LogViewer` - Main component for viewing logs
- `LogFilter` - Component for filtering logs by page, severity, date, and keywords
- `LogEntry` - Component for displaying a single log entry
- `LogForm` - Component for creating a new log entry
- `LogStats` - Component for displaying log statistics

### Page Integration
- Extend the existing `PageManager` component to include log management
- Add a new tab in the `ContentContainer` for log viewing and management
- Integrate log viewing into the custom page view

## Data Retention and Archiving

- Implement automatic log cleanup based on retention policies
- Provide functionality to export logs to CSV/JSON for archiving
- Implement log rotation to maintain performance with large log volumes

## Scalability Considerations

While SQLite is specified as the database engine, the following considerations will help with scalability:
- Use proper indexing for frequently queried fields
- Implement pagination for log retrieval
- Use efficient query patterns to minimize database load
- Implement caching for frequently accessed data
- Design for future migration to a more scalable database if needed

## Security Considerations

- All API endpoints will require authentication
- Passwords will be hashed using bcrypt
- Input validation will be performed on all API requests
- CSRF protection will be implemented
- Rate limiting will be applied to sensitive endpoints
- Logs containing sensitive information will be properly sanitized

## Implementation Plan

1. Set up Prisma with SQLite and create the database schema
2. Implement authentication using NextAuth.js
3. Create API endpoints for log management
4. Develop frontend components for log viewing and management
5. Integrate log management with the existing page system
6. Implement data retention and archiving features
7. Add security features and access control
8. Test and optimize the application