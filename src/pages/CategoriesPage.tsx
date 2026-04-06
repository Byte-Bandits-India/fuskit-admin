import React, { useState, useMemo } from 'react';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryDrawer } from '@/components/categories/CategoryDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';

/* ─── Types ─── */
export interface Category {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  itemCount: number;
  type: string;
  visible: boolean;
}

/* ─── Mock data matching the HTML reference ─── */
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Buns', emoji: '🥐', bgColor: '#FFF3E0', itemCount: 14, type: 'Veg + Non-veg', visible: true },
  { id: '2', name: 'Drinks', emoji: '🥤', bgColor: '#E3F2FD', itemCount: 8, type: 'Veg', visible: true },
  { id: '3', name: 'Bread Omelette', emoji: '🍳', bgColor: '#FFF8E1', itemCount: 6, type: 'Veg + Non-veg', visible: true },
  { id: '4', name: 'Signatures', emoji: '⭐', bgColor: '#FCE4EC', itemCount: 6, type: 'Veg', visible: true },
  { id: '5', name: 'Maggi', emoji: '🍜', bgColor: '#F3E5F5', itemCount: 4, type: 'Veg + Non-veg', visible: true },
  { id: '6', name: 'Fusk Fries', emoji: '🍟', bgColor: '#FFFDE7', itemCount: 4, type: 'Veg', visible: true },
  { id: '7', name: 'Fuscorns', emoji: '🍿', bgColor: '#E8F5E9', itemCount: 1, type: 'Veg', visible: true },
  { id: '8', name: 'VJ Siddhu Spl', emoji: '🎬', bgColor: '#ECEFF1', itemCount: 2, type: 'Special collab', visible: false },
];

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


/* ─── Main Page ─── */
export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
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

  /* ── Derived data ── */
  const stats = useMemo(() => {
    const total = categories.length;
    const visible = categories.filter(c => c.visible).length;
    const hidden = categories.filter(c => !c.visible).length;
    const totalItems = categories.reduce((s, c) => s + c.itemCount, 0);
    return { total, visible, hidden, totalItems };
  }, [categories]);

  const filteredCategories = useMemo(() => {
    let result = categories;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q));
    }

    // Filter
    if (filter === 'visible') result = result.filter(c => c.visible);
    if (filter === 'hidden') result = result.filter(c => !c.visible);

    // Sort
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'items') result = [...result].sort((a, b) => b.itemCount - a.itemCount);

    return result;
  }, [categories, searchQuery, filter, sortBy]);

  /* ── Handlers ── */
  const handleToggleVisibility = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
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

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
    }
    setDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleSaveCategory = (data: { name: string; emoji: string; visible: boolean; order: number }) => {
    if (drawerMode === 'edit' && editingCategory) {
      setCategories(prev =>
        prev.map(c => c.id === editingCategory.id ? { ...c, name: data.name, emoji: data.emoji, visible: data.visible } : c)
      );
    } else {
      const newCat: Category = {
        id: String(Date.now()),
        name: data.name,
        emoji: data.emoji,
        bgColor: ['#FFF3E0', '#E3F2FD', '#FFF8E1', '#FCE4EC', '#F3E5F5', '#FFFDE7', '#E8F5E9'][Math.floor(Math.random() * 7)],
        itemCount: 0,
        type: 'Veg',
        visible: data.visible,
      };
      setCategories(prev => [...prev, newCat]);
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 p-3 md:p-5 md:px-6">

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
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            <ReorderIcon />
            Reorder
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: 'var(--orange)',
              border: 'none',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(212,114,42,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(212,114,42,0.4)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--orange)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(212,114,42,0.3)';
            }}
          >
            <PlusIcon />
            Add Category
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        <StatCard icon={<ListIcon />} iconClass="ssi-orange" value={stats.total} label="Total categories" />
        <StatCard icon={<EyeIcon />} iconClass="ssi-green" value={stats.visible} label="Visible on site" />
        <StatCard icon={<EyeOffIcon />} iconClass="ssi-red" value={stats.hidden} label="Hidden" />
        <StatCard icon={<ClipboardIcon />} iconClass="ssi-blue" value={stats.totalItems} label="Total items across all" />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-[10px]">
        <div
          className="flex items-center gap-2 flex-1 max-w-[320px] px-3 py-[8px] rounded-lg transition-colors"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
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
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-sm)',
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          <option value="order">Sort: Display order</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="items">Sort: Item count</option>
          <option value="recent">Sort: Recently added</option>
        </select>
      </div>

      {/* ── Section Label ── */}
      <div
        className="text-[11px] font-bold uppercase tracking-[.08em] mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {filter === 'all' ? `All categories (${filteredCategories.length})` :
          filter === 'visible' ? `Visible categories (${filteredCategories.length})` :
            `Hidden categories (${filteredCategories.length})`}
      </div>

      {/* ── Category Grid ── */}
      {filteredCategories.length > 0 ? (
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
      />
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
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
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
