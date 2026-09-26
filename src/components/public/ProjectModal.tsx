import { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Film, Tag } from 'lucide-react';
import { ProjectItem } from '../../types/content';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { OptimizedImage } from '../common/OptimizedImage';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const primaryVideo = project.videos && project.videos.length > 0 ? project.videos[0] : null;

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#171717] border border-[#2b2b2b] p-4 sm:p-8 shadow-2xl space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#2b2b2b]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#2563eb] text-white">
                <Tag className="w-3 h-3" />
                <span>{project.category}</span>
              </span>
              {project.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#232323] text-[#38bdf8] border border-[#2563eb]/40">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#f1f2ed] font-quicksand">
              {project.title}
            </h2>
          </div>

          <button
            id="close-project-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close Project Details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Player or Cover Image */}
        {primaryVideo ? (
          <div className="space-y-2">
            <YouTubeEmbed
              videoId={primaryVideo.videoId || primaryVideo.youtubeUrl}
              title={primaryVideo.title || project.title}
              lazyLoad={false}
              caption={primaryVideo.caption}
            />
            {project.videos.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {project.videos.slice(1).map((v, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-xs font-semibold text-[#f1f2ed]">{v.title}</p>
                    <YouTubeEmbed videoId={v.videoId || v.youtubeUrl} title={v.title} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-[#2b2b2b] bg-[#1d1d1d]">
            <OptimizedImage
              src={project.coverImage}
              alt={project.title}
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Project Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs">
          <div className="flex items-center gap-2 text-[#a8a6a1]">
            <User className="w-4 h-4 text-[#2563eb]" />
            <div>
              <p className="text-[10px] text-[#706e6a] uppercase font-mono">Client</p>
              <div className="font-semibold text-[#f1f2ed]">
                {project.client || 'Creative Showcase'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#a8a6a1]">
            <Calendar className="w-4 h-4 text-[#2563eb]" />
            <div>
              <p className="text-[10px] text-[#706e6a] uppercase font-mono">Release Year</p>
              <div className="font-semibold text-[#f1f2ed]">
                {project.year || '2026'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#a8a6a1]">
            <Film className="w-4 h-4 text-[#2563eb]" />
            <div>
              <p className="text-[10px] text-[#706e6a] uppercase font-mono">Direction</p>
              <p className="font-semibold text-[#f1f2ed]">Sharif Abs</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-[#706e6a]">
            Project Overview & Narrative
          </h4>
          <p className="text-sm sm:text-base text-[#a8a6a1] leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Additional Gallery Stills */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#706e6a]">
              Cinematography Stills
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.gallery.map((img, i) => (
                <div key={i} className="aspect-video rounded-lg overflow-hidden border border-[#2b2b2b] bg-[#1d1d1d]">
                  <OptimizedImage
                    src={img}
                    alt={`${project.title} still ${i + 1}`}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        {project.externalLinks && project.externalLinks.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-3">
            {project.externalLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#232323] hover:bg-[#2b2b2b] text-xs font-medium text-[#f1f2ed] border border-[#2b2b2b] transition-colors"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#2563eb]" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
