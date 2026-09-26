import { Camera, CheckCircle2, Award, Clapperboard, Layers } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { OptimizedImage } from '../common/OptimizedImage';

export function About() {
  const { content } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const about = content.about;

  return (
    <section id="about" className="relative py-16 sm:py-24 bg-[#171717] overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Image with cinematic badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#2563eb]/40 via-[#232323] to-transparent -z-10 blur-sm" />
              
              <div className="relative rounded-2xl overflow-hidden bg-[#1d1d1d] border border-[#2b2b2b] shadow-2xl aspect-[4/5]">
                <OptimizedImage
                  src={about.profileImage}
                  alt={about.highlightText || 'Sharif Abs'}
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-transparent opacity-80 pointer-events-none" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 p-3.5 sm:p-4 rounded-xl bg-[#171717]/85 backdrop-blur-md border border-[#2b2b2b] z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#2563eb] flex items-center justify-center text-white flex-shrink-0">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#f1f2ed] uppercase tracking-wide">
                        {isAr ? 'شريف عبس (Sharif Abs)' : 'Sharif Abs'}
                      </p>
                      <p className="text-[11px] sm:text-xs text-[#a8a6a1] font-mono">
                        {isAr ? 'مخرج ومدير تصوير سينمائي' : 'Director & Lead Cinematographer'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating experience pill */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[#2563eb] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg border border-[#3b82f6]/60 flex items-center gap-2 z-10">
                <Award className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {about.experienceYears || 7}+ {isAr ? 'سنوات إبداع' : 'Years Storytelling'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Bio and details */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[10px] sm:text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase">
                <Clapperboard className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{about.badge || (isAr ? 'المبدع خلف العدسة' : 'THE CREATIVE BEHIND THE LENS')}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#f1f2ed] tracking-tight uppercase font-quicksand leading-tight">
                {about.heading || (isAr ? 'صناعة قصص بصرية تبقى حية في الذاكرة.' : 'Crafting visual stories that linger in the memory.')}
              </h2>
              <div className="text-sm sm:text-lg font-medium text-[#38bdf8]">
                {about.highlightText || (isAr ? 'شريف عبس — مخرج ومدير تصوير سينمائي' : 'Sharif Abs — Filmmaker & Visual Storyteller')}
              </div>
            </div>

            {/* Paragraphs */}
            <div className="space-y-3 sm:space-y-4 text-[#a8a6a1] text-xs sm:text-base leading-relaxed">
              {(about.bioParagraphs && about.bioParagraphs.length > 0 ? about.bioParagraphs : [
                'مخرج سينمائي ومدير تصوير محترف خلف علامة SHPIXELS. أكرس رؤيتي البصرية لتحويل الأفكار الجريئة إلى إنتاجات سينمائية استثنائية تأسر الجمهور.',
                'أجمع بين أحدث عتاد التصوير السينمائي (Red، Sony FX Cinema، وعدسات Anamorphic) وبين تدرج الألوان المتطور لتقديم محتوى بصري فاخر للإعلانات التجارية والأفلام الإبداعية.'
              ]).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-[#2b2b2b]">
              {about.stats && about.stats.map((stat) => (
                <div key={stat.id} className="p-3 sm:p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors">
                  <span className="text-xl sm:text-3xl font-extrabold text-[#f1f2ed] font-quicksand block">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs text-[#a8a6a1] uppercase tracking-wider font-mono">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Capabilities / Tools */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#706e6a]">
                <Layers className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{isAr ? 'المهارات وأدوات الإنتاج' : 'Core Competencies & Toolchain'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.skills && about.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-[#f1f2ed] bg-[#1d1d1d] border border-[#2b2b2b]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
