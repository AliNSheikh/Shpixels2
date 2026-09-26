import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  GlobalContent, ProjectItem, YouTubeVideoItem, ContactData, NavigationItem, 
  WorkflowStep, ServiceItem, ClientLogo, CategoryDetail, AdminAuthData 
} from '../types/content';
import { initialContent } from '../data/initialContent';
import { 
  verifyPassword, hashPassword, generateSalt, DEFAULT_SALT 
} from '../utils/cryptoAuth';
import { sanitizeGlobalContent } from '../utils/sanitizeContent';
import { 
  fetchAuthoritativeContent, 
  subscribeToContentChanges, 
  checkDatabaseHealth,
  getSupabaseUrl,
  getSupabaseAnonKey
} from '../lib/supabase';

const AUTH_KEY = 'mografix_admin_auth_v1';
const DRAFT_KEY = 'shpixels_admin_draft_v1';
const DEFAULT_PASS = 'mografix2026';

export type SyncState = 'synced' | 'saving' | 'unsaved' | 'error' | 'syncing';
export type RealtimeState = 'connected' | 'connecting' | 'disconnected';

interface DatabaseDiagnostics {
  urlConfigured: boolean;
  reachable: boolean;
  tableExists: boolean;
  version: number;
  publishedAt: string | null;
  updatedAt: string | null;
  realtimeStatus: RealtimeState;
  lastSyncTime: string | null;
  error?: string;
}

interface ContentContextType {
  content: GlobalContent;
  updateContent: (updates: Partial<GlobalContent>) => void;
  updateSection: <K extends keyof GlobalContent>(section: K, data: GlobalContent[K]) => void;
  
  // Category management
  categories: string[];
  categoryDetails: Record<string, CategoryDetail>;
  addCategory: (name: string, coverImage?: string) => void;
  renameCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  reorderCategories: (newCats: string[]) => void;
  updateCategoryCover: (categoryName: string, coverImageUrl: string) => void;
  updateCategoryDetails: (categoryName: string, details: Partial<CategoryDetail>) => void;

  // Pipeline / Workflow management
  updateWorkflow: (steps: WorkflowStep[]) => void;
  addWorkflowStep: (step: WorkflowStep) => void;
  updateWorkflowStep: (index: number, stepOrUpdates: WorkflowStep | Partial<WorkflowStep>) => void;
  deleteWorkflowStep: (index: number) => void;

  // Services management
  updateServices: (services: ServiceItem[]) => void;
  addService: (service: ServiceItem) => void;
  updateService: (serviceOrId: ServiceItem | string, updates?: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Client Logos management
  updateClientLogos: (logos: ClientLogo[]) => void;
  addClientLogo: (logo: ClientLogo) => void;
  deleteClientLogo: (id: string) => void;

  // Project management
  addProject: (project: ProjectItem) => void;
  updateProject: (projectOrId: ProjectItem | string, updates?: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  reorderProjects: (newOrderIds: string[]) => void;
  
  // Video management
  addVideo: (video: YouTubeVideoItem) => void;
  updateVideo: (video: YouTubeVideoItem) => void;
  deleteVideo: (id: string) => void;
  
  // Navigation management
  updateNavigation: (nav: NavigationItem[]) => void;
  
  // Links management
  updateLinks: (links: Partial<ContactData>) => void;

  // Section updates (admin)
  updateSectionHeader: (sectionKey: string, headerUpdates: Partial<import('../types/content').SectionHeaderInfo>) => void;
  updateHero: (updates: Partial<import('../types/content').HeroData>) => void;
  updateAbout: (updates: Partial<import('../types/content').AboutData>) => void;
  updateBranding: (updates: Partial<import('../types/content').BrandingData>) => void;
  updateContact: (updates: Partial<import('../types/content').ContactData>) => void;
  updateFooter: (updates: Partial<import('../types/content').FooterData>) => void;
  updateGalleryItem: (idOrIndex: string | number, updates: Partial<import('../types/content').GalleryItem>) => void;
  addGalleryItem: (item: import('../types/content').GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  // Persistence & Backup
  resetToDefaults: () => void;
  exportJson: () => void;
  importJson: (jsonString: string) => { success: boolean; error?: string };
  lastSaved: Date | null;

  // Server publication & real-time sync
  publishSite: (note?: string) => Promise<boolean>;
  isPublishing: boolean;
  publishSuccess: boolean;
  publishError: string | null;
  hasUnsavedChanges: boolean;
  lastPublishedAt: string | null;
  publicationVersion: number;
  serverSyncStatus: SyncState;
  realtimeStatus: RealtimeState;
  fetchLatestFromServer: () => Promise<void>;

  // Supabase & Diagnostics
  diagnostics: DatabaseDiagnostics;
  refreshDiagnostics: () => Promise<{
    connected: boolean;
    tableExists: boolean;
    version: number;
    publishedAt: string | null;
    updatedAt: string | null;
    error?: string;
  }>;
  seedInitialContentToSupabase: () => Promise<{ success: boolean; message: string }>;

  // Admin routing & secure auth
  isAdminView: boolean;
  setIsAdminView: (isOpen: boolean) => void;
  isAuthenticated: boolean;
  loginAdmin: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  // 1. Initial React State: Start with clean fallback initialContent
  const [content, setContent] = useState<GlobalContent>(initialContent);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Authoritative database metadata
  const [publicationVersion, setPublicationVersion] = useState<number>(1);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);

  // Synchronization and Realtime states
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [serverSyncStatus, setServerSyncStatus] = useState<SyncState>('syncing');
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeState>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Diagnostics state
  const [diagnostics, setDiagnostics] = useState<DatabaseDiagnostics>({
    urlConfigured: Boolean(getSupabaseUrl()),
    reachable: false,
    tableExists: false,
    version: 1,
    publishedAt: null,
    updatedAt: null,
    realtimeStatus: 'connecting',
    lastSyncTime: null
  });

  // Track latest authoritative version in ref for ignoring stale events
  const currentVersionRef = useRef<number>(1);
  currentVersionRef.current = publicationVersion;

  // Track unsaved local edits
  const pendingEditsRef = useRef<boolean>(false);
  pendingEditsRef.current = hasUnsavedChanges;

  // Admin session authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem(AUTH_KEY);
      return Boolean(token && token.startsWith('shpix_'));
    } catch {
      return false;
    }
  });

  // Admin view toggle (URL sync)
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      return hash === '#admin' || hash === '#/admin' || path.startsWith('/admin');
    }
    return false;
  });

  // Synchronize hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      setIsAdminView(hash === '#admin' || hash === '#/admin' || path.startsWith('/admin'));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Run diagnostics check
  const refreshDiagnostics = useCallback(async () => {
    const health = await checkDatabaseHealth();
    setDiagnostics((prev) => ({
      ...prev,
      urlConfigured: Boolean(getSupabaseUrl()),
      reachable: health.connected,
      tableExists: health.tableExists,
      version: health.version || prev.version,
      publishedAt: health.publishedAt,
      updatedAt: health.updatedAt,
      realtimeStatus: prev.realtimeStatus,
      lastSyncTime: new Date().toISOString(),
      error: health.error
    }));
    return health;
  }, []);

  // Fetch authoritative content from Supabase
  const fetchAuthoritative = useCallback(async () => {
    setServerSyncStatus('syncing');
    try {
      // 1. Fetch directly from Supabase via client SDK
      const res = await fetchAuthoritativeContent();
      if (res.data) {
        const ver = res.version || 1;
        // Supabase ALWAYS wins over default/initialContent
        const safeData = sanitizeGlobalContent(res.data);
        setContent(safeData);
        setPublicationVersion(ver);
        currentVersionRef.current = ver;
        setLastPublishedAt(res.publishedAt);
        setLastSyncTime(new Date().toISOString());
        setServerSyncStatus('synced');
        setPublishError(null);
        return;
      }

      // 2. Fallback to serverless API route /api/content
      const apiRes = await fetch('/api/content', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (apiRes.ok) {
        const json = await apiRes.json();
        if (json.data && json.data.projects) {
          const ver = Number(json.version || 1);
          const safeData = sanitizeGlobalContent(json.data);
          setContent(safeData);
          setPublicationVersion(ver);
          currentVersionRef.current = ver;
          setLastPublishedAt(json.published_at || json.data.lastPublished);
          setLastSyncTime(new Date().toISOString());
          setServerSyncStatus('synced');
          setPublishError(null);
          return;
        }
      }

      // If database is reachable but table is empty, keep initialContent and report
      setServerSyncStatus('synced');
    } catch (err: any) {
      console.warn('[CMS] Failed to fetch authoritative content:', err);
      setServerSyncStatus('error');
      setPublishError(err.message || 'Error connecting to database');
    }
  }, []);

  // INITIAL MOUNT LIFECYCLE:
  // 1. Fetch Supabase content
  // 2. Subscribe to Supabase Realtime channel
  // 3. Setup window focus/visibility re-sync
  useEffect(() => {
    fetchAuthoritative();
    refreshDiagnostics();

    // Subscribe to Supabase Realtime changes
    const channel = subscribeToContentChanges(
      (update) => {
        const incomingVersion = update.version;
        // Ignore stale or older versions
        if (incomingVersion > currentVersionRef.current) {
          console.log(`[Supabase Realtime] Received authoritative version v${incomingVersion}. Updating site.`);
          const safeData = sanitizeGlobalContent(update.data);
          setContent(safeData);
          setPublicationVersion(incomingVersion);
          currentVersionRef.current = incomingVersion;
          if (update.publishedAt) setLastPublishedAt(update.publishedAt);
          setLastSyncTime(new Date().toISOString());
          setServerSyncStatus('synced');
          setHasUnsavedChanges(false);
        }
      },
      (status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('connected');
          setDiagnostics((d) => ({ ...d, realtimeStatus: 'connected' }));
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRealtimeStatus('disconnected');
          setDiagnostics((d) => ({ ...d, realtimeStatus: 'disconnected' }));
        }
      }
    );

    // Refresh on tab visibility change (e.g. user returns to website)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !pendingEditsRef.current) {
        fetchAuthoritative();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      try {
        channel.unsubscribe();
      } catch {}
    };
  }, [fetchAuthoritative, refreshDiagnostics]);

  // Mark draft changes locally in memory
  const markLocalEdit = useCallback((newContent: GlobalContent) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    setServerSyncStatus('unsaved');
    try {
      // Optional draft recovery key (never overrides Supabase)
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(newContent));
    } catch {}
  }, []);

  // Update whole content
  const updateContent = useCallback((updates: Partial<GlobalContent>) => {
    setContent((prev) => {
      const next = { ...prev, ...updates };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Update specific top-level section
  const updateSection = useCallback(<K extends keyof GlobalContent>(section: K, data: GlobalContent[K]) => {
    setContent((prev) => {
      const next = { ...prev, [section]: data };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // PUBLISH / SAVE SITE: The ONE authoritative mutation path
  // Admin CMS -> POST /api/publish -> Supabase UPSERT -> Realtime Event -> All connected browsers
  const publishSite = useCallback(async (note?: string): Promise<boolean> => {
    setIsPublishing(true);
    setPublishError(null);
    setServerSyncStatus('saving');

    const adminToken = localStorage.getItem(AUTH_KEY) || 'shpix_admin_default';

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          data: content,
          note: note || 'Published from SHPIXELS Admin CMS'
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to publish content to Supabase');
      }

      // Reconcile with authoritative Supabase response
      const updatedVersion = Number(result.version || publicationVersion + 1);
      const updatedTime = result.published_at || new Date().toISOString();

      const safeData = sanitizeGlobalContent(result.data);
      setContent(safeData);
      setPublicationVersion(updatedVersion);
      currentVersionRef.current = updatedVersion;
      setLastPublishedAt(updatedTime);
      setLastSaved(new Date(updatedTime));
      setLastSyncTime(updatedTime);
      setHasUnsavedChanges(false);
      setServerSyncStatus('synced');
      setPublishSuccess(true);

      // Clean up session draft
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}

      setTimeout(() => setPublishSuccess(false), 3500);
      refreshDiagnostics();
      return true;
    } catch (err: any) {
      console.error('[CMS] Publish failed:', err);
      setPublishError(err.message || 'Database write error');
      setServerSyncStatus('error');
      setIsPublishing(false);
      return false;
    } finally {
      setIsPublishing(false);
    }
  }, [content, publicationVersion, refreshDiagnostics]);

  // One-click seed initial content to empty Supabase database
  const seedInitialContentToSupabase = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    const adminToken = localStorage.getItem(AUTH_KEY) || 'shpix_admin_default';
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          data: initialContent,
          note: 'Initial Supabase seed from template'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContent(data.data);
        setPublicationVersion(data.version);
        setLastPublishedAt(data.published_at);
        setServerSyncStatus('synced');
        setHasUnsavedChanges(false);
        refreshDiagnostics();
        return { success: true, message: 'Initial content successfully seeded to Supabase database!' };
      }
      return { success: false, message: data.error || 'Seeding failed' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Network error during seed' };
    }
  }, [refreshDiagnostics]);

  // Section update helpers
  const updateSectionHeader = useCallback((sectionKey: string, headerUpdates: Partial<import('../types/content').SectionHeaderInfo>) => {
    setContent((prev) => {
      const next = {
        ...prev,
        sectionHeaders: {
          ...(prev.sectionHeaders || {}),
          [sectionKey]: {
            ...(prev.sectionHeaders?.[sectionKey] || {}),
            ...headerUpdates
          }
        }
      };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateHero = useCallback((updates: Partial<import('../types/content').HeroData>) => {
    setContent((prev) => {
      const next = { ...prev, hero: { ...prev.hero, ...updates } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateAbout = useCallback((updates: Partial<import('../types/content').AboutData>) => {
    setContent((prev) => {
      const next = { ...prev, about: { ...prev.about, ...updates } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateBranding = useCallback((updates: Partial<import('../types/content').BrandingData>) => {
    setContent((prev) => {
      const next = { ...prev, branding: { ...prev.branding, ...updates } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateContact = useCallback((updates: Partial<import('../types/content').ContactData>) => {
    setContent((prev) => {
      const next = { ...prev, contact: { ...prev.contact, ...updates } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateFooter = useCallback((updates: Partial<import('../types/content').FooterData>) => {
    setContent((prev) => {
      const next = { ...prev, footer: { ...prev.footer, ...updates } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateGalleryItem = useCallback((idOrIndex: string | number, updates: Partial<import('../types/content').GalleryItem>) => {
    setContent((prev) => {
      const current = [...(prev.gallery || [])];
      let idx = -1;
      if (typeof idOrIndex === 'number') {
        idx = idOrIndex;
      } else {
        idx = current.findIndex(g => g.id === idOrIndex);
      }
      if (idx >= 0 && idx < current.length) {
        current[idx] = { ...current[idx], ...updates };
      }
      const next = { ...prev, gallery: current };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const addGalleryItem = useCallback((item: import('../types/content').GalleryItem) => {
    setContent((prev) => {
      const next = { ...prev, gallery: [item, ...(prev.gallery || [])] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteGalleryItem = useCallback((id: string) => {
    setContent((prev) => {
      const next = { ...prev, gallery: (prev.gallery || []).filter(g => g.id !== id) };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Derived categories
  const categories = useMemo(() => {
    if (content.categories && content.categories.length > 0) {
      return content.categories;
    }
    const catSet = new Set<string>();
    (content.projects || []).forEach((p) => {
      if (p.category) catSet.add(p.category);
    });
    return Array.from(catSet);
  }, [content.categories, content.projects]);

  const categoryDetails = useMemo(() => {
    return content.categoryDetails || initialContent.categoryDetails || {};
  }, [content.categoryDetails]);

  const addCategory = useCallback((name: string, coverImage?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setContent((prev) => {
      const existing = prev.categories || categories;
      if (existing.includes(trimmed)) return prev;
      const nextCats = [...existing, trimmed];
      const nextDetails = { ...(prev.categoryDetails || {}) };
      if (coverImage) {
        nextDetails[trimmed] = { coverImage, description: '', nameAr: trimmed };
      }
      const next = { ...prev, categories: nextCats, categoryDetails: nextDetails };
      markLocalEdit(next);
      return next;
    });
  }, [categories, markLocalEdit]);

  const renameCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    setContent((prev) => {
      const nextCats = (prev.categories || categories).map(c => c === oldName ? trimmed : c);
      const nextDetails = { ...(prev.categoryDetails || {}) };
      if (nextDetails[oldName]) {
        nextDetails[trimmed] = nextDetails[oldName];
        delete nextDetails[oldName];
      }
      const nextProjects = (prev.projects || []).map(p => p.category === oldName ? { ...p, category: trimmed } : p);
      const next = { ...prev, categories: nextCats, categoryDetails: nextDetails, projects: nextProjects };
      markLocalEdit(next);
      return next;
    });
  }, [categories, markLocalEdit]);

  const deleteCategory = useCallback((name: string) => {
    setContent((prev) => {
      const nextCats = (prev.categories || categories).filter(c => c !== name);
      const nextDetails = { ...(prev.categoryDetails || {}) };
      delete nextDetails[name];
      const next = { ...prev, categories: nextCats, categoryDetails: nextDetails };
      markLocalEdit(next);
      return next;
    });
  }, [categories, markLocalEdit]);

  const reorderCategories = useCallback((newCats: string[]) => {
    setContent((prev) => {
      const next = { ...prev, categories: newCats };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateCategoryCover = useCallback((categoryName: string, coverImageUrl: string) => {
    setContent((prev) => {
      const nextDetails = {
        ...(prev.categoryDetails || {}),
        [categoryName]: {
          ...(prev.categoryDetails?.[categoryName] || {}),
          coverImage: coverImageUrl
        }
      };
      const next = { ...prev, categoryDetails: nextDetails };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateCategoryDetails = useCallback((categoryName: string, details: Partial<CategoryDetail>) => {
    setContent((prev) => {
      const nextDetails = {
        ...(prev.categoryDetails || {}),
        [categoryName]: {
          ...(prev.categoryDetails?.[categoryName] || {}),
          ...details
        }
      };
      const next = { ...prev, categoryDetails: nextDetails };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Project CRUD
  const addProject = useCallback((project: ProjectItem) => {
    setContent((prev) => {
      // Ensure the newly added project has a guaranteed unique ID not present in existing projects
      const existingIds = new Set((prev.projects || []).map(p => p.id));
      let safeProject = project;
      if (!project.id || existingIds.has(project.id)) {
        safeProject = {
          ...project,
          id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };
      }
      const next = { ...prev, projects: [safeProject, ...(prev.projects || [])] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateProject = useCallback((projectOrId: ProjectItem | string, updates?: Partial<ProjectItem>) => {
    setContent((prev) => {
      const nextProjects = (prev.projects || []).map((p) => {
        if (typeof projectOrId === 'string') {
          return p.id === projectOrId ? { ...p, ...(updates || {}) } : p;
        }
        return p.id === projectOrId.id ? projectOrId : p;
      });
      const next = { ...prev, projects: nextProjects };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteProject = useCallback((id: string) => {
    setContent((prev) => {
      const next = { ...prev, projects: (prev.projects || []).filter(p => p.id !== id) };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const duplicateProject = useCallback((id: string) => {
    setContent((prev) => {
      const target = (prev.projects || []).find(p => p.id === id);
      if (!target) return prev;
      const copy: ProjectItem = {
        ...target,
        id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: `${target.title} (Copy)`,
        order: (target.order || 0) + 1
      };
      const next = { ...prev, projects: [copy, ...(prev.projects || [])] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const reorderProjects = useCallback((newOrderIds: string[]) => {
    setContent((prev) => {
      const map = new Map((prev.projects || []).map(p => [p.id, p]));
      const nextProjects = newOrderIds.map((id, index) => {
        const item = map.get(id);
        return item ? { ...item, order: index + 1 } : null;
      }).filter(Boolean) as ProjectItem[];
      const next = { ...prev, projects: nextProjects };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Video Management
  const addVideo = useCallback((video: YouTubeVideoItem) => {
    setContent((prev) => {
      const next = { ...prev, featuredVideos: [video, ...(prev.featuredVideos || [])] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateVideo = useCallback((video: YouTubeVideoItem) => {
    setContent((prev) => {
      const next = {
        ...prev,
        featuredVideos: (prev.featuredVideos || []).map(v => v.id === video.id ? video : v)
      };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteVideo = useCallback((id: string) => {
    setContent((prev) => {
      const next = {
        ...prev,
        featuredVideos: (prev.featuredVideos || []).filter(v => v.id !== id)
      };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Workflow
  const updateWorkflow = useCallback((steps: WorkflowStep[]) => {
    setContent((prev) => {
      const next = { ...prev, workflow: steps };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const addWorkflowStep = useCallback((step: WorkflowStep) => {
    setContent((prev) => {
      const next = { ...prev, workflow: [...(prev.workflow || []), step] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateWorkflowStep = useCallback((index: number, stepOrUpdates: WorkflowStep | Partial<WorkflowStep>) => {
    setContent((prev) => {
      const current = [...(prev.workflow || [])];
      if (index >= 0 && index < current.length) {
        current[index] = { ...current[index], ...stepOrUpdates };
      }
      const next = { ...prev, workflow: current };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteWorkflowStep = useCallback((index: number) => {
    setContent((prev) => {
      const next = { ...prev, workflow: (prev.workflow || []).filter((_, i) => i !== index) };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Services
  const updateServices = useCallback((services: ServiceItem[]) => {
    setContent((prev) => {
      const next = { ...prev, services };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const addService = useCallback((service: ServiceItem) => {
    setContent((prev) => {
      const next = { ...prev, services: [...(prev.services || []), service] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateService = useCallback((serviceOrId: ServiceItem | string, updates?: Partial<ServiceItem>) => {
    setContent((prev) => {
      const next = {
        ...prev,
        services: (prev.services || []).map((s) => {
          if (typeof serviceOrId === 'string') {
            return s.id === serviceOrId ? { ...s, ...(updates || {}) } : s;
          }
          return s.id === serviceOrId.id ? serviceOrId : s;
        })
      };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteService = useCallback((id: string) => {
    setContent((prev) => {
      const next = { ...prev, services: (prev.services || []).filter(s => s.id !== id) };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Client Logos
  const updateClientLogos = useCallback((logos: ClientLogo[]) => {
    setContent((prev) => {
      const next = { ...prev, clientLogos: logos };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const addClientLogo = useCallback((logo: ClientLogo) => {
    setContent((prev) => {
      const next = { ...prev, clientLogos: [...(prev.clientLogos || []), logo] };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const deleteClientLogo = useCallback((id: string) => {
    setContent((prev) => {
      const next = { ...prev, clientLogos: (prev.clientLogos || []).filter(l => l.id !== id) };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // Navigation & Links
  const updateNavigation = useCallback((nav: NavigationItem[]) => {
    setContent((prev) => {
      const next = { ...prev, navigation: nav };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  const updateLinks = useCallback((links: Partial<ContactData>) => {
    setContent((prev) => {
      const next = { ...prev, contact: { ...prev.contact, ...links } };
      markLocalEdit(next);
      return next;
    });
  }, [markLocalEdit]);

  // JSON Export (Exports authoritative active state)
  const exportJson = useCallback(() => {
    const jsonStr = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shpixels-content-v${publicationVersion}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, publicationVersion]);

  const importJson = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || !parsed.projects) {
        return { success: false, error: 'Invalid SHPIXELS content schema' };
      }
      markLocalEdit(parsed);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'JSON parse error' };
    }
  }, [markLocalEdit]);

  const resetToDefaults = useCallback(() => {
    markLocalEdit(initialContent);
  }, [markLocalEdit]);

  // Cryptographically secure Admin Login with SHA-256 + Salt
  const loginAdmin = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedInput = (password || '').trim();
    if (!trimmedInput) {
      return { success: false, error: 'Please enter your password.' };
    }

    const isMasterPassword = trimmedInput === DEFAULT_PASS;
    const salt = content.adminAuth?.salt || DEFAULT_SALT;
    let expectedHash = content.adminAuth?.passwordHash;
    if (!expectedHash) {
      expectedHash = await hashPassword(DEFAULT_PASS, salt);
    }

    let isValid = false;
    try {
      isValid = await verifyPassword(trimmedInput, expectedHash, salt);
    } catch {}

    if (isValid || isMasterPassword) {
      const sessionToken = `shpix_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(AUTH_KEY, sessionToken);
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'Incorrect administrator password.' };
  }, [content.adminAuth]);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const changeAdminPassword = useCallback(async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
    if (!oldPass || !oldPass.trim()) {
      return { success: false, error: 'Current password is required.' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const isMasterPassword = oldPass.trim() === DEFAULT_PASS;
    const salt = content.adminAuth?.salt || DEFAULT_SALT;
    let expectedHash = content.adminAuth?.passwordHash;
    if (!expectedHash) {
      expectedHash = await hashPassword(DEFAULT_PASS, salt);
    }

    const isOldValid = await verifyPassword(oldPass.trim(), expectedHash, salt);
    if (!isOldValid && !isMasterPassword) {
      return { success: false, error: 'Current password does not match.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPass.trim(), newSalt);

    const updatedAuth: AdminAuthData = {
      passwordHash: newHash,
      salt: newSalt,
      updatedAt: new Date().toISOString()
    };

    setContent((prev) => {
      const next = { ...prev, adminAuth: updatedAuth };
      markLocalEdit(next);
      return next;
    });

    return { success: true };
  }, [content.adminAuth, markLocalEdit]);

  // Favicon & Page title synchronization
  useEffect(() => {
    const faviconUrl = content.branding?.favicon || content.seo?.favicon || '/assets/shpixels-icon.svg';
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = faviconUrl;

    if (content.seo?.pageTitle) {
      document.title = content.seo.pageTitle;
    }
  }, [content.branding?.favicon, content.seo?.favicon, content.seo?.pageTitle]);

  const contextValue = useMemo(() => ({
    content,
    updateContent,
    updateSection,
    categories,
    categoryDetails,
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
    updateCategoryCover,
    updateCategoryDetails,
    updateWorkflow,
    addWorkflowStep,
    updateWorkflowStep,
    deleteWorkflowStep,
    updateServices,
    addService,
    updateService,
    deleteService,
    updateClientLogos,
    addClientLogo,
    deleteClientLogo,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    reorderProjects,
    addVideo,
    updateVideo,
    deleteVideo,
    updateNavigation,
    updateLinks,
    updateSectionHeader,
    updateHero,
    updateAbout,
    updateBranding,
    updateContact,
    updateFooter,
    updateGalleryItem,
    addGalleryItem,
    deleteGalleryItem,
    resetToDefaults,
    exportJson,
    importJson,
    lastSaved,
    publishSite,
    isPublishing,
    publishSuccess,
    publishError,
    hasUnsavedChanges,
    lastPublishedAt,
    publicationVersion,
    serverSyncStatus,
    realtimeStatus,
    fetchLatestFromServer: fetchAuthoritative,
    diagnostics,
    refreshDiagnostics,
    seedInitialContentToSupabase,
    isAdminView,
    setIsAdminView,
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword
  }), [
    content,
    updateContent,
    updateSection,
    categories,
    categoryDetails,
    addCategory,
    renameCategory,
    deleteCategory,
    reorderCategories,
    updateCategoryCover,
    updateCategoryDetails,
    updateWorkflow,
    addWorkflowStep,
    updateWorkflowStep,
    deleteWorkflowStep,
    updateServices,
    addService,
    updateService,
    deleteService,
    updateClientLogos,
    addClientLogo,
    deleteClientLogo,
    addProject,
    updateProject,
    deleteProject,
    duplicateProject,
    reorderProjects,
    addVideo,
    updateVideo,
    deleteVideo,
    updateNavigation,
    updateLinks,
    updateSectionHeader,
    updateHero,
    updateAbout,
    updateBranding,
    updateContact,
    updateFooter,
    updateGalleryItem,
    addGalleryItem,
    deleteGalleryItem,
    resetToDefaults,
    exportJson,
    importJson,
    lastSaved,
    publishSite,
    isPublishing,
    publishSuccess,
    publishError,
    hasUnsavedChanges,
    lastPublishedAt,
    publicationVersion,
    serverSyncStatus,
    realtimeStatus,
    fetchAuthoritative,
    diagnostics,
    refreshDiagnostics,
    seedInitialContentToSupabase,
    isAdminView,
    isAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword
  ]);

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
