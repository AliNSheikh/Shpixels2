import { useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../utils/youtube';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
  className?: string;
  posterImage?: string;
  lazyLoad?: boolean;
  caption?: string;
}

export function YouTubeEmbed({
  videoId,
  title = 'YouTube Video Player',
  autoplay = false,
  className = '',
  posterImage,
  lazyLoad = true,
  caption
}: YouTubeEmbedProps) {
  const cleanId = extractYouTubeId(videoId);
  const [isPlaying, setIsPlaying] = useState(!lazyLoad || autoplay);
  const [imgError, setImgError] = useState(false);

  if (!cleanId) {
    return (
      <div className={`aspect-video w-full bg-[#1d1d1d] border border-[#2b2b2b] rounded-xl flex items-center justify-center text-[#706e6a] text-sm ${className}`}>
        <span>No YouTube video ID provided</span>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(cleanId, isPlaying || autoplay);
  const thumbnail = posterImage || (!imgError ? getYouTubeThumbnailUrl(cleanId, 'maxres') : getYouTubeThumbnailUrl(cleanId, 'hq'));

  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-[#171717] border border-[#2b2b2b] group shadow-2xl ${className}`}>
      <div className="relative w-full aspect-video">
        {isPlaying ? (
          <iframe
            id={`youtube-embed-${cleanId}`}
            src={embedUrl}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div
            id={`youtube-poster-${cleanId}`}
            onClick={() => setIsPlaying(true)}
            className="relative w-full h-full cursor-pointer overflow-hidden group/poster"
            role="button"
            tabIndex={0}
            aria-label={`Play video: ${title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsPlaying(true);
              }
            }}
          >
            <img
              src={thumbnail}
              alt={title}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, 1200px"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover/poster:scale-105"
            />
            {/* Cinematic overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 group-hover/poster:via-black/20 transition-all duration-300" />
            
            {/* Big Blue Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Glow ring */}
                <div className="absolute w-20 h-20 rounded-full bg-[#2563eb]/40 blur-xl group-hover/poster:bg-[#3b82f6]/60 transition-all duration-500 scale-100 group-hover/poster:scale-125" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2563eb] hover:bg-[#3b82f6] text-[#f1f2ed] flex items-center justify-center shadow-lg transition-transform duration-300 ease-out group-hover/poster:scale-110 active:scale-95 border border-[#3b82f6]/50">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Video Title on Poster */}
            {title && (
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="inline-block text-xs font-medium tracking-widest uppercase text-[#38bdf8] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-[#2563eb]/40 mb-1.5">
                  Play Video
                </span>
                <p className="text-white font-semibold text-sm sm:text-base line-clamp-1 drop-shadow-md">
                  {title}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {caption && (
        <div className="p-3 bg-[#1d1d1d] border-t border-[#2b2b2b] text-xs text-[#a8a6a1] flex items-center justify-between">
          <span className="font-mono text-[#706e6a]">{caption}</span>
          <span className="text-[10px] tracking-wider uppercase text-[#38bdf8] font-semibold">YouTube 4K</span>
        </div>
      )}
    </div>
  );
}
