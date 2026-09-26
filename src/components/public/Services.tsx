import { Film, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { AVAILABLE_ICONS } from '../common/IconPicker';

export function Services() {
  const { content } = useContent();
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const services = content.services || [];

  const sectionBadge = content.sectionHeaders?.services?.badge || t('services.badge', 'CREATIVE CAPABILITIES');
  const sectionTitle = content.sectionHeaders?.services?.title || t('services.title', 'SPECIALIZED SERVICES');
  const sectionDesc = content.sectionHeaders?.services?.description || t('services.desc', 'From script concept and 4K cinema shooting to neural AI visual synthesis and broadcast-grade DaVinci Resolve color grading.');

  return (
    <section id="services" className="relative py-16 sm:py-24 bg-[#171717] border-t border-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[10px] sm:text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{sectionBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-5xl font-black text-[#f1f2ed] tracking-tight uppercase font-quicksand">
              {sectionTitle}
            </h2>
          </div>
          <div className="text-xs sm:text-base text-[#a8a6a1] max-w-md">
            <p>{sectionDesc}</p>
          </div>
        </div>

        {/* Services Grid: 2 COLUMNS ON MOBILE, 3 COLUMNS ON DESKTOP */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {services.map((service) => {
            const IconComp = AVAILABLE_ICONS[service.icon || 'Film'] || Film;

            return (
              <div
                key={service.id}
                className="group relative rounded-xl sm:rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] p-3.5 sm:p-7 transition-all duration-300 hover:border-[#2563eb]/60 hover:shadow-xl hover:shadow-[#2563eb]/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#232323] border border-[#2b2b2b] group-hover:bg-[#2563eb] text-[#38bdf8] group-hover:text-white flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                      <IconComp className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>

                    <span className="text-[8px] sm:text-[10px] font-mono tracking-wider uppercase text-[#706e6a] bg-[#232323] px-2 py-0.5 rounded truncate max-w-[50%]">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-xl font-bold text-[#f1f2ed] group-hover:text-white transition-colors mb-1 sm:mb-2 font-quicksand">
                    {service.title}
                  </h3>
                  <div className="text-[10px] sm:text-xs text-[#38bdf8] font-medium tracking-wide mb-1.5 sm:mb-3">
                    {service.subtitle}
                  </div>
                  <div className="text-[11px] sm:text-sm text-[#a8a6a1] leading-relaxed mb-3 sm:mb-6">
                    {service.description}
                  </div>
                </div>

                {service.features && service.features.length > 0 && (
                  <div className="pt-2 sm:pt-4 border-t border-[#232323] space-y-1 sm:space-y-1.5">
                    {service.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#706e6a]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
