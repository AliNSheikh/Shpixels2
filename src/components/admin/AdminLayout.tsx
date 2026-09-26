import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Video, 
  Image, 
  Settings, 
  Menu, 
  Globe, 
  Search, 
  Download, 
  LogOut, 
  LayoutDashboard, 
  ExternalLink,
  Film,
  Zap,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
  UploadCloud,
  Check,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { DashboardHome } from './DashboardHome';
import { ProjectManager } from './ProjectManager';
import { CategoryManager } from './CategoryManager';
import { SectionManager } from './SectionManager';
import { VideoManager } from './VideoManager';
import { MediaManager } from './MediaManager';
import { SiteSettings } from './SiteSettings';
import { NavigationManager } from './NavigationManager';
import { LinkManager } from './LinkManager';
import { SEOManager } from './SEOManager';
import { ExportManager } from './ExportManager';

type AdminTab = 
  | 'home' 
  | 'projects' 
  | 'categories' 
  | 'sections' 
  | 'videos' 
  | 'media' 
  | 'settings' 
  | 'navigation' 
  | 'links' 
  | 'seo' 
  | 'export';

export function AdminLayout() {
  const { 
    content, 
    categories, 
    logoutAdmin, 
    setIsAdminView,
    publishSite,
    isPublishing,
    publishSuccess,
    publishError,
    hasUnsavedChanges,
    lastPublishedAt,
    publicationVersion,
    serverSyncStatus
  } = useContent();
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [, setTimeTicker] = useState(0);

  // Periodically refresh relative time display
  useEffect(() => {
    const timer = setInterval(() => setTimeTicker((t) => t + 1), 15000);
    return () => clearInterval(timer);
  }, []);

  // Format date helper
  const formatPublicationDate = (isoString: string | null | undefined) => {
    if (!isoString) return isAr ? 'لم ينشر بعد' : 'Not published yet';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Relative time helper
  const getRelativeTime = (isoString: string | null | undefined) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSec < 30) return isAr ? 'الآن' : 'Just now';
      if (diffSec < 60) return isAr ? `منذ ${diffSec} ثانية` : `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return isAr ? `منذ ${diffMin} د` : `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return isAr ? `منذ ${diffHour} س` : `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      return isAr ? `منذ ${diffDays} يوم` : `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  const navItems = [
    { id: 'home', label: isAr ? 'لوحة القيادة' : 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: isAr ? 'إدارة المشاريع والأعمال' : 'Projects (CRUD)', icon: FolderKanban, count: content.projects.length },
    { id: 'categories', label: isAr ? 'إدارة التصنيفات والفئات' : 'Category Manager', icon: Tag, count: categories.length },
    { id: 'sections', label: isAr ? 'محرر كافة الأقسام والمحتوى' : 'Section & Pipeline Editor', icon: Layers },
    { id: 'videos', label: isAr ? 'فيديوهات YouTube 4K' : 'YouTube Videos', icon: Video },
    { id: 'media', label: isAr ? 'الوسائط والرفع المباشر' : 'Media & Desktop Upload', icon: Image },
    { id: 'settings', label: isAr ? 'الشعار والهوية والإعدادات' : 'Logo, Brand & Settings', icon: Settings },
    { id: 'navigation', label: isAr ? 'قائمة التنقل' : 'Navigation Menu', icon: Menu },
    { id: 'links', label: isAr ? 'الروابط والتواصل' : 'Links & Social', icon: Globe },
    { id: 'seo', label: isAr ? 'أرشفة Google & Sitemap' : 'SEO & Google Indexing', icon: Search },
    { id: 'export', label: isAr ? 'تصدير الكود والبيانات' : 'Codebase Export', icon: Download },
  ];

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileDrawerOpen(false);
  };

  const currentTabItem = navItems.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-[#111111] text-[#f1f2ed] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#171717]/95 backdrop-blur-md border-b border-[#2b2b2b] px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="md:hidden p-2 rounded-xl text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black shadow-md shadow-[#2563eb]/25 flex-shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase font-quicksand text-white truncate">
                SHPIXELS
              </span>
              <span className="hidden xs:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#232323] text-[#38bdf8] border border-[#2563eb]/40">
                {isAr ? 'لوحة CMS' : 'ADMIN CMS'}
              </span>
            </div>
          </div>
        </div>

        {/* Status & Quick actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Last Publication Time/Date Record & Live Server Sync */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${serverSyncStatus === 'error' ? 'bg-red-400' : hasUnsavedChanges ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${serverSyncStatus === 'error' ? 'bg-red-500' : hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>

            <div className="flex flex-col text-[11px] leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[#a8a6a1] font-mono text-[10px]">v{publicationVersion}</span>
                <span className="text-[#444]">•</span>
                <span className="font-semibold text-[#f1f2ed] truncate max-w-[150px] lg:max-w-none">
                  {formatPublicationDate(lastPublishedAt)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#706e6a]">
                <Clock className="w-3 h-3 text-[#706e6a]" />
                <span>
                  {hasUnsavedChanges 
                    ? (isAr ? 'يوجد تعديلات غير منشورة' : 'Draft changes pending publish')
                    : lastPublishedAt 
                      ? (isAr ? `نُشر على السيرفر (${getRelativeTime(lastPublishedAt)})` : `Live on server (${getRelativeTime(lastPublishedAt)})`)
                      : (isAr ? 'متصل بالسيرفر' : 'Connected to server')}
                </span>
              </div>
            </div>
          </div>

          {/* Primary "Save Site" Button (Persists & Publishes to Server) */}
          <button
            onClick={() => publishSite()}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer select-none ${
              publishSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : hasUnsavedChanges
                ? 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/30 ring-2 ring-[#38bdf8]/50 animate-pulse'
                : 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/20'
            }`}
            title={isAr ? 'حفظ وتثبيت التعديلات على السيرفر فوراً لجميع الزوار' : 'Save all changes directly to the server immediately for all visitors'}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{isAr ? 'جارِ النشر على السيرفر...' : 'Publishing to Server...'}</span>
              </>
            ) : publishSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>{isAr ? 'تم النشر بنجاح ✓' : 'Site Saved & Published ✓'}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-white" />
                <span>{isAr ? 'حفظ ونشر الموقع' : 'Save Site'}</span>
                {hasUnsavedChanges && (
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                )}
              </>
            )}
          </button>

          {/* Bilingual Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-mono text-[#a8a6a1] hover:text-white border border-[#2b2b2b] transition-colors cursor-pointer"
            title={isAr ? 'Switch CMS to English' : 'تحويل اللوحة إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#2563eb]" />
            <span className={!isAr ? 'font-bold text-[#f1f2ed]' : 'text-[#706e6a]'}>EN</span>
            <span className="text-[#444]">/</span>
            <span className={isAr ? 'font-bold text-[#f1f2ed]' : 'text-[#706e6a]'}>عربي</span>
          </button>

          <button
            onClick={() => setIsAdminView(false)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-medium text-[#f1f2ed] border border-[#2b2b2b] transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">{isAr ? 'الموقع العام' : 'Public Site'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2563eb]" />
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
            title={isAr ? 'تسجيل الخروج' : 'Log Out'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex animate-in fade-in duration-200"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div 
            className="w-4/5 max-w-sm bg-[#171717] h-full border-r border-[#2b2b2b] p-4 flex flex-col space-y-3 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2b2b2b]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black">
                  <Film className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-white font-quicksand">
                  {isAr ? 'قائمة إدارة المحتوى' : 'Admin Navigation'}
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#232323]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id as AdminTab)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20 font-bold'
                        : 'text-[#a8a6a1] hover:text-[#f1f2ed] hover:bg-[#232323]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          isActive ? 'bg-black/30 text-white' : 'bg-[#232323] text-[#706e6a]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#2b2b2b] flex items-center justify-between text-xs text-[#706e6a] font-mono">
              <span>SHPIXELS v2.0</span>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setIsAdminView(false);
                }}
                className="text-[#2563eb] hover:underline flex items-center gap-1"
              >
                <span>{isAr ? 'الموقع العام' : 'Public Site'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 gap-4 sm:gap-6">
        {/* Tablet & Desktop Sidebar Navigation */}
        <aside 
          className={`hidden md:flex flex-col rounded-2xl bg-[#171717] border border-[#2b2b2b] p-2 sm:p-3 space-y-1 self-start shadow-xl sticky top-20 transition-all duration-300 ${
            sidebarCollapsed ? 'w-20 items-center' : 'w-60 lg:w-64'
          }`}
        >
          {/* Collapse / Expand Toggle Button */}
          <div className={`w-full flex items-center pb-2 mb-1 border-b border-[#2b2b2b] ${
            sidebarCollapsed ? 'justify-center' : 'justify-between px-2'
          }`}>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#706e6a]">
                {isAr ? 'أقسام اللوحة' : 'Navigation'}
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#232323] transition-colors cursor-pointer"
              title={sidebarCollapsed ? (isAr ? 'توسيع القائمة' : 'Expand Sidebar') : (isAr ? 'طي القائمة لتوفير مساحة' : 'Collapse Sidebar')}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  sidebarCollapsed 
                    ? 'w-12 h-12 justify-center p-0' 
                    : 'w-full justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/20 font-bold'
                    : 'text-[#a8a6a1] hover:text-[#f1f2ed] hover:bg-[#232323]'
                }`}
              >
                <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!sidebarCollapsed && item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-black/30 text-white' : 'bg-[#232323] text-[#706e6a]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Clean Bottom Navigation Bar (5 core actions) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#171717]/95 backdrop-blur-md border-t border-[#2b2b2b] px-2 py-1.5 flex items-center justify-around">
          {[
            { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: LayoutDashboard },
            { id: 'projects', label: isAr ? 'المشاريع' : 'Projects', icon: FolderKanban },
            { id: 'categories', label: isAr ? 'التصنيفات' : 'Categories', icon: Tag },
            { id: 'sections', label: isAr ? 'الأقسام' : 'Sections', icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id as AdminTab)}
                className={`min-h-[44px] min-w-[54px] px-2 py-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors ${
                  isActive ? 'text-[#2563eb] font-bold' : 'text-[#706e6a] hover:text-[#a8a6a1]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* More menu trigger button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="min-h-[44px] min-w-[54px] px-2 py-1 rounded-xl flex flex-col items-center justify-center gap-0.5 cursor-pointer text-[#706e6a] hover:text-[#a8a6a1] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">{isAr ? 'المزيد' : 'More'}</span>
          </button>
        </div>

        {/* Content Workspace Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6">
          {activeTab === 'home' && (
            <DashboardHome
              onNavigate={(tab) => setActiveTab(tab as AdminTab)}
              onNewProject={() => setActiveTab('projects')}
            />
          )}
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'sections' && <SectionManager />}
          {activeTab === 'videos' && <VideoManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'settings' && <SiteSettings />}
          {activeTab === 'navigation' && <NavigationManager />}
          {activeTab === 'links' && <LinkManager />}
          {activeTab === 'seo' && <SEOManager />}
          {activeTab === 'export' && <ExportManager />}
        </main>
      </div>
    </div>
  );
}
