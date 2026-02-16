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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Serve static files from the React app
// Skip in development to allow Vite to handle HMR and new routes
const isDev = process.env.NODE_ENV === 'development';
if (!isDev && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get(/^(?!\/api).+/, async (req, res) => {
        try {
            let html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
            
            // Récupérer le domaine pour la clé de config
            const host = req.get('host') || 'default';
            const domain = host.split(':')[0];
            const configKey = `config:${domain}`;

            // Récupérer la config actuelle depuis la DB
            const db = await getDb();
            const row = await db.get('SELECT value FROM site_config WHERE key = ?', configKey);
            
            if (row && row.value) {
                const config = JSON.parse(row.value);
                const meta = config.meta || {};
                const sections = config.sections || [];
                
                // Enrichissement automatique si les champs sont vides
                const heroSection = sections.find(s => s.type === 'hero');
                const headerSection = sections.find(s => s.type === 'header');
                
                const title = meta.title || heroSection?.content?.headline || headerSection?.content?.title || 'Landing Page';
                const description = meta.description || heroSection?.content?.subheadline || 'Expertise et services professionnels.';
                const keywords = meta.keywords || '';
                const ogImage = meta.ogImage || heroSection?.content?.image?.src || '';
                const favicon = meta.favicon || '/favicon.ico';
                const canonical = meta.canonicalUrl || `${req.protocol}://${req.get('host')}${req.originalUrl}`;
                const robots = meta.robots || 'index, follow';
                const author = meta.author || meta.businessName || title;

                // Remplacements standards
                html = html.replace(/<title>.*?<\/title>/g, `<title>${title}</title>`);
                html = html.replace(/<meta name="title" content=".*?" \/>/g, `<meta name="title" content="${title}" />`);
                html = html.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${description}" />`);
                
                // Nouveaux tags SEO
                if (html.includes('</title>')) {
                    const extraTags = `
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />`;
                    html = html.replace('</title>', `</title>${extraTags}`);
                }

                // OG Tags
                html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${title}" />`);
                html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${description}" />`);
                html = html.replace(/<meta property="og:image" content=".*?" \/>/g, `<meta property="og:image" content="${ogImage}" />`);
                html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${canonical}" />`);
                
                // Twitter Tags
                html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${title}" />`);
                html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${description}" />`);
                html = html.replace(/<meta name="twitter:image" content=".*?" \/>/g, `<meta name="twitter:image" content="${ogImage}" />`);
                
                html = html.replace(/<meta property="twitter:title" content=".*?" \/>/g, `<meta property="twitter:title" content="${title}" />`);
                html = html.replace(/<meta property="twitter:description" content=".*?" \/>/g, `<meta property="twitter:description" content="${description}" />`);
                html = html.replace(/<meta property="twitter:image" content=".*?" \/>/g, `<meta property="twitter:image" content="${ogImage}" />`);

                // Remplacer le favicon
                html = html.replace(/<link rel="icon" .*? \/>/g, `<link rel="icon" href="${favicon}" />`);

                // Injection Données Structurées (JSON-LD)
                if (meta.businessName || heroSection) {
                    const contactSection = sections.find(s => s.type === 'contact');
                    const structuredData = {
                        "@context": "https://schema.org",
                        "@type": meta.businessType || "LocalBusiness",
                        "name": meta.businessName || title,
                        "description": description,
                        "image": ogImage,
                        "url": canonical,
                        "telephone": contactSection?.content?.phone || "",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": contactSection?.content?.address || "",
                        },
                        "priceRange": meta.priceRange || "$$",
                    };

                    if (meta.ratingValue) {
                        structuredData.aggregateRating = {
                            "@type": "AggregateRating",
                            "ratingValue": meta.ratingValue,
                            "reviewCount": meta.reviewCount || 10
                        };
                    }

                    const ldJsonScript = `\n    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
                    html = html.replace('</head>', `${ldJsonScript}\n</head>`);
                }

                // Scripts de tracking (GA, GTM, Pixel)
                let trackingScripts = "";
                if (meta.googleAnalyticsId) {
                    trackingScripts += `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${meta.googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${meta.googleAnalyticsId}');
    </script>`;
                }
                if (meta.googleTagManagerId) {
                    trackingScripts += `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${meta.googleTagManagerId}');</script>`;
                }
                if (meta.facebookPixelId) {
                    trackingScripts += `
    <!-- Facebook Pixel -->
    <script>
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${meta.facebookPixelId}');
      fbq('track', 'PageView');
    </script>`;
                }

                if (trackingScripts) {
                    html = html.replace('</head>', `${trackingScripts}\n</head>`);
                }
            }
            
            res.send(html);
        } catch (err) {
            console.error('Erreur lors de l\'injection des meta tags:', err);
            res.sendFile(path.join(distPath, 'index.html'));
        }
    });
}

export default app;
