import express from 'express';
import { getDb } from '../db/index.js';
import { seed } from '../db/seed.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

router.get('/config', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    try {
        const db = await getDb();
        const row = await db.get('SELECT value FROM site_config WHERE key = ?', 'current_config');
        
        if (row && row.value) {
            res.json(JSON.parse(row.value));
        } else {
            // Seed if empty and try again
            await seed();
            const rowRetry = await db.get('SELECT value FROM site_config WHERE key = ?', 'current_config');
            if (rowRetry) {
                res.json(JSON.parse(rowRetry.value));
            } else {
                res.status(404).json({ error: 'Config introuvable' });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint unique pour sauvegarder et publier
router.post(['/config', '/publish', '/storage'], async (req, res) => {
    const config = req.body.config || req.body;
    
    if (!config || Object.keys(config).length === 0) {
        return res.status(400).json({ error: 'Configuration vide' });
    }

    try {
        const db = await getDb();
        const configJson = JSON.stringify(config);

        // 1. Sauvegarde SQLite (Source de vérité)
        await db.run(
            'INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
            'current_config', 
            configJson
        );

        // 2. Persistance fichier (Optionnel, uniquement hors Vercel)
        const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
        if (!isVercel) {
            try {
                const configPath = path.resolve(process.cwd(), 'exempleenproduction.json');
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            } catch (fsErr) {
                console.warn('Erreur écriture fichier (non critique):', fsErr);
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Erreur API:', err);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

export default router;
