import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api.js';

const app = express();

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
    app.get('*', (req, res) => {
        // Only for non-API routes
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

export default app;
