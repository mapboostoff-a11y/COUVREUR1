
import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';

// Simulation of the logic in api/storage.js
const dbFile = path.resolve(process.cwd(), 'site-data.db');
const dbPath = `file:${dbFile}`;

console.log('Testing DB Path:', dbPath);

try {
  const client = createClient({
    url: dbPath,
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
  
  console.log('Table created successfully');

  await client.execute({
    sql: "INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    args: ["test_key", "test_value"]
  });

  console.log('Write successful');
  
  const result = await client.execute("SELECT * FROM site_config WHERE key = 'test_key'");
  console.log('Read result:', result.rows);

} catch (error) {
  console.error('DB Error:', error);
}
