import { createClient } from '@vercel/kv';

export default async function handler(request, response) {
  // Configurer le client KV
  // Ces variables d'environnement sont automatiquement ajoutées par Vercel 
  // quand on lie une base de données KV au projet
  const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });

  if (request.method === 'GET') {
    try {
      // Lire la configuration
      const config = await kv.get('site_config');
      return response.status(200).json(config || null);
    } catch (error) {
      console.error('KV Read Error:', error);
      return response.status(500).json({ error: 'Failed to read configuration' });
    }
  }

  if (request.method === 'POST') {
    try {
      const { config } = request.body;
      
      if (!config) {
        return response.status(400).json({ error: 'Missing config data' });
      }

      // Sauvegarder la configuration
      await kv.set('site_config', config);
      
      return response.status(200).json({ success: true });
    } catch (error) {
      console.error('KV Write Error:', error);
      return response.status(500).json({ error: 'Failed to save configuration' });
    }
  }

  return response.status(405).json({ error: 'Method Not Allowed' });
}
