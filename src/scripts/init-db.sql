-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'user',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Create Page table
CREATE TABLE IF NOT EXISTS "Page" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "emoji" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  "userId" TEXT NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create Log table
CREATE TABLE IF NOT EXISTS "Log" (
  "id" TEXT PRIMARY KEY,
  "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "severity" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "pageId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- Create indexes for Log table
CREATE INDEX IF NOT EXISTS "Log_pageId_idx" ON "Log" ("pageId");
CREATE INDEX IF NOT EXISTS "Log_severity_idx" ON "Log" ("severity");
CREATE INDEX IF NOT EXISTS "Log_timestamp_idx" ON "Log" ("timestamp");

-- Create RetentionPolicy table
CREATE TABLE IF NOT EXISTS "RetentionPolicy" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "daysToRetain" INTEGER NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- Insert a test user
INSERT INTO "User" ("id", "name", "email", "password", "role", "createdAt", "updatedAt")
VALUES ('cuid1', 'Test User', 'test@example.com', 'password123', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert a test page
INSERT INTO "Page" ("id", "title", "emoji", "createdAt", "updatedAt", "userId")
VALUES ('cuid2', 'Test Page', '📝', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'cuid1');

-- Insert a test log
INSERT INTO "Log" ("id", "timestamp", "severity", "message", "pageId", "userId", "createdAt", "updatedAt")
VALUES ('cuid3', CURRENT_TIMESTAMP, 'info', 'Test log message', 'cuid2', 'cuid1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);