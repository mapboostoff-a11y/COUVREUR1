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

export async function seed(domain = 'default', force = false) {
    try {
        const db = await getDb();
        const configKey = `config:${domain}`;
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS site_config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        `);

        if (force) {
            console.log(`Force seeding database for domain: ${domain}...`);
            await db.run(`
                INSERT INTO site_config (key, value) 
                VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            `, configKey, JSON.stringify(defaultConfig));
            return;
        }

        const row = await db.get('SELECT key FROM site_config WHERE key = ?', configKey);

        if (!row) {
            console.log(`Seeding database for domain: ${domain}...`);
            await db.run('INSERT INTO site_config (key, value) VALUES (?, ?)', configKey, JSON.stringify(defaultConfig));
        } else {
            console.log(`Database already seeded for domain: ${domain}.`);
        }
    } catch (err) {
        console.error(`Seeding failed for domain ${domain}:`, err);
    }
}

if (process.argv[1] === import.meta.filename) {
    seed();
}
