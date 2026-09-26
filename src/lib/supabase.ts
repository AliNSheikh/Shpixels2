/**
 * Supabase Data Client & Persistent Database Integration for SHPIXELS
 * 
 * Production architecture:
 * - Public reads: Direct Supabase client using Anon Key OR serverless /api/content
 * - Realtime subscriptions: Directly on table 'site_content' with filter id=eq.current
 * - Admin writes: Through secure serverless endpoint /api/publish or /api/publish-site
 */

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { GlobalContent } from '../types/content';

// Environment variable retrieval with production defaults
export function getSupabaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/$/, '');
  return 'https://bzfxervcwhvoxpvfsnec.supabase.co';
}

export function getSupabaseAnonKey(): string {
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  if (envKey && envKey.trim()) return envKey.trim();
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZnhlcnZjd2h2b3hwdmZzbmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNTYwOTQsImV4cCI6MjEwNTczMjA5NH0.FcnwXNlffUopnN4UsjhcPnzGitsNjFhRt8tAxvRgYaQ';
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
  }
  return supabaseInstance;
}

export interface SupabaseContentResult {
  data: GlobalContent | null;
  version: number;
  publishedAt: string | null;
  updatedAt: string | null;
  error?: string;
}

/**
 * Reads the authoritative content row from Supabase
 */
export async function fetchAuthoritativeContent(): Promise<SupabaseContentResult> {
  const client = getSupabaseClient();
  try {
    let { data: rows, error } = await client
      .from('site_content')
      .select('id, data, version, published_at, updated_at')
      .eq('id', 'current')
      .limit(1);

    if (error && error.message && error.message.includes("Could not find the '")) {
      const retry = await client
        .from('site_content')
        .select('id, data, version')
        .eq('id', 'current')
        .limit(1);
      if (!retry.error) {
        rows = retry.data as any;
        error = null;
      }
    }

    if (error) {
      return { data: null, version: 0, publishedAt: null, updatedAt: null, error: error.message };
    }

    if (rows && rows.length > 0 && rows[0]?.data) {
      const row = rows[0];
      const content = row.data as GlobalContent;
      const ver = Number(row.version || 1);
      
      if (!content.publicationInfo) content.publicationInfo = { publishedAt: row.published_at || new Date().toISOString(), version: ver };
      content.publicationInfo.version = ver;
      if (row.published_at) content.lastPublished = row.published_at;

      return {
        data: content,
        version: ver,
        publishedAt: row.published_at,
        updatedAt: row.updated_at
      };
    }

    return { data: null, version: 0, publishedAt: null, updatedAt: null, error: 'No row found in site_content with id=current' };
  } catch (err: any) {
    return { data: null, version: 0, publishedAt: null, updatedAt: null, error: err.message };
  }
}

/**
 * Subscribes to Supabase Realtime changes on site_content for id=current
 */
export function subscribeToContentChanges(
  onUpdate: (payload: { data: GlobalContent; version: number; publishedAt: string | null }) => void,
  onStatusChange?: (status: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR') => void
): RealtimeChannel {
  const client = getSupabaseClient();

  const channel = client
    .channel('site_content_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'site_content',
        filter: 'id=eq.current'
      },
      (payload) => {
        const newRecord = payload.new as any;
        if (newRecord && newRecord.data) {
          const content = newRecord.data as GlobalContent;
          const version = Number(newRecord.version || 1);
          const publishedAt = newRecord.published_at || null;
          onUpdate({ data: content, version, publishedAt });
        }
      }
    )
    .subscribe((status) => {
      if (onStatusChange) {
        onStatusChange(status as any);
      }
    });

  return channel;
}

/**
 * Diagnostics check for Admin dashboard
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  tableExists: boolean;
  version: number;
  publishedAt: string | null;
  updatedAt: string | null;
  error?: string;
}> {
  const client = getSupabaseClient();
  try {
    let { data, error } = await client
      .from('site_content')
      .select('version, published_at, updated_at')
      .eq('id', 'current')
      .limit(1);

    if (error && error.message && error.message.includes("Could not find the '")) {
      const retry = await client
        .from('site_content')
        .select('version')
        .eq('id', 'current')
        .limit(1);
      if (!retry.error) {
        data = retry.data as any;
        error = null;
      }
    }

    if (error) {
      return {
        connected: false,
        tableExists: error.code !== '42P01', // 42P01 is undefined_table in PostgreSQL
        version: 0,
        publishedAt: null,
        updatedAt: null,
        error: error.message
      };
    }

    if (data && data.length > 0) {
      return {
        connected: true,
        tableExists: true,
        version: Number(data[0].version || 1),
        publishedAt: data[0].published_at,
        updatedAt: data[0].updated_at
      };
    }

    return {
      connected: true,
      tableExists: true,
      version: 0,
      publishedAt: null,
      updatedAt: null
    };
  } catch (err: any) {
    return {
      connected: false,
      tableExists: false,
      version: 0,
      publishedAt: null,
      updatedAt: null,
      error: err.message
    };
  }
}
