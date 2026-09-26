import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.showreel': 'Showreel',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.process': 'Process',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.getInTouch': 'Get in Touch',

    // Hero
    'hero.badge': 'DIRECTOR & CINEMATOGRAPHER',
    'hero.title': 'VISUAL STORYTELLING THROUGH CINEMATIC MOTION',
    'hero.subtitle': '7+ years directing high-impact commercial campaigns, music videos, luxury brand films, and cutting-edge AI motion graphics.',
    'hero.watchShowreel': 'Watch 2026 Showreel',
    'hero.exploreWork': 'Explore Portfolio',
    'hero.filmmaker': 'Mo Abdallah • Director of Photography',

    // Showreel
    'showreel.badge': 'SIGNATURE SHOWREEL',
    'showreel.title': '2026 CINEMATIC HIGHLIGHTS',
    'showreel.desc': 'A curated retrospective of commercial campaigns, fashion visuals, and narrative motion picture direction mastered in 4K DCI.',

    // About
    'about.badge': 'THE DIRECTOR',
    'about.heading': 'MOHAMMAD ABDALLAH',
    'about.stats.projects': 'Commercial Projects',
    'about.stats.awards': 'Industry Recognitions',
    'about.stats.years': 'Years Experience',
    'about.stats.4k': '4K Productions',
    'about.technical': 'Technical Competencies & Arsenal',

    // Services
    'services.badge': 'CREATIVE SOLUTIONS',
    'services.title': 'SPECIALIZED PRODUCTION SERVICES',
    'services.desc': 'End-to-end cinematic execution tailored for global brands, luxury agencies, and visionary creators.',

    // Portfolio
    'portfolio.badge': 'SELECTED PRODUCTIONS',
    'portfolio.title': 'FEATURED PORTFOLIO',
    'portfolio.desc': 'Click any production to view the full 4K YouTube film, creative backstory, production stills, and directorial credits.',
    'portfolio.all': 'All Productions',
    'portfolio.watchFilm': 'Watch Film',
    'portfolio.client': 'Client',
    'portfolio.year': 'Year',
    'portfolio.category': 'Category',
    'portfolio.empty': 'No projects found in this category.',
    'portfolio.modal.close': 'Close Window',
    'portfolio.modal.stills': 'Cinematography Stills',
    'portfolio.modal.watchOnYt': 'Watch on YouTube',

    // Process
    'process.badge': 'PRODUCTION PIPELINE',
    'process.title': 'FROM CONCEPT TO 4K MASTER',
    'process.desc': 'A disciplined four-phase directorial workflow ensuring visual excellence at every stage.',

    // Gallery
    'gallery.badge': 'ON SET',
    'gallery.title': 'CINEMATOGRAPHY STILLS & BTS',
    'gallery.desc': 'Glimpses into camera rigs, anamorphic lighting setups, and production moments across global locations.',

    // Contact
    'contact.badge': 'COLLABORATE',
    'contact.title': "LET'S CREATE SOMETHING UNFORGETTABLE",
    'contact.desc': 'Available for commercial campaigns, narrative films, and brand visual direction worldwide.',
    'contact.name': 'Your Name *',
    'contact.email': 'Email Address *',
    'contact.phone': 'Phone / WhatsApp',
    'contact.type': 'Project Type',
    'contact.budget': 'Estimated Budget',
    'contact.message': 'Project Vision & Details *',
    'contact.submit': 'Send Production Inquiry',
    'contact.submitting': 'Transmitting Message...',
    'contact.success': 'Inquiry Received! I will get back to you within 24 hours.',
    'contact.direct': 'Direct Production Inquiries',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.top': 'Back to Top',

    // Admin Common
    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.videos': 'YouTube Videos',
    'admin.media': 'Media & Images',
    'admin.settings': 'Site Settings',
    'admin.navigation': 'Navigation',
    'admin.links': 'Links & Social',
    'admin.seo': 'SEO & Analytics',
    'admin.export': 'GitHub Export',
    'admin.publicSite': 'Public Site',
    'admin.logout': 'Sign Out',
    'admin.save': 'Save Changes',
    'admin.saved': 'Saved Successfully!',
    'admin.cancel': 'Cancel',
    'admin.delete': 'Delete',
    'admin.edit': 'Edit',
    'admin.newProject': 'New Project',
    'admin.uploadDesktop': 'Upload from Computer',
    'admin.dragDrop': 'Drag and drop an image, or click to browse',
    'admin.ytVideoId': 'YouTube Video ID or URL',
    'admin.testPlay': 'Test Playback',
    'admin.persisted': 'Real-time Codebase Sync Active',
  },
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.showreel': 'العرض الترويجي',
    'nav.work': 'الأعمال',
    'nav.about': 'عن المخرج',
    'nav.services': 'الخدمات',
    'nav.process': 'مراحل العمل',
    'nav.gallery': 'معرض الصور',
    'nav.contact': 'تواصل معي',
    'nav.getInTouch': 'ابدأ مشروعك',

    // Hero
    'hero.badge': 'مخرج ومدير تصوير سينمائي',
    'hero.title': 'السرد البصري من خلال الحركة السينمائية',
    'hero.subtitle': 'أكثر من 7 سنوات في إخراج الحملات الإعلانية الكبرى، والأفلام الموسيقية، والعلامات الفاخرة، وموشن جرافيكس المدعوم بالذكاء الاصطناعي.',
    'hero.watchShowreel': 'شاهد عرض 2026',
    'hero.exploreWork': 'استعرض الأعمال',
    'hero.filmmaker': 'محمد عبد الله • مدير التصوير السينمائي',

    // Showreel
    'showreel.badge': 'العرض المميز',
    'showreel.title': 'مقتطفات سينمائية 2026',
    'showreel.desc': 'مجموعة مختارة من أبرز الحملات التجارية والإخراجية تم تصويرها وتلوينها بدقة 4K DCI.',

    // About
    'about.badge': 'المخرج السينمائي',
    'about.heading': 'محمد عبد الله (Mo Abdallah)',
    'about.stats.projects': 'مشروع إعلاني منجز',
    'about.stats.awards': 'تقديرات وجوائز صناعية',
    'about.stats.years': 'سنوات خبرة تصويرية',
    'about.stats.4k': 'إنتاجات بدقة 4K',
    'about.technical': 'القدرات والعتاد التقني',

    // Services
    'services.badge': 'حلول إبداعية متكاملة',
    'services.title': 'خدمات الإنتاج السينمائي المتخصصة',
    'services.desc': 'تنفيذ سينمائي متكامل من الفكرة إلى العرض، مصمم للعلامات التجارية العالمية ووكالات الإعلان.',

    // Portfolio
    'portfolio.badge': 'إنتاجات مختارة',
    'portfolio.title': 'معرض الأعمال السينمائية',
    'portfolio.desc': 'انقر على أي عمل لمشاهدة الفيديو بدقة 4K عبر يوتيوب، مع القصة الإبداعية ولقطات الكواليس وتفاصيل الكاميرا.',
    'portfolio.all': 'كافة الإنتاجات',
    'portfolio.watchFilm': 'شاهد الفيلم',
    'portfolio.client': 'العميل',
    'portfolio.year': 'السنة',
    'portfolio.category': 'التصنيف',
    'portfolio.empty': 'لا توجد مشاريع في هذا التصنيف حالياً.',
    'portfolio.modal.close': 'إغلاق',
    'portfolio.modal.stills': 'لقطات تصويرية من الفيلم',
    'portfolio.modal.watchOnYt': 'مشاهدة على يوتيوب',

    // Process
    'process.badge': 'خطوات الإنتاج',
    'process.title': 'من الفكرة الأولية إلى ماستر 4K',
    'process.desc': 'منهجية إخراجية منضبطة من أربع مراحل تضمن أعلى معايير الجودة البصرية.',

    // Gallery
    'gallery.badge': 'من موقع التصوير',
    'gallery.title': 'لقطات الكاميرا وكواليس الإنتاج',
    'gallery.desc': 'نظرة على معدات الكاميرا، وأنظمة الإضاءة السينمائية، ولحظات الإنتاج في مواقع مختلفة.',

    // Contact
    'contact.badge': 'تعاون إبداعي',
    'contact.title': 'دعنا نصنع عملاً لا يُنسى',
    'contact.desc': 'متاح للحملات التجارية، والأفلام الروائية والوثائقية، وإدارة الرؤية البصرية حول العالم.',
    'contact.name': 'الاسم الكامل *',
    'contact.email': 'البريد الإلكتروني *',
    'contact.phone': 'رقم الهاتف / واتساب',
    'contact.type': 'نوع المشروع',
    'contact.budget': 'الميزانية التقديرية',
    'contact.message': 'تفاصيل المشروع والرؤية الإبداعية *',
    'contact.submit': 'إرسال طلب الإنتاج',
    'contact.submitting': 'جارٍ إرسال الطلب...',
    'contact.success': 'تم استلام طلبك بنجاح! سأتواصل معك خلال 24 ساعة.',
    'contact.direct': 'قنوات التواصل المباشرة',

    // Footer
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.top': 'العودة للأعلى',

    // Admin Common
    'admin.dashboard': 'لوحة التحكم',
    'admin.projects': 'المشاريع والأعمال',
    'admin.videos': 'فيديوهات يوتيوب',
    'admin.media': 'الوسائط والصور',
    'admin.settings': 'إعدادات الموقع',
    'admin.navigation': 'قائمة التنقل',
    'admin.links': 'الروابط والتواصل',
    'admin.seo': 'محركات البحث وأرشفة Google',
    'admin.export': 'تصدير جيتهاب والنسخ',
    'admin.publicSite': 'معاينة الموقع',
    'admin.logout': 'تسجيل الخروج',
    'admin.save': 'حفظ التعديلات',
    'admin.saved': 'تم الحفظ بنجاح!',
    'admin.cancel': 'إلغاء',
    'admin.delete': 'حذف',
    'admin.edit': 'تعديل',
    'admin.newProject': 'مشروع جديد',
    'admin.uploadDesktop': 'رفع صورة من جهازك',
    'admin.dragDrop': 'اسحب الصورة هنا أو انقر للاختيار من الكمبيوتر',
    'admin.ytVideoId': 'معرف أو رابط يوتيوب',
    'admin.testPlay': 'تجربة التشغيل',
    'admin.persisted': 'المزامنة المباشرة مع الكود نشطة',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('mografix_lang');
      if (stored === 'ar' || stored === 'en') return stored;
    } catch {
      // ignore
    }
    return 'en'; // Default is English
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('mografix_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;
      if (language === 'ar') {
        document.body.classList.add('font-arabic');
      } else {
        document.body.classList.remove('font-arabic');
      }
    }
  }, [language, dir]);

  const t = (key: string, fallback?: string): string => {
    return translations[language]?.[key] || fallback || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dir,
        isRTL,
        t
      }}
    >
      <div dir={dir} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
