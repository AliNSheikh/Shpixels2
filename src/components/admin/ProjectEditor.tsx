import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Video, Image, Link as LinkIcon, Check, Play, 
  Sparkles, Eye, ArrowUp, ArrowDown, HelpCircle, Film
} from 'lucide-react';
import { ProjectItem, ProjectVideo } from '../../types/content';
import { extractYouTubeId } from '../../utils/youtube';
import { YouTubeEmbed } from '../common/YouTubeEmbed';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';
import { ConfirmModal } from '../common/ConfirmModal';
import { useLanguage } from '../../context/LanguageContext';
import { useContent } from '../../context/ContentContext';

interface ProjectEditorProps {
  project: ProjectItem | null;
  onSave: (project: ProjectItem) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const FALLBACK_CATEGORIES = [
  'Commercial & Brand Ads',
  'AI & Motion Graphics',
  'Luxury Weddings & Events',
  'Fitness & Sports Cinematography',
  'Aerial 4K Drone',
  'Healthcare & Medical Films',
  'Music Videos & Narrative',
  'Documentary & Culture'
];

export function ProjectEditor({ project, onSave, onCancel, onDelete }: ProjectEditorProps) {
  const { language } = useLanguage();
  const { categories: contextCategories } = useContent();
  const availableCategories = (contextCategories && contextCategories.length > 0) ? contextCategories : FALLBACK_CATEGORIES;
  const isAr = language === 'ar';

  const [formData, setFormData] = useState<ProjectItem>(() => ({
    id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: '',
    description: '',
    category: 'Commercial & Brand Ads',
    client: '',
    year: '2026',
    coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    videos: [],
    gallery: [],
    externalLinks: [],
    featured: false,
    published: true,
    order: 1
  }));

  // YouTube video form state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCaption, setNewVideoCaption] = useState('');
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Still / gallery upload state
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // External link form state
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: '',
        description: '',
        category: 'Commercial & Brand Ads',
        client: '',
        year: '2026',
        coverImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
        videos: [
          {
            id: `vid-${Date.now()}`,
            title: 'Official Commercial Reel',
            youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
            videoId: 'ScMzIvxBSi4',
            caption: 'Directed & Graded by Mo Abdallah • 4K DCI'
          }
        ],
        gallery: [],
        externalLinks: [],
        featured: false,
        published: true,
        order: 99
      });
    }
  }, [project]);

  // Video ID preview update
  useEffect(() => {
    if (newVideoUrl.trim()) {
      const extracted = extractYouTubeId(newVideoUrl);
      setPreviewVideoId(extracted || null);
      if (extracted) setVideoError(null);
    } else {
      setPreviewVideoId(null);
      setVideoError(null);
    }
  }, [newVideoUrl]);

  const handleAddVideo = () => {
    if (!newVideoUrl.trim()) return;
    const extractedId = extractYouTubeId(newVideoUrl);
    if (!extractedId) {
      setVideoError(isAr ? 'يرجى إدخال رابط يوتيوب صحيح أو معرف من 11 حرفاً' : 'Please provide a valid YouTube URL or 11-char Video ID');
      return;
    }
    setVideoError(null);

    const newVideo: ProjectVideo = {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim() || formData.title || 'Production Film',
      youtubeUrl: newVideoUrl.trim(),
      videoId: extractedId,
      caption: newVideoCaption.trim()
    };

    setFormData({
      ...formData,
      videos: [...(formData.videos || []), newVideo]
    });

    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoCaption('');
    setPreviewVideoId(null);
  };

  const handleRemoveVideo = (id: string) => {
    setFormData({
      ...formData,
      videos: (formData.videos || []).filter((v) => v.id !== id)
    });
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url.trim()) return;
    setFormData({
      ...formData,
      gallery: [...(formData.gallery || []), url.trim()]
    });
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData({
      ...formData,
      gallery: (formData.gallery || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setTitleError(isAr ? 'يرجى كتابة عنوان المشروع' : 'Please provide a project title');
      return;
    }
    setTitleError(null);
    onSave(formData);
  };

  return (
    <div className="bg-[#171717] rounded-2xl border border-[#2b2b2b] p-4 sm:p-7 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2b2b2b]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-black">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#f1f2ed] uppercase font-quicksand">
              {project 
                ? (isAr ? 'تعديل مشروع العمل' : 'Edit Portfolio Project') 
                : (isAr ? 'إنشاء مشروع عمل جديد' : 'Create New Portfolio Project')}
            </h2>
            <p className="text-xs text-[#a8a6a1] font-mono">
              ID: {formData.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project && onDelete && (
            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              className="p-2 rounded-xl text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/30 transition-colors cursor-pointer"
              title={isAr ? 'حذف المشروع' : 'Delete Project'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
              {isAr ? 'عنوان المشروع *' : 'Project Title *'}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (e.target.value.trim()) setTitleError(null);
              }}
              placeholder={isAr ? 'مثال: VORTEX: إعلان رياضي سينمائي' : 'e.g. VORTEX: Athletic Commercial'}
              className={`w-full px-4 py-2.5 rounded-xl bg-[#232323] border ${
                titleError ? 'border-red-500' : 'border-[#2b2b2b]'
              } focus:border-[#2563eb] focus:outline-none text-sm text-[#f1f2ed]`}
            />
            {titleError && (
              <p className="text-xs text-red-400 mt-1">{titleError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
              {isAr ? 'التصنيف *' : 'Category *'}
            </label>
            <div className="space-y-2">
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Commercial & Brand Ads"
                className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-sm text-[#f1f2ed]"
              />
              {/* Category Quick Chips */}
              <div className="flex flex-wrap gap-1.5">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      formData.category === cat
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#1f1f1f] text-[#706e6a] hover:text-[#f1f2ed]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
              {isAr ? 'العميل / العلامة التجارية' : 'Client / Brand'}
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder={isAr ? 'مثال: شركة نايكي أو علامة تجارية' : 'e.g. Vortex Athletics, Solace Music'}
              className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-sm text-[#f1f2ed]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
              {isAr ? 'سنة الإصدار' : 'Release Year'}
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2026"
              className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-sm text-[#f1f2ed] font-mono"
            />
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
            {isAr ? 'الوصف الإبداعي وسياق الفيلم' : 'Creative Narrative & Technical Context'}
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={isAr ? 'أدخل نبذة عن مفهوم التصوير، الكاميرا والعدسات المستخدمة، الإضاءة، ورؤية الإخراج...' : 'Describe the shooting concept, camera equipment, mood, and client goals...'}
            className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-sm text-[#f1f2ed] resize-none"
          />
        </div>

        {/* Cover Image Upload (DIRECT DESKTOP UPLOAD CAPABILITY) */}
        <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#f1f2ed] font-bold">
                {isAr ? 'صورة الغلاف الرئيسية (رفع من الكمبيوتر مباشرة)' : 'Cover Image (Desktop Upload & Drag-and-Drop)'}
              </h3>
            </div>
            <span className="text-[10px] text-[#706e6a]">
              {isAr ? 'يدعم السحب والإفلات أو التصفح' : 'Drag & drop image or browse file'}
            </span>
          </div>

          <ImageUploadDropzone
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            aspectRatio="aspect-[16/10]"
            placeholder="https://images.unsplash.com/..."
            helperText={isAr ? 'الصورة تظهر في واجهة المعرض وشبكة الأعمال الرئيسية' : 'Displays as the primary project card in the public portfolio grid'}
          />
        </div>

        {/* YouTube Video Management */}
        <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#f1f2ed] font-bold">
                {isAr ? 'إدارة فيديوهات يوتيوب (تضمين Iframe 4K)' : 'YouTube Videos Management (Embed & Preview)'}
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              {formData.videos?.length || 0} {isAr ? 'فيديو مرفق' : 'videos attached'}
            </span>
          </div>

          {/* Attached Videos List */}
          {formData.videos && formData.videos.length > 0 ? (
            <div className="space-y-4">
              {formData.videos.map((vid, idx) => (
                <div key={vid.id || idx} className="p-3 sm:p-4 rounded-xl bg-[#232323] border border-[#2b2b2b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      <span className="text-xs sm:text-sm font-bold text-[#f1f2ed] truncate">
                        {vid.title || 'Untitled Video'}
                      </span>
                      <span className="text-[10px] font-mono text-[#a8a6a1] bg-[#1d1d1d] px-2 py-0.5 rounded border border-[#2b2b2b]">
                        ID: {vid.videoId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(vid.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                      title={isAr ? 'حذف الفيديو' : 'Remove Video'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {vid.caption && (
                    <p className="text-xs text-[#a8a6a1] italic">
                      {vid.caption}
                    </p>
                  )}

                  {/* Live Embed Preview of attached video */}
                  <div className="max-w-md rounded-lg overflow-hidden border border-[#2b2b2b]">
                    <YouTubeEmbed videoId={vid.videoId} title={vid.title} lazyLoad={true} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#706e6a] italic">
              {isAr ? 'لا توجد فيديوهات مضافة بعد. أضف رابط فيديو من يوتيوب أدناه:' : 'No YouTube videos attached yet. Add one below:'}
            </p>
          )}

          {/* Add YouTube Video Controls */}
          <div className="pt-3 border-t border-[#232323] space-y-3">
            <h4 className="text-xs font-semibold text-[#f1f2ed]">
              {isAr ? 'إضافة فيديو يوتيوب جديد' : 'Attach New YouTube Video'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                placeholder={isAr ? 'عنوان الفيديو (مثال: العرض الرسمي 4K)' : 'Video Title (e.g. Official 4K Master)'}
                className="px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
              />
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder={isAr ? 'رابط يوتيوب أو المعرف (11 حرفاً)' : 'https://youtube.com/watch?v=... or ID'}
                className="px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] font-mono"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newVideoCaption}
                onChange={(e) => setNewVideoCaption(e.target.value)}
                placeholder={isAr ? 'ملاحظة تقنية (مثال: Sony FX6 • Cooke Anamorphic Lenses)' : 'Technical caption (e.g. Sony FX6 • Cooke Anamorphic Lenses)'}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                disabled={!newVideoUrl.trim()}
                className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] disabled:opacity-40 text-white text-xs font-semibold uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إضافة الفيديو' : 'Add Video'}</span>
              </button>
            </div>

            {videoError && (
              <p className="text-xs text-red-400">{videoError}</p>
            )}

            {/* Instant Live Preview of typed YouTube URL */}
            {previewVideoId && (
              <div className="p-3 rounded-xl bg-[#232323] border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? `تم التعرف على معرف الفيديو: ${previewVideoId}` : `Valid YouTube ID Detected: ${previewVideoId}`}</span>
                </div>
                <div className="max-w-xs">
                  <YouTubeEmbed videoId={previewVideoId} title="Test Preview" lazyLoad={false} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cinematography Stills / Gallery (Direct Desktop Upload) */}
        <div className="p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-[#2563eb]" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#f1f2ed] font-bold">
                {isAr ? 'لقطات من الفيلم وكواليس التصوير' : 'Production Stills & Gallery'}
              </h3>
            </div>
            <span className="text-[10px] text-[#706e6a]">
              {formData.gallery?.length || 0} {isAr ? 'لقطة' : 'stills'}
            </span>
          </div>

          {formData.gallery && formData.gallery.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {formData.gallery.map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[#2b2b2b] group">
                  <img src={url} alt={`Still ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute top-1 right-1 p-1 rounded bg-black/80 text-red-400 hover:text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Still from Desktop or URL */}
          <div className="pt-2">
            <ImageUploadDropzone
              value={newGalleryUrl}
              onChange={(url) => {
                if (url) {
                  handleAddGalleryImage(url);
                }
              }}
              label={isAr ? 'رفع لقطة جديدة من جهازك' : 'Upload New Still from Desktop'}
              aspectRatio="aspect-video"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Visibility, Featured Status, Order */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2b2b2b]">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded text-[#2563eb] focus:ring-0 bg-[#232323] border-[#2b2b2b]"
            />
            <span className="text-xs font-medium text-[#f1f2ed]">
              {isAr ? 'منشور في الموقع' : 'Published to Public Site'}
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-[#2563eb] focus:ring-0 bg-[#232323] border-[#2b2b2b]"
            />
            <span className="text-xs font-medium text-[#f1f2ed]">
              {isAr ? 'شارة عمل مميز (Featured)' : 'Featured Project Badge'}
            </span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-[#a8a6a1]">
              {isAr ? 'الترتيب:' : 'Order:'}
            </span>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
              className="w-20 px-3 py-1.5 rounded-lg bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] font-mono"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2b2b2b]">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold text-[#a8a6a1] hover:text-white transition-colors"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ المشروع' : 'Save Project'}</span>
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {project && onDelete && (
        <ConfirmModal
          isOpen={deleteConfirmOpen}
          title={isAr ? 'حذف المشروع' : 'Delete Project'}
          message={isAr 
            ? `هل أنت متأكد من رغبتك في حذف هذا المشروع (${formData.title || 'بدون عنوان'})؟ لا يمكن التراجع عن هذا الإجراء.` 
            : `Are you sure you want to delete project "${formData.title || 'Untitled'}"? This action cannot be undone.`}
          confirmLabel={isAr ? 'تأكيد الحذف' : 'Delete Project'}
          cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
          variant="danger"
          onConfirm={() => {
            onDelete(formData.id);
            setDeleteConfirmOpen(false);
          }}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
}
