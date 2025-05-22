import fs from 'fs';
import path from 'path';
import { Database } from 'sqlite3';

// Path to the database file
const dbPath = path.join(__dirname, '../../prisma/dev.db');

// Path to the SQL script
const sqlPath = path.join(__dirname, './init-db.sql');

// Read the SQL script
const sql = fs.readFileSync(sqlPath, 'utf8');

// Split the SQL script into individual statements
const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

// Connect to the database
const db = new Database(dbPath);

// Execute each statement
db.serialize(() => {
  // Begin transaction
  db.run('BEGIN TRANSACTION');

  // Execute each statement
  statements.forEach(statement => {
    if (statement.trim()) {
      db.run(statement, err => {
        if (err) {
          console.error('Error executing SQL statement:', err);
          console.error('Statement:', statement);
        }
      });
    }
  });

  // Commit transaction
  db.run('COMMIT', err => {
    if (err) {
      console.error('Error committing transaction:', err);
    } else {
      console.log('Database initialized successfully!');
    }
    
    // Close the database connection
    db.close();
  });
});