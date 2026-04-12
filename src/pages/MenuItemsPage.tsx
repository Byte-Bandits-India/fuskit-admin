import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/menuItems/ProductCard';
import { ProductDrawer } from '@/components/menuItems/ProductDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import {
  menuItemsApi,
  categoriesApi,
  storesApi,
  type MenuItemDTO,
  type MenuItemMeta,
  type CategoryDTO,
} from '@/services/api';

/* ─── Types ─── */
export interface Product {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  category: string;      // categoryName — used by UI dropdowns + filters
  categoryId: string;    // needed to send to API on create/update
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isVeg: boolean;
  visible: boolean;
  stores: string[];
  storeSpecial?: string;
  badges: string[];
  imageUrls?: string[];
  videoUrl?: string;
}

/* ─── DTO → local type mapper ─── */
function toProduct(dto: MenuItemDTO): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? '',
    emoji: dto.emoji,
    bgColor: dto.bgColor,
    category: dto.categoryName,
    categoryId: dto.categoryId,
    price: dto.price,
    oldPrice: dto.oldPrice ?? undefined,
    discountPercent: dto.discountPercent ?? undefined,
    isVeg: dto.isVeg,
    visible: dto.visible,
    stores: dto.stores,
    storeSpecial: dto.storeSpecial ?? undefined,
    badges: dto.badges,
    imageUrls: dto.imageUrls || [],
    videoUrl: dto.videoUrl ?? undefined,
  };
}

type FilterType = 'all' | 'visible' | 'bestseller' | 'veg';
type SortType = 'default' | 'price-low' | 'price-high' | 'name' | 'recent';

/* ─── Default meta ─── */
const DEFAULT_META: MenuItemMeta = { total: 0, visible: 0, hidden: 0, bestsellers: 0, discounted: 0 };

/* ─── SVG Icons ─── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const ExportIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 16l4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
  </svg>
);

const VegIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]">
    <circle cx="8" cy="8" r="3" fill="currentColor" />
    <path d="M2 5h6M2 11h6M16 13l-4 4 4 4M20 13l-4 4 4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);

const AllIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]">
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="19" r="2" fill="currentColor" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const EyeIcon16 = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon16 = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
  </svg>
);

const StarIcon16 = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" />
  </svg>
);

const TagIcon16 = () => (
  <svg viewBox="0 0 24 24" className="w-[16px] h-[16px]">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" fill="currentColor" />
  </svg>
);

/* ─── Skeleton card ─── */
const SkeletonCard = () => (
  <div
    className="rounded-[14px] overflow-hidden"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
  >
    <div className="animate-pulse" style={{ height: 140, background: 'var(--bg-hover)' }} />
    <div className="px-[14px] py-3">
      <div className="animate-pulse rounded h-3 w-3/4 mb-2" style={{ background: 'var(--bg-hover)' }} />
      <div className="animate-pulse rounded h-3 w-1/2 mb-2" style={{ background: 'var(--bg-hover)' }} />
      <div className="animate-pulse rounded h-4 w-1/3" style={{ background: 'var(--bg-hover)' }} />
    </div>
  </div>
);

/* ─── Main Page ─── */
export const MenuItemsPage: React.FC = () => {
  const [products, setProducts]           = useState<Product[]>([]);
  const [meta, setMeta]                   = useState<MenuItemMeta>(DEFAULT_META);
  const [categories, setCategories]       = useState<CategoryDTO[]>([]);
  const [storeNames, setStoreNames]       = useState<string[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [exporting, setExporting]         = useState(false);

  const [searchQuery, setSearchQuery]     = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [storeFilter, setStoreFilter]     = useState('all');
  const [filter, setFilter]               = useState<FilterType>('all');
  const [sortBy, setSortBy]               = useState<SortType>('default');

  // Drawer
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerMode, setDrawerMode]       = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen]   = useState(false);
  const [deletingProduct, setDeletingProduct]   = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading]       = useState(false);

  const { toasts, showToast, dismissToast } = useToast();

  /* ── Fetch all data on mount ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, catsRes, storesRes] = await Promise.all([
        menuItemsApi.list(),
        categoriesApi.list(),
        storesApi.list(),
      ]);
      setProducts(itemsRes.data.map(toProduct));
      setMeta(itemsRes.meta);
      setCategories(catsRes.data);
      // storesApi may return { data: [...] } or just an array — handle both
      const storeData = storesRes?.data ?? (storesRes as unknown as { name: string }[]);
      setStoreNames(Array.isArray(storeData) ? storeData.map((s: { name: string }) => s.name) : ['Chennai', 'Bangalore']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Client-side filter + sort ── */
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter);
    if (storeFilter !== 'all')    result = result.filter(p => p.stores.includes(storeFilter));

    if (filter === 'visible')    result = result.filter(p => p.visible);
    if (filter === 'bestseller') result = result.filter(p => p.badges.includes('bestseller'));
    if (filter === 'veg')        result = result.filter(p => p.isVeg);

    if (sortBy === 'price-low')  result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchQuery, categoryFilter, storeFilter, filter, sortBy]);

  /* ── Handlers ── */
  const handleToggleVisibility = async (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    const newVisible = !prod.visible;
    try {
      await menuItemsApi.update(id, { visible: newVisible });
      fetchAll();
    } catch {
      showToast('Failed to update visibility', 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setDrawerMode('add');
    setDrawerOpen(true);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      await menuItemsApi.delete(deletingProduct.id);
      showToast(`"${deletingProduct.name}" deleted`, 'success');
      fetchAll();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete item', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setDeletingProduct(null);
    }
  };

  const handleSaveProduct = async (data: Partial<Product> & { images?: File[]; video?: File | null; imagesToDelete?: string[] }) => {
    // Resolve category name → ID
    const categoryId =
      categories.find(c => c.name === data.category)?.id ?? editingProduct?.categoryId ?? '';

    if (!categoryId && drawerMode !== 'edit') {
      showToast('Please select a category', 'warning');
      return;
    }

    const fd = new FormData();
    if (data.name) fd.append('name', data.name);
    if (data.description !== undefined) fd.append('description', data.description);
    if (data.emoji) fd.append('emoji', data.emoji);
    if (categoryId) fd.append('categoryId', categoryId);
    if (data.price !== undefined) fd.append('price', String(data.price));
    if (data.oldPrice !== undefined) fd.append('oldPrice', String(data.oldPrice));
    if (data.discountPercent !== undefined) fd.append('discountPercent', String(data.discountPercent));
    if (data.isVeg !== undefined) fd.append('isVeg', String(data.isVeg));
    if (data.visible !== undefined) fd.append('visible', String(data.visible));
    if (data.stores) fd.append('stores', JSON.stringify(data.stores));
    if (data.storeSpecial !== undefined) fd.append('storeSpecial', data.storeSpecial || '');
    if (data.badges) fd.append('badges', JSON.stringify(data.badges));

    if (data.imagesToDelete && data.imagesToDelete.length > 0) {
      fd.append('imagesToDelete', JSON.stringify(data.imagesToDelete));
    }
    
    if (data.images) {
      data.images.forEach(f => fd.append('images', f));
    }
    if (data.video) {
        fd.append('video', data.video);
    }

    if (drawerMode === 'edit' && editingProduct) {
      try {
        const res = await menuItemsApi.update(editingProduct.id, fd);
        showToast(`"Menu item updated"`, 'success');
        fetchAll();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to update item', 'error');
      }
    } else {
      const bgColors = ['#FFF3E0', '#E3F2FD', '#FFF8E1', '#FCE4EC', '#F3E5F5', '#FFFDE7', '#E8F5E9', '#FBE9E7'];
      fd.append('bgColor', bgColors[Math.floor(Math.random() * bgColors.length)]);
      
      try {
        const res = await menuItemsApi.create(fd);
        showToast(`"Menu item created"`, 'success');
        fetchAll();
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Failed to create item', 'error');
      }
    }
    setDrawerOpen(false);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await menuItemsApi.export();
      showToast('Export downloaded', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  /* ── Category names for dropdown ── */
  const categoryNames = categories.map(c => c.name);

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-3 md:gap-[14px] p-3 md:p-5 md:px-6 bg-[#F7F3EE] min-h-full rounded-xl">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Menu Items
          </h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>
            Add, edit and manage all products across your menu categories
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-[6px] px-[14px] py-[9px] rounded-lg text-xs cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)',
              opacity: exporting ? 0.7 : 1,
              cursor: exporting ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!exporting) { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            <ExportIcon />
            {exporting ? 'Exporting…' : 'Export'}
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
            style={{ background: 'var(--orange)', border: 'none', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}
          >
            <PlusIcon /> Add Product
          </button>
        </div>
      </div>

      {/* ── Stats Strip (5 cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[10px]">
        <StatCard icon={<ClipboardIcon />} iconBg="var(--orange-light)" iconColor="var(--orange)" value={meta.total}       label="Total products" />
        <StatCard icon={<EyeIcon16 />}     iconBg="var(--green-bg)"    iconColor="var(--green)"   value={meta.visible}     label="Visible"        />
        <StatCard icon={<EyeOffIcon16 />}  iconBg="var(--red-bg)"      iconColor="var(--red)"     value={meta.hidden}      label="Hidden"         />
        <StatCard icon={<StarIcon16 />}    iconBg="var(--blue-bg)"     iconColor="var(--blue)"    value={meta.bestsellers} label="Bestsellers"    />
        <StatCard icon={<TagIcon16 />}     iconBg="var(--purple-bg)"   iconColor="var(--purple)"  value={meta.discounted}  label="Discounted"     />
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
            onClick={fetchAll}
            className="text-xs font-semibold underline cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'inherit' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 min-w-[220px] px-3 py-[8px] rounded-lg transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
          <input
            type="text" placeholder="Search products…"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="border-none outline-none bg-transparent text-xs w-full"
            style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
          />
        </div>

        {/* Category select — live from API */}
        <select
          value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="all">All categories</option>
          {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Store select — live from API */}
        <select
          value={storeFilter} onChange={e => setStoreFilter(e.target.value)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="all">All stores</option>
          {storeNames.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Filter pills */}
        {([
          { key: 'all'        as FilterType, label: 'All',         icon: <AllIcon />  },
          { key: 'visible'    as FilterType, label: 'Visible',     icon: <EyeIcon />  },
          { key: 'bestseller' as FilterType, label: 'Bestsellers', icon: <StarIcon /> },
          { key: 'veg'        as FilterType, label: 'Veg only',    icon: <VegIcon />  },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="flex items-center gap-[5px] px-3 py-[7px] rounded-[20px] text-[11px] cursor-pointer transition-all"
            style={{
              background: filter === f.key ? 'var(--orange-light)' : 'var(--bg-card)',
              border: `1px solid ${filter === f.key ? 'var(--orange)' : 'var(--border)'}`,
              color: filter === f.key ? 'var(--orange)' : 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}

        {/* Sort */}
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="default">Sort: Default</option>
          <option value="price-low">Sort: Price low–high</option>
          <option value="price-high">Sort: Price high–low</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="recent">Sort: Recently added</option>
        </select>
      </div>

      {/* ── Section Label ── */}
      <div className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: 'var(--text-muted)' }}>
        All products ({filteredProducts.length})
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid gap-[14px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {filteredProducts.map((prod, i) => (
            <ProductCard
              key={prod.id}
              product={prod}
              index={i}
              onToggle={() => handleToggleVisibility(prod.id)}
              onEdit={() => handleEdit(prod)}
              onDelete={() => handleDelete(prod)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-[60px] gap-3 text-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12" style={{ fill: 'var(--border-strong)' }}>
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>No products found</h3>
          <p className="text-xs max-w-[260px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {searchQuery ? 'Try a different search term or filter' : 'Get started by adding your first product'}
          </p>
        </div>
      )}

      {/* ── Drawer ── */}
      <ProductDrawer
        open={drawerOpen}
        mode={drawerMode}
        product={editingProduct}
        categories={categoryNames}
        stores={storeNames}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* ── Delete Modal ── */}
      <DeleteModal
        open={deleteModalOpen}
        categoryName={deletingProduct?.name || ''}
        onClose={() => { setDeleteModalOpen(false); setDeletingProduct(null); }}
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
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, iconColor, value, label }) => (
  <div
    className="flex items-center gap-[10px] px-[14px] py-3 rounded-[10px]"
    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
  >
    <div
      className="flex items-center justify-center rounded-lg flex-shrink-0"
      style={{ width: 32, height: 32, background: iconBg }}
    >
      <span style={{ color: iconColor }}>{icon}</span>
    </div>
    <div>
      <div className="font-display text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);
