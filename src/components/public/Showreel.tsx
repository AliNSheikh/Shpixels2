import { Sparkles, Video } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { useLanguage } from '../../context/LanguageContext';

export function Showreel() {
  const { content } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const videoId = content.hero.featuredVideoId || 'ScMzIvxBSi4';
  const headerInfo = content.sectionHeaders?.showreel || {
    badge: isAr ? 'عرض إخراجي حصري' : 'DIRECTOR SHOWCASE',
    title: isAr ? 'الشوريل السينمائي 2026' : 'THE 2026 VISUAL REEL',
    description: isAr 
      ? 'مزيج سريع ومبهر من الإعلانات التجارية الفاخرة، المشاهد الجوية بالدرون، وتصاميم الذكاء الاصطناعي والموشن جرافيكس.'
      : 'A fast-cut synthesis of commercial advertising, licensed drone aerials, sensitive healthcare portraits, and generative AI motion aesthetics.'
  };

  return (
    <section id="showreel" className="relative py-20 bg-[#171717] border-b border-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase mb-3">
              <Video className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{headerInfo.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#f1f2ed] tracking-tight uppercase font-quicksand">
              {headerInfo.title}
            </h2>
          </div>
          <div className="text-sm sm:text-base text-[#a8a6a1] max-w-md">
            <p>{headerInfo.description}</p>
          </div>
        </div>

        {/* Featured Video Frame */}
        <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#2b2b2b] via-[#232323] to-[#171717] shadow-2xl">
          <YouTubeEmbed
            videoId={videoId}
            title="SHPIXELS Official 2026 Cinematography Showreel"
            lazyLoad={false}
            caption="Sony FX6 & FX3 Cinema Line • DJI Mavic 3 Cine • DaVinci Resolve Studio Color"
          />
        </div>

        {/* Technical specs strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#706e6a] font-mono">Format</p>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f2ed]">4K UHD 60FPS ProRes</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#706e6a] font-mono">Color Space</p>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f2ed]">DaVinci Wide Gamut</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#706e6a] font-mono">Aerial System</p>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f2ed]">DJI Mavic 3 Cine D-Log</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#706e6a] font-mono">Motion VFX</p>
              <p className="text-xs sm:text-sm font-semibold text-[#f1f2ed]">Hybrid AI Synthesis</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
