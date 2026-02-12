import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// Remote DB configuration
const remoteUrl = process.env.LIBSQL_DB_URL || process.env.TURSO_DATABASE_URL;
const authToken = process.env.LIBSQL_DB_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

// Local DB path
const dbPath = isVercel ? path.join('/tmp', 'site-data.db') : path.resolve(process.cwd(), 'site-data.db');

console.log(`Database configuration:`);
if (remoteUrl) {
    console.log(`- Type: Remote (Turso/LibSQL)`);
    console.log(`- URL: ${remoteUrl}`);
} else {
    console.log(`- Type: Local SQLite`);
    console.log(`- Path: ${dbPath}`);
    console.log(`- isVercel: ${isVercel}`);
}

let dbInstance = null;

export async function getDb() {
    if (dbInstance) return dbInstance;

    try {
        // Ensure directory exists for local dev
        if (!isVercel && !remoteUrl) {
            const dir = path.dirname(dbPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }

        const clientConfig = remoteUrl 
            ? { url: remoteUrl, authToken: authToken }
            : { url: `file:${dbPath}` };

        const client = createClient(clientConfig);

        // Compatibility layer to match sqlite-like API used in the project
        dbInstance = {
            async exec(sql) {
                return await client.execute(sql);
            },
            async run(sql, ...params) {
                return await client.execute({
                    sql,
                    args: params
                });
            },
            async get(sql, ...params) {
                const rs = await client.execute({
                    sql,
                    args: params
                });
                if (rs.rows.length === 0) return null;
                const row = rs.rows[0];
                // Convert Row object to plain object for compatibility
                const obj = {};
                rs.columns.forEach((col, i) => {
                    obj[col] = row[i];
                });
                return obj;
            },
            async all(sql, ...params) {
                const rs = await client.execute({
                    sql,
                    args: params
                });
                return rs.rows.map(row => {
                    const obj = {};
                    rs.columns.forEach((col, i) => {
                        obj[col] = row[i];
                    });
                    return obj;
                });
            },
            client // Expose raw client if needed
        };

        // Ensure table exists
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS site_config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        `);

        console.log(`LibSQL (${remoteUrl ? 'Remote' : 'Local'}) database opened and initialized successfully.`);
        return dbInstance;
    } catch (err) {
        console.error('Failed to open LibSQL database:', err.message);
        throw err;
    }
}
