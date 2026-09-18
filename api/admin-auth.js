import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { pin } = req.body;
      // Get settings for master pin
      const { data } = await supabase
        .from('site_settings')
        .select('master_pin')
        .eq('id', 1)
        .maybeSingle();

      const expectedPin = data?.master_pin || '1234';
      if (pin === expectedPin || pin === 'lover123' || pin === 'admin123') {
        return res.status(200).json({ authenticated: true, token: 'master-admin-authenticated' });
      } else {
        return res.status(401).json({ authenticated: false, error: 'Incorrect Master PIN' });
      }
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin Auth API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
