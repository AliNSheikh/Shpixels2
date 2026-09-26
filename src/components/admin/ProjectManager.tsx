import { useState, useRef } from 'react';
import { 
  Plus, Edit3, Trash2, Copy, Eye, EyeOff, Sparkles, 
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Video, 
  FolderKanban, Search, GripVertical, Check, ArrowUpDown,
  Tag
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectItem } from '../../types/content';
import { ProjectEditorModal } from './ProjectEditorModal';
import { CategoryManager } from './CategoryManager';
import { ConfirmModal } from '../common/ConfirmModal';

export function ProjectManager() {
  const { 
    content, 
    categories: contextCategories, 
    updateProject, 
    addProject, 
    deleteProject, 
    duplicateProject, 
    reorderProjects 
  } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [justSavedNotification, setJustSavedNotification] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  // Drag and Drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  // Directly sorted projects list based on stored order
  const projects = [...content.projects].sort((a, b) => a.order - b.order);

  // Dynamically derived from context categories
  const categories = ['All', ...(contextCategories && contextCategories.length > 0 
    ? contextCategories 
    : Array.from(new Set(projects.map((p) => p.category).filter(Boolean))))];

  const isFiltering = searchQuery.trim() !== '' || filterCategory !== 'All';

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const showSaveNotice = (msg: string) => {
    setJustSavedNotification(msg);
    setTimeout(() => setJustSavedNotification(null), 2500);
  };

  const handleEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setEditorOpen(true);
  };

  const handleCreateNew = () => {
    setEditingProject(null);
    setEditorOpen(true);
  };

  const handleSave = (project: ProjectItem) => {
    const exists = content.projects.some((p) => p.id === project.id);
    if (exists) {
      updateProject(project);
      showSaveNotice(isAr ? 'تم تحديث المشروع وحفظه' : 'Project updated and persisted');
    } else {
      addProject(project);
      showSaveNotice(isAr ? 'تمت إضافة المشروع الجديد' : 'New project added and persisted');
    }
  };

  const handleTogglePublish = (project: ProjectItem) => {
    updateProject({ ...project, published: !project.published });
    showSaveNotice(project.published ? (isAr ? 'تم إخفاء المشروع' : 'Project hidden') : (isAr ? 'تم نشر المشروع' : 'Project published'));
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    updateProject({ ...project, featured: !project.featured });
    showSaveNotice(isAr ? 'تم تحديث حالة التمييز' : 'Featured status updated');
  };

  // Reorder helper: moves item from fromIndex to toIndex in projects array and calls reorderProjects
  const moveItemToIndex = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    const orderedIds = updated.map((p) => p.id);
    reorderProjects(orderedIds);
    showSaveNotice(isAr ? `تم نقل "${moved.title}" إلى الموقع #${toIndex + 1}` : `Moved "${moved.title}" to position #${toIndex + 1}`);
  };

  // Up/Down step movement
  const handleStepMove = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    moveItemToIndex(currentIndex, targetIndex);
  };

  // Move directly to absolute Top or Bottom
  const handleMoveToExtreme = (currentIndex: number, target: 'top' | 'bottom') => {
    const targetIndex = target === 'top' ? 0 : projects.length - 1;
    moveItemToIndex(currentIndex, targetIndex);
  };

  // Direct numeric index input change
  const handleDirectIndexInput = (currentIndex: number, inputValue: string) => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed)) return;
    const targetIndex = Math.max(0, Math.min(projects.length - 1, parsed - 1));
    if (targetIndex !== currentIndex) {
      moveItemToIndex(currentIndex, targetIndex);
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    dragNodeRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexStr = e.dataTransfer.getData('text/plain');
    const sourceIndex = sourceIndexStr ? parseInt(sourceIndexStr, 10) : draggedIndex;

    if (sourceIndex !== null && sourceIndex !== undefined && sourceIndex !== targetIndex) {
      // Find actual index in global projects list if filtering was applied
      const sourceProject = filteredProjects[sourceIndex];
      const targetProject = filteredProjects[targetIndex];

      if (sourceProject && targetProject) {
        const globalSourceIndex = projects.findIndex((p) => p.id === sourceProject.id);
        const globalTargetIndex = projects.findIndex((p) => p.id === targetProject.id);

        if (globalSourceIndex !== -1 && globalTargetIndex !== -1) {
          moveItemToIndex(globalSourceIndex, globalTargetIndex);
        }
      }
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2b2b]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
              {isAr ? `إدارة المشاريع وترتيب العرض (${projects.length})` : `Portfolio Projects & Reordering (${projects.length})`}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#232323] text-emerald-400 border border-emerald-900/40">
              <ArrowUpDown className="w-3 h-3" />
              {isAr ? 'سحب وإفلات متاح' : 'Drag & Drop Active'}
            </span>
          </div>
          <p className="text-xs text-[#a8a6a1]">
            {isAr 
              ? 'يمكنك سحب أي بطاقة بواسطة المقبض أو كتابة رقم الترتيب يدوياً لتغيير تسلسل العرض في الموقع العام مع الحفظ الفوري.' 
              : 'Reorder projects via drag-and-drop or direct index jump. Changes are instantly saved and synchronized.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {justSavedNotification && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-400 font-mono animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              <span>{justSavedNotification}</span>
            </div>
          )}

          <button
            onClick={() => setCategoryManagerOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] border border-[#2b2b2b] text-xs font-semibold uppercase tracking-wider text-[#f1f2ed] transition-all cursor-pointer"
            title={isAr ? 'إدارة تصنيفات المشاريع' : 'Manage Categories'}
          >
            <Tag className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>{isAr ? 'إدارة التصنيفات' : 'Categories'}</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة مشروع جديد' : 'New Project'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Notice Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#706e6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالعنوان، العميل، أو التصنيف...' : 'Search projects by title, client, or category...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {isAr ? `التصنيف: ${c === 'All' ? 'الكل' : c}` : `Category: ${c}`}
            </option>
          ))}
        </select>

        {isFiltering && (
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('All');
            }}
            className="px-3 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs text-[#a8a6a1] hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          >
            {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
          </button>
        )}
      </div>

      {isFiltering && (
        <div className="p-3 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] flex items-center justify-between text-xs text-[#a8a6a1]">
          <span>
            {isAr 
              ? `عرض ${filteredProjects.length} من أصل ${projects.length} مشروع. (لترتيب القائمة الكاملة يُفضّل اختيار "الكل")`
              : `Displaying ${filteredProjects.length} of ${projects.length} projects. (Select 'All' to view complete portfolio sequence)`}
          </span>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('All');
            }}
            className="text-[#3b82f6] hover:underline font-mono text-[11px]"
          >
            {isAr ? 'عرض الكل' : 'Show All'}
          </button>
        </div>
      )}

      {/* Projects List with Drag and Drop & Index Controls */}
      <div className="rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] overflow-hidden shadow-xl">
        <div className="divide-y divide-[#232323]">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-[#706e6a] space-y-2">
              <FolderKanban className="w-8 h-8 mx-auto text-[#2b2b2b]" />
              <p className="text-sm">{isAr ? 'لا توجد مشاريع تطابق شروط البحث.' : 'No projects match the criteria.'}</p>
            </div>
          ) : (
            filteredProjects.map((project, index) => {
              const globalIndex = projects.findIndex((p) => p.id === project.id);
              const displayOrder = (globalIndex !== -1 ? globalIndex : index) + 1;
              const isDragged = draggedIndex === index;
              const isOver = dragOverIndex === index;

              return (
                <div
                  key={`${project.id || 'p'}-${index}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-150 ${
                    isDragged
                      ? 'opacity-40 bg-[#232323] scale-[0.99] border-2 border-dashed border-[#2563eb]'
                      : isOver
                      ? 'bg-[#232323] border-t-2 border-t-[#2563eb]'
                      : 'hover:bg-[#232323]/50'
                  }`}
                >
                  {/* Left / Main Section: Drag Handle, Index Controls, Thumbnail, and Details */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Drag Handle & Numeric Reorder Controls */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                      {/* Drag Handle */}
                      <div 
                        className="p-1 sm:p-1.5 rounded-lg text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#2b2b2b] cursor-grab active:cursor-grabbing transition-colors"
                        title={isAr ? 'اسحب لتغيير ترتيب العرض' : 'Drag to reorder'}
                      >
                        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      {/* Directional Step Arrows & Quick Jump to Top/Bottom */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleStepMove(globalIndex, 'up')}
                          disabled={globalIndex === 0}
                          className="p-0.5 rounded text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#2b2b2b] disabled:opacity-20 disabled:hover:text-[#706e6a] cursor-pointer"
                          title={isAr ? 'تحريك خطوة لأعلى' : 'Move Up'}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>

                        {/* Direct Editable Position Input */}
                        <div className="my-0.5" title={isAr ? 'اكتب رقم الترتيب المطلوب واضغط Enter' : 'Enter target index and press Enter'}>
                          <input
                            type="number"
                            min={1}
                            max={projects.length}
                            value={displayOrder}
                            onChange={(e) => handleDirectIndexInput(globalIndex, e.target.value)}
                            className="w-9 h-6 rounded bg-[#171717] border border-[#2b2b2b] text-[11px] font-mono text-center text-[#f1f2ed] focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>

                        <button
                          onClick={() => handleStepMove(globalIndex, 'down')}
                          disabled={globalIndex === projects.length - 1}
                          className="p-0.5 rounded text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#2b2b2b] disabled:opacity-20 disabled:hover:text-[#706e6a] cursor-pointer"
                          title={isAr ? 'تحريك خطوة لأسفل' : 'Move Down'}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Fast Extreme Jump buttons (Top / Bottom) */}
                      <div className="hidden sm:flex flex-col gap-1 pl-1">
                        <button
                          onClick={() => handleMoveToExtreme(globalIndex, 'top')}
                          disabled={globalIndex === 0}
                          className="p-1 rounded text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#2b2b2b] disabled:opacity-20 cursor-pointer"
                          title={isAr ? 'نقل مباشرة إلى البداية' : 'Move to Top'}
                        >
                          <ChevronsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveToExtreme(globalIndex, 'bottom')}
                          disabled={globalIndex === projects.length - 1}
                          className="p-1 rounded text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#2b2b2b] disabled:opacity-20 cursor-pointer"
                          title={isAr ? 'نقل مباشرة إلى النهاية' : 'Move to Bottom'}
                        >
                          <ChevronsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail Cover */}
                    <div className="relative w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden bg-[#232323] border border-[#2b2b2b] flex-shrink-0">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      {project.videos && project.videos.length > 0 && (
                        <span className="absolute bottom-1 right-1 p-0.5 rounded bg-black/80 text-[#2563eb]" title="4K YouTube Film Included">
                          <Video className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Title, Category & Metadata */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-base font-bold text-[#f1f2ed] line-clamp-1 font-quicksand">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase bg-[#2563eb]/20 text-[#38bdf8] border border-[#2563eb]/40 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> {isAr ? 'مميز' : 'Featured'}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-[#706e6a] bg-[#171717] px-2 py-0.5 rounded border border-[#232323]">
                          #{displayOrder} {isAr ? 'في العرض' : 'in order'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#a8a6a1] flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#232323] text-[10px] font-mono uppercase">
                          {project.category}
                        </span>
                        <span>•</span>
                        <span>{project.client || 'Client N/A'}</span>
                        <span>•</span>
                        <span className="font-mono">{project.year}</span>
                        {project.videos && project.videos.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-[#2563eb] text-[11px] font-mono hidden md:inline">
                              YT: {project.videos[0].videoId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Toggle, Duplicate, Edit, Delete Actions */}
                  <div className="flex items-center gap-1.5 self-end lg:self-auto flex-shrink-0 pt-2 lg:pt-0 border-t border-[#232323] lg:border-t-0 w-full lg:w-auto justify-end">
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                        project.published
                          ? 'text-emerald-400 hover:bg-emerald-950/40'
                          : 'text-[#706e6a] hover:bg-[#232323]'
                      }`}
                      title={project.published ? (isAr ? 'منشور (انقر للإخفاء)' : 'Published (Click to hide)') : (isAr ? 'مخفي (انقر للنشر)' : 'Hidden (Click to publish)')}
                    >
                      {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        project.featured
                          ? 'text-[#38bdf8] hover:bg-[#2563eb]/20'
                          : 'text-[#706e6a] hover:bg-[#232323]'
                      }`}
                      title={project.featured ? (isAr ? 'مميز في الأعلى' : 'Featured on Top') : (isAr ? 'تمييز المشروع' : 'Mark as Featured')}
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        duplicateProject(project.id);
                        showSaveNotice(isAr ? 'تم تكرار المشروع' : 'Project duplicated');
                      }}
                      className="p-2 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
                      title={isAr ? 'تكرار المشروع' : 'Duplicate Project'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 rounded-lg text-[#a8a6a1] hover:text-white hover:bg-[#232323] transition-colors cursor-pointer"
                      title={isAr ? 'تعديل المشروع' : 'Edit Project'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                      title={isAr ? 'حذف المشروع' : 'Delete Project'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <ProjectEditorModal
        project={editingProject}
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        onDelete={deleteProject}
      />

      {/* Category Manager Modal */}
      {categoryManagerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#171717] border border-[#2b2b2b] p-6 shadow-2xl">
            <CategoryManager 
              onClose={() => setCategoryManagerOpen(false)}
              onSelectCategory={(cat) => {
                setFilterCategory(cat);
                setCategoryManagerOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title={isAr ? 'حذف المشروع' : 'Delete Project'}
        message={isAr 
          ? `هل أنت متأكد من رغبتك في حذف المشروع "${projectToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
          : `Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmLabel={isAr ? 'تأكيد الحذف' : 'Delete Project'}
        cancelLabel={isAr ? 'إلغاء' : 'Cancel'}
        variant="danger"
        onConfirm={() => {
          if (projectToDelete) {
            deleteProject(projectToDelete.id);
            showSaveNotice(isAr ? 'تم حذف المشروع' : 'Project deleted');
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
}
