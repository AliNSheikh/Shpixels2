import { useState } from 'react';
import { Video, Plus, Trash2, Edit3, Check, Sparkles, ExternalLink } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { YouTubeVideoItem } from '../../types/content';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../../utils/youtube';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { ConfirmModal } from '../common/ConfirmModal';

export function VideoManager() {
  const { content, updateContent, addVideo, updateVideo, deleteVideo } = useContent();

  // Hero Video state
  const [heroVideoInput, setHeroVideoInput] = useState(content.hero.featuredVideoId || '');
  const [heroVideoSaved, setHeroVideoSaved] = useState(false);

  // New video modal state
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideoItem | null>(null);
  const [videoToDelete, setVideoToDelete] = useState<YouTubeVideoItem | null>(null);

  const [formState, setFormState] = useState<YouTubeVideoItem>({
    id: `fvid-${Date.now()}`,
    title: '',
    youtubeUrl: '',
    videoId: '',
    thumbnail: '',
    description: '',
    category: 'Commercial',
    featured: true,
    order: 1,
    visible: true,
    caption: '4K ProRes • DaVinci Resolve',
    client: 'SHPIXELS'
  });

  const handleSaveHeroVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = extractYouTubeId(heroVideoInput);
    updateContent({
      hero: {
        ...content.hero,
        featuredVideoId: cleanId
      }
    });
    setHeroVideoSaved(true);
    setTimeout(() => setHeroVideoSaved(false), 2500);
  };

  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormState({
      id: `fvid-${Date.now()}`,
      title: '',
      youtubeUrl: '',
      videoId: '',
      thumbnail: '',
      description: '',
      category: 'Commercial',
      featured: true,
      order: (content.featuredVideos?.length || 0) + 1,
      visible: true,
      caption: '',
      client: ''
    });
    setIsAdding(true);
  };

  const handleOpenEdit = (v: YouTubeVideoItem) => {
    setEditingVideo(v);
    setFormState(v);
    setIsAdding(true);
  };

  const handleUrlChange = (url: string) => {
    const extracted = extractYouTubeId(url);
    const thumb = getYouTubeThumbnailUrl(extracted);
    setFormState({
      ...formState,
      youtubeUrl: url,
      videoId: extracted,
      thumbnail: thumb
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.videoId) return;

    if (editingVideo) {
      updateVideo(formState);
    } else {
      addVideo(formState);
    }
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#2b2b2b]">
        <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
          YouTube Video Embeds Manager
        </h2>
        <p className="text-xs text-[#a8a6a1]">
          Videos are dynamically rendered exclusively via official YouTube iframes. Changing an ID or URL updates the live website instantly.
        </p>
      </div>

      {/* Hero / Main Showreel Video Card */}
      <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#232323]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              Primary Website Showreel (Hero & Showreel Sections)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#706e6a]">
            Active ID: {content.hero.featuredVideoId || 'None'}
          </span>
        </div>

        <form onSubmit={handleSaveHeroVideo} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={heroVideoInput}
              onChange={(e) => setHeroVideoInput(e.target.value)}
              placeholder="Paste YouTube Video URL or ID (e.g. ScMzIvxBSi4 or https://youtu.be/...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0"
            >
              {heroVideoSaved ? <Check className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              <span>{heroVideoSaved ? 'Showreel Saved!' : 'Update Showreel'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview of Hero Video */}
        <div className="max-w-2xl pt-2">
          <p className="text-xs font-mono uppercase text-[#706e6a] mb-2">Live Embedded Preview:</p>
          <YouTubeEmbed
            videoId={content.hero.featuredVideoId}
            title="Hero Showreel Preview"
            lazyLoad={false}
          />
        </div>
      </div>

      {/* Featured Video Highlights Manager */}
      <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#232323]">
          <div>
            <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              Curated YouTube Video Highlights ({content.featuredVideos?.length || 0})
            </h3>
            <p className="text-xs text-[#a8a6a1]">
              Additional video showcases available across the site.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold uppercase tracking-wider text-[#f1f2ed] border border-[#2b2b2b] transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#2563eb]" />
            <span>Add YouTube Video</span>
          </button>
        </div>

        {/* List of Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.featuredVideos && content.featuredVideos.map((vid) => (
            <div
              key={vid.id}
              className="rounded-xl bg-[#232323] border border-[#2b2b2b] overflow-hidden space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#2563eb] font-bold">
                      {vid.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#f1f2ed] line-clamp-1">
                      {vid.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(vid)}
                      className="p-1.5 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#1d1d1d]"
                      title="Edit Video"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setVideoToDelete(vid)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-[#1d1d1d] cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Video Embed */}
                <YouTubeEmbed videoId={vid.videoId} title={vid.title} lazyLoad={true} />

                {vid.description && (
                  <p className="text-xs text-[#a8a6a1] line-clamp-2">
                    {vid.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-[#1d1d1d] flex items-center justify-between text-[11px] font-mono text-[#706e6a]">
                <span>ID: {vid.videoId}</span>
                <a
                  href={`https://youtube.com/watch?v=${vid.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#f1f2ed]"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Video Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#171717] border border-[#2b2b2b] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#2b2b2b]">
              <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
                {editingVideo ? 'Edit YouTube Video' : 'Add YouTube Video'}
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1.5 rounded-lg text-[#a8a6a1] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  YouTube URL or Video ID *
                </label>
                <input
                  type="text"
                  required
                  value={formState.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or Video ID"
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
                {formState.videoId && (
                  <p className="text-[10px] font-mono text-emerald-400 mt-1">
                    Detected Video ID: {formState.videoId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                  placeholder="e.g. Commercial Direction Showreel"
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    placeholder="e.g. Commercial, Wedding, Drone"
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formState.client}
                    onChange={(e) => setFormState({ ...formState, client: e.target.value })}
                    placeholder="e.g. Solace Brands"
                    className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Short summary of the video content..."
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none resize-none"
                />
              </div>

              {/* Live Preview */}
              {formState.videoId && (
                <div className="pt-2">
                  <p className="text-[10px] font-mono uppercase text-[#706e6a] mb-1">Preview:</p>
                  <YouTubeEmbed videoId={formState.videoId} title={formState.title} lazyLoad={false} />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2b2b2b]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg bg-[#232323] text-xs text-[#a8a6a1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase text-white"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(videoToDelete)}
        title="Delete Video"
        message={`Are you sure you want to remove "${videoToDelete?.title || 'this video'}"?`}
        confirmLabel="Delete Video"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (videoToDelete) {
            deleteVideo(videoToDelete.id);
            setVideoToDelete(null);
          }
        }}
        onCancel={() => setVideoToDelete(null)}
      />
    </div>
  );
}
