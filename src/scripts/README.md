# Database Initialization Scripts

This directory contains scripts for initializing and managing the database.

## Scripts

### init-db.sql

This SQL script creates the necessary database tables and inserts initial test data. It includes:

- User table
- Page table
- Log table
- RetentionPolicy table

And inserts test data for User, Page, and Log.

### run-sql.js

A Node.js script that executes the SQL commands in `init-db.sql` against the SQLite database.

Usage:
```bash
node src/scripts/run-sql.js
```

### verify-db.js

A Node.js script that verifies the database tables exist and contain data.

Usage:
```bash
node src/scripts/verify-db.js
```

## How to Initialize the Database

If you encounter errors related to missing tables (e.g., "The table `main.Page` does not exist in the current database"), follow these steps:

1. Make sure you have the sqlite3 Node.js module installed:
   ```bash
   npm install sqlite3
   ```

2. Run the database initialization script:
   ```bash
   node src/scripts/run-sql.js
   ```

3. Verify that the database was initialized correctly:
   ```bash
   node src/scripts/verify-db.js
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

## Notes

- These scripts are an alternative to using Prisma migrations when there are compatibility issues with the Prisma CLI.
- The database file is located at `prisma/dev.db`.
- If you need to reset the database, you can delete the `prisma/dev.db` file and run the initialization script again.