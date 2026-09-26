-- ==============================================================================
-- SHPIXELS • Supabase Database Schema & Setup Script
-- ==============================================================================
-- This script provisions all necessary tables, row-level security (RLS) policies,
-- and default permissions to allow persistent storage and instant data synchronization
-- across Vercel deployments and visitor sessions.
--
-- Instructions:
-- 1. Open your Supabase project dashboard (https://supabase.com/dashboard)
-- 2. Go to the "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire script, and click "RUN"
-- 4. Copy your "Project URL" and "anon public key" from Project Settings -> API
-- 5. Paste them into the SHPIXELS Dashboard under "Settings -> Database & Supabase"
-- ==============================================================================

-- 1. Create site_content table (Primary store for all site data & CMS edits)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'current',
    content JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    last_published TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant JSON retrieval
CREATE INDEX IF NOT EXISTS idx_site_content_id ON public.site_content(id);

-- 2. Create category_metadata table (Dedicated category taxonomy & cover images)
CREATE TABLE IF NOT EXISTS public.category_metadata (
    id UUID DEFAULT gen_random_column_or_uuid_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    cover_image TEXT,
    description TEXT,
    description_ar TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fallback function if uuid-ossp is not enabled
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    END IF;
END $$;

-- 3. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_metadata ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies for site_content:
-- Allow PUBLIC READ so all visitors can see published portfolio without logging in
DROP POLICY IF EXISTS "Public read access for site_content" ON public.site_content;
CREATE POLICY "Public read access for site_content"
    ON public.site_content
    FOR SELECT
    TO public, anon, authenticated
    USING (true);

-- Allow upsert/write access using the anon key or authenticated users
DROP POLICY IF EXISTS "Allow write access for site_content" ON public.site_content;
CREATE POLICY "Allow write access for site_content"
    ON public.site_content
    FOR ALL
    TO public, anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Set RLS Policies for category_metadata:
DROP POLICY IF EXISTS "Public read access for category_metadata" ON public.category_metadata;
CREATE POLICY "Public read access for category_metadata"
    ON public.category_metadata
    FOR SELECT
    TO public, anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow write access for category_metadata" ON public.category_metadata;
CREATE POLICY "Allow write access for category_metadata"
    ON public.category_metadata
    FOR ALL
    TO public, anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_site_content_updated_at ON public.site_content;
CREATE TRIGGER set_site_content_updated_at
    BEFORE UPDATE ON public.site_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Insert Initial Categories with High-Quality Cover Images
INSERT INTO public.category_metadata (name, name_ar, cover_image, description, description_ar, sort_order)
VALUES
    ('Commercial & Brand Ads', 'إعلانات تجارية', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85', 'High-impact commercial storytelling and broadcast commercials.', 'إعلانات تجارية سينمائية عالية التأثير للعلامات التجارية.', 1),
    ('Sport & Gym', 'رياضة ولياقة', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85', 'High-octane fitness, athletic power, and dynamic movement.', 'تصوير حركي ديناميكي للياقة البدنية والرياضيين.', 2),
    ('Weddings & Events', 'أعراس وفعاليات', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', 'Emotional luxury wedding films and memorable celebrations.', 'توثيق سينمائي فاخر للأعراس واللحظات العاطفية الخالدة.', 3),
    ('AI & Motion Graphics', 'ذكاء اصطناعي وموشن', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85', 'Generative neural aesthetics, VFX, and kinetic typography.', 'مؤثرات بصرية متقدمة وموشن جرافيكس مدعوم بالذكاء الاصطناعي.', 4),
    ('Medical & Healthcare', 'رعاية صحية وطبية', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85', 'Precise, empathetic healthcare documentaries and surgical portraits.', 'أفلام طبية وثائقية للمستشفيات والكوادر الصحية.', 5),
    ('Aerial & Drone', 'تصوير جوي درون', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=85', 'Licensed 4K aerial cinematography and sweeping landscape reveals.', 'لقطات جوية 4K مرخصة وتوثيق معماري وطبيعي مذهل.', 6)
ON CONFLICT (name) DO UPDATE SET
    cover_image = EXCLUDED.cover_image,
    name_ar = EXCLUDED.name_ar,
    description = EXCLUDED.description,
    description_ar = EXCLUDED.description_ar;

-- ==============================================================================
-- Confirmation Query
-- Run this to verify that the table is ready:
-- SELECT id, version, updated_at FROM public.site_content;
-- ==============================================================================
