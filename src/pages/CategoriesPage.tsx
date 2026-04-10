import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryDrawer } from '@/components/categories/CategoryDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  categoriesApi,
  type CategoryDTO,
  type CategoryMeta,
} from '@/services/api';

/* ─── Types ─── */
export interface Category {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  itemCount: number;
  type: string;
  visible: boolean;
  displayOrder: number;
  imageUrl?: string;
}

type FilterType = 'all' | 'visible' | 'hidden';
type SortType = 'order' | 'name' | 'items' | 'recent';

/* ─── SVG Icons ─── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ReorderIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

/* ─── Default meta ─── */
const DEFAULT_META: CategoryMeta = { total: 0, visible: 0, hidden: 0, totalItems: 0 };

/* ─── Skeleton card for loading state ─── */
const SkeletonCard = () => (
  <div
    className="rounded-[14px] overflow-hidden"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
  >
    <div className="animate-pulse" style={{ height: 130, background: 'var(--bg-hover)' }} />
    <div className="px-[14px] py-3">
      <div className="animate-pulse rounded h-4 w-3/4 mb-2" style={{ background: 'var(--bg-hover)' }} />
      <div className="animate-pulse rounded h-3 w-1/2" style={{ background: 'var(--bg-hover)' }} />
    </div>
    <div className="px-[14px] py-[10px]" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card2)' }}>
      <div className="animate-pulse rounded h-4 w-full" style={{ background: 'var(--bg-hover)' }} />
    </div>
  </div>
);

/* ─── DTO → local type mapper ─── */
function toCategory(dto: CategoryDTO): Category {
  return {
    id: dto.id,
    name: dto.name,
    emoji: dto.emoji,
    bgColor: dto.bgColor,
    itemCount: dto.itemCount,
    type: dto.type,
    visible: dto.visible,
    displayOrder: dto.displayOrder,
    imageUrl: dto.imageUrl,
  };
}

/* ─── Main Page ─── */
export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<CategoryMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('order');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toasts, showToast, dismissToast } = useToast();

  /* ── Fetch all categories on mount ── */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoriesApi.list();
      setCategories(res.data.map(toCategory));
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  /* ── Client-side filter + sort (useMemo over loaded data) ── */
  const filteredCategories = useMemo(() => {
    let result = categories;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }

    if (filter === 'visible') result = result.filter(c => c.visible);
    if (filter === 'hidden') result = result.filter(c => !c.visible);

    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'items') result = [...result].sort((a, b) => b.itemCount - a.itemCount);
    if (sortBy === 'recent') result = [...result]; // already sorted by createdAt from API for 'recent'
    // 'order' → default displayOrder from API

    return result;
  }, [categories, searchQuery, filter, sortBy]);

  /* ── Action handlers ── */
  const handleToggleVisibility = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const newVisible = !cat.visible;
    // Optimistic update
    setCategories(prev => prev.map(c => c.id === id ? { ...c, visible: newVisible } : c));
    setMeta(prev => ({
      ...prev,
      visible: newVisible ? prev.visible + 1 : prev.visible - 1,
      hidden: newVisible ? prev.hidden - 1 : prev.hidden + 1,
    }));
    try {
      await categoriesApi.update(id, { visible: newVisible });
    } catch {
      // Revert on failure
      setCategories(prev => prev.map(c => c.id === id ? { ...c, visible: !newVisible } : c));
      setMeta(prev => ({
        ...prev,
        visible: newVisible ? prev.visible - 1 : prev.visible + 1,
        hidden: newVisible ? prev.hidden + 1 : prev.hidden - 1,
      }));
      showToast('Failed to update visibility', 'error');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setDrawerMode('add');
    setDrawerOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    try {
      await categoriesApi.delete(deletingCategory.id);
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
      setMeta(prev => ({
        ...prev,
        total: prev.total - 1,
        visible: deletingCategory.visible ? prev.visible - 1 : prev.visible,
        hidden: !deletingCategory.visible ? prev.hidden - 1 : prev.hidden,
      }));
      showToast(`"${deletingCategory.name}" deleted`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete category', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setDeletingCategory(null);
    }
  };

  const handleSaveCategory = async (data: { name: string; emoji: string; visible: boolean; order: number; image?: File }) => {
    const fd = new FormData();
    fd.append('name', data.name);
    fd.append('emoji', data.emoji);
    fd.append('visible', String(data.visible));
    fd.append('displayOrder', String(data.order));
    if (data.image) fd.append('image', data.image);

    if (drawerMode === 'edit' && editingCategory) {
      if (!data.image) {
        // Just empty it, or backend handles it, but since we are using formData we might want to tell backend to delete?
        // Wait, the backend replaces or deletes based on what's received usually or we might not need to.
        // Actually, let's keep it simple.
      }
      try {
        const res = await categoriesApi.update(editingCategory.id, fd);
        const updated = toCategory(res.data);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c));
        showToast(`"${updated.name}" updated`, 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to update category', 'error');
      }
    } else {
      fd.append('type', 'Veg');
      try {
        const res = await categoriesApi.create(fd);
        const created = toCategory(res.data);
        setCategories(prev => [...prev, created]);
        setMeta(prev => ({
          ...prev,
          total: prev.total + 1,
          visible: created.visible ? prev.visible + 1 : prev.visible,
          hidden: !created.visible ? prev.hidden + 1 : prev.hidden,
        }));
        showToast(`"${created.name}" created`, 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to create category', 'error');
      }
    }
    setDrawerOpen(false);
  };

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-3 md:gap-4 p-3 md:p-5 md:px-6 bg-[#F7F3EE] min-h-full rounded-xl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Categories
          </h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>
            Manage menu sections — drag to reorder, toggle visibility, add or edit anytime
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            className="flex items-center gap-[6px] px-[14px] py-[9px] rounded-lg text-xs cursor-pointer transition-all"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            <ReorderIcon /> Reorder
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{ background: 'var(--orange)', border: 'none', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}
          >
            <PlusIcon /> Add Category
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        <StatCard icon={<ListIcon />} iconClass="ssi-orange" value={meta.total} label="Total categories" />
        <StatCard icon={<EyeIcon />} iconClass="ssi-green" value={meta.visible} label="Visible on site" />
        <StatCard icon={<EyeOffIcon />} iconClass="ssi-red" value={meta.hidden} label="Hidden" />
        <StatCard icon={<ClipboardIcon />} iconClass="ssi-blue" value={meta.totalItems} label="Total items across all" />
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--red-bg)', border: '1px solid var(--red)', color: 'var(--red)' }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          <span className="flex-1">{error}</span>
          <button
            onClick={fetchCategories}
            className="text-xs font-semibold underline cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'inherit' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-[10px]">
        <div
          className="flex items-center gap-2 flex-1 max-w-[320px] px-3 py-[8px] rounded-lg transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search categories…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="border-none outline-none bg-transparent text-xs w-full"
            style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
          />
        </div>

        {/* Filter buttons */}
        {([
          { key: 'all', label: 'All', icon: <EyeIcon /> },
          { key: 'visible', label: 'Visible', icon: <EyeIcon /> },
          { key: 'hidden', label: 'Hidden', icon: <EyeOffIcon /> },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-lg text-xs cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${filter === f.key ? 'var(--orange)' : 'var(--border)'}`,
              color: filter === f.key ? 'var(--orange)' : 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ color: filter === f.key ? 'var(--orange)' : 'var(--text-secondary)' }}>{f.icon}</span>
            {f.label}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortType)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="order">Sort: Display order</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="items">Sort: Item count</option>
          <option value="recent">Sort: Recently added</option>
        </select>
      </div>

      {/* ── Section Label ── */}
      <div className="text-[11px] font-bold uppercase tracking-[.08em] mt-1" style={{ color: 'var(--text-muted)' }}>
        {filter === 'all' ? `All categories (${filteredCategories.length})` :
          filter === 'visible' ? `Visible categories (${filteredCategories.length})` :
            `Hidden categories (${filteredCategories.length})`}
      </div>

      {/* ── Category Grid ── */}
      {loading ? (
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))' }}>
          {filteredCategories.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={i}
              onToggle={() => handleToggleVisibility(cat.id)}
              onEdit={() => handleEdit(cat)}
              onDelete={() => handleDelete(cat)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[60px] gap-3 text-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12" style={{ fill: 'var(--border-strong)' }}>
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>No categories found</h3>
          <p className="text-xs max-w-[260px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {searchQuery ? 'Try a different search term' : 'Get started by adding your first category'}
          </p>
        </div>
      )}

      {/* ── Drawer ── */}
      <CategoryDrawer
        open={drawerOpen}
        mode={drawerMode}
        category={editingCategory}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* ── Delete Modal ── */}
      <DeleteModal
        open={deleteModalOpen}
        categoryName={deletingCategory?.name || ''}
        onClose={() => { setDeleteModalOpen(false); setDeletingCategory(null); }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* ── Toasts ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};


/* ─── Stat Card ─── */
interface StatCardProps {
  icon: React.ReactNode;
  iconClass: string;
  value: number;
  label: string;
}

const iconColors: Record<string, { bg: string; color: string }> = {
  'ssi-orange': { bg: 'var(--orange-light)', color: 'var(--orange)' },
  'ssi-green': { bg: 'var(--green-bg)', color: 'var(--green)' },
  'ssi-red': { bg: 'var(--red-bg)', color: 'var(--red)' },
  'ssi-blue': { bg: 'var(--blue-bg)', color: 'var(--blue)' },
};

const StatCard: React.FC<StatCardProps> = ({ icon, iconClass, value, label }) => {
  const colors = iconColors[iconClass] || iconColors['ssi-orange'];
  return (
    <div
      className="flex items-center gap-[10px] px-4 py-3 rounded-[10px]"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      <div
        className="flex items-center justify-center rounded-lg flex-shrink-0"
        style={{ width: 32, height: 32, background: colors.bg }}
      >
        <span style={{ color: colors.color }}>{icon}</span>
      </div>
      <div>
        <div className="font-display text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  );
};
