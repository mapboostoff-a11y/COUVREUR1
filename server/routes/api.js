import express from 'express';
import { getDb } from '../db/index.js';
import { seed } from '../db/seed.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const router = express.Router();

// Helper to get domain-based config key
const getConfigKey = (req) => {
    // Get hostname and remove port if present
    const host = req.get('host') || 'default';
    const domain = host.split(':')[0];
    return `config:${domain}`;
};

router.get('/config', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const configKey = getConfigKey(req);
    const domain = configKey.split(':')[1];

    try {
        const db = await getDb();
        const row = await db.get('SELECT value FROM site_config WHERE key = ?', configKey);
        
        if (row && row.value) {
            res.json(JSON.parse(row.value));
        } else {
            console.log(`Config non trouvée pour ${domain}, tentative de seeding...`);
            // Seed if empty and try again
            await seed(domain);
            const rowRetry = await db.get('SELECT value FROM site_config WHERE key = ?', configKey);
            if (rowRetry && rowRetry.value) {
                res.json(JSON.parse(rowRetry.value));
            } else {
                console.warn(`Config toujours introuvable pour ${domain} après seeding`);
                res.status(404).json({ error: 'Config introuvable' });
            }
        }
    } catch (err) {
        console.error(`Erreur API GET /config (${domain}):`, err);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération de la configuration',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Endpoint unique pour sauvegarder et publier
router.post(['/config', '/publish', '/storage'], async (req, res) => {
    const config = req.body.config || req.body;
    const configKey = getConfigKey(req);
    const domain = configKey.split(':')[1];
    
    if (!config || Object.keys(config).length === 0) {
        return res.status(400).json({ error: 'Configuration vide' });
    }

    try {
        const db = await getDb();
        const configJson = JSON.stringify(config);

        // 1. Sauvegarde SQLite (Source de vérité)
        await db.run(
            'INSERT INTO site_config (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
            configKey, 
            configJson
        );

        // 2. Persistance fichier (Optionnel, uniquement hors Vercel et pour localhost)
        const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;
        if (!isVercel && domain === 'localhost') {
            try {
                const configPath = path.resolve(process.cwd(), 'exempleenproduction.json');
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
            } catch (fsErr) {
                console.warn('Erreur écriture fichier (non critique):', fsErr);
            }
        }

        console.log(`Config sauvegardée avec succès pour le domaine: ${domain}`);
        res.json({ success: true, domain });
    } catch (err) {
        console.error(`Erreur API POST /publish (${domain}):`, err);
        res.status(500).json({ 
            error: 'Erreur lors de la sauvegarde',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

export default router;
