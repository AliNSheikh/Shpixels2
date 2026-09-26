import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';

export function ClientLogos() {
  const { content } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const logos = content.clientLogos || [];

  if (logos.length === 0) return null;

  return (
    <section className="relative py-12 bg-[#141414] border-y border-[#262626] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#706e6a] mb-8">
          {isAr ? 'علامات تجارية وشركاء وثقوا بإبداعنا' : 'TRUSTED BY LEADING GLOBAL BRANDS & CREATIVE HOUSES'}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {logos.map((client) => {
            const logoSrc = client.logoUrl || client.logo;

            return (
              <div 
                key={client.id}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1c1c1c] border border-[#2b2b2b] hover:border-[#2563eb]/50 transition-all shadow-sm group"
              >
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={client.name}
                    className="h-6 sm:h-7 object-contain max-w-[120px] grayscale group-hover:grayscale-0 transition-all"
                  />
                )}
                <span className="text-xs font-medium text-[#a8a6a1] group-hover:text-white transition-colors">
                  {client.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
