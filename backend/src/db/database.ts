import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// This is a singleton to ensure we only have one database connection.
let db: Database | null = null;

const dbPath = path.resolve(__dirname, '..', '..', 'db', 'event-hall.db');

async function getDbConnection(): Promise<Database> {
    if (db) {
        return db;
    }

    // Open the database connection
    const newDb = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    await newDb.exec('PRAGMA foreign_keys = ON;');
    
    db = newDb;
    return db;
}

async function initializeDatabase() {
    const db = await getDbConnection();

    console.log("Running database migrations...");

    // User Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            full_name TEXT,
            role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'admin')),
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_sign_in_at DATETIME
        );
    `);

    // Packages Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS packages (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            base_price REAL NOT NULL,
            max_guests INTEGER NOT NULL,
            duration_hours INTEGER NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1,
            image_url TEXT
        );
    `);

    // Bookings Table
    await db.exec(`
        CREATE TABLE IF NOT EXISTS bookings (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            package_id TEXT NOT NULL,
            booking_date DATETIME NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'cancelled')),
            total_price REAL NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE CASCADE
        );
    `);

    console.log("Database tables are ready.");
}

export { getDbConnection, initializeDatabase };

