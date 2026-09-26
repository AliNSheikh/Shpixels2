import React, { useState } from 'react';
import { 
  FolderKanban, 
  Video, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Plus, 
  Download, 
  Globe, 
  Sparkles, 
  Zap, 
  Tag, 
  Layers, 
  Search, 
  Check, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Workflow, 
  Sliders, 
  Film, 
  Phone, 
  ShieldCheck, 
  UploadCloud, 
  RefreshCw, 
  Copy,
  ChevronRight,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Database
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectItem } from '../../types/content';
import { ProjectEditorModal } from './ProjectEditorModal';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../../utils/youtube';
import { compressImageFile } from '../../utils/imageCompressor';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
  onNewProject: () => void;
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { 
    content, 
    categories, 
    addCategory, 
    updateProject, 
    addProject, 
    deleteProject, 
    updateHero,
    addGalleryItem,
    exportJson, 
    setIsAdminView,
    publishSite,
    isPublishing,
    publishSuccess,
    hasUnsavedChanges,
    lastPublishedAt,
    publicationVersion,
    serverSyncStatus,
    publishError,
    diagnostics
  } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Modal state for direct in-dashboard project editing
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Quick search in recent projects
  const [projectSearch, setProjectSearch] = useState('');

  // Quick Category creation state
  const [quickCategoryName, setQuickCategoryName] = useState('');
  const [categoryNotice, setCategoryNotice] = useState<string | null>(null);

  // Quick Showreel YouTube update state
  const [showreelDraftId, setShowreelDraftId] = useState(
    content.hero.featuredVideoId || 'ScMzIvxBSi4'
  );
  const [videoNotice, setVideoNotice] = useState<string | null>(null);

  // Quick Media upload state
  const [quickUploadPreview, setQuickUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedDataUrl, setCopiedDataUrl] = useState(false);
  const [addedToGalleryNotice, setAddedToGalleryNotice] = useState(false);

  // General temporary notice
  const [generalNotice, setGeneralNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setGeneralNotice(msg);
    setTimeout(() => setGeneralNotice(null), 3000);
  };

  // Metrics calculations
  const totalProjects = content.projects.length;
  const publishedProjects = content.projects.filter((p) => p.published).length;
  const hiddenProjects = totalProjects - publishedProjects;
  
  const totalProjectVideos = content.projects.reduce((acc, p) => acc + (p.videos?.length || 0), 0);
  const totalVideos = totalProjectVideos + (content.featuredVideos?.length || 0) + 1;

  const totalGalleryImages = (content.gallery?.length || 0) + content.projects.reduce((acc, p) => acc + (p.gallery?.length || 0), 0);
  const totalWorkflowSteps = content.workflow?.length || 4;
  const totalServices = content.services?.length || 6;

  // Filtered recent projects
  const recentProjects = content.projects
    .filter((p) => {
      if (!projectSearch.trim()) return true;
      const q = projectSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    })
    .slice(0, 5);

  // Handlers for direct project actions
  const handleTogglePublish = (project: ProjectItem) => {
    const updated = { ...project, published: !project.published };
    updateProject(updated);
    showNotice(
      project.published 
        ? (isAr ? `تم إخفاء مشروع "${project.title}"` : `Project "${project.title}" hidden`) 
        : (isAr ? `تم نشر مشروع "${project.title}"` : `Project "${project.title}" published`)
    );
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    const updated = { ...project, featured: !project.featured };
    updateProject(updated);
    showNotice(
      project.featured 
        ? (isAr ? `تم إلغاء تمييز "${project.title}"` : `Project "${project.title}" unfeatured`) 
        : (isAr ? `تم تمييز مشروع "${project.title}"` : `Project "${project.title}" marked as featured`)
    );
  };

  const handleOpenEditProject = (project: ProjectItem) => {
    setEditingProject(project);
    setEditorModalOpen(true);
  };

  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setEditorModalOpen(true);
  };

  const handleSaveModalProject = (project: ProjectItem) => {
    const exists = content.projects.some((p) => p.id === project.id);
    if (exists) {
      updateProject(project);
      showNotice(isAr ? 'تم تحديث المشروع بنجاح' : 'Project updated successfully');
    } else {
      addProject(project);
      showNotice(isAr ? 'تمت إضافة المشروع الجديد' : 'New project created successfully');
    }
  };

  // Quick Add Category
  const handleQuickAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickCategoryName.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryNotice(isAr ? 'التصنيف موجود بالفعل!' : 'Category already exists!');
      setTimeout(() => setCategoryNotice(null), 2500);
      return;
    }
    addCategory(trimmed);
    setQuickCategoryName('');
    setCategoryNotice(isAr ? `✓ تم إضافة: "${trimmed}"` : `✓ Added: "${trimmed}"`);
    setTimeout(() => setCategoryNotice(null), 3000);
  };

  // Quick Save Showreel Video ID
  const handleSaveShowreelVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractYouTubeId(showreelDraftId);
    if (!cleanId) return;
    updateHero({ featuredVideoId: cleanId });
    setVideoNotice(isAr ? '✓ تم تحديث معرف فيديو العرض الترويجي!' : '✓ Showreel YouTube ID updated!');
    setTimeout(() => setVideoNotice(null), 3000);
  };

  // Quick Media File Drop / Upload
  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError(isAr ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      setTimeout(() => setUploadError(null), 3000);
      return;
    }
    setUploadError(null);
    compressImageFile(file)
      .then((dataUrl) => {
        setQuickUploadPreview(dataUrl);
      })
      .catch(() => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setQuickUploadPreview(dataUrl);
        };
        reader.readAsDataURL(file);
      });
  };

  const handleAddUploadedToGallery = () => {
    if (!quickUploadPreview) return;
    addGalleryItem({
      id: `gal-${Date.now()}`,
      title: isAr ? 'لقطة سينمائية جديدة' : 'New Production Still',
      image: quickUploadPreview,
      category: categories[0] || 'Commercial',
      caption: 'Direct Desktop Upload'
    });
    setAddedToGalleryNotice(true);
    setTimeout(() => setAddedToGalleryNotice(false), 3000);
  };

  const handleCopyUploadUrl = () => {
    if (!quickUploadPreview) return;
    navigator.clipboard.writeText(quickUploadPreview);
    setCopiedDataUrl(true);
    setTimeout(() => setCopiedDataUrl(false), 2000);
  };

  // Sections summary list
  const sectionCards = [
    { 
      id: 'pipeline', 
      name: isAr ? 'مسار العمل والإنتاج (Pipeline)' : 'Production Pipeline', 
      meta: `${totalWorkflowSteps} ${isAr ? 'مراحل عمل' : 'Workflow Steps'}`, 
      icon: Workflow, 
      color: 'text-rose-400' 
    },
    { 
      id: 'services', 
      name: isAr ? 'الخدمات والأيقونات الفنية' : 'Services & Capabilities', 
      meta: `${totalServices} ${isAr ? 'خدمات معتمدة' : 'Active Services'}`, 
      icon: Sliders, 
      color: 'text-amber-400' 
    },
    { 
      id: 'hero', 
      name: isAr ? 'الواجهة وفيديو العرض 4K' : 'Hero & 4K Showreel', 
      meta: `YouTube: ${content.hero.featuredVideoId || 'ScMzIvxBSi4'}`, 
      icon: Film, 
      color: 'text-[#38bdf8]' 
    },
    { 
      id: 'about', 
      name: isAr ? 'عن المخرج، النبذة والإحصائيات' : 'Director Bio & Metrics', 
      meta: content.about.heading || 'Bio & Experience', 
      icon: Sparkles, 
      color: 'text-indigo-400' 
    },
    { 
      id: 'branding', 
      name: isAr ? 'الشعار، الأيقونة والإعدادات' : 'Logo, Brand & Site Settings', 
      meta: content.branding.logoImage ? (isAr ? 'شعار مخصص مفعل' : 'Custom Logo Active') : (isAr ? 'نص الشعار الافتراضي' : 'Default Brand'), 
      icon: Sparkles, 
      color: 'text-emerald-400' 
    },
    { 
      id: 'contact-footer', 
      name: isAr ? 'التواصل، الروابط والتذييل' : 'Contact & Social Links', 
      meta: content.contact.email, 
      icon: Phone, 
      color: 'text-sky-400' 
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* General Notification Toast */}
      {generalNotice && (
        <div className="fixed top-5 right-5 z-50 p-3.5 sm:p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{generalNotice}</span>
        </div>
      )}

      {/* Top Banner with Studio Context & Instant Live Visual Switcher */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-[#1d1d1d] via-[#242424] to-[#1d1d1d] border border-[#2b2b2b] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563eb]/20 border border-[#2563eb]/40 text-xs font-mono uppercase text-[#38bdf8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'محرك إدارة محتوى SHPIXELS' : 'SHPIXELS Content Engine'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#f1f2ed] font-quicksand uppercase tracking-wide">
            {isAr ? 'لوحة القيادة ونظرة عامة' : 'Content Management Overview'}
          </h1>
          <p className="text-xs sm:text-sm text-[#a8a6a1] leading-relaxed">
            {isAr 
              ? 'إدارة فورية لمشاريع الفيديو، رفع صور الأغلفة واللقطات مباشرة، ضبط معرفات YouTube بدقة 4K، وتعديل كافة الأقسام مع الحفظ المباشر.' 
              : 'Directly manage your video portfolio, upload desktop stills, configure 4K YouTube embeds, and customize all website sections with real-time sync.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setIsAdminView(false)}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold text-[#f1f2ed] border border-[#2b2b2b] transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-[#2563eb]" />
            <span>{isAr ? 'الموقع العام' : 'Public Site'}</span>
          </button>

          <button
            onClick={exportJson}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold text-white transition-all shadow-md shadow-[#2563eb]/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isAr ? 'تصدير JSON' : 'Export JSON'}</span>
          </button>
        </div>
      </div>

      {/* Primary Server Publication & Live Visitor Synchronization Banner */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-2xl ${
        hasUnsavedChanges 
          ? 'bg-gradient-to-r from-[#1c1917] via-[#1f1915] to-[#1c1917] border-amber-500/40 ring-1 ring-amber-500/20' 
          : 'bg-[#181818] border-[#2b2b2b]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Publication Metadata & Server Status */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${
                serverSyncStatus === 'error'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : hasUnsavedChanges
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${serverSyncStatus === 'error' ? 'bg-rose-400' : hasUnsavedChanges ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>
                  {serverSyncStatus === 'error'
                    ? (isAr ? 'خطأ في الاتصال بالسيرفر' : 'Server Connection Issue')
                    : hasUnsavedChanges
                    ? (isAr ? 'توجد تعديلات مسودة غير منشورة' : 'Unpublished Changes Pending')
                    : (isAr ? 'السيرفر محدث ومزامن للزوار' : 'Live & Synchronized on Server')}
                </span>
              </span>

              <span className="px-2 py-0.5 rounded-md bg-[#232323] text-[#a8a6a1] text-[11px] font-mono">
                {isAr ? `إصدار النشر: v${publicationVersion}` : `Version v${publicationVersion}`}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-[#f1f2ed] font-quicksand uppercase flex items-center gap-2">
                <span>{isAr ? 'حفظ ونشر الموقع فورياً على السيرفر' : 'Server Synchronization & Publication'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#a8a6a1] leading-relaxed">
                {isAr 
                  ? 'تُحفظ كافة التعديلات على نصوص وصور وأقسام الموقع مباشرة على ملفات السيرفر، وتظهر لجميع الزوار فوراً دون تأخير.'
                  : 'All edits across site text, images, and sections take place on the server and synchronize live to all visitors without delay.'}
              </p>
            </div>

            {/* Last Publication Record with Exact Time/Date */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-xs font-mono text-[#a8a6a1]">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0" />
                <span>{isAr ? 'آخر توقيت وتاريخ نشر:' : 'Last Publication Record:'}</span>
                <strong className="text-[#f1f2ed]">
                  {lastPublishedAt 
                    ? new Date(lastPublishedAt).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })
                    : (isAr ? 'لم ينشر بعد' : 'Not recorded yet')}
                </strong>
              </div>

              {diagnostics && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#141414] border border-[#262626] text-xs font-mono text-[#a8a6a1]">
                  <Database className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>Supabase:</span>
                  <span className={diagnostics.reachable ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {diagnostics.reachable ? (isAr ? 'متصل' : 'Connected') : (isAr ? 'غير متصل' : 'Offline')}
                  </span>
                </div>
              )}
            </div>

            {/* Error banner if publishing encountered an error */}
            {publishError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{publishError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('settings')}
                  className="underline text-rose-200 hover:text-white text-[11px] whitespace-nowrap cursor-pointer"
                >
                  {isAr ? 'فحص إعدادات Supabase' : 'Check Supabase Settings'}
                </button>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            {/* The Dedicated "Save Site" Button */}
            <button
              onClick={() => publishSite()}
              disabled={isPublishing}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer ${
                publishSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : hasUnsavedChanges
                  ? 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/40 ring-2 ring-[#38bdf8]/50 animate-pulse'
                  : 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/25'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{isAr ? 'جارِ الحفظ والنشر على السيرفر...' : 'Publishing to Server...'}</span>
                </>
              ) : publishSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{isAr ? 'تم حفظ ونشر الموقع بنجاح ✓' : 'Site Saved & Published Live ✓'}</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-white" />
                  <span>{isAr ? 'حفظ ونشر الموقع (Save Site)' : 'Save Site (Publish)'}</span>
                </>
              )}
            </button>

            {/* Quick jump to Section Editor */}
            <button
              onClick={() => onNavigate('sections')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold text-[#f1f2ed] border border-[#2b2b2b] transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#38bdf8]" />
              <span>{isAr ? 'تعديل أي قسم بالموقع' : 'Edit Any Site Section'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row: 2-Column on Mobile, 4-Column on Tablet & Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <div
          onClick={() => onNavigate('projects')}
          className="p-4 sm:p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#a8a6a1] truncate">{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#232323] text-[#38bdf8] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#f1f2ed] font-quicksand">{totalProjects}</p>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 text-[10px] sm:text-xs text-[#706e6a]">
            <span className="text-emerald-400 font-bold">{publishedProjects} {isAr ? 'نشط' : 'active'}</span>
            <span>•</span>
            <span>{hiddenProjects} {isAr ? 'مسودة' : 'draft'}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('videos')}
          className="p-4 sm:p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#a8a6a1] truncate">{isAr ? 'فيديوهات YouTube' : 'YouTube Videos'}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#232323] text-[#38bdf8] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#f1f2ed] font-quicksand">{totalVideos}</p>
          <p className="text-[10px] sm:text-xs text-[#706e6a] mt-2 font-mono truncate">4K Ultra HD Embeds</p>
        </div>

        <div
          onClick={() => onNavigate('media')}
          className="p-4 sm:p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#a8a6a1] truncate">{isAr ? 'لقطات المعرض' : 'Gallery Stills'}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#232323] text-[#38bdf8] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[#f1f2ed] font-quicksand">{totalGalleryImages}</p>
          <p className="text-[10px] sm:text-xs text-[#706e6a] mt-2 font-mono truncate">{isAr ? 'دعم الرفع المباشر' : 'Upload Ready'}</p>
        </div>

        <div
          onClick={() => onNavigate('seo')}
          className="p-4 sm:p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors cursor-pointer shadow-lg group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-mono uppercase text-[#a8a6a1] truncate">{isAr ? 'أرشفة Google & XML' : 'Sitemap & SEO'}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#232323] text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">sitemap.xml</p>
          <p className="text-[10px] sm:text-xs text-[#706e6a] mt-2 font-mono truncate">{isAr ? 'مزامنة تلقائية' : 'Live Auto-Sync'}</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE RESPONSIVE TWO-COLUMN GRID SYSTEM (Mobile: 1-col, Tablet: 2-col, Desktop: 2-col) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: Content & Productions Management */}
        {/* ========================================================= */}
        <div className="space-y-5 sm:space-y-6">
          {/* Card 1: Recent Projects & Quick Status Controller */}
          <div className="rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#2b2b2b] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'المشاريع والأعمال الحديثة' : 'Recent Works & Projects'}
                  </h2>
                  <p className="text-[11px] text-[#706e6a]">
                    {isAr ? 'تحكم سريع بالنشر والتمييز وتعديل التفاصيل' : 'Quick publish toggles and inline editing'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleOpenCreateProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold shadow-md shadow-[#2563eb]/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروع جديد' : 'New'}</span>
              </button>
            </div>

            {/* Quick Search Filter */}
            <div className="p-3 bg-[#1c1c1c] border-b border-[#2b2b2b]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#706e6a] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder={isAr ? 'بحث سريع بالعنوان أو العميل...' : 'Quick filter by title or client...'}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#141414] border border-[#2b2b2b] text-xs text-[#f1f2ed] placeholder-[#706e6a] focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Projects List */}
            <div className="divide-y divide-[#232323]">
              {recentProjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#706e6a]">
                  {isAr ? 'لا توجد مشاريع مطابقة للبحث' : 'No projects match your filter'}
                </div>
              ) : (
                recentProjects.map((project, idx) => (
                  <div
                    key={`${project.id || 'p'}-${idx}`}
                    className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#1f1f1f] transition-colors"
                  >
                    {/* Project Info & Thumbnail */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative w-16 h-11 sm:w-20 sm:h-12 rounded-lg overflow-hidden bg-[#232323] border border-[#2b2b2b] flex-shrink-0">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {project.videos && project.videos.length > 0 && (
                          <span className="absolute bottom-0.5 right-0.5 p-0.5 rounded bg-black/80 text-[#2563eb]">
                            <Video className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold text-[#f1f2ed] truncate font-quicksand">
                            {project.title}
                          </h3>
                          {project.featured && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#2563eb]/20 text-[#38bdf8] border border-[#2563eb]/30">
                              {isAr ? 'مميز' : 'Featured'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#706e6a] truncate mt-0.5">
                          <span className="text-[#a8a6a1] truncate">{project.category}</span>
                          <span>•</span>
                          <span className="truncate">{project.client || 'Client'}</span>
                          <span>•</span>
                          <span className="font-mono">{project.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick 1-Click Action Controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Publish / Unpublish toggle */}
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          project.published 
                            ? 'text-emerald-400 hover:bg-emerald-950/40' 
                            : 'text-[#706e6a] hover:bg-[#232323]'
                        }`}
                        title={project.published ? (isAr ? 'منشور (انقر للإخفاء)' : 'Published (click to hide)') : (isAr ? 'مخفي (انقر للنشر)' : 'Draft (click to publish)')}
                      >
                        {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Featured toggle */}
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          project.featured 
                            ? 'text-[#38bdf8] hover:bg-[#2563eb]/20' 
                            : 'text-[#706e6a] hover:bg-[#232323]'
                        }`}
                        title={project.featured ? (isAr ? 'مميز في الأعلى' : 'Featured') : (isAr ? 'تمييز في الأعلى' : 'Mark featured')}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      {/* Edit project modal */}
                      <button
                        onClick={() => handleOpenEditProject(project)}
                        className="p-2 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
                        title={isAr ? 'تعديل المشروع' : 'Edit project'}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Card Footer: Jump to full CRUD & Drag-and-Drop */}
            <div className="p-3 sm:p-4 bg-[#141414] border-t border-[#2b2b2b] flex items-center justify-between text-xs">
              <span className="text-[#706e6a] font-mono">
                {isAr ? `إجمالي ${totalProjects} عمل` : `Total ${totalProjects} works`}
              </span>
              <button
                onClick={() => onNavigate('projects')}
                className="text-[#2563eb] hover:text-[#38bdf8] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAr ? 'إدارة وسحب وترتيب كافة المشاريع' : 'Manage & reorder all projects'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Quick Category & Taxonomy Controller */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'التصنيفات والفئات' : 'Categories & Taxonomies'}
                  </h2>
                  <p className="text-[11px] text-[#706e6a]">
                    {isAr ? 'إضافة تصنيف جديد فوري وتوزيع الأعمال' : 'Quick add category & distribution'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('categories')}
                className="text-xs text-[#a8a6a1] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAr ? 'إدارة' : 'Manage'}</span>
                <ArrowUpRight className="w-3 h-3 text-[#2563eb]" />
              </button>
            </div>

            {categoryNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{categoryNotice}</span>
              </div>
            )}

            {/* Quick Add Form */}
            <form onSubmit={handleQuickAddCategory} className="flex gap-2">
              <input
                type="text"
                value={quickCategoryName}
                onChange={(e) => setQuickCategoryName(e.target.value)}
                placeholder={isAr ? 'اسم تصنيف جديد (مثال: أزياء وموضة)...' : 'New category name...'}
                className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] placeholder-[#706e6a] focus:outline-none focus:border-[#2563eb]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة' : 'Add'}</span>
              </button>
            </form>

            {/* Active Categories Pills with Project Counts */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const count = content.projects.filter((p) => p.category === cat).length;
                return (
                  <div
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#232323] border border-[#2b2b2b] text-xs text-[#a8a6a1]"
                  >
                    <span>{cat}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[#141414] text-[#38bdf8] border border-[#2563eb]/30">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Featured 4K Showreel Controller */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'فيديو العرض الترويجي (Showreel 4K)' : 'Main Showreel Video (4K)'}
                  </h2>
                  <p className="text-[11px] text-[#706e6a]">
                    {isAr ? 'رابط وفيديو العرض السينمائي في الواجهة' : 'Homepage hero showreel embed'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('videos')}
                className="text-xs text-[#a8a6a1] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAr ? 'كافة الفيديوهات' : 'All Videos'}</span>
                <ArrowUpRight className="w-3 h-3 text-[#2563eb]" />
              </button>
            </div>

            {videoNotice && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{videoNotice}</span>
              </div>
            )}

            {/* Video Thumbnail Preview & Input */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative w-full sm:w-36 aspect-video rounded-xl overflow-hidden bg-[#232323] border border-[#2b2b2b] flex-shrink-0">
                <img
                  src={getYouTubeThumbnailUrl(showreelDraftId, 'hq')}
                  alt="Showreel Thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[9px] font-mono bg-black/80 text-emerald-400">
                  4K
                </span>
              </div>

              <form onSubmit={handleSaveShowreelVideo} className="flex-1 w-full space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={showreelDraftId}
                    onChange={(e) => setShowreelDraftId(e.target.value)}
                    placeholder="YouTube Video ID (e.g. ScMzIvxBSi4)"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs font-mono text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isAr ? 'حفظ' : 'Save'}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#706e6a]">
                  <span>ID: <code className="text-[#a8a6a1] font-mono">{extractYouTubeId(showreelDraftId)}</code></span>
                  <a
                    href={`https://youtu.be/${extractYouTubeId(showreelDraftId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2563eb] hover:underline flex items-center gap-1"
                  >
                    <span>{isAr ? 'معاينة YouTube' : 'Preview'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: Sections, Media & Operations */}
        {/* ========================================================= */}
        <div className="space-y-5 sm:space-y-6">
          {/* Card 1: Universal Sections & Pipeline Control */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'أقسام الموقع ومسار الإنتاج' : 'Website Sections & Pipeline'}
                  </h2>
                  <p className="text-[11px] text-[#706e6a]">
                    {isAr ? 'تعديل نصوص وأيقونات ومراحل كافة الأقسام' : 'Direct shortcuts to customize each section'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('sections')}
                className="text-xs text-[#a8a6a1] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAr ? 'المحرر الشامل' : 'Full Editor'}</span>
                <ArrowUpRight className="w-3 h-3 text-[#2563eb]" />
              </button>
            </div>

            {/* Grid of Website Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sectionCards.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    onClick={() => onNavigate(sec.id === 'branding' ? 'settings' : 'sections')}
                    className="p-3 rounded-xl bg-[#232323] border border-[#2b2b2b] hover:border-[#2563eb]/40 transition-colors cursor-pointer group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-[#1a1a1a] flex-shrink-0">
                        <Icon className={`w-4 h-4 ${sec.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#f1f2ed] group-hover:text-white truncate">
                          {sec.name}
                        </h4>
                        <p className="text-[10px] text-[#706e6a] truncate font-mono">
                          {sec.meta}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-[#706e6a] group-hover:text-white flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Direct Desktop Media & Quick Upload */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#38bdf8] flex-shrink-0">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'الرفع المباشر والوسائط' : 'Desktop Media & Quick Upload'}
                  </h2>
                  <p className="text-[11px] text-[#706e6a]">
                    {isAr ? 'سحب وإفلات لقطات جديدة من سطح المكتب' : 'Drag & drop image files for instant use'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('media')}
                className="text-xs text-[#a8a6a1] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>{isAr ? 'مدير الوسائط' : 'Media Manager'}</span>
                <ArrowUpRight className="w-3 h-3 text-[#2563eb]" />
              </button>
            </div>

            {/* Quick Upload Dropzone */}
            <div className="relative border-2 border-dashed border-[#2b2b2b] hover:border-[#2563eb]/50 rounded-2xl p-4 text-center bg-[#1e1e1e] transition-colors group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileDrop}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title={isAr ? 'اختر صورة من جهازك' : 'Choose an image from device'}
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-[#282828] text-[#2563eb] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#f1f2ed]">
                  {isAr ? 'اسحب صورة هنا أو انقر للاختيار' : 'Drop photo here or click to browse'}
                </p>
                <p className="text-[10px] text-[#706e6a] font-mono">
                  PNG, JPG, WebP • Camera Roll / Desktop
                </p>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 font-mono text-center">{uploadError}</p>
            )}

            {/* Preview & Instant Action if uploaded */}
            {quickUploadPreview && (
              <div className="p-3 rounded-xl bg-[#232323] border border-[#2b2b2b] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-[#2b2b2b]">
                    <img src={quickUploadPreview} alt="Upload preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-400 font-mono">✓ Ready (Base64)</p>
                    <p className="text-[10px] text-[#706e6a] truncate">Use in projects or stills gallery</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={handleCopyUploadUrl}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[11px] text-[#f1f2ed] border border-[#333] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedDataUrl ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ' : 'Copy')}</span>
                  </button>

                  <button
                    onClick={handleAddUploadedToGallery}
                    className="px-2.5 py-1.5 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-[11px] text-white font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{addedToGalleryNotice ? (isAr ? 'أضيفت!' : 'Added!') : (isAr ? 'للمعرض' : 'To Gallery')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gallery Mini-Strip */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#706e6a] mb-2 font-mono">
                <span>{isAr ? 'أحدث لقطات المعرض السينمائي' : 'Recent Gallery Stills'}</span>
                <span>{(content.gallery || []).length} {isAr ? 'لقطة' : 'stills'}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(content.gallery || []).slice(0, 4).map((g) => (
                  <div key={g.id} className="aspect-square rounded-lg overflow-hidden bg-[#232323] border border-[#2b2b2b]">
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Supabase Authoritative Persistence Center */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#171717] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#f1f2ed] font-quicksand uppercase">
                    {isAr ? 'قاعدة بيانات Supabase المرجعية' : 'Supabase Production Database'}
                  </h2>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    {isAr ? 'المصدر المرجعي الوحيد • Realtime Stream' : 'Single Source of Truth • Realtime Active'}
                  </p>
                </div>
              </div>

              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="p-3 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#a8a6a1] leading-relaxed">
              {isAr
                ? 'جميع التعديلات تحفظ وتُنشر مباشرة في جدول site_content وتُبث فورياً لجميع المتصفحات والزوار حول العالم.'
                : 'All CMS edits publish directly to public.site_content in Supabase and broadcast live to all visitors in real-time.'}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportJson}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1f1f1f] hover:bg-[#2b2b2b] border border-[#2b2b2b] text-xs font-semibold text-[#f1f2ed] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{isAr ? 'تنزيل نسخة JSON' : 'Download JSON'}</span>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1f1f1f] hover:bg-[#2b2b2b] border border-[#2b2b2b] text-xs font-semibold text-[#f1f2ed] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'إعدادات القاعدة' : 'DB Diagnostics'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Project Editor Modal */}
      <ProjectEditorModal
        project={editingProject}
        isOpen={editorModalOpen}
        onClose={() => {
          setEditorModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveModalProject}
        onDelete={editingProject ? (id) => {
          deleteProject(id);
          showNotice(isAr ? 'تم حذف المشروع' : 'Project deleted');
        } : undefined}
      />
    </div>
  );
}
