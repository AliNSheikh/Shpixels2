import { Workflow } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { AVAILABLE_ICONS } from '../common/IconPicker';

export function Process() {
  const { content } = useContent();
  const { language, t } = useLanguage();
  const isAr = language === 'ar';
  const workflow = content.workflow || [];

  const sectionBadge = content.sectionHeaders?.workflow?.badge || t('process.badge', 'THE PRODUCTION PIPELINE');
  const sectionTitle = content.sectionHeaders?.workflow?.title || t('process.title', 'HOW WE BRING IDEAS TO LIFE');
  const sectionDesc = content.sectionHeaders?.workflow?.description || t('process.desc', 'A battle-tested production methodology ensuring razor-sharp timelines, uncompromising visual fidelity, and frictionless client collaboration.');

  return (
    <section id="process" className="relative py-16 sm:py-24 bg-[#171717] border-t border-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[10px] sm:text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase mb-3">
              <Workflow className="w-3.5 h-3.5 text-[#2563eb]" />
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

        {/* Workflow steps: 2 COLUMNS ON MOBILE, 4 COLUMNS ON DESKTOP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {workflow.map((step, idx) => {
            const IconComp = AVAILABLE_ICONS[step.icon || 'Workflow'] || Workflow;

            return (
              <div
                key={idx}
                className="relative p-3.5 sm:p-7 rounded-xl sm:rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <span className="text-2xl sm:text-4xl font-black text-[#2563eb] group-hover:text-[#38bdf8] transition-colors font-quicksand">
                      {step.number}
                    </span>

                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#232323] flex items-center justify-center text-[#2563eb] group-hover:text-white group-hover:bg-[#2563eb] transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-lg font-bold text-[#f1f2ed] mb-1.5 sm:mb-3 font-quicksand group-hover:text-white transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-[11px] sm:text-sm text-[#a8a6a1] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-[#232323]">
                  <div className="w-full bg-[#232323] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2563eb] h-full transition-all duration-500"
                      style={{ width: `${((idx + 1) / Math.max(workflow.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
