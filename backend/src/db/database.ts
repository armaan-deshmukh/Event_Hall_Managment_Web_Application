import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

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

    // Running database migrations...

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

    // Seed default packages if none exist
    const packagesCount = await db.get('SELECT COUNT(*) as count FROM packages');
    if (packagesCount.count === 0) {
        const defaultPackages = [
            {
                id: '1',
                name: 'Royal Wedding Suite',
                category: 'Wedding',
                description: 'A magnificent hall for a royal wedding experience with full-scale decoration and catering.',
                base_price: 75000,
                max_guests: 600,
                duration_hours: 12,
                image_url: '/royal_wedding.png'
            },
            {
                id: '2',
                name: 'Classic Wedding Decor',
                category: 'Wedding',
                description: 'Elegant and traditional wedding setup for memorable family celebrations.',
                base_price: 45000,
                max_guests: 400,
                duration_hours: 10,
                image_url: '/classic_wedding.png'
            },
            {
                id: '3',
                name: 'Engagement Party Gala',
                category: 'Engagement',
                description: 'Specialized arrangements for engagement ceremonies with luxury theme options.',
                base_price: 30000,
                max_guests: 200,
                duration_hours: 6,
                image_url: '/engagement_party.png'
            },
            {
                id: '4',
                name: 'Birthday Bash Hall',
                category: 'Birthday',
                description: 'A vibrant and customizable hall for birthday parties of all ages.',
                base_price: 15000,
                max_guests: 150,
                duration_hours: 4,
                image_url: '/birthday_hall.png'
            },
            {
                id: '5',
                name: 'Kids Fantasy Party',
                category: 'Birthday',
                description: 'Specially designed theme parties for kids with fun activities and balloons.',
                base_price: 12000,
                max_guests: 80,
                duration_hours: 4,
                image_url: 'public/kids_birthday_party.png'
            },
            {
                id: '6',
                name: 'Networking Event Lounge',
                category: 'Corporate',
                description: 'Professional and calm setting for business meetups and corporate networking.',
                base_price: 20000,
                max_guests: 120,
                duration_hours: 5,
                image_url: '/networking_event.png'
            }
        ];

        for (const pkg of defaultPackages) {
            await db.run(
                `INSERT INTO packages (id, name, category, description, base_price, max_guests, duration_hours, image_url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [pkg.id, pkg.name, pkg.category, pkg.description, pkg.base_price, pkg.max_guests, pkg.duration_hours, pkg.image_url]
            );
        }

    }

    // Seed default admin if none exist
    const adminEmail = 'admin@grandeelegance.com';
    const existingAdmin = await db.get("SELECT id FROM users WHERE email = ?", [adminEmail]);
    
    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash('admin786', 10);
        const adminId = 'admin-default-id'; 

        await db.run(
            `INSERT INTO users (id, email, full_name, role, password_hash) 
             VALUES (?, ?, ?, ?, ?)`,
            [adminId, adminEmail, 'Grand Admin', 'admin', passwordHash]
        );
    }
}

export { getDbConnection, initializeDatabase };

