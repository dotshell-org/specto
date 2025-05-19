import sqlite3 from 'sqlite3';
import * as path from 'path';

// Path to the database file
const dbPath: string = path.join(__dirname, '../../prisma/dev.db');

// Connect to the database
const db: sqlite3.Database = new sqlite3.Database(dbPath);

// Define interfaces for the row types
interface CountRow {
  count: number;
}

interface PageRow {
  id: string;
  title: string;
  emoji: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Check if tables exist and contain data
db.serialize(() => {
  // Check User table
  db.get("SELECT COUNT(*) as count FROM User", (err: Error | null, row: CountRow) => {
    if (err) {
      console.error('Error checking User table:', err.message);
    } else {
      console.log(`User table exists with ${row.count} records`);
    }
  });

  // Check Page table
  db.get("SELECT COUNT(*) as count FROM Page", (err: Error | null, row: CountRow) => {
    if (err) {
      console.error('Error checking Page table:', err.message);
    } else {
      console.log(`Page table exists with ${row.count} records`);
    }
  });

  // Check Log table
  db.get("SELECT COUNT(*) as count FROM Log", (err: Error | null, row: CountRow) => {
    if (err) {
      console.error('Error checking Log table:', err.message);
    } else {
      console.log(`Log table exists with ${row.count} records`);
    }
  });

  // Check RetentionPolicy table
  db.get("SELECT COUNT(*) as count FROM RetentionPolicy", (err: Error | null, row: CountRow) => {
    if (err) {
      console.error('Error checking RetentionPolicy table:', err.message);
    } else {
      console.log(`RetentionPolicy table exists with ${row.count} records`);
    }
  });

  // Get sample data from Page table
  db.get("SELECT * FROM Page LIMIT 1", (err: Error | null, row: PageRow | undefined) => {
    if (err) {
      console.error('Error getting sample Page data:', err.message);
    } else if (row) {
      console.log('Sample Page data:', row);
    } else {
      console.log('No Page data found');
    }
  });
});

// Close the database connection when done
setTimeout(() => {
  db.close();
  console.log('Database connection closed');
}, 1000);