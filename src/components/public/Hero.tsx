import { useState } from 'react';
import { Play, ArrowRight, Sparkles, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { useLanguage } from '../../context/LanguageContext';

export function Hero() {
  const { content } = useContent();
  const { language, t, isRTL } = useLanguage();
  const isAr = language === 'ar';
  const [showreelModalOpen, setShowreelModalOpen] = useState(false);

  const hero = content.hero;
  const marqueeList = isAr
    ? ['إعلانات تجارية', 'ذكاء اصطناعي وموشن', 'أعراس وفعاليات فاخرة', 'تصوير جوي 4K درون', 'تلوين سينمائي']
    : (hero.marqueeItems && hero.marqueeItems.length > 0
        ? hero.marqueeItems
        : ['COMMERCIAL ADS', 'AI MOTION GRAPHICS', 'WEDDINGS & EVENTS', 'DRONE 4K', 'COLOR GRADING']);

  return (
    <section id="hero" className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-10 overflow-hidden bg-[#171717]">
      {/* Background Ambient Imagery & Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={hero.bgImageUrl}
          alt="Cinematography backdrop"
          className="w-full h-full object-cover object-center opacity-20 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/80 via-[#171717]/85 to-[#171717]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.18)_0%,transparent_70%)]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full text-center">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#1d1d1d]/90 border border-[#2b2b2b] shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#a8a6a1] font-mono">
              {hero.badgeText || (isAr ? 'شريف عبس • مخرج سينمائي ومصور محترف' : 'SHARIF ABS • CINEMATOGRAPHER & DIRECTOR')}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#f1f2ed] uppercase font-quicksand leading-[1.08]">
            {hero.title || (isAr ? 'سرد بصري استثنائي برؤية سينمائية' : 'VISUAL STORYTELLING THROUGH CINEMATIC MOTION')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-[#a8a6a1] max-w-2xl mx-auto font-normal leading-relaxed">
            {hero.subtitle || (isAr 
              ? 'شريف عبس — إخراج وتصوير الإعلانات التجارية الفاخرة، الأفلام الوثائقية، والأعمال السينمائية بدقة 4K.' 
              : 'Sharif Abs crafting high-impact commercial ads, emotionally resonant wedding films, luxury visuals, and cutting-edge cinematography.')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              id="hero-primary-cta"
              href={hero.primaryCtaLink || '#portfolio'}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-[#2563eb] hover:bg-[#3b82f6] transition-all duration-300 shadow-xl hover:shadow-[#2563eb]/30 border border-[#3b82f6]/50 group cursor-pointer"
            >
              <span>{hero.primaryCtaText || t('hero.explore', 'Explore Portfolio')}</span>
              <ArrowRight className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
            </a>

            <button
              id="hero-watch-showreel-btn"
              onClick={() => setShowreelModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#f1f2ed] hover:text-white bg-[#1d1d1d] hover:bg-[#232323] transition-all duration-200 border border-[#2b2b2b] shadow-md group cursor-pointer"
            >
              <div className="w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-[#2563eb] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-current translate-x-0.5" />
              </div>
              <span>{hero.secondaryCtaText || t('hero.showreel', '2026 Showreel')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="relative z-10 w-full overflow-hidden border-y border-[#2b2b2b] bg-[#111111]/70 backdrop-blur-sm py-2.5 sm:py-3 mt-8">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeList, ...marqueeList, ...marqueeList, ...marqueeList].map((item, idx) => (
            <span
              key={idx}
              className="mx-4 sm:mx-6 text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#706e6a] uppercase flex items-center gap-3"
            >
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            </span>
          ))}
        </div>
      </div>

      {/* Showreel Modal */}
      {showreelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-[#171717] border border-[#2b2b2b] shadow-2xl space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2b2b2b]">
              <div>
                <h3 className="text-lg font-bold text-[#f1f2ed] uppercase font-quicksand">
                  {isAr ? 'العرض السينمائي الترويجي المجمع' : 'Official Director Showreel'}
                </h3>
                <p className="text-xs text-[#a8a6a1] font-mono">SHPIXELS — Cinematography by Sharif Abs</p>
              </div>
              <button
                onClick={() => setShowreelModalOpen(false)}
                className="p-2 rounded-full text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2b2b2b]">
              <YouTubeEmbed
                videoId={hero.featuredVideoId || 'ScMzIvxBSi4'}
                title="SHPIXELS Showreel"
                autoplay
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
