import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/menuItems/ProductCard';
import { ProductDrawer } from '@/components/menuItems/ProductDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';

/* ─── Types ─── */
export interface Product {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bgColor: string;
  category: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isVeg: boolean;
  visible: boolean;
  stores: string[];
  storeSpecial?: string;
  badges: string[]; // 'bestseller' | 'new' | 'trending' | 'seasonal'
}

/* ─── Mock data matching the HTML reference ─── */
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Bun Butter Jam', description: 'Classic butter bun with a generous spread of jam. A Fusk-it favourite since day one.',
    emoji: '🥐', bgColor: '#FFF3E0', category: 'Buns', price: 89, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: ['bestseller'],
  },
  {
    id: '2', name: 'Kozhi Butter Bun', description: 'Juicy chicken filling in a fluffy butter bun. Non-veg special.',
    emoji: '🍗', bgColor: '#FBE9E7', category: 'Buns', price: 179, oldPrice: 199, discountPercent: 10,
    isVeg: false, visible: true, stores: ['Chennai'], storeSpecial: 'Chennai Spl', badges: [],
  },
  {
    id: '3', name: 'OG Malaysian Milo', description: 'The iconic Malaysian Milo — thick, rich, and ridiculously good.',
    emoji: '🥤', bgColor: '#E3F2FD', category: 'Drinks', price: 199, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: ['new', 'bestseller'],
  },
  {
    id: '4', name: 'Fusk Spl Fries', description: 'The ultimate Fusk-it loaded fries experience. Add-on available.',
    emoji: '🍟', bgColor: '#FFFDE7', category: 'Fusk Fries', price: 169, oldPrice: 199, discountPercent: 15,
    isVeg: true, visible: true, stores: ['Chennai', 'Bangalore'], badges: [],
  },
  {
    id: '5', name: 'Chocolate Bhajji', description: 'A collab special — currently hidden from the site.',
    emoji: '🍫', bgColor: '#ECEFF1', category: 'VJ Siddhu Spl', price: 89, isVeg: true, visible: false,
    stores: ['Chennai'], storeSpecial: 'VJ Siddhu Spl', badges: [],
  },
  {
    id: '6', name: 'Gulabjamun + Ice Cream', description: 'Warm gulabjamun paired with chilled ice cream. The crowd favourite.',
    emoji: '🍨', bgColor: '#FCE4EC', category: 'Signatures', price: 199, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: ['bestseller'],
  },
  {
    id: '7', name: 'Egg Omelette Classic', description: 'Classic fluffy omelette with bread on the side.',
    emoji: '🍳', bgColor: '#FFF8E1', category: 'Bread Omelette', price: 79, isVeg: false, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: [],
  },
  {
    id: '8', name: 'Maggi Masala', description: 'The OG Maggi prepared with our signature masala blend.',
    emoji: '🍜', bgColor: '#F3E5F5', category: 'Maggi', price: 99, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: ['bestseller'],
  },
  {
    id: '9', name: 'Cheese Fries', description: 'Loaded fries with extra cheese topping.',
    emoji: '🧀', bgColor: '#FFFDE7', category: 'Fusk Fries', price: 149, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: ['new'],
  },
  {
    id: '10', name: 'Choco Lava Bun', description: 'Warm bun with melting chocolate center. Irresistible.',
    emoji: '🍫', bgColor: '#D7CCC8', category: 'Buns', price: 129, isVeg: true, visible: true,
    stores: ['Chennai'], badges: ['trending'],
  },
  {
    id: '11', name: 'Cold Coffee', description: 'Thick, creamy cold coffee to beat the heat.',
    emoji: '☕', bgColor: '#EFEBE9', category: 'Drinks', price: 149, isVeg: true, visible: true,
    stores: ['Chennai', 'Bangalore'], badges: [],
  },
  {
    id: '12', name: 'VJ Siddhu Spl Bun', description: 'A special limited collab bun — celebrity endorsed.',
    emoji: '🎬', bgColor: '#ECEFF1', category: 'VJ Siddhu Spl', price: 149, isVeg: false, visible: false,
    stores: ['Chennai'], storeSpecial: 'VJ Siddhu Spl', badges: [],
  },
];

const CATEGORIES = ['Buns', 'Drinks', 'Bread Omelette', 'Signatures', 'Maggi', 'Fusk Fries', 'Fuscorns', 'VJ Siddhu Spl'];
const STORES = ['Chennai', 'Bangalore'];

type FilterType = 'all' | 'visible' | 'bestseller' | 'veg';
type SortType = 'default' | 'price-low' | 'price-high' | 'name' | 'recent';

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


/* ─── Main Page ─── */
export const MenuItemsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('default');

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  /* ── Computed stats ── */
  const stats = useMemo(() => {
    const total = products.length;
    const visible = products.filter(p => p.visible).length;
    const hidden = products.filter(p => !p.visible).length;
    const bestsellers = products.filter(p => p.badges.includes('bestseller')).length;
    const discounted = products.filter(p => p.discountPercent && p.discountPercent > 0).length;
    return { total, visible, hidden, bestsellers, discounted };
  }, [products]);

  /* ── Filtered / sorted products ── */
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter);
    if (storeFilter !== 'all') result = result.filter(p => p.stores.includes(storeFilter));

    if (filter === 'visible') result = result.filter(p => p.visible);
    if (filter === 'bestseller') result = result.filter(p => p.badges.includes('bestseller'));
    if (filter === 'veg') result = result.filter(p => p.isVeg);

    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchQuery, categoryFilter, storeFilter, filter, sortBy]);

  /* ── Handlers ── */
  const handleToggleVisibility = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
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

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
    }
    setDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const handleSaveProduct = (data: Partial<Product>) => {
    if (drawerMode === 'edit' && editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
    } else {
      const bgColors = ['#FFF3E0', '#E3F2FD', '#FFF8E1', '#FCE4EC', '#F3E5F5', '#FFFDE7', '#E8F5E9', '#FBE9E7'];
      const newProd: Product = {
        id: String(Date.now()),
        name: data.name || 'New Product',
        description: data.description || '',
        emoji: data.emoji || '🍽️',
        bgColor: bgColors[Math.floor(Math.random() * bgColors.length)],
        category: data.category || 'Buns',
        price: data.price || 0,
        oldPrice: data.oldPrice,
        discountPercent: data.discountPercent,
        isVeg: data.isVeg ?? true,
        visible: data.visible ?? true,
        stores: data.stores || ['Chennai', 'Bangalore'],
        storeSpecial: data.storeSpecial,
        badges: data.badges || [],
      };
      setProducts(prev => [...prev, newProd]);
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-[14px] p-3 md:p-5 md:px-6">

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
            className="flex items-center gap-[6px] px-[14px] py-[9px] rounded-lg text-xs cursor-pointer transition-all"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            <ExportIcon /> Export
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
        <StatCard icon={<ClipboardIcon />} iconBg="var(--orange-light)" iconColor="var(--orange)" value={stats.total} label="Total products" />
        <StatCard icon={<EyeIcon16 />} iconBg="var(--green-bg)" iconColor="var(--green)" value={stats.visible} label="Visible" />
        <StatCard icon={<EyeOffIcon16 />} iconBg="var(--red-bg)" iconColor="var(--red)" value={stats.hidden} label="Hidden" />
        <StatCard icon={<StarIcon16 />} iconBg="var(--blue-bg)" iconColor="var(--blue)" value={stats.bestsellers} label="Bestsellers" />
        <StatCard icon={<TagIcon16 />} iconBg="var(--purple-bg)" iconColor="var(--purple)" value={stats.discounted} label="Discounted" />
      </div>

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

        {/* Category select */}
        <select
          value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Store select */}
        <select
          value={storeFilter} onChange={e => setStoreFilter(e.target.value)}
          className="px-3 py-[8px] rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}
        >
          <option value="all">All stores</option>
          {STORES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Filter pills */}
        {([
          { key: 'all' as FilterType, label: 'All', icon: <AllIcon /> },
          { key: 'visible' as FilterType, label: 'Visible', icon: <EyeIcon /> },
          { key: 'bestseller' as FilterType, label: 'Bestsellers', icon: <StarIcon /> },
          { key: 'veg' as FilterType, label: 'Veg only', icon: <VegIcon /> },
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
      {filteredProducts.length > 0 ? (
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
        categories={CATEGORIES}
        stores={STORES}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveProduct}
      />

      {/* ── Delete Modal ── */}
      <DeleteModal
        open={deleteModalOpen}
        categoryName={deletingProduct?.name || ''}
        onClose={() => { setDeleteModalOpen(false); setDeletingProduct(null); }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};


/* ─── Stat Card (reused) ─── */
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
