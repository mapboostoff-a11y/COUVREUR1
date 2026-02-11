import { getDb } from './index.js';
import fs from 'fs';
import path from 'path';

const defaultConfigPath = path.resolve(process.cwd(), 'exempleenproduction.json');
let defaultConfig = {};

try {
    if (fs.existsSync(defaultConfigPath)) {
        const data = fs.readFileSync(defaultConfigPath, 'utf8');
        defaultConfig = JSON.parse(data);
    }
} catch (err) {
    console.warn('Could not load exempleenproduction.json, using empty object', err);
}

export async function seed(force = false) {
    try {
        const db = await getDb();
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS site_config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        `);

        if (force) {
            console.log('Force seeding database with default config...');
            await db.run(`
                INSERT INTO site_config (key, value) 
                VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            `, 'current_config', JSON.stringify(defaultConfig));
            return;
        }

        const row = await db.get('SELECT key FROM site_config WHERE key = ?', 'current_config');

        if (!row) {
            console.log('Seeding database with default config...');
            await db.run('INSERT INTO site_config (key, value) VALUES (?, ?)', 'current_config', JSON.stringify(defaultConfig));
        } else {
            console.log('Database already seeded.');
        }
    } catch (err) {
        console.error('Seeding failed:', err);
    }
}

if (process.argv[1] === import.meta.filename) {
    seed();
}
