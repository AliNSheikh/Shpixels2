import { useState } from 'react';
import { Menu, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Eye, EyeOff, Save, Check } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { NavigationItem } from '../../types/content';
import { ConfirmModal } from '../common/ConfirmModal';

export function NavigationManager() {
  const { content, updateSection } = useContent();
  const [navItems, setNavItems] = useState<NavigationItem[]>([...content.navigation].sort((a, b) => a.order - b.order));
  const [isSaved, setIsSaved] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // New item modal
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<NavigationItem>({
    id: `nav-${Date.now()}`,
    label: '',
    href: '#',
    order: navItems.length + 1,
    visible: true
  });

  const handleToggleVisible = (id: string) => {
    const updated = navItems.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item));
    setNavItems(updated);
    updateSection('navigation', updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navItems.length) return;

    const list = [...navItems];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // reassign order numbers
    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavItems(updated);
    updateSection('navigation', updated);
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
  };

  const handleSaveItemChanges = (index: number, field: keyof NavigationItem, value: any) => {
    const updated = [...navItems];
    updated[index] = { ...updated[index], [field]: value };
    setNavItems(updated);
    updateSection('navigation', updated);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.label || !newItem.href) return;
    const updated = [...navItems, newItem];
    setNavItems(updated);
    updateSection('navigation', updated);
    setIsAdding(false);
    setNewItem({
      id: `nav-${Date.now()}`,
      label: '',
      href: '#',
      order: updated.length + 1,
      visible: true
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2b2b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
            Header & Footer Navigation Menu
          </h2>
          <p className="text-xs text-[#a8a6a1]">
            Control the order, labels, target anchors, and visibility of header navigation links.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Nav Items List */}
      <div className="rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#171717] border-b border-[#2b2b2b] hidden sm:grid grid-cols-12 gap-4 text-[10px] font-mono uppercase tracking-wider text-[#706e6a]">
          <span className="col-span-1 text-center">Order</span>
          <span className="col-span-4">Menu Label</span>
          <span className="col-span-4">Target Anchor / URL</span>
          <span className="col-span-3 text-right">Actions</span>
        </div>

        <div className="divide-y divide-[#232323]">
          {navItems.map((item, index) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:grid sm:grid-cols-12 gap-3 items-center hover:bg-[#232323]/50 transition-colors"
            >
              {/* Reorder Buttons */}
              <div className="sm:col-span-1 flex items-center justify-center gap-1 text-[#706e6a]">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:text-[#f1f2ed] disabled:opacity-20"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono">{index + 1}</span>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === navItems.length - 1}
                  className="p-1 hover:text-[#f1f2ed] disabled:opacity-20"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Label */}
              <div className="w-full sm:col-span-4">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleSaveItemChanges(index, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              {/* Link */}
              <div className="w-full sm:col-span-4">
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleSaveItemChanges(index, 'href', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
              </div>

              {/* Visibility and Delete */}
              <div className="w-full sm:col-span-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleToggleVisible(item.id)}
                  className={`p-2 rounded-lg text-xs flex items-center gap-1 ${
                    item.visible ? 'text-emerald-400 hover:bg-emerald-950/40' : 'text-[#706e6a] hover:bg-[#232323]'
                  }`}
                  title={item.visible ? 'Visible (Click to hide)' : 'Hidden (Click to show)'}
                >
                  {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#171717] border border-[#2b2b2b] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              Add Navigation Item
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  Menu Label *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.label}
                  onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                  placeholder="e.g. Services, Contact, Awards"
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1">
                  Target Link / Anchor *
                </label>
                <input
                  type="text"
                  required
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  placeholder="e.g. #services, #contact, https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2b2b2b]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg bg-[#232323] text-xs text-[#a8a6a1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold text-white uppercase"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Delete Navigation Link"
        message="Are you sure you want to delete this navigation link?"
        confirmLabel="Delete Link"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          if (itemToDelete) {
            const updated = navItems.filter((i) => i.id !== itemToDelete);
            setNavItems(updated);
            updateSection('navigation', updated);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
