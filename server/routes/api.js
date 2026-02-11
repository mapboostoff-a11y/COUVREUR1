import express from 'express';
import { getDb } from '../db/index.js';
import { seed } from '../db/seed.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

// Initialize DB and Seed
(async () => {
    await seed();
})();

router.get('/config', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
        const db = await getDb();
        const row = await db.get('SELECT value FROM site_config WHERE key = ?', 'current_config');
        
        if (row && row.value) {
            try {
                const config = JSON.parse(row.value);
                res.json(config);
            } catch (parseErr) {
                console.error('Error parsing config from DB:', parseErr);
                res.status(500).json({ error: 'Invalid configuration format in database' });
            }
        } else {
            console.log('Config not found in DB, seeding...');
            await seed();
            const rowRetry = await db.get('SELECT value FROM site_config WHERE key = ?', 'current_config');
            if (rowRetry && rowRetry.value) {
                res.json(JSON.parse(rowRetry.value));
            } else {
                res.status(404).json({ error: 'Config not found after seeding' });
            }
        }
    } catch (err) {
        console.error('API Config error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/storage', (req, res) => {
    res.redirect(307, '/api/config');
});

router.post(['/config', '/storage'], async (req, res) => {
    // We accept both { config: ... } and the config directly
    const config = req.body.config || req.body;
    
    if (!config || Object.keys(config).length === 0) {
        return res.status(400).json({ error: 'Missing or empty config' });
    }

    try {
        const db = await getDb();
        await db.run(`
            INSERT INTO site_config (key, value) 
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `, 'current_config', JSON.stringify(config));
        
        res.json({ success: true });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/publish', async (req, res) => {
    const config = req.body.config || req.body;
    
    if (!config || Object.keys(config).length === 0) {
        return res.status(400).json({ error: 'Missing or empty config' });
    }

    try {
        const db = await getDb();
        await db.run(`
            INSERT INTO site_config (key, value) 
            VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `, 'current_config', JSON.stringify(config));

        const configPath = path.resolve(process.cwd(), 'exempleenproduction.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        res.json({ success: true, message: 'Published successfully.' });
    } catch (err) {
        console.error('Publish error:', err);
        res.status(500).json({ error: 'Database save failed', details: err.message });
    }
});

export default router;
