import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

    // Strategy: Replace everything between "const DEFAULT_CONFIG =" and "// Configuration SQLite"
    const startMarker = 'const DEFAULT_CONFIG = {';
    const endMarker = '// Configuration SQLite';
    
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
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
    
    // Git Automation
    try {
      console.log('Executing git commands...');
      await execAsync('git add api/storage.js');
      await execAsync('git commit -m "Auto-update: Sync production config from Admin"');
      await execAsync('git push');
      console.log('Git push successful.');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Configuration saved and pushed to repository. Deployment triggered.' 
      });
    } catch (gitError) {
      console.error('Git Error:', gitError);
      // Even if git fails, the file is saved, so it's a partial success or a warning.
      // But we return 200 with a warning message to the frontend.
      return res.status(200).json({ 
        success: true, 
        warning: 'File saved, but git auto-publish failed. Please push manually.',
        details: gitError.message
      });
    }

  } catch (error) {
    console.error('Publish API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
