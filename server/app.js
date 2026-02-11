import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api.js';
import { seed } from './db/seed.js';
import { getDb } from './db/index.js';

const app = express();

// Initialize DB in background (useful for Vercel cold starts)
seed().catch(err => console.error('Background seeding failed:', err));

const __dirname = path.resolve();
const distPath = path.join(__dirname, 'dist');

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.youtube.com", "https://*.google.com", "https://*.gstatic.com", "https://*.google-analytics.com", "https://*.googletagmanager.com"],
            "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.unsplash.com", "https://*.google.com", "https://*.gstatic.com", "https://*.googleusercontent.com", "https://*.ytimg.com"],
            "connect-src": ["'self'", "ws://localhost:5173", "http://localhost:5173", "https://*.unsplash.com", "https://*.google.com", "https://*.google-analytics.com", "https://*.doubleclick.net"],
            "frame-src": ["'self'", "https://www.youtube.com", "https://*.youtube.com", "https://maps.google.com", "https://*.google.com", "https://*.googleadservices.com", "https://*.doubleclick.net"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.youtube.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS config
app.use(cors());

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Serve static files from the React app
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get(/^(?!\/api).+/, async (req, res) => {
        try {
            let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
            
            // Récupérer la config actuelle depuis la DB
            const db = await getDb();
            const row = await db.get('SELECT value FROM site_config WHERE key = ?', 'current_config');
            
            if (row && row.value) {
                const config = JSON.parse(row.value);
                const meta = config.meta || {};
                const sections = config.sections || [];
                
                // Enrichissement automatique si les champs sont vides
                const heroSection = sections.find(s => s.type === 'hero');
                const headerSection = sections.find(s => s.type === 'header');
                
                const title = meta.title || heroSection?.content?.headline || headerSection?.content?.title || 'Landing Page';
                const description = meta.description || heroSection?.content?.subheadline || 'Expertise et services professionnels.';
                const ogImage = meta.ogImage || heroSection?.content?.image?.src || '';
                const favicon = meta.favicon || '/favicon.ico';

                html = html.replace(/<title>.*?<\/title>/g, `<title>${title}</title>`);
                html = html.replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${title}" />`);
                html = html.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${description}" />`);
                
                html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title}" />`);
                html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${description}" />`);
                html = html.replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${ogImage}" />`);
                html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />`);
                
                html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${title}" />`);
                html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${description}" />`);
                html = html.replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${ogImage}" />`);
                
                html = html.replace(/<meta property="twitter:title" content=".*?" \/>/g, `<meta property="twitter:title" content="${title}" />`);
                html = html.replace(/<meta property="twitter:description" content=".*?" \/>/g, `<meta property="twitter:description" content="${description}" />`);
                html = html.replace(/<meta property="twitter:image" content=".*?" \/>/g, `<meta property="twitter:image" content="${ogImage}" />`);

                // Remplacer le favicon
                html = html.replace(/<link rel="icon" .*? \/>/g, `<link rel="icon" href="${favicon}" />`);
            }
            
            res.send(html);
        } catch (err) {
            console.error('Erreur lors de l\'injection des meta tags:', err);
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

export default app;
