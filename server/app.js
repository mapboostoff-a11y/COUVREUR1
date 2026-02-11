import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api.js';

const app = express();

// Security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.youtube.com", "https://*.google.com"],
            "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.unsplash.com", "https://*.google.com", "https://*.gstatic.com"],
            "connect-src": ["'self'", "ws://localhost:5173", "http://localhost:5173", "https://*.unsplash.com"],
            "frame-src": ["'self'", "https://www.youtube.com", "https://*.youtube.com", "https://maps.google.com", "https://*.google.com", "https://*.googleadservices.com"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
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

export default app;
