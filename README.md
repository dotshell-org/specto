# Specto - Secure Log Management Web Application

Specto is a secure log management web application that allows users to organize, view, and analyze logs across different pages or categories. The application provides a RESTful API for receiving, storing, and retrieving logs, with a modern web interface for browsing, searching, and filtering logs.

## Features

- **User-defined Pages**: Organize logs into custom pages or categories
- **Comprehensive Logging**: Each log entry includes timestamp, severity level, message, and optional additional data
- **Advanced Filtering**: Filter logs by page, severity, date range, and keywords
- **Secure Authentication**: User authentication and access control ensure log data is only accessible to authorized users
- **Data Export**: Export filtered logs for archiving or analysis
- **Modern UI**: Clean, responsive interface with dark mode support
- **Page-specific Log Viewing**: View logs specific to each custom page
- **Intelligent Log Processing**: Analyze logs with advanced features:
  - Log analytics and statistics
  - Pattern detection for recurring issues
  - Anomaly detection for unusual log patterns
  - Performance insights and optimization recommendations

## Technology Stack

### Backend
- **Framework**: Next.js API Routes (for serverless API endpoints)
- **Database**: SQLite (for storing all application data)
- **ORM**: Prisma (for type-safe database access)
- **Authentication**: NextAuth.js (for user authentication and session management)
- **Validation**: Zod (for request validation)

### Frontend
- **Framework**: Next.js (React)
- **UI Components**: Custom components with Tailwind CSS
- **State Management**: React Context API and React Query
- **Data Visualization**: Recharts (for log statistics visualization)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Architecture

The application follows a modular architecture with clear separation of concerns:

1. **UI Layer**: React components for user interaction
2. **State Management**: React Context and hooks for client-state management
3. **API Layer**: Next.js API routes for server-side operations
4. **Data Access Layer**: Prisma ORM for database operations
5. **Authentication Layer**: NextAuth.js for user authentication and authorization

For more details, see the [architecture document](src/architecture.md).

## Database Schema

The application uses SQLite with the following main tables:

- **Users**: Store user information and authentication details
- **Pages**: Store user-defined pages/categories
- **Logs**: Store log entries with references to pages and users
- **RetentionPolicies**: Define how long logs should be retained

## API Endpoints

The application provides RESTful API endpoints for:

- User authentication and management
- Page creation and management
- Log creation, retrieval, and filtering
- Retention policy management

## Security Considerations

- All API endpoints require authentication
- Passwords are securely hashed
- Input validation is performed on all requests
- Access control ensures users can only access their own data
- Logs containing sensitive information are properly sanitized

## Future Enhancements

- Real-time log streaming
- Advanced analytics and reporting
- Integration with external logging systems
- Mobile application
- Multi-tenant support

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
