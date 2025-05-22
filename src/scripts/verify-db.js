import sqlite3 from 'sqlite3';
import path from 'path';

const db = sqlite3.verbose();

// Path to the database file
const dbPath = path.join(__dirname, '../../prisma/dev.db');

// Connect to the database
const database = new db.Database(dbPath);

// Check if tables exist and contain data
database.serialize(() => {
  // Check User table
  database.get("SELECT COUNT(*) as count FROM User", (err, row) => {
    if (err) {
      console.error('Error checking User table:', err.message);
    } else {
      console.log(`User table exists with ${row.count} records`);
    }
  });

  // Check Page table
  database.get("SELECT COUNT(*) as count FROM Page", (err, row) => {
    if (err) {
      console.error('Error checking Page table:', err.message);
    } else {
      console.log(`Page table exists with ${row.count} records`);
    }
  });

  // Check Log table
  database.get("SELECT COUNT(*) as count FROM Log", (err, row) => {
    if (err) {
      console.error('Error checking Log table:', err.message);
    } else {
      console.log(`Log table exists with ${row.count} records`);
    }
  });

  // Check RetentionPolicy table
  database.get("SELECT COUNT(*) as count FROM RetentionPolicy", (err, row) => {
    if (err) {
      console.error('Error checking RetentionPolicy table:', err.message);
    } else {
      console.log(`RetentionPolicy table exists with ${row.count} records`);
    }
  });

  // Get sample data from Page table
  database.get("SELECT * FROM Page LIMIT 1", (err, row) => {
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
  database.close();
  console.log('Database connection closed');
}, 1000);