import { getServerSupabase } from './_supabase';

export default async function handler(req: any, res: any) {
  // Set aggressive no-cache headers for instant edge freshness
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { client, error } = getServerSupabase();
  if (!client) {
    return res.status(503).json({
      error: error || 'Supabase server client not initialized',
      source: 'unconfigured'
    });
  }

  try {
    let { data: rows, error: queryError } = await client
      .from('site_content')
      .select('id, data, version, updated_at, published_at')
      .eq('id', 'current')
      .limit(1);

    if (queryError && queryError.message && queryError.message.includes("Could not find the '")) {
      const retry = await client
        .from('site_content')
        .select('id, data, version')
        .eq('id', 'current')
        .limit(1);
      if (!retry.error) {
        rows = retry.data as any;
        queryError = null;
      }
    }

    if (queryError) {
      console.error('[API/content] Supabase query error:', queryError);
      return res.status(500).json({ error: queryError.message });
    }

    if (rows && rows.length > 0 && rows[0]?.data) {
      const row = rows[0];
      const content = row.data;

      // Ensure authoritative database version is synced to response
      if (typeof row.version === 'number') {
        if (!content.publicationInfo) content.publicationInfo = {};
        content.publicationInfo.version = row.version;
      }
      if (row.published_at) {
        content.lastPublished = row.published_at;
      }

      return res.status(200).json({
        data: content,
        version: Number(row.version || 1),
        published_at: row.published_at,
        updated_at: row.updated_at,
        source: 'supabase'
      });
    }

    return res.status(404).json({
      status: 'not_found',
      message: 'No published content found in Supabase table site_content (id=current).'
    });
  } catch (err: any) {
    console.error('[API/content] Unhandled exception:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
