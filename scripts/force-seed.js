import { seed } from '../server/db/seed.js';

console.log('Forcing database seed...');
await seed('default', true);
console.log('Database seed complete.');
