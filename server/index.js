import app from './app.js';
import { seed } from './db/seed.js';

const PORT = process.env.PORT || 3001;

// Initialize Database
(async () => {
    try {
        console.log('Initializing database...');
        await seed();
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Failed to initialize database:', err);
    }
})();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});
