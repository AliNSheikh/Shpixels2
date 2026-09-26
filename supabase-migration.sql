-- ==============================================================================
-- SHPIXELS CMS - Production Supabase Migration
-- Canonical Authoritative Single Source of Truth
-- ==============================================================================
-- This migration safely inspects, preserves, transforms, and establishes the 
-- definitive schema required by the SHPIXELS publishing engine.
--
-- Target Canonical Table Schema:
-- public.site_content
--   id           TEXT PRIMARY KEY DEFAULT 'current'
--   data         JSONB NOT NULL
--   version      BIGINT NOT NULL DEFAULT 1
--   published_at TIMESTAMPTZ
--   updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
--   updated_by   TEXT DEFAULT 'Admin'
-- ==============================================================================

-- STEP 1: Create canonical table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  version BIGINT NOT NULL DEFAULT 1,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT DEFAULT 'Admin'
);

-- STEP 2: Ensure all canonical columns exist (handling legacy tables)
DO $$
BEGIN
  -- Ensure column 'data' exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'data'
  ) THEN
    ALTER TABLE public.site_content ADD COLUMN data JSONB;
  END IF;

  -- Ensure column 'version' exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'version'
  ) THEN
    ALTER TABLE public.site_content ADD COLUMN version BIGINT NOT NULL DEFAULT 1;
  END IF;

  -- Ensure column 'published_at' exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE public.site_content ADD COLUMN published_at TIMESTAMPTZ DEFAULT NOW();
  END IF;

  -- Ensure column 'updated_at' exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.site_content ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;

  -- Ensure column 'updated_by' exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'updated_by'
  ) THEN
    ALTER TABLE public.site_content ADD COLUMN updated_by TEXT DEFAULT 'Admin';
  END IF;
END $$;

-- STEP 3: Migrate existing data from legacy columns ('content' -> 'data', 'last_published' -> 'published_at')
DO $$
BEGIN
  -- If legacy 'content' column exists, migrate its JSONB into 'data' where 'data' is NULL or empty
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'content'
  ) THEN
    UPDATE public.site_content
    SET data = content
    WHERE (data IS NULL OR data = '{}'::jsonb) AND content IS NOT NULL;
  END IF;

  -- If legacy 'last_published' column exists, migrate into 'published_at'
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'last_published'
  ) THEN
    UPDATE public.site_content
    SET published_at = last_published
    WHERE published_at IS NULL AND last_published IS NOT NULL;
  END IF;
END $$;

-- STEP 4: Remove obsolete columns now that all data is safely preserved in 'data' and 'published_at'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'content'
  ) THEN
    ALTER TABLE public.site_content DROP COLUMN content;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'site_content' AND column_name = 'last_published'
  ) THEN
    ALTER TABLE public.site_content DROP COLUMN last_published;
  END IF;
END $$;

-- STEP 5: Enforce NOT NULL on data column
ALTER TABLE public.site_content ALTER COLUMN data SET NOT NULL;

-- STEP 6: Configure Row Level Security (RLS)
-- Disable legacy unrestricted policies
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Allow anon inserts" ON public.site_content;
DROP POLICY IF EXISTS "Allow anon updates" ON public.site_content;
DROP POLICY IF EXISTS "Allow anon insert" ON public.site_content;
DROP POLICY IF EXISTS "Allow anon update" ON public.site_content;
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
DROP POLICY IF EXISTS "Allow public read access" ON public.site_content;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.site_content;

-- Canonical Security Policy 1: Public SELECT only (Visitors & Anon key can read live content)
CREATE POLICY "Allow public read access"
  ON public.site_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Canonical Security Policy 2: Authenticated / Service-role mutations only
-- Anonymous users CANNOT directly insert/update/delete CMS data via browser
CREATE POLICY "Allow authenticated users to write"
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- (Note: Server-side calls using SUPABASE_SERVICE_ROLE_KEY automatically bypass RLS in Postgres)

-- STEP 7: Add public.site_content to Supabase Realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'site_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
  END IF;
END $$;
