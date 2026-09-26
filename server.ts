import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Helper to get Supabase client
  const getSupabase = (): SupabaseClient | null => {
    const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://bzfxervcwhvoxpvfsnec.supabase.co';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    try {
      return createClient(url.trim().replace(/\/$/, ''), key.trim(), {
        auth: { persistSession: false }
      });
    } catch {
      return null;
    }
  };

  const setNoCacheHeaders = (res: express.Response) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  };

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), platform: "node-dev" });
  });

  // GET /api/diagnostics
  app.get("/api/diagnostics", async (_req, res) => {
    setNoCacheHeaders(res);
    const sb = getSupabase();
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://bzfxervcwhvoxpvfsnec.supabase.co';
    const checks = {
      supabaseUrlConfigured: Boolean(supabaseUrl),
      serviceRoleKeyConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      anonKeyConfigured: Boolean(process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
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

    if (!sb) {
      checks.error = 'Supabase client could not be initialized.';
      return res.status(503).json({ success: false, checks });
    }

    try {
      const { data: rows, error: selectErr } = await sb
        .from('site_content')
        .select('id, data, version, published_at, updated_at')
        .eq('id', 'current')
        .limit(1);

      if (selectErr) {
        checks.databaseConnected = true;
        if (selectErr.code === '42P01') {
          checks.tableExists = false;
          checks.error = 'Table public.site_content does not exist. Run supabase-migration.sql';
        } else {
          checks.tableExists = true;
          checks.error = selectErr.message;
        }
        return res.json({ success: false, checks });
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
          checks.error = 'Row exists but data JSONB is empty or missing expected schema.';
        }
      } else {
        checks.rowCurrentExists = false;
        checks.error = 'Table site_content exists, but row id=current is missing.';
      }

      return res.json({ success: !checks.error, checks });
    } catch (err: any) {
      checks.error = err.message;
      return res.status(500).json({ success: false, checks });
    }
  });

  // GET /api/content-version - Directly from Supabase
  app.get("/api/content-version", async (_req, res) => {
    setNoCacheHeaders(res);
    const sb = getSupabase();
    if (!sb) {
      return res.json({ version: 1, lastPublished: new Date().toISOString() });
    }
    try {
      const { data, error } = await sb
        .from('site_content')
        .select('version, published_at, updated_at')
        .eq('id', 'current')
        .limit(1);

      if (error || !data || data.length === 0) {
        return res.json({ version: 1, lastPublished: new Date().toISOString() });
      }

      return res.json({
        version: Number(data[0].version || 1),
        published_at: data[0].published_at || data[0].updated_at,
        updated_at: data[0].updated_at
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // GET /api/content - Authoritative Supabase Read
  app.get("/api/content", async (_req, res) => {
    setNoCacheHeaders(res);
    const sb = getSupabase();
    if (!sb) {
      return res.status(503).json({ error: "Supabase not configured on server" });
    }

    try {
      const { data, error } = await sb
        .from('site_content')
        .select('id, data, version, published_at, updated_at')
        .eq('id', 'current')
        .limit(1);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (data && data.length > 0 && data[0]?.data) {
        const payload = data[0].data;
        if (typeof data[0].version === 'number') {
          if (!payload.publicationInfo) payload.publicationInfo = {};
          payload.publicationInfo.version = data[0].version;
        }
        if (data[0].published_at) {
          payload.lastPublished = data[0].published_at;
        }
        return res.json({
          data: payload,
          version: Number(data[0].version || 1),
          published_at: data[0].published_at,
          updated_at: data[0].updated_at
        });
      }

      return res.status(404).json({ status: "not_found", message: "No data in Supabase" });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // POST /api/publish-site & POST /api/publish - Upsert to Supabase
  const handlePublish = async (req: express.Request, res: express.Response) => {
    setNoCacheHeaders(res);
    const sb = getSupabase();
    if (!sb) {
      return res.status(503).json({ success: false, error: "Supabase not configured" });
    }

    const rawPayload = req.body?.data || req.body;
    if (!rawPayload || typeof rawPayload !== 'object') {
      return res.status(400).json({ success: false, error: "Invalid payload" });
    }

    try {
      const { data: curr } = await sb
        .from('site_content')
        .select('version')
        .eq('id', 'current')
        .limit(1);

      const nextVersion = Number(curr?.[0]?.version || 0) + 1;
      const now = new Date().toISOString();

      const finalContent = {
        ...rawPayload,
        lastPublished: now,
        publicationInfo: {
          publishedAt: now,
          version: nextVersion,
          publishedBy: 'Admin'
        }
      };

      const upsertPayload: Record<string, any> = {
        id: 'current',
        data: finalContent,
        version: nextVersion,
        published_at: now,
        updated_at: now
      };

      let { error: upsertErr } = await sb
        .from('site_content')
        .upsert(upsertPayload, { onConflict: 'id' });

      if (upsertErr && upsertErr.message && upsertErr.message.includes("Could not find the '")) {
        const match = upsertErr.message.match(/Could not find the '([^']+)' column/);
        if (match && match[1] && match[1] in upsertPayload && match[1] !== 'id' && match[1] !== 'data') {
          delete upsertPayload[match[1]];
          const retryRes = await sb
            .from('site_content')
            .upsert(upsertPayload, { onConflict: 'id' });
          upsertErr = retryRes.error;
        }
      }

      if (upsertErr) {
        return res.status(500).json({ success: false, error: upsertErr.message });
      }

      console.log(`[Server] Published version ${nextVersion} to Supabase database`);
      return res.json({
        success: true,
        version: nextVersion,
        published_at: now,
        data: finalContent
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  };

  app.post("/api/publish-site", handlePublish);
  app.post("/api/publish", handlePublish);
  app.post("/api/save-content", handlePublish);

  // Dynamic Sitemap XML
  app.get("/sitemap.xml", async (_req, res) => {
    const sb = getSupabase();
    let contentData: any = null;
    if (sb) {
      try {
        const { data } = await sb.from('site_content').select('data').eq('id', 'current').limit(1);
        if (data?.[0]?.data) contentData = data[0].data;
      } catch {}
    }

    const baseUrl = (contentData?.seo?.canonicalUrl || "https://shpixels.vercel.app").replace(/\/$/, "");
    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#portfolio</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#showreel</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#about</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#services</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#process</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#gallery</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.header("Content-Type", "application/xml");
    return res.send(xml);
  });

  // Robots.txt
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\n\nSitemap: https://shpixels.vercel.app/sitemap.xml\n`);
  });

  // Vite dev server mounting
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
