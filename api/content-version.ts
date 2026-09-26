import { getServerSupabase } from './_supabase';

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { client, error } = getServerSupabase();
  if (!client) {
    return res.status(200).json({
      version: 1,
      lastPublished: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      warning: error || 'Supabase server not configured'
    });
  }

  try {
    const { data: rows, error: queryError } = await client
      .from('site_content')
      .select('version, published_at, updated_at')
      .eq('id', 'current')
      .limit(1);

    if (queryError) {
      return res.status(500).json({ error: queryError.message });
    }

    if (rows && rows.length > 0) {
      const row = rows[0];
      return res.status(200).json({
        version: Number(row.version || 1),
        published_at: row.published_at || row.updated_at,
        updated_at: row.updated_at,
        serverTime: new Date().toISOString()
      });
    }

    return res.status(200).json({
      version: 1,
      published_at: null,
      updated_at: null,
      serverTime: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to check version' });
  }
}
