import * as fs from 'fs';
import * as path from 'path';
import sqlite3 from 'sqlite3';

// Path to the database file
const dbPath: string = path.join(__dirname, '../../prisma/dev.db');

// Path to the SQL script
const sqlPath: string = path.join(__dirname, './init-db.sql');

// Read the SQL script
const sql: string = fs.readFileSync(sqlPath, 'utf8');

// Split the SQL script into individual statements
const statements: string[] = sql.split(';').filter(stmt => stmt.trim() !== '');

// Connect to the database
const db: sqlite3.Database = new sqlite3.Database(dbPath);

// Execute each statement
db.serialize(() => {
  // Begin transaction
  db.run('BEGIN TRANSACTION');

  // Execute each statement
  statements.forEach(statement => {
    if (statement.trim()) {
      db.run(statement, (err: Error | null) => {
        if (err) {
          console.error('Error executing SQL statement:', err);
          console.error('Statement:', statement);
        }
      });
    }
  });

  // Commit transaction
  db.run('COMMIT', (err: Error | null) => {
    if (err) {
      console.error('Error committing transaction:', err);
    } else {
      console.log('Database initialized successfully!');
    }
    
    // Close the database connection
    db.close();
  });
});