import { getServerSupabase, verifyAdminAuthorization } from './_supabase';

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const checks = {
    supabaseUrlConfigured: Boolean(supabaseUrl && supabaseUrl.trim()),
    serviceRoleKeyConfigured: Boolean(serviceRoleKey && serviceRoleKey.trim()),
    anonKeyConfigured: Boolean(anonKey && anonKey.trim()),
    databaseConnected: false,
    tableExists: false,
    rowCurrentExists: false,
    dataJsonbValid: false,
    currentVersion: 0,
    publishedAt: null as string | null,
    updatedAt: null as string | null,
    serverWritable: false,
    error: null as string | null
  };

  const { client, error: clientErr } = getServerSupabase();
  if (!client) {
    checks.error = clientErr || 'Server-side Supabase client could not be initialized.';
    return res.status(503).json({ success: false, checks });
  }

  try {
    // 1. Check if site_content table and id='current' exist
    let { data: rows, error: selectErr } = await client
      .from('site_content')
      .select('id, data, version, published_at, updated_at')
      .eq('id', 'current')
      .limit(1);

    if (selectErr && selectErr.message && selectErr.message.includes("Could not find the '")) {
      const retry = await client
        .from('site_content')
        .select('id, data, version')
        .eq('id', 'current')
        .limit(1);
      if (!retry.error) {
        rows = retry.data as any;
        selectErr = null;
      }
    }

    if (selectErr) {
      checks.databaseConnected = true;
      if (selectErr.code === '42P01') {
        checks.tableExists = false;
        checks.error = 'Supabase table public.site_content does not exist. Please run migration SQL.';
      } else {
        checks.tableExists = true;
        checks.error = `Supabase query error: ${selectErr.message}`;
      }
      return res.status(200).json({ success: false, checks });
    }

    checks.databaseConnected = true;
    checks.tableExists = true;

    if (rows && rows.length > 0) {
      const row = rows[0];
      checks.rowCurrentExists = true;
      checks.currentVersion = Number(row.version || 1);
      checks.publishedAt = row.published_at;
      checks.updatedAt = row.updated_at;

      if (row.data && typeof row.data === 'object' && row.data.projects) {
        checks.dataJsonbValid = true;
      } else {
        checks.error = 'Row id=current exists but data JSONB column is empty or missing expected schema.';
      }
    } else {
      checks.rowCurrentExists = false;
      checks.error = 'Table site_content exists, but row with id=current is missing.';
    }

    // 2. Test server write capability if authenticated admin requested it
    const isAdmin = verifyAdminAuthorization(req);
    if (isAdmin && checks.rowCurrentExists) {
      checks.serverWritable = Boolean(serviceRoleKey || anonKey);
    }

    return res.status(200).json({
      success: !checks.error,
      checks
    });
  } catch (err: any) {
    checks.error = err.message || 'Diagnostic exception';
    return res.status(500).json({ success: false, checks });
  }
}
