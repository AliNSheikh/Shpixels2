import { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit3, Check, RefreshCw, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { GalleryItem } from '../../types/content';
import { ImageUploadDropzone } from '../common/ImageUploadDropzone';
import { ConfirmModal } from '../common/ConfirmModal';
import { useLanguage } from '../../context/LanguageContext';

export function MediaManager() {
  const { content, updateContent, updateSection } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [heroBgInput, setHeroBgInput] = useState(content.hero.bgImageUrl || '');
  const [profileImgInput, setProfileImgInput] = useState(content.about.profileImage || '');
  const [logoInput, setLogoInput] = useState(content.branding.logoImage || '/assets/shpixels-logo.svg');
  const [faviconInput, setFaviconInput] = useState(content.branding.favicon || content.seo.favicon || '/assets/shpixels-icon.svg');
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const handleSaveLogo = (url: string) => {
    setLogoInput(url);
    updateContent({
      branding: { ...content.branding, logoImage: url }
    });
    setSavedKey('logo');
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleSaveFavicon = (url: string) => {
    setFaviconInput(url);
    updateContent({
      branding: { ...content.branding, favicon: url },
      seo: { ...content.seo, favicon: url }
    });
    setSavedKey('favicon');
    setTimeout(() => setSavedKey(null), 2000);
  };

  // Gallery item add/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formItem, setFormItem] = useState<GalleryItem>({
    id: `gal-${Date.now()}`,
    title: '',
    image: '',
    category: 'Production Stills',
    caption: ''
  });

  const handleSaveHeroBg = (url: string) => {
    setHeroBgInput(url);
    updateContent({
      hero: { ...content.hero, bgImageUrl: url }
    });
    setSavedKey('heroBg');
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleSaveProfileImg = (url: string) => {
    setProfileImgInput(url);
    updateContent({
      about: { ...content.about, profileImage: url }
    });
    setSavedKey('profileImg');
    setTimeout(() => setSavedKey(null), 2000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormItem({
      id: `gal-${Date.now()}`,
      title: '',
      image: '',
      category: 'Behind the Scenes',
      caption: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormItem(item);
    setIsModalOpen(true);
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItem.image || !formItem.title) return;

    if (editingItem) {
      const updated = content.gallery.map((g) => (g.id === formItem.id ? formItem : g));
      updateSection('gallery', updated);
    } else {
      const updated = [formItem, ...content.gallery];
      updateSection('gallery', updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-[#2b2b2b]">
        <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
          {isAr ? 'إدارة الوسائط والصور (رفع مباشر من الكمبيوتر)' : 'Media & Image Management (Direct Desktop Upload)'}
        </h2>
        <p className="text-xs text-[#a8a6a1]">
          {isAr 
            ? 'إدارة مركزية لصور خلفية البداية، وصورة المخرج، وصور كواليس التصوير السينمائي مع دعم السحب والإفلات من سطح المكتب.'
            : 'Centralized management for hero backgrounds, director portraits, project covers, and cinematography gallery stills with direct desktop drag-and-drop.'}
        </p>
      </div>

      {/* Global Brand Assets Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Logo */}
        <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#232323]">
            <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
              {isAr ? 'شعار الموقع (Website Logo)' : 'Website Logo (Header & Footer)'}
            </h3>
            {savedKey === 'logo' && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isAr ? 'تم الحفظ' : 'Saved'}
              </span>
            )}
          </div>

          <ImageUploadDropzone
            value={logoInput}
            onChange={handleSaveLogo}
            aspectRatio="aspect-[4/1]"
            previewFit="contain"
            placeholder="/assets/shpixels-logo.svg or https://..."
            helperText={isAr ? 'رفع ملف الشعار بصيغة PNG شفافة أو SVG' : 'Upload custom logo file (transparent PNG or SVG recommended)'}
          />
        </div>

        {/* Browser Favicon */}
        <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#232323]">
            <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
              {isAr ? 'أيقونة المتصفح (Browser Favicon)' : 'Browser Favicon (.ico, .svg, .png)'}
            </h3>
            {savedKey === 'favicon' && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isAr ? 'تم الحفظ' : 'Saved'}
              </span>
            )}
          </div>

          <ImageUploadDropzone
            value={faviconInput}
            onChange={handleSaveFavicon}
            aspectRatio="aspect-square"
            previewFit="contain"
            compact={true}
            placeholder="/assets/shpixels-icon.svg or https://..."
            helperText={isAr ? 'رفع أيقونة المتصفح بدقة 32×32 أو 64×64 أو SVG' : 'Upload browser icon file (32×32px, 64×64px, or vector SVG)'}
          />
        </div>
      </div>

      {/* Global Hero & Profile Image Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero Background Image */}
        <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#232323]">
            <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
              {isAr ? 'خلفية الواجهة الرئيسية (Hero)' : 'Hero Section Background'}
            </h3>
            {savedKey === 'heroBg' && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isAr ? 'تم الحفظ' : 'Saved'}
              </span>
            )}
          </div>

          <ImageUploadDropzone
            value={heroBgInput}
            onChange={handleSaveHeroBg}
            aspectRatio="aspect-[21/9]"
            placeholder="https://..."
            helperText={isAr ? 'يمكنك سحب وإفلات صورة عالية الدقة مباشرة من جهازك' : 'Drag & drop a high-res wide background photo or enter URL'}
          />
        </div>

        {/* Director Profile Photo */}
        <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#232323]">
            <h3 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
              {isAr ? 'صورة المخرج الشخصية (عن المخرج)' : 'Director Portrait (Sharif Abs)'}
            </h3>
            {savedKey === 'profileImg' && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="w-3 h-3" /> {isAr ? 'تم الحفظ' : 'Saved'}
              </span>
            )}
          </div>

          <ImageUploadDropzone
            value={profileImgInput}
            onChange={handleSaveProfileImg}
            aspectRatio="aspect-[4/5]"
            placeholder="https://..."
            helperText={isAr ? 'صورة عمودية بدقة عالية للمخرج في موقع التصوير' : 'Vertical cinematic portrait of the director on set'}
          />
        </div>
      </div>

      {/* Production Stills / Gallery Management */}
      <div className="p-5 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232323]">
          <div>
            <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              {isAr ? 'لقطات المعرض وكواليس التصوير (BTS Stills)' : 'Public Gallery & BTS Stills'}
            </h3>
            <p className="text-xs text-[#a8a6a1]">
              {isAr ? 'الصور المعروضة في قسم معرض موقع التصوير والكاميرات' : 'Stills displayed in the public "On Set / BTS" section'}
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة لقطة جديدة' : 'Add New Still'}</span>
          </button>
        </div>

        {/* Stills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {content.gallery.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#232323] border border-[#2b2b2b] hover:border-[#2563eb] transition-colors"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 rounded bg-black/70 text-white hover:bg-[#2563eb] transition-colors"
                    title={isAr ? 'تعديل' : 'Edit'}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1 rounded bg-black/70 text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    title={isAr ? 'حذف' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white line-clamp-1">{item.title}</p>
                  <p className="text-[9px] text-[#a8a6a1] font-mono">{item.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Still Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#171717] border border-[#2b2b2b] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2b2b2b]">
              <h4 className="text-sm font-bold text-[#f1f2ed] uppercase font-quicksand">
                {editingItem 
                  ? (isAr ? 'تعديل لقطة التصوير' : 'Edit Cinematography Still') 
                  : (isAr ? 'إضافة لقطة جديدة' : 'Add New Cinematography Still')}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-[#706e6a] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  {isAr ? 'عنوان اللقطة *' : 'Still Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={formItem.title}
                  onChange={(e) => setFormItem({ ...formItem, title: e.target.value })}
                  placeholder={isAr ? 'مثال: نظام الإضاءة السينمائي' : 'e.g. Anamorphic Rigging on Track'}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  {isAr ? 'التصنيف' : 'Category'}
                </label>
                <input
                  type="text"
                  value={formItem.category}
                  onChange={(e) => setFormItem({ ...formItem, category: e.target.value })}
                  placeholder="Behind the Scenes / Lighting / Framing"
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
                />
              </div>

              {/* Direct Desktop Upload for the Still Image */}
              <ImageUploadDropzone
                value={formItem.image}
                onChange={(url) => setFormItem({ ...formItem, image: url })}
                label={isAr ? 'ملف الصورة (رفع من الكمبيوتر أو رابط)' : 'Image File (Upload or URL)'}
                aspectRatio="aspect-[4/3]"
                placeholder="https://..."
              />

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  {isAr ? 'ملاحظة تقنية (اختياري)' : 'Technical Caption (Optional)'}
                </label>
                <input
                  type="text"
                  value={formItem.caption || ''}
                  onChange={(e) => setFormItem({ ...formItem, caption: e.target.value })}
                  placeholder={isAr ? 'مثال: Sony FX6 مع عدسات Cooke Anamorphic' : 'e.g. Sony FX6 rigged with Cooke Anamorphic'}
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2b2b2b]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs text-[#a8a6a1]"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!formItem.image || !formItem.title}
                  className="px-5 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] disabled:opacity-40 text-xs font-semibold uppercase text-white"
                >
                  {isAr ? 'حفظ اللقطة' : 'Save Still'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title={isAr ? 'حذف اللقطة' : 'Delete Still'}
        message={isAr 
          ? `هل أنت متأكد من رغبتك في حذف "${itemToDelete?.title || 'هذه اللقطة'}"؟` 
          : `Are you sure you want to delete "${itemToDelete?.title || 'this still'}"?`}
        confirmLabel={isAr ? 'تأكيد الحذف' : 'Delete'}
        cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
        variant="danger"
        onConfirm={() => {
          if (itemToDelete) {
            const updated = content.gallery.filter((g) => g.id !== itemToDelete.id);
            updateSection('gallery', updated);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
