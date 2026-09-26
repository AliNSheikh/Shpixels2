import { useState } from 'react';
import { Camera, X, ZoomIn } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { GalleryItem } from '../../types/content';
import { OptimizedImage } from '../common/OptimizedImage';

export function Gallery() {
  const { content } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  const gallery = content.gallery || [];

  const sectionBadge = content.sectionHeaders?.gallery?.badge || (isAr ? 'خلف الكواليس ولقطات الإنتاج' : 'BEHIND THE SCENES & PRODUCTION STILLS');
  const sectionTitle = content.sectionHeaders?.gallery?.title || (isAr ? 'لقطات سينمائية فوتوغرافية' : 'CINEMATIC STILLS');
  const sectionDesc = content.sectionHeaders?.gallery?.description || (isAr ? 'لقطات واقعية من خلف الكواليس، معدات الكاميرا السينمائية، والعمليات الإبداعية لمشاريعنا.' : 'Glimpses into camera rigs, optical glass, twilight drone operations, and on-set lighting setups crafted across productions.');

  return (
    <section id="gallery" className="relative py-24 bg-[#171717] border-t border-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase mb-3">
              <Camera className="w-3.5 h-3.5 text-[#2563eb]" />
              <span>{sectionBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#f1f2ed] tracking-tight uppercase font-quicksand">
              {sectionTitle}
            </h2>
          </div>
          <div className="text-sm sm:text-base text-[#a8a6a1] max-w-md">
            <p>{sectionDesc}</p>
          </div>
        </div>

        {/* Gallery Grid: 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/60 cursor-pointer transition-all duration-300 shadow-md"
            >
              <OptimizedImage
                src={item.image}
                alt={item.title}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 sm:p-5 flex flex-col justify-end pointer-events-none">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#38bdf8] font-semibold">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-base font-bold text-white font-quicksand truncate">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-[10px] sm:text-xs text-[#a8a6a1] line-clamp-1 mt-0.5">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0">
                    <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          id="gallery-lightbox-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] bg-[#171717] rounded-2xl border border-[#2b2b2b] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[#2b2b2b]">
              <div>
                <span className="text-xs text-[#2563eb] font-mono uppercase tracking-wider font-semibold">
                  {activeImage.category}
                </span>
                <h3 className="text-lg font-bold text-[#f1f2ed] font-quicksand">
                  {activeImage.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1.5 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative overflow-hidden flex items-center justify-center bg-black max-h-[70vh]">
              <OptimizedImage
                src={activeImage.image}
                alt={activeImage.title}
                sizes="(max-width: 1024px) 100vw, 1200px"
                priority
                className="w-auto h-auto max-h-[70vh] object-contain"
              />
            </div>

            {activeImage.caption && (
              <div className="p-4 bg-[#1d1d1d] border-t border-[#2b2b2b] text-xs text-[#a8a6a1]">
                {activeImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
