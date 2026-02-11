import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
const dbPath = isVercel ? path.join('/tmp', 'site-data.db') : path.resolve(process.cwd(), 'site-data.db');

console.log(`Database path: ${dbPath} (isVercel: ${isVercel})`);

let dbInstance = null;

export async function getDb() {
    if (dbInstance) return dbInstance;

    try {
        // Ensure directory exists for local dev
        if (!isVercel) {
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('SQLite database opened successfully.');
        return dbInstance;
    } catch (err) {
        console.error('Failed to open SQLite database:', err.message);
        throw err;
    }
}
