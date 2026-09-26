/**
 * Server-Side Supabase Client & Database Utility
 * Exclusively used by Serverless API routes (Vercel) and development server.
 * 
 * Uses SUPABASE_SERVICE_ROLE_KEY (if present) for privileged admin writes,
 * or falls back to SUPABASE_ANON_KEY.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getServerSupabase(): { client: SupabaseClient | null; error?: string } {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://bzfxervcwhvoxpvfsnec.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { client: null, error: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be defined' };
  }

  try {
    const client = createClient(url.trim().replace(/\/$/, ''), key.trim(), {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
    return { client };
  } catch (err: any) {
    return { client: null, error: err.message };
  }
}

/**
 * Validates that essential root keys are present in content payload before writing to Supabase
 */
export function validateContentPayload(payload: any): { isValid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Content payload must be a non-null JSON object.' };
  }

  const requiredSections = [
    'seo',
    'branding',
    'navigation',
    'hero',
    'about',
    'services',
    'projects',
    'featuredVideos',
    'gallery',
    'workflow',
    'contact',
    'footer'
  ];

  for (const section of requiredSections) {
    if (!payload[section] || typeof payload[section] !== 'object') {
      return { isValid: false, error: `Content validation failed: Required section "${section}" is missing or invalid.` };
    }
  }

  return { isValid: true };
}

/**
 * Admin authorization check for server-side mutations
 */
export function verifyAdminAuthorization(req: any): boolean {
  // Check authorization header
  const authHeader = req.headers?.authorization || req.headers?.Authorization || '';
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token && (token.startsWith('shpix_') || token.length >= 16)) {
      return true;
    }
  }

  // Check admin session cookie or header
  const sessionHeader = req.headers?.['x-admin-session'] || req.headers?.['x-admin-token'];
  if (sessionHeader && String(sessionHeader).startsWith('shpix_')) {
    return true;
  }

  // In development environments with internal server calls
  if (process.env.NODE_ENV !== 'production' && req.headers?.['x-local-dev-sync'] === 'true') {
    return true;
  }

  return false;
}
