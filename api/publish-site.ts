import { getServerSupabase, validateContentPayload, verifyAdminAuthorization } from './_supabase';

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // 1. Verify admin authorization
  if (!verifyAdminAuthorization(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token or session required for publishing.'
    });
  }

  // 2. Validate payload
  const rawPayload = req.body?.data || req.body;
  const validation = validateContentPayload(rawPayload);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, error: validation.error });
  }

  // 3. Connect to Supabase
  const { client, error: clientErr } = getServerSupabase();
  if (!client) {
    return res.status(503).json({
      success: false,
      error: clientErr || 'Server-side Supabase client could not be initialized.'
    });
  }

  try {
    // 4. Fetch current version to increment atomically
    const { data: currentRows } = await client
      .from('site_content')
      .select('version')
      .eq('id', 'current')
      .limit(1);

    const currentVersion = Number(currentRows?.[0]?.version || 0);
    const nextVersion = currentVersion + 1;
    const now = new Date().toISOString();

    const note = req.body?.note || 'Published from SHPIXELS Admin CMS';

    // Build mutated payload with authoritative version and history
    const finalContent = {
      ...rawPayload,
      lastPublished: now,
      publicationInfo: {
        publishedAt: now,
        version: nextVersion,
        publishedBy: 'Admin'
      },
      publicationHistory: [
        {
          id: `pub-${Date.now()}`,
          publishedAt: now,
          version: nextVersion,
          publishedBy: 'Admin',
          note
        },
        ...(rawPayload.publicationHistory || []).slice(0, 19)
      ]
    };

    // 5. Canonical UPSERT on conflict (id)
    // Only standard columns (id, data, version, published_at, updated_at) - updated_by is recorded inside data JSONB
    const upsertPayload: Record<string, any> = {
      id: 'current',
      data: finalContent,
      version: nextVersion,
      published_at: now,
      updated_at: now
    };

    let { data: upsertData, error: upsertError } = await client
      .from('site_content')
      .upsert(upsertPayload, { onConflict: 'id' })
      .select('id, version, published_at, updated_at')
      .maybeSingle();

    // If PostgREST fails due to schema cache missing column (e.g. published_at, updated_by, updated_at)
    if (upsertError && upsertError.message && upsertError.message.includes("Could not find the '")) {
      const match = upsertError.message.match(/Could not find the '([^']+)' column/);
      if (match && match[1] && match[1] in upsertPayload && match[1] !== 'id' && match[1] !== 'data') {
        const missingCol = match[1];
        console.warn(`[API/publish] Retrying upsert without missing column '${missingCol}'`);
        delete upsertPayload[missingCol];
        const retryResult = await client
          .from('site_content')
          .upsert(upsertPayload, { onConflict: 'id' })
          .select('id, version')
          .maybeSingle();
        upsertData = retryResult.data as any;
        upsertError = retryResult.error;
      }
    }

    if (upsertError) {
      console.error('[API/publish] Supabase upsert failed:', upsertError);
      return res.status(500).json({
        success: false,
        error: `Supabase database error: ${upsertError.message}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully published to Supabase database',
      version: nextVersion,
      published_at: now,
      updated_at: now,
      data: finalContent
    });
  } catch (err: any) {
    console.error('[API/publish] Unexpected exception:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
  }
}
