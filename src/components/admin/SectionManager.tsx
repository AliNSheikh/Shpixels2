import React, { useState } from 'react';
import { 
  Sparkles, Workflow, Film, Sliders, Image, Type, Video, 
  Layers, Check, Plus, Trash2, Edit2, ArrowUp, ArrowDown, 
  Tag, Shield, ExternalLink, Save, Phone, Mail, Globe, MapPin, 
  Quote, RefreshCw, UploadCloud, Eye, Clock
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { IconPicker } from '../common/IconPicker';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';
import { WorkflowStep, ServiceItem, ClientLogo, StatItem } from '../../types/content';
import { extractYouTubeId } from '../../utils/youtube';

type SectionTab = 
  | 'pipeline'
  | 'services'
  | 'hero'
  | 'about'
  | 'branding'
  | 'portfolio-gallery'
  | 'contact-footer';

export function SectionManager() {
  const { 
    content, 
    updateContent, 
    categories,
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
    publishSite,
    isPublishing,
    publishSuccess: isGlobalPublishSuccess,
    hasUnsavedChanges,
    lastPublishedAt,
    publicationVersion
  } = useContent();

  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<SectionTab>('pipeline');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const notifySave = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  // ==========================================
  // 1. PIPELINE (WORKFLOW) STATE
  // ==========================================
  const [pipelineSectionMeta, setPipelineSectionMeta] = useState({
    badge: content.sectionHeaders?.workflow?.badge || 'THE PRODUCTION PIPELINE',
    title: content.sectionHeaders?.workflow?.title || 'HOW WE BRING IDEAS TO LIFE',
    description: content.sectionHeaders?.workflow?.description || 'A battle-tested production methodology ensuring razor-sharp timelines, uncompromising visual fidelity, and frictionless client collaboration.'
  });

  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [stepFormData, setStepFormData] = useState<WorkflowStep>({
    number: '01',
    title: '',
    description: '',
    icon: 'Workflow'
  });

  const [isAddingStep, setIsAddingStep] = useState(false);

  const handleSavePipelineMeta = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      sectionHeaders: {
        ...(content.sectionHeaders || {}),
        workflow: pipelineSectionMeta
      }
    });
    notifySave(isAr ? '✓ تم حفظ معلومات مسار الإنتاج!' : '✓ Pipeline section info saved!');
  };

  const handleStartAddStep = () => {
    const nextNum = (content.workflow?.length || 0) + 1;
    setStepFormData({
      number: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
      title: '',
      description: '',
      icon: 'Workflow'
    });
    setIsAddingStep(true);
    setEditingStepIndex(null);
  };

  const handleStartEditStep = (index: number) => {
    const step = content.workflow[index];
    if (step) {
      setStepFormData({ ...step });
      setEditingStepIndex(index);
      setIsAddingStep(false);
    }
  };

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepFormData.title.trim()) return;

    if (isAddingStep) {
      addWorkflowStep(stepFormData);
      setIsAddingStep(false);
      notifySave(isAr ? '✓ تمت إضافة مرحلة جديدة للإنتاج!' : '✓ Added new pipeline step!');
    } else if (editingStepIndex !== null) {
      updateWorkflowStep(editingStepIndex, stepFormData);
      setEditingStepIndex(null);
      notifySave(isAr ? '✓ تم تحديث مرحلة الإنتاج!' : '✓ Pipeline step updated!');
    }
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const steps = [...(content.workflow || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[index];
    steps[index] = steps[targetIdx];
    steps[targetIdx] = temp;
    updateWorkflow(steps);
    notifySave(isAr ? '✓ تم تغيير ترتيب المراحل' : '✓ Reordered steps');
  };

  // ==========================================
  // 2. SERVICES STATE
  // ==========================================
  const [servicesSectionMeta, setServicesSectionMeta] = useState({
    badge: content.sectionHeaders?.services?.badge || 'CREATIVE CAPABILITIES',
    title: content.sectionHeaders?.services?.title || 'SPECIALIZED SERVICES',
    description: content.sectionHeaders?.services?.description || 'From script concept and 4K cinema shooting to neural AI visual synthesis and broadcast-grade DaVinci Resolve color grading.'
  });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [serviceFormData, setServiceFormData] = useState<ServiceItem>({
    id: `srv-${Date.now()}`,
    title: '',
    subtitle: '',
    description: '',
    category: categories[0] || 'Commercial',
    icon: 'Film',
    features: []
  });
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleSaveServicesMeta = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      sectionHeaders: {
        ...(content.sectionHeaders || {}),
        services: servicesSectionMeta
      }
    });
    notifySave(isAr ? '✓ تم حفظ معلومات قسم الخدمات!' : '✓ Services section info saved!');
  };

  const handleStartAddService = () => {
    setServiceFormData({
      id: `srv-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      category: categories[0] || 'Commercial',
      icon: 'Film',
      features: ['High-end production', 'Multi-platform master delivery']
    });
    setIsAddingService(true);
    setEditingServiceId(null);
  };

  const handleStartEditService = (service: ServiceItem) => {
    setServiceFormData({ ...service, features: service.features ? [...service.features] : [] });
    setEditingServiceId(service.id);
    setIsAddingService(false);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceFormData.title.trim()) return;

    if (isAddingService) {
      addService(serviceFormData);
      setIsAddingService(false);
      notifySave(isAr ? '✓ تمت إضافة الخدمة بنجاح!' : '✓ New service added!');
    } else {
      updateService(serviceFormData);
      setEditingServiceId(null);
      notifySave(isAr ? '✓ تم تحديث تفاصيل الخدمة!' : '✓ Service updated!');
    }
  };

  const handleAddFeatureToService = () => {
    if (!newFeatureText.trim()) return;
    setServiceFormData({
      ...serviceFormData,
      features: [...(serviceFormData.features || []), newFeatureText.trim()]
    });
    setNewFeatureText('');
  };

  const handleRemoveFeatureFromService = (idx: number) => {
    setServiceFormData({
      ...serviceFormData,
      features: serviceFormData.features.filter((_, i) => i !== idx)
    });
  };

  // ==========================================
  // 3. HERO & SHOWREEL STATE
  // ==========================================
  const [heroForm, setHeroForm] = useState({
    badgeText: content.hero.badgeText || '',
    title: content.hero.title || '',
    subtitle: content.hero.subtitle || '',
    primaryCtaText: content.hero.primaryCtaText || '',
    primaryCtaLink: content.hero.primaryCtaLink || '',
    secondaryCtaText: content.hero.secondaryCtaText || '',
    secondaryCtaLink: content.hero.secondaryCtaLink || '',
    bgImageUrl: content.hero.bgImageUrl || '',
    featuredVideoId: content.hero.featuredVideoId || 'ScMzIvxBSi4',
    marqueeItemsText: (content.hero.marqueeItems || []).join(' • ')
  });

  const [showreelSectionMeta, setShowreelSectionMeta] = useState({
    badge: content.sectionHeaders?.showreel?.badge || 'DIRECTOR SHOWCASE',
    title: content.sectionHeaders?.showreel?.title || 'THE 2026 VISUAL REEL',
    description: content.sectionHeaders?.showreel?.description || 'A fast-cut synthesis of commercial advertising, licensed drone aerials, sensitive healthcare portraits, and generative AI motion aesthetics.'
  });

  const handleSaveHeroAndShowreel = (e: React.FormEvent) => {
    e.preventDefault();
    const marqueeArr = heroForm.marqueeItemsText
      .split('•')
      .map((s) => s.trim())
      .filter(Boolean);

    const videoIdExtracted = extractYouTubeId(heroForm.featuredVideoId) || heroForm.featuredVideoId;

    updateContent({
      hero: {
        ...content.hero,
        badgeText: heroForm.badgeText,
        title: heroForm.title,
        subtitle: heroForm.subtitle,
        primaryCtaText: heroForm.primaryCtaText,
        primaryCtaLink: heroForm.primaryCtaLink,
        secondaryCtaText: heroForm.secondaryCtaText,
        secondaryCtaLink: heroForm.secondaryCtaLink,
        bgImageUrl: heroForm.bgImageUrl,
        featuredVideoId: videoIdExtracted,
        marqueeItems: marqueeArr.length > 0 ? marqueeArr : content.hero.marqueeItems
      },
      sectionHeaders: {
        ...(content.sectionHeaders || {}),
        showreel: showreelSectionMeta
      }
    });

    notifySave(isAr ? '✓ تم حفظ قسم الواجهة والعرض الترويجي!' : '✓ Hero & Showreel saved successfully!');
  };

  // ==========================================
  // 4. ABOUT SECTION STATE
  // ==========================================
  const [aboutForm, setAboutForm] = useState({
    badge: content.about.badge || '',
    heading: content.about.heading || '',
    highlightText: content.about.highlightText || '',
    bioText: (content.about.bioParagraphs || []).join('\n\n'),
    profileImage: content.about.profileImage || '',
    experienceYears: content.about.experienceYears || 7,
    skillsText: (content.about.skills || []).join(', '),
    toolsText: (content.about.tools || []).join(', ')
  });

  const [aboutStats, setAboutStats] = useState<StatItem[]>(
    content.about.stats ? [...content.about.stats] : []
  );

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    const paragraphs = aboutForm.bioText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const skillsArr = aboutForm.skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const toolsArr = aboutForm.toolsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    updateContent({
      about: {
        ...content.about,
        badge: aboutForm.badge,
        heading: aboutForm.heading,
        highlightText: aboutForm.highlightText,
        bioParagraphs: paragraphs,
        profileImage: aboutForm.profileImage,
        experienceYears: Number(aboutForm.experienceYears) || 7,
        skills: skillsArr,
        tools: toolsArr,
        stats: aboutStats
      }
    });

    notifySave(isAr ? '✓ تم حفظ قسم "عن المخرج" والإحصائيات!' : '✓ About Director section saved!');
  };

  // ==========================================
  // 5. BRANDING & CLIENT LOGOS STATE
  // ==========================================
  const [brandForm, setBrandForm] = useState({
    logoText: content.branding.logoText || 'SHPIXELS',
    logoSubtext: content.branding.logoSubtext || 'FILMMAKER & CREATIVE STUDIO',
    logoImage: content.branding.logoImage || '',
    accentColor: content.branding.accentColor || '#2563eb',
    favicon: content.seo.favicon || '/favicon.ico'
  });

  const [newClientName, setNewClientName] = useState('');
  const [newClientLogoUrl, setNewClientLogoUrl] = useState('');

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      branding: {
        ...content.branding,
        logoText: brandForm.logoText,
        logoSubtext: brandForm.logoSubtext,
        logoImage: brandForm.logoImage,
        accentColor: brandForm.accentColor
      },
      seo: {
        ...content.seo,
        favicon: brandForm.favicon
      }
    });
    notifySave(isAr ? '✓ تم حفظ الهوية البصرية والشعارات!' : '✓ Brand identity and logos saved!');
  };

  const handleAddClientLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientLogoUrl.trim()) return;
    addClientLogo({
      id: `cl-${Date.now()}`,
      name: newClientName.trim(),
      logoUrl: newClientLogoUrl.trim()
    });
    setNewClientName('');
    setNewClientLogoUrl('');
    notifySave(isAr ? '✓ تم إضافة شعار الشريك/العميل!' : '✓ Added client partner logo!');
  };

  // ==========================================
  // 6. PORTFOLIO & GALLERY META STATE
  // ==========================================
  const [portfolioMeta, setPortfolioMeta] = useState({
    badge: content.sectionHeaders?.portfolio?.badge || 'FEATURED PRODUCTIONS',
    title: content.sectionHeaders?.portfolio?.title || 'CURATED COMMERCIAL & NARRATIVE WORKS',
    description: content.sectionHeaders?.portfolio?.description || 'A comprehensive showcase of directed commercial films, wedding highlights, athletic visuals, and motion experiments.'
  });

  const [galleryMeta, setGalleryMeta] = useState({
    badge: content.sectionHeaders?.gallery?.badge || 'BEHIND THE SCENES & PRODUCTION STILLS',
    title: content.sectionHeaders?.gallery?.title || 'CINEMATIC STILLS & SET ARCHIVE',
    description: content.sectionHeaders?.gallery?.description || 'Lighting setups, high-precision camera rigs, candid moments, and visual experiments captured on location across Syria and beyond.'
  });

  const handleSavePortfolioGalleryMeta = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      sectionHeaders: {
        ...(content.sectionHeaders || {}),
        portfolio: portfolioMeta,
        gallery: galleryMeta
      }
    });
    notifySave(isAr ? '✓ تم حفظ نصوص ومقدمات المعرض والأعمال!' : '✓ Portfolio & Gallery headers saved!');
  };

  // ==========================================
  // 7. CONTACT & FOOTER STATE
  // ==========================================
  const [contactForm, setContactForm] = useState({
    ctaHeading: content.contact.ctaHeading || '',
    ctaSubtitle: content.contact.ctaSubtitle || '',
    email: content.contact.email || '',
    phone: content.contact.phone || '',
    whatsapp: content.contact.whatsapp || '',
    location: content.contact.location || '',
    responseTimeNote: content.contact.responseTimeNote || '',
    instagram: content.contact.instagram || '',
    youtube: content.contact.youtube || '',
    tiktok: content.contact.tiktok || '',
    linkedin: content.contact.linkedin || '',
    behance: content.contact.behance || ''
  });

  const [footerForm, setFooterForm] = useState({
    copyrightText: content.footer.copyrightText || '',
    quote: content.footer.quote || '',
    disclaimer: content.footer.disclaimer || ''
  });

  const handleSaveContactFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      contact: {
        ...content.contact,
        ...contactForm
      },
      footer: {
        ...content.footer,
        ...footerForm
      }
    });
    notifySave(isAr ? '✓ تم حفظ معلومات التواصل والتذييل!' : '✓ Contact and footer info saved!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification */}
      {saveSuccess && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2b2b2b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center text-[#3b82f6] flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#f1f2ed] uppercase tracking-wide font-quicksand">
              {isAr ? 'محرر كافة أقسام الموقع والمحتوى' : 'Universal Website Section Editor'}
            </h2>
            <p className="text-xs text-[#a8a6a1]">
              {isAr
                ? 'تعديل كافة نصوص الموقع، العناوين، الصور، الشعارات، ومسار العمل مع المزامنة الحية لجميع الزوار.'
                : 'Directly modify text, headings, imagery, logos, icons, section info, and pipeline with real-time server sync.'}
            </p>
          </div>
        </div>

        {/* Global Save Site Button & Last Publication Record */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-[11px] font-mono text-[#a8a6a1]">
            <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{isAr ? 'آخر نشر:' : 'Published:'}</span>
            <span className="text-[#f1f2ed] font-semibold">
              {lastPublishedAt 
                ? new Date(lastPublishedAt).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
                : (isAr ? 'غير مسجل' : 'N/A')}
            </span>
          </div>

          <button
            onClick={() => publishSite()}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isGlobalPublishSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : hasUnsavedChanges
                ? 'bg-[#2563eb] hover:bg-[#3b82f6] text-white ring-2 ring-[#38bdf8]/50 shadow-[#2563eb]/30 animate-pulse'
                : 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/20'
            }`}
          >
            {isPublishing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>{isAr ? 'جارِ النشر على السيرفر...' : 'Publishing to Server...'}</span>
              </>
            ) : isGlobalPublishSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'تم النشر بنجاح ✓' : 'Site Published ✓'}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'حفظ ونشر الموقع' : 'Save Site'}</span>
                {hasUnsavedChanges && <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#2b2b2b] no-scrollbar">
        {[
          { id: 'pipeline', label: isAr ? 'مسار الإنتاج (Pipeline)' : 'Pipeline & Workflow', icon: Workflow },
          { id: 'services', label: isAr ? 'الخدمات والأيقونات' : 'Services & Icons', icon: Sliders },
          { id: 'hero', label: isAr ? 'الواجهة والعرض الترويجي' : 'Hero & Showreel', icon: Film },
          { id: 'about', label: isAr ? 'عن المخرج والصور' : 'About Director', icon: Sparkles },
          { id: 'branding', label: isAr ? 'شعارات الشركاء والعملاء' : 'Client & Partner Logos', icon: Shield },
          { id: 'portfolio-gallery', label: isAr ? 'معلومات المعرض والأعمال' : 'Work & Gallery Info', icon: Type },
          { id: 'contact-footer', label: isAr ? 'التواصل والتذييل' : 'Contact & Footer', icon: Phone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SectionTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20 font-bold'
                  : 'bg-[#1d1d1d] hover:bg-[#232323] text-[#a8a6a1] hover:text-[#f1f2ed] border border-[#2b2b2b]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. PIPELINE (WORKFLOW) TAB                                                */}
      {/* ========================================================================= */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Section Info Card */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? 'معلومات وعنوان قسم مسار الإنتاج' : 'Pipeline Section Header'}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSavePipelineMeta} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                    {isAr ? 'شارة القسم العلوية (Badge)' : 'Section Badge Text'}
                  </label>
                  <input
                    type="text"
                    value={pipelineSectionMeta.badge}
                    onChange={(e) => setPipelineSectionMeta({ ...pipelineSectionMeta, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                    {isAr ? 'العنوان الرئيسي' : 'Main Section Headline'}
                  </label>
                  <input
                    type="text"
                    value={pipelineSectionMeta.title}
                    onChange={(e) => setPipelineSectionMeta({ ...pipelineSectionMeta, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'الوصف التوضيحي' : 'Section Description'}
                </label>
                <textarea
                  rows={2}
                  value={pipelineSectionMeta.description}
                  onChange={(e) => setPipelineSectionMeta({ ...pipelineSectionMeta, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] border border-[#333] hover:border-[#2563eb] text-xs font-bold text-[#f1f2ed] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>{isAr ? 'حفظ نصوص القسم' : 'Save Header Info'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Workflow Steps List */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? `خطوات مسار الإنتاج (${content.workflow?.length || 0})` : `Workflow Steps (${content.workflow?.length || 0})`}
                </h3>
              </div>

              {!isAddingStep && editingStepIndex === null && (
                <button
                  onClick={handleStartAddStep}
                  className="px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة خطوة جديدة' : 'Add Step'}</span>
                </button>
              )}
            </div>

            {/* Step Add/Edit Modal/Form */}
            {(isAddingStep || editingStepIndex !== null) && (
              <form onSubmit={handleSaveStep} className="p-4 rounded-xl bg-[#232323] border border-[#2563eb]/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#2b2b2b]">
                  <h4 className="text-xs font-bold text-[#f1f2ed] uppercase font-mono">
                    {isAddingStep 
                      ? (isAr ? 'إضافة خطوة إنتاج جديدة' : 'Add New Production Step') 
                      : (isAr ? `تعديل الخطوة: ${stepFormData.title}` : `Edit Step: ${stepFormData.title}`)}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingStep(false);
                      setEditingStepIndex(null);
                    }}
                    className="text-[#a8a6a1] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                      {isAr ? 'رقم الخطوة (01, 02..)' : 'Step Number (01, 02..)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={stepFormData.number}
                      onChange={(e) => setStepFormData({ ...stepFormData, number: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                      {isAr ? 'عنوان الخطوة' : 'Step Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={stepFormData.title}
                      onChange={(e) => setStepFormData({ ...stepFormData, title: e.target.value })}
                      placeholder="e.g. Concept & Narrative Blueprint"
                      className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                    {isAr ? 'شرح تفاصيل الخطوة' : 'Step Description'}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={stepFormData.description}
                    onChange={(e) => setStepFormData({ ...stepFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
                  />
                </div>

                <div className="max-w-xs">
                  <IconPicker
                    label={isAr ? 'أيقونة الخطوة' : 'Step Icon'}
                    value={stepFormData.icon || 'Workflow'}
                    onChange={(iconName) => setStepFormData({ ...stepFormData, icon: iconName })}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2b2b2b]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingStep(false);
                      setEditingStepIndex(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1d1d1d] hover:bg-[#2b2b2b] text-xs text-[#a8a6a1]"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold"
                  >
                    {isAr ? 'حفظ الخطوة' : 'Save Step'}
                  </button>
                </div>
              </form>
            )}

            {/* List of steps */}
            <div className="space-y-3">
              {(content.workflow || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#232323] border border-[#2b2b2b] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl font-black text-[#2563eb] font-mono w-8">
                      {step.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#f1f2ed] font-quicksand">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#a8a6a1] mt-0.5 line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={() => handleMoveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-[#1d1d1d] hover:bg-[#2b2b2b] disabled:opacity-30 text-[#a8a6a1]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveStep(idx, 'down')}
                      disabled={idx === (content.workflow?.length || 0) - 1}
                      className="p-1.5 rounded-lg bg-[#1d1d1d] hover:bg-[#2b2b2b] disabled:opacity-30 text-[#a8a6a1]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEditStep(idx)}
                      className="p-2 rounded-lg bg-[#1d1d1d] hover:bg-[#2b2b2b] text-[#f1f2ed]"
                      title="Edit Step"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteWorkflowStep(idx)}
                      className="p-2 rounded-lg bg-[#1d1d1d] hover:bg-red-950/40 text-red-400"
                      title="Delete Step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SERVICES TAB                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Services Section Header Info */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? 'معلومات وعنوان قسم الخدمات' : 'Services Section Header'}
                </h3>
              </div>
            </div>

            <form onSubmit={handleSaveServicesMeta} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                    {isAr ? 'شارة القسم' : 'Badge'}
                  </label>
                  <input
                    type="text"
                    value={servicesSectionMeta.badge}
                    onChange={(e) => setServicesSectionMeta({ ...servicesSectionMeta, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                    {isAr ? 'العنوان الرئيسي' : 'Headline'}
                  </label>
                  <input
                    type="text"
                    value={servicesSectionMeta.title}
                    onChange={(e) => setServicesSectionMeta({ ...servicesSectionMeta, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={servicesSectionMeta.description}
                  onChange={(e) => setServicesSectionMeta({ ...servicesSectionMeta, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] border border-[#333] hover:border-[#2563eb] text-xs font-bold text-[#f1f2ed] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 text-[#2563eb]" />
                  <span>{isAr ? 'حفظ نصوص القسم' : 'Save Header Info'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Services List & CRUD */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? `قائمة الخدمات المعروضة (${content.services?.length || 0})` : `Services List (${content.services?.length || 0})`}
                </h3>
              </div>

              {!isAddingService && editingServiceId === null && (
                <button
                  onClick={handleStartAddService}
                  className="px-3 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة خدمة جديدة' : 'Add Service'}</span>
                </button>
              )}
            </div>

            {/* Service Form */}
            {(isAddingService || editingServiceId !== null) && (
              <form onSubmit={handleSaveService} className="p-4 rounded-xl bg-[#232323] border border-[#2563eb]/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#2b2b2b]">
                  <h4 className="text-xs font-bold text-[#f1f2ed] uppercase font-mono">
                    {isAddingService ? (isAr ? 'إضافة خدمة جديدة' : 'Add New Service') : (isAr ? 'تعديل الخدمة' : 'Edit Service')}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingService(false);
                      setEditingServiceId(null);
                    }}
                    className="text-[#a8a6a1] hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                      {isAr ? 'عنوان الخدمة' : 'Service Title'}
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceFormData.title}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, title: e.target.value })}
                      placeholder="e.g. Commercial & Brand Ads"
                      className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                      {isAr ? 'العنوان الفرعي' : 'Subtitle'}
                    </label>
                    <input
                      type="text"
                      value={serviceFormData.subtitle}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, subtitle: e.target.value })}
                      placeholder="e.g. High-conversion cinematic campaigns"
                      className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                      {isAr ? 'التصنيف المرتبط' : 'Category'}
                    </label>
                    <select
                      value={serviceFormData.category}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <IconPicker
                      label={isAr ? 'أيقونة الخدمة' : 'Service Icon'}
                      value={serviceFormData.icon}
                      onChange={(iconName) => setServiceFormData({ ...serviceFormData, icon: iconName })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                    {isAr ? 'الوصف الكامل للخدمة' : 'Description'}
                  </label>
                  <textarea
                    rows={3}
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
                  />
                </div>

                {/* Features bullet points */}
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
                    {isAr ? 'مزايا ونقاط الخدمة (Features)' : 'Features / Bullet Points'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="e.g. 4K Cinema Line Shooting"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureToService}
                      className="px-3 py-1.5 rounded-xl bg-[#1d1d1d] hover:bg-[#2b2b2b] text-xs font-bold text-[#f1f2ed] border border-[#333]"
                    >
                      {isAr ? 'إضافة نقطة' : 'Add'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(serviceFormData.features || []).map((feat, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1d1d1d] text-xs text-[#a8a6a1] border border-[#2b2b2b]">
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureFromService(i)}
                          className="hover:text-red-400"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2b2b2b]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingService(false);
                      setEditingServiceId(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#1d1d1d] hover:bg-[#2b2b2b] text-xs text-[#a8a6a1]"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold"
                  >
                    {isAr ? 'حفظ الخدمة' : 'Save Service'}
                  </button>
                </div>
              </form>
            )}

            {/* List of services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(content.services || []).map((service) => (
                <div
                  key={service.id}
                  className="p-4 rounded-xl bg-[#232323] border border-[#2b2b2b] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase bg-[#1d1d1d] text-[#3b82f6] px-2 py-0.5 rounded border border-[#2b2b2b]">
                        {service.category}
                      </span>
                      <span className="text-xs font-mono text-[#706e6a]">
                        Icon: {service.icon}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#f1f2ed] font-quicksand">
                      {service.title}
                    </h4>
                    <p className="text-xs text-[#3b82f6] font-medium mt-0.5">
                      {service.subtitle}
                    </p>
                    <p className="text-xs text-[#a8a6a1] mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-[#2b2b2b]">
                    <button
                      onClick={() => handleStartEditService(service)}
                      className="p-1.5 rounded-lg bg-[#1d1d1d] hover:bg-[#2b2b2b] text-[#f1f2ed]"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-1.5 rounded-lg bg-[#1d1d1d] hover:bg-red-950/40 text-red-400"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO & SHOWREEL TAB                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHeroAndShowreel} className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Film className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'نصوص الواجهة الرئيسية (Hero Section)' : 'Hero Section Copy & Imagery'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'شارة الواجهة (Badge)' : 'Hero Badge'}
                </label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'العنوان الرئيسي للواجهة' : 'Main Headline'}
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الوصف الترحيبي' : 'Hero Subtitle'}
              </label>
              <textarea
                rows={2}
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
              />
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'نص الزر الرئيسي' : 'Primary CTA Text'}
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'رابط الزر الرئيسي' : 'Primary CTA Link'}
                </label>
                <input
                  type="text"
                  value={heroForm.primaryCtaLink}
                  onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'نص الزر الثانوي' : 'Secondary CTA Text'}
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaText}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'رابط الزر الثانوي' : 'Secondary CTA Link'}
                </label>
                <input
                  type="text"
                  value={heroForm.secondaryCtaLink}
                  onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLink: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            {/* Marquee Ticker */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'عناصر الشريط المتحرك (افصل بينها برمز •)' : 'Marquee Ticker (Separate with • symbol)'}
              </label>
              <input
                type="text"
                value={heroForm.marqueeItemsText}
                onChange={(e) => setHeroForm({ ...heroForm, marqueeItemsText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>

            {/* Background Image Upload & Preview */}
            <div className="space-y-2 pt-2 border-t border-[#232323]">
              <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
                {isAr ? 'صورة خلفية الواجهة (Hero Background)' : 'Hero Background Image'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <ImageUploadDropzone
                    value={heroForm.bgImageUrl}
                    onChange={(url: string) => setHeroForm({ ...heroForm, bgImageUrl: url })}
                    label={isAr ? 'رفع صورة من الجهاز للخلفية' : 'Upload background image directly'}
                  />
                  <input
                    type="url"
                    value={heroForm.bgImageUrl}
                    onChange={(e) => setHeroForm({ ...heroForm, bgImageUrl: e.target.value })}
                    placeholder="Or enter direct image URL..."
                    className="w-full mt-2 px-3 py-1.5 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none"
                  />
                </div>
                {heroForm.bgImageUrl && (
                  <div className="relative rounded-xl overflow-hidden border border-[#2b2b2b] h-28 bg-black">
                    <img
                      src={heroForm.bgImageUrl}
                      alt="Hero BG Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Showreel Settings Card */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Video className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'العرض الترويجي الشامل (Showreel 2026)' : 'Director Showreel Video & Specs'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'شارة العرض الترويجي' : 'Showreel Badge'}
                </label>
                <input
                  type="text"
                  value={showreelSectionMeta.badge}
                  onChange={(e) => setShowreelSectionMeta({ ...showreelSectionMeta, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'عنوان العرض الترويجي' : 'Showreel Title'}
                </label>
                <input
                  type="text"
                  value={showreelSectionMeta.title}
                  onChange={(e) => setShowreelSectionMeta({ ...showreelSectionMeta, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'معرف أو رابط يوتيوب للعرض' : 'YouTube Video ID or Full URL'}
              </label>
              <input
                type="text"
                value={heroForm.featuredVideoId}
                onChange={(e) => setHeroForm({ ...heroForm, featuredVideoId: e.target.value })}
                placeholder="e.g. ScMzIvxBSi4 or https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2563eb]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ الواجهة والعرض الترويجي' : 'Save Hero & Showreel'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. ABOUT TAB                                                              */}
      {/* ========================================================================= */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Sparkles className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'الملف التعريفي للمخرج (Mo Abdallah)' : 'Director Profile & Biography'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'شارة القسم' : 'Badge'}
                </label>
                <input
                  type="text"
                  value={aboutForm.badge}
                  onChange={(e) => setAboutForm({ ...aboutForm, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'سنوات الخبرة' : 'Experience Years'}
                </label>
                <input
                  type="number"
                  value={aboutForm.experienceYears}
                  onChange={(e) => setAboutForm({ ...aboutForm, experienceYears: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'العنوان الرئيسي' : 'Heading'}
                </label>
                <input
                  type="text"
                  value={aboutForm.heading}
                  onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'النص البارز / المسمى' : 'Highlight / Role Subtitle'}
                </label>
                <input
                  type="text"
                  value={aboutForm.highlightText}
                  onChange={(e) => setAboutForm({ ...aboutForm, highlightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الفقرات السيرة الذاتية (افصل بين الفقرات بسطرين فارغين)' : 'Bio Paragraphs (Separate with double newlines)'}
              </label>
              <textarea
                rows={4}
                value={aboutForm.bioText}
                onChange={(e) => setAboutForm({ ...aboutForm, bioText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>

            {/* Profile Image Direct Desktop Upload & URL */}
            <div className="space-y-2 pt-2 border-t border-[#232323]">
              <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
                {isAr ? 'صورة المخرج الشخصية' : 'Director Portrait Image'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <ImageUploadDropzone
                    value={aboutForm.profileImage}
                    onChange={(url: string) => setAboutForm({ ...aboutForm, profileImage: url })}
                    label={isAr ? 'رفع صورة شخصية مباشرة من الحاسوب' : 'Upload director portrait from computer'}
                  />
                  <input
                    type="url"
                    value={aboutForm.profileImage}
                    onChange={(e) => setAboutForm({ ...aboutForm, profileImage: e.target.value })}
                    placeholder="Or enter direct image URL..."
                    className="w-full mt-2 px-3 py-1.5 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none"
                  />
                </div>
                {aboutForm.profileImage && (
                  <div className="relative rounded-xl overflow-hidden border border-[#2b2b2b] w-28 h-28 bg-black">
                    <img
                      src={aboutForm.profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#232323]">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'المهارات والتقنيات (مفصولة بفواصل)' : 'Skills (Comma-separated)'}
                </label>
                <input
                  type="text"
                  value={aboutForm.skillsText}
                  onChange={(e) => setAboutForm({ ...aboutForm, skillsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'العتاد والبرمجيات (مفصولة بفواصل)' : 'Tools & Equipment (Comma-separated)'}
                </label>
                <input
                  type="text"
                  value={aboutForm.toolsText}
                  onChange={(e) => setAboutForm({ ...aboutForm, toolsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            {/* Stats Editor */}
            <div className="space-y-3 pt-2 border-t border-[#232323]">
              <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
                {isAr ? 'أرقام وإحصائيات الخبرة (Stats Counters)' : 'Experience Stats Counters'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {aboutStats.map((stat, i) => (
                  <div key={stat.id || i} className="p-3 rounded-xl bg-[#232323] border border-[#2b2b2b] space-y-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#706e6a]">Value:</span>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...aboutStats];
                          updated[i] = { ...updated[i], value: e.target.value };
                          setAboutStats(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#706e6a]">Label:</span>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...aboutStats];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setAboutStats(updated);
                        }}
                        className="w-full px-2 py-1 rounded bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2563eb]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ قسم المخرج' : 'Save About Section'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 5. BRANDING & CLIENT LOGOS TAB                                            */}
      {/* ========================================================================= */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Consolidated Logo Notice Card */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563eb]/20 text-[#38bdf8] flex items-center justify-center border border-[#2563eb]/30 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#f1f2ed] font-quicksand">
                  {isAr ? 'تم توحيد إدارة شعار الموقع في مكان واحد' : 'Website Logo Consolidated in Site Settings'}
                </h4>
                <p className="text-xs text-[#a8a6a1]">
                  {isAr 
                    ? 'تم نقل إدارة شعار الموقع، نص العلامة، وأيقونة المتصفح بالكامل إلى تبويب "الشعار والهوية والإعدادات" لمنع التشتت وتكرار الحقول.' 
                    : 'All website logo uploads, brand taglines, and favicon controls are now exclusively managed in the "Logo, Brand & Settings" tab.'}
                </p>
              </div>
            </div>
          </div>

          {/* Client / Partner Brand Logos Section */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2563eb]" />
                <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? `شعارات العملاء والشركاء الموثوقين (${content.clientLogos?.length || 0})` : `Client & Partner Logos (${content.clientLogos?.length || 0})`}
                </h3>
              </div>
            </div>

            {/* Add client logo form */}
            <form onSubmit={handleAddClientLogo} className="p-4 rounded-xl bg-[#232323] border border-[#2b2b2b] space-y-3">
              <h4 className="text-xs font-mono uppercase text-[#a8a6a1]">
                {isAr ? 'إضافة شعار عميل أو شريك جديد' : 'Add New Client / Partner Logo'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'اسم العميل أو العلامة (مثال: Sony Cinema)' : 'e.g. Sony Cinema, Red Bull, DJI'}
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    required
                    placeholder="Logo image URL or upload below..."
                    value={newClientLogoUrl}
                    onChange={(e) => setNewClientLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <ImageUploadDropzone
                    value={newClientLogoUrl}
                    onChange={(url: string) => setNewClientLogoUrl(url)}
                    label={isAr ? 'أو اختر صورة من الجهاز' : 'Or upload logo directly from PC'}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold flex items-center gap-1.5 self-end sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إضافة الشعار' : 'Add Logo'}</span>
                </button>
              </div>
            </form>

            {/* Client logos display */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(content.clientLogos || []).map((client) => (
                <div
                  key={client.id}
                  className="p-3 rounded-xl bg-[#232323] border border-[#2b2b2b] flex flex-col items-center justify-between gap-2"
                >
                  <div className="w-full h-16 rounded-lg bg-[#171717] p-2 flex items-center justify-center">
                    <img
                      src={client.logoUrl}
                      alt={client.name}
                      className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                  <div className="w-full flex items-center justify-between text-xs pt-1 border-t border-[#2b2b2b]">
                    <span className="font-semibold text-[#f1f2ed] truncate text-[11px]">
                      {client.name}
                    </span>
                    <button
                      onClick={() => deleteClientLogo(client.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. PORTFOLIO & GALLERY INFO TAB                                           */}
      {/* ========================================================================= */}
      {activeTab === 'portfolio-gallery' && (
        <form onSubmit={handleSavePortfolioGalleryMeta} className="space-y-6">
          {/* Portfolio Section Meta */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Film className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'معلومات وعنوان قسم الأعمال (Portfolio Section)' : 'Portfolio Section Header Info'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'شارة القسم' : 'Badge'}
                </label>
                <input
                  type="text"
                  value={portfolioMeta.badge}
                  onChange={(e) => setPortfolioMeta({ ...portfolioMeta, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'العنوان الرئيسي' : 'Headline'}
                </label>
                <input
                  type="text"
                  value={portfolioMeta.title}
                  onChange={(e) => setPortfolioMeta({ ...portfolioMeta, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الوصف التوضيحي' : 'Description'}
              </label>
              <textarea
                rows={2}
                value={portfolioMeta.description}
                onChange={(e) => setPortfolioMeta({ ...portfolioMeta, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Gallery Section Meta */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Image className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'معلومات وعنوان معرض الكواليس (Gallery Section)' : 'Behind The Scenes & Gallery Header Info'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'شارة المعرض' : 'Badge'}
                </label>
                <input
                  type="text"
                  value={galleryMeta.badge}
                  onChange={(e) => setGalleryMeta({ ...galleryMeta, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'عنوان المعرض' : 'Headline'}
                </label>
                <input
                  type="text"
                  value={galleryMeta.title}
                  onChange={(e) => setGalleryMeta({ ...galleryMeta, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الوصف' : 'Description'}
              </label>
              <textarea
                rows={2}
                value={galleryMeta.description}
                onChange={(e) => setGalleryMeta({ ...galleryMeta, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2563eb]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ نصوص الأقسام' : 'Save Header Info'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 7. CONTACT & FOOTER TAB                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'contact-footer' && (
        <form onSubmit={handleSaveContactFooter} className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Phone className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'معلومات التواصل المباشر (Contact Details)' : 'Direct Contact & Inquiries'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'عنوان الدعوة للتواصل (Heading)' : 'CTA Heading'}
                </label>
                <input
                  type="text"
                  value={contactForm.ctaHeading}
                  onChange={(e) => setContactForm({ ...contactForm, ctaHeading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'مدة الاستجابة المتوقعة' : 'Response Time Note'}
                </label>
                <input
                  type="text"
                  value={contactForm.responseTimeNote}
                  onChange={(e) => setContactForm({ ...contactForm, responseTimeNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'النص التوضيحي للتواصل' : 'CTA Subtitle'}
              </label>
              <textarea
                rows={2}
                value={contactForm.ctaSubtitle}
                onChange={(e) => setContactForm({ ...contactForm, ctaSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'رقم الهاتف' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'رابط واتساب المباشر' : 'WhatsApp Link'}
                </label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الموقع الجغرافي / التوفر' : 'Studio Location & Availability'}
              </label>
              <input
                type="text"
                value={contactForm.location}
                onChange={(e) => setContactForm({ ...contactForm, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Card */}
          <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#232323]">
              <Quote className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {isAr ? 'تذييل الموقع والاقتباس (Footer & Quotation)' : 'Footer & Legal Disclaimers'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'حقوق النشر' : 'Copyright Text'}
                </label>
                <input
                  type="text"
                  value={footerForm.copyrightText}
                  onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                  {isAr ? 'اقتباس المخرج' : 'Director Quotation'}
                </label>
                <input
                  type="text"
                  value={footerForm.quote}
                  onChange={(e) => setFooterForm({ ...footerForm, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                {isAr ? 'الوصف الفرعي للتذييل' : 'Footer Subtext Disclaimer'}
              </label>
              <input
                type="text"
                value={footerForm.disclaimer}
                onChange={(e) => setFooterForm({ ...footerForm, disclaimer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#2563eb]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isAr ? 'حفظ معلومات التواصل والتذييل' : 'Save Contact & Footer'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
