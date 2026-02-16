
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'site-data.db');
const db = new Database(dbPath);

try {
  const row = db.prepare('SELECT value FROM site_config WHERE key = ?').get('current_config');
  if (row) {
    const config = JSON.parse(row.value);
    const footer = config.sections.find(s => s.type === 'footer');
    if (footer) {
      console.log('Footer Copyright:', footer.content.copyright);
      console.log('Legal Links:', JSON.stringify(footer.content.legalLinks, null, 2));
      console.log('Legal Info:', JSON.stringify(footer.content.legal, null, 2));
    } else {
      console.log('No footer section found.');
    }
  } else {
    console.log('No config found in database.');
  }
} catch (error) {
  console.error('Error reading database:', error);
} finally {
  db.close();
}
