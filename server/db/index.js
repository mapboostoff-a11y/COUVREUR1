import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || path.resolve(process.cwd(), 'site-data.db');
const dbUrl = `file:${dbPath.replace(/\\/g, '/')}`;

console.log(`Initializing SQLite database at ${dbUrl}`);

let dbInstance = null;

// Wrapper for @libsql/client to match the expected interface (get, run, exec)
class LibSqlClientWrapper {
    constructor(client) {
        this.client = client;
    }

    async exec(sql) {
        return await this.client.execute(sql);
    }

    async get(sql, ...params) {
        const result = await this.client.execute({ sql, args: params });
        return result.rows[0];
    }

    async all(sql, ...params) {
        const result = await this.client.execute({ sql, args: params });
        return result.rows;
    }

    async run(sql, ...params) {
        const result = await this.client.execute({ sql, args: params });
        return { lastID: result.lastInsertRowid, changes: result.rowsAffected };
    }
}

// Mock DB with JSON persistence for environments where native bindings are missing
class MockDB {
    constructor() {
        this.fallbackFile = path.resolve(process.cwd(), 'site-config-fallback.json');
        this.data = new Map();
        this.load();
        console.warn('⚠️ USING JSON FALLBACK DATABASE. ⚠️');
        console.warn(`Data will be persisted in: ${this.fallbackFile}`);
    }

    load() {
        try {
            if (fs.existsSync(this.fallbackFile)) {
                const content = fs.readFileSync(this.fallbackFile, 'utf8');
                const json = JSON.parse(content);
                Object.entries(json).forEach(([key, value]) => {
                    this.data.set(key, value);
                });
            }
        } catch (err) {
            console.error('Error loading fallback JSON:', err);
        }
    }

    save() {
        try {
            const obj = Object.fromEntries(this.data);
            fs.writeFileSync(this.fallbackFile, JSON.stringify(obj, null, 2));
        } catch (err) {
            console.error('Error saving fallback JSON:', err);
        }
    }

    async exec(sql) {
        return;
    }

    async get(sql, ...params) {
        // sql is like "SELECT value FROM site_config WHERE key = ?"
        // or "SELECT key FROM site_config WHERE key = ?"
        if (sql.toLowerCase().includes('from site_config')) {
            const key = params[0] || 'current_config';
            const value = this.data.get(key);
            if (value) {
                // Return an object that has both key and value if requested
                return { 
                    key: key,
                    value: value 
                };
            }
        }
        return undefined;
    }

    async run(sql, ...params) {
        // sql is like "INSERT INTO site_config (key, value) VALUES (?, ?)..."
        if (sql.includes('INSERT INTO site_config')) {
            const key = params[0] || 'current_config';
            const value = params[1];
            if (value) {
                this.data.set(key, value);
                this.save();
                return { lastID: 0, changes: 1 };
            }
        }
        return { lastID: 0, changes: 0 };
    }
}

export async function getDb() {
    if (dbInstance) return dbInstance;

    try {
        const client = createClient({ url: dbUrl });
        
        // Test connection
        await client.execute('SELECT 1');
        
        dbInstance = new LibSqlClientWrapper(client);
        return dbInstance;
    } catch (err) {
        console.error('Failed to open native SQLite database with @libsql/client:', err.message);
        console.log('Falling back to MockDB with JSON persistence...');
        dbInstance = new MockDB();
        return dbInstance;
    }
}
