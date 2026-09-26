import { useState, useEffect } from 'react';
import { ArrowUp, Instagram, Youtube, Linkedin, Film } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { content, setIsAdminView } = useContent();
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const { branding, contact, footer, navigation } = content;
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [branding.logoImage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [...navigation]
    .filter((i) => i.visible)
    .sort((a, b) => a.order - b.order);

  const getNavLabel = (label: string) => {
    if (!isAr) return label;
    const map: Record<string, string> = {
      'Home': 'الرئيسية',
      'Showreel': 'العرض الترويجي',
      'Work': 'الأعمال',
      'Portfolio': 'الأعمال',
      'About': 'من أنا',
      'Services': 'الخدمات',
      'Process': 'مراحل الإنتاج',
      'Gallery': 'المعرض',
      'Contact': 'تواصل معي'
    };
    return map[label] || label;
  };

  return (
    <footer id="main-footer" className="relative bg-[#111111] border-t border-[#2b2b2b] text-[#a8a6a1] overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#2563eb]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#232323]">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              {branding.logoImage && !logoError ? (
                <img 
                  src={branding.logoImage} 
                  alt={branding.logoText || 'SHPIXELS'} 
                  className="h-9 w-auto max-w-[170px] sm:max-w-[200px] object-contain rounded-md" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center text-white font-black">
                  <Film className="w-5 h-5 text-white" />
                </div>
              )}
              {(!branding.logoImage || logoError) && (
                <span className="font-extrabold text-xl tracking-wider text-[#f1f2ed] uppercase font-quicksand">
                  {branding.logoText || 'SHPIXELS'}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#706e6a] leading-relaxed max-w-sm">
              {footer.disclaimer || (isAr
                ? 'استوديو إنتاج سينمائي متخصص في صناعة الإعلانات الفاخرة، الأفلام التجارية والتصوير السينمائي بدقة 4K.'
                : 'Bespoke cinematography studio specializing in luxury commercial advertisements, drone operations, and high-impact visual stories.')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2563eb] hover:text-white transition-colors border border-[#2b2b2b]"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2563eb] hover:text-white transition-colors border border-[#2b2b2b]"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2563eb] hover:text-white transition-colors border border-[#2b2b2b]"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#f1f2ed] font-semibold">
              {isAr ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="hover:text-[#f1f2ed] transition-colors"
                  >
                    {getNavLabel(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Production Specialties */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#f1f2ed] font-semibold">
              {isAr ? 'تخصصات الإنتاج' : 'Specialties'}
            </h4>
            <ul className="space-y-2 text-xs text-[#706e6a]">
              <li>Commercial Advertising (4K DCI)</li>
              <li>High-End Luxury Weddings & Private Galas</li>
              <li>Licensed Aerial Drone Cinematography</li>
              <li>DaVinci Resolve Studio Color Grading</li>
              <li>Creative Direction & Visual Storytelling</li>
            </ul>
          </div>

          {/* Director Quote & Back to Top */}
          <div className="lg:col-span-2 flex flex-col justify-between items-start md:items-end">
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-[#1a1a1a] hover:bg-[#2563eb] text-[#f1f2ed] hover:text-white transition-all border border-[#2b2b2b] shadow-md cursor-pointer group"
              title={isAr ? 'العودة للأعلى' : 'Scroll to top'}
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <div className="mt-6 md:mt-0 text-left md:text-right">
              <span className="text-[10px] font-mono text-[#706e6a] uppercase block">
                Sharif Abs
              </span>
              <p className="text-xs text-[#a8a6a1] italic max-w-[200px] mt-1">
                "{footer.quote || 'Every single frame holds an indelible emotion.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#706e6a]">
          <p>
            {footer.copyrightText || `© ${new Date().getFullYear()} SHPIXELS. All Rights Reserved.`}
          </p>

          <div className="flex items-center gap-4">
            <span>Sony FX Cinema • DJI Cine • DaVinci Wide Gamut</span>
            <span className="text-[#333]">|</span>
            {/* Discreet admin portal access */}
            <button
              id="footer-admin-login-link"
              onClick={() => setIsAdminView(true)}
              className="hover:text-[#a8a6a1] transition-colors cursor-pointer"
            >
              Director Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
