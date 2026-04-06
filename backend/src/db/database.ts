import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";

// This is a singleton to ensure we only have one database connection.
let db: Database | null = null;

const dbPath = path.resolve(__dirname, '..', '..', 'db', 'event-hall.db');

// Ensure the directory for the database exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

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
    
    // Seed default packages if none exist
    const packagesCount = await db.get('SELECT COUNT(*) as count FROM packages');
    if (packagesCount.count === 0) {
        console.log("Seeding default packages...");
        const defaultPackages = [
            {
                id: '1',
                name: 'Royal Wedding Package',
                category: 'Wedding',
                description: 'Complete wedding solution with premium catering and decoration.',
                base_price: 50000,
                max_guests: 500,
                duration_hours: 12,
                image_url: '/assets/wedding-package-A6TZQNiO.jpg'
            },
            {
                id: '2',
                name: 'Corporate Gala',
                category: 'Corporate',
                description: 'Professional setup for seminars and annual general meetings.',
                base_price: 25000,
                max_guests: 200,
                duration_hours: 8,
                image_url: '/assets/corporate-package-CxzTuEag.jpg'
            },
            {
                id: '3',
                name: 'Birthday Bash',
                category: 'Birthday',
                description: 'Fun-filled birthday setup with themes and magic shows.',
                base_price: 15000,
                max_guests: 100,
                duration_hours: 4,
                image_url: '/assets/birthday-package-BN4gN8vG.jpg'
            }
        ];

        for (const pkg of defaultPackages) {
            await db.run(
                `INSERT INTO packages (id, name, category, description, base_price, max_guests, duration_hours, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [pkg.id, pkg.name, pkg.category, pkg.description, pkg.base_price, pkg.max_guests, pkg.duration_hours, pkg.image_url]
            );
        }
        console.log("Seeding completed.");
    }
}

export { getDbConnection, initializeDatabase };

