import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { config } = req.body;
  if (!config) {
    return res.status(400).json({ error: 'Missing config' });
  }

  try {
    const storagePath = path.join(process.cwd(), 'api', 'storage.js');
    
    if (!fs.existsSync(storagePath)) {
      return res.status(404).json({ error: 'api/storage.js not found' });
    }

    let content = fs.readFileSync(storagePath, 'utf8');

    // Strategy: Replace everything between "const DEFAULT_CONFIG =" and "// Configuration SQLite locale stricte"
    // We assume the file structure is maintained.
    const startMarker = 'const DEFAULT_CONFIG = {';
    const endMarker = '// Configuration SQLite locale stricte';
    
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
       // Fallback: Try to find just the variable definition if end marker is missing/changed
       // But strictly, we expect the file I just wrote.
       console.error('Markers not found', { startIndex, endIndex });
       return res.status(500).json({ error: 'Could not parse api/storage.js structure. Markers missing.' });
    }

    const newConfigStr = `const DEFAULT_CONFIG = ${JSON.stringify(config, null, 2)};`;
    
    // Construct new file content
    const newContent = content.substring(0, startIndex) + 
                       newConfigStr + 
                       '\n\n' + 
                       content.substring(endIndex);

    fs.writeFileSync(storagePath, newContent);
    console.log('api/storage.js updated successfully.');
    
    const msg = 'Configuration saved to file (api/storage.js). You must commit and push manually to deploy.';

    return res.status(200).json({ success: true, message: msg });

  } catch (error) {
    console.error('Publish API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
