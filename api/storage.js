
import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const url = new URL(request.url);
    
    // GET request: Fetch config
    if (request.method === 'GET') {
      const storedConfig = await kv.get('site_config');
      
      if (!storedConfig) {
        // Return 404 if not found, frontend should handle fallback
        return new Response(JSON.stringify(null), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(storedConfig), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0' // Ensure fresh data
        }
      });
    }

    // POST request: Save config
    if (request.method === 'POST') {
      const body = await request.json();
      const { config } = body;
      
      if (!config) {
        return new Response(JSON.stringify({ error: 'No config provided' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await kv.set('site_config', config);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('KV Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
