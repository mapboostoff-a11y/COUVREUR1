import { createClient } from '@libsql/client';
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

        const client = createClient({
            url: `file:${dbPath}`,
        });

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
                return rs.rows[0];
            },
            async all(sql, ...params) {
                const rs = await client.execute({
                    sql,
                    args: params
                });
                return rs.rows;
            },
            client // Expose raw client if needed
        };

        console.log('LibSQL (SQLite) database opened successfully.');
        return dbInstance;
    } catch (err) {
        console.error('Failed to open LibSQL database:', err.message);
        throw err;
    }
}
