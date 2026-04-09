import React, { useState, useMemo, useEffect } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { BannerDrawer } from '@/components/banners/BannerDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';

/* ─── Types ─── */
export type BannerType = BannerDTO['type'];
export type BannerStatus = BannerDTO['status'];
export type Banner = BannerDTO;

import { bannersApi, BannerDTO } from '@/services/api';

const TYPE_COLORS: Record<BannerType, { accent: string; bg: string; color: string; label: string }> = {
  hero: { accent: 'var(--orange)', bg: 'var(--orange-light)', color: 'var(--orange)', label: 'Hero' },
  menu: { accent: 'var(--blue)', bg: 'var(--blue-bg)', color: 'var(--blue)', label: 'Menu' },
  announcement: { accent: 'var(--green)', bg: 'var(--green-bg)', color: 'var(--green)', label: 'Announcement' },
  popup: { accent: 'var(--purple)', bg: 'var(--purple-bg)', color: 'var(--purple)', label: 'Popup' },
};

const STATUS_STYLES: Record<BannerStatus, { bg: string; color: string; label: string }> = {
  active: { bg: 'var(--green-bg)', color: 'var(--green)', label: 'Active' },
  inactive: { bg: 'var(--bg-card2)', color: 'var(--text-muted)', label: 'Inactive' },
  scheduled: { bg: 'rgba(196,122,26,0.10)', color: '#C47A1A', label: 'Scheduled' },
  expired: { bg: 'var(--red-bg)', color: 'var(--red)', label: 'Expired' },
};

type TypeFilter = 'all' | BannerType;

/* ─── Icons ─── */
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[12px] h-[12px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);
const LinkIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[10px] h-[10px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

/* ─── Main Page ─── */
export const BannerSettingsPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [selectedId, setSelectedId] = useState<string>('');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState<Banner | null>(null);

  const fetchBanners = async () => {
    try {
      const res = await bannersApi.list();
      setBanners(res.data);
      setMeta(res.meta);
      if (res.data.length > 0 && !selectedId) {
        setSelectedId(res.data[0].id);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  /* Stats */
  const stats = useMemo(() => {
    if (meta) return meta;
    return {
      total: banners.length,
      active: banners.filter(b => b.status === 'active').length,
      scheduled: banners.filter(b => b.status === 'scheduled').length,
      inactive: banners.filter(b => b.status === 'inactive' || b.status === 'expired').length,
      types: new Set(banners.map(b => b.type)).size,
    };
  }, [banners, meta]);

  /* Filtered */
  const filtered = useMemo(() => {
    let r = banners;
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); r = r.filter(b => b.name.toLowerCase().includes(q)); }
    if (statusFilter !== 'all') r = r.filter(b => b.status === statusFilter);
    if (typeFilter !== 'all') r = r.filter(b => b.type === typeFilter);
    return r;
  }, [banners, searchQuery, statusFilter, typeFilter]);

  const selectedBanner = banners.find(b => b.id === selectedId) || filtered[0];

  /* Type counts */
  const typeCounts = useMemo(() => {
    const m: Record<string, number> = { all: banners.length, hero: 0, menu: 0, announcement: 0, popup: 0 };
    banners.forEach(b => m[b.type]++);
    return m;
  }, [banners]);

  /* Handlers */
  const handleToggle = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    try {
      await bannersApi.updatePartial(id, { enabled: !banner.enabled });
      fetchBanners();
    } catch (e) { console.error(e); }
  };
  const handleAdd = () => { setEditingBanner(null); setDrawerMode('add'); setDrawerOpen(true); };
  const handleEdit = (banner: Banner) => { setEditingBanner(banner); setDrawerMode('edit'); setDrawerOpen(true); };
  const handleDelete = (banner: Banner) => { setDeletingBanner(banner); setDeleteModalOpen(true); };
  const handleConfirmDelete = async () => {
    if (deletingBanner) {
      try {
        await bannersApi.delete(deletingBanner.id);
        fetchBanners();
      } catch (e) { console.error(e); }
    }
    setDeleteModalOpen(false); setDeletingBanner(null);
  };
  const handleSave = async (data: any) => {
    // Note: data might be a FormData or partial if we implement form data properly
    // BannerDrawer will be updated to pass FormData if images are present.
    // For now we'll support both Partial<Banner> and FormData.
    try {
      const isFormData = data instanceof FormData;
      if (drawerMode === 'edit' && editingBanner) {
        if (isFormData) {
          await bannersApi.update(editingBanner.id, data);
        } else {
          await bannersApi.updatePartial(editingBanner.id, data);
        }
      } else {
        if (isFormData) {
          await bannersApi.create(data);
        } else {
          // Wrap in formData
          const fd = new FormData();
          Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
          await bannersApi.create(fd);
        }
      }
      fetchBanners();
    } catch (e) {
      console.error('Failed to save banner', e);
    }
    setDrawerOpen(false);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-[14px] p-3 md:p-5 md:px-6 min-h-full bg-[#F7F3EE] rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 flex-shrink-0">
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Banner Settings</h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>Manage hero, menu, announcement, and popup banners shown across the website</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap"
          style={{ background: 'var(--orange)', border: 'none', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}
        ><PlusIcon /> Add Banner</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[10px] flex-shrink-0">
        <StatCard icon="🖼️" bg="var(--orange-light)" value={stats.total} label="Total banners" />
        <StatCard icon="✅" bg="var(--green-bg)" value={stats.active} label="Active now" />
        <StatCard icon="⏰" bg="rgba(196,122,26,0.10)" value={stats.scheduled} label="Scheduled" />
        <StatCard icon="🚫" bg="var(--red-bg)" value={stats.inactive} label="Inactive / Expired" />
        <StatCard icon="📊" bg="var(--blue-bg)" value={stats.types} label="Banner types" />
      </div>

      {/* Split layout */}
      <div className="flex flex-col lg:grid gap-[14px] flex-1" style={{ gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '420px 1fr' : '1fr' }}>

        {/* LEFT: Banner list */}
        <div className="flex flex-col gap-[10px]">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-[7px] flex-1 px-[11px] py-[7px] rounded-lg"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
              <input type="text" placeholder="Search banners…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="border-none outline-none bg-transparent text-xs w-full" style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-[10px] py-[7px] rounded-lg text-[11px] cursor-pointer outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', fontFamily: "'Open Sans', sans-serif" }}>
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Type tabs */}
          <div className="flex gap-1 flex-shrink-0 overflow-x-auto pb-1">
            {(['all', 'hero', 'menu', 'announcement', 'popup'] as TypeFilter[]).map(t => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-3 py-[5px] rounded-[20px] text-[11px] font-semibold cursor-pointer transition-all whitespace-nowrap"
                style={{
                  background: typeFilter === t ? 'var(--orange)' : 'var(--bg-card)',
                  border: `1px solid ${typeFilter === t ? 'var(--orange)' : 'var(--border)'}`,
                  color: typeFilter === t ? '#fff' : 'var(--text-muted)',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                <span className="ml-1 opacity-70 text-[10px]">{typeCounts[t]}</span>
              </button>
            ))}
          </div>

          {/* Banner list */}
          <div className="flex flex-col gap-2">
            {filtered.map((banner, i) => {
              const tc = TYPE_COLORS[banner.type];
              const ss = STATUS_STYLES[banner.status];
              const isSelected = selectedBanner?.id === banner.id;
              return (
                <div
                  key={banner.id}
                  onClick={() => setSelectedId(banner.id)}
                  className="flex rounded-xl overflow-hidden cursor-pointer transition-all duration-150"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${isSelected ? 'var(--orange)' : 'var(--border)'}`,
                    boxShadow: isSelected ? '0 0 0 2px rgba(212,114,42,0.15)' : 'var(--shadow-sm)',
                    animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
                    }
                  }}
                >
                  {/* Left accent strip by type */}
                  <div className="flex-shrink-0" style={{ width: 4, background: tc.accent }} />

                  {/* Thumbnail */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center overflow-hidden relative"
                    style={{ width: 80, minHeight: 70, background: banner.thumbBg }}
                  >
                    <span className="text-[28px] select-none relative z-[1]">{banner.emoji}</span>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.04)' }} />
                  </div>

                  {/* Body */}
                  <div className="flex-1 px-3 py-3 min-w-0 flex flex-col justify-center gap-[4px]">
                    {/* Top: type badge + status badge */}
                    <div className="flex items-center gap-[6px] mb-[2px]">
                      <span
                        className="text-[9px] font-bold px-[7px] py-[2px] rounded-[10px] whitespace-nowrap"
                        style={{ background: tc.bg, color: tc.color }}
                      >
                        {tc.label}
                      </span>
                      <span
                        className="text-[9px] font-bold px-[7px] py-[2px] rounded-[10px] ml-auto whitespace-nowrap"
                        style={{
                          background: ss.bg,
                          color: ss.color,
                          border: banner.status === 'inactive' ? '1px solid var(--border)' : 'none',
                        }}
                      >
                        {ss.label}
                      </span>
                    </div>

                    {/* Banner name */}
                    <div
                      className="font-bold whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{
                        fontSize: 13,
                        color: 'var(--text-primary)',
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {banner.name}
                    </div>

                    {/* Meta line: link info */}
                    <div className="flex items-center gap-[6px] text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex-shrink-0"><LinkIcon /></span>
                      <span className="truncate">
                        {banner.ctaLink ? `fuskit.com → ${banner.ctaLink}` : 'Top bar · Text only'}
                      </span>
                    </div>

                    {/* Schedule line with status dot */}
                    <div
                      className="flex items-center gap-[4px] text-[10px]"
                      style={{ color: banner.status === 'active' ? 'var(--green)' : 'var(--text-muted)' }}
                    >
                      <span
                        className="inline-block flex-shrink-0 rounded-full"
                        style={{
                          width: 6, height: 6,
                          background: banner.status === 'active'
                            ? 'var(--green)'
                            : banner.status === 'scheduled'
                              ? '#C47A1A'
                              : 'var(--text-muted)',
                        }}
                      />
                      {banner.schedule}
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex flex-col items-center justify-center gap-[6px] px-[12px] py-3 flex-shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); handleEdit(banner); }}
                      className="flex items-center justify-center rounded-[7px] transition-all duration-[120ms]"
                      style={{ width: 26, height: 26, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--orange-light)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--orange)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(banner); }}
                      className="flex items-center justify-center rounded-[7px] transition-all duration-[120ms]"
                      style={{ width: 26, height: 26, background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--red-bg)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--red)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      <TrashIcon />
                    </button>
                    <Toggle on={banner.enabled} onToggle={() => handleToggle(banner.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Preview panel */}
        {selectedBanner && (
          <div className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-[7px] text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--orange)' }}><EyeIcon /></span>
                Live preview — {selectedBanner.name}
              </div>
            </div>
            {/* Preview body */}
            <div className="p-4 flex flex-col gap-[14px]">
              {/* Browser frame */}
              <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Browser bar */}
                <div className="flex items-center gap-[5px] px-[10px]" style={{ height: 28, background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                  <div className="rounded-full" style={{ width: 7, height: 7, background: '#ff5f57' }} />
                  <div className="rounded-full" style={{ width: 7, height: 7, background: '#febc2e' }} />
                  <div className="rounded-full" style={{ width: 7, height: 7, background: '#28c840' }} />
                  <div className="flex-1 mx-2 flex items-center px-[7px] rounded" style={{ height: 16, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>fuskit.com</span>
                  </div>
                </div>
                {/* Announcement bar preview */}
                {selectedBanner.type === 'announcement' && (
                  <div className="flex items-center justify-center gap-2 py-[7px] px-[14px]" style={{ background: '#E8873A' }}>
                    <span className="text-[10px] font-bold text-white">{selectedBanner.title}</span>
                  </div>
                )}
                {/* Hero preview */}
                {selectedBanner.type === 'hero' && (
                  <div className="relative overflow-hidden flex items-center px-5" style={{ height: 160, background: 'linear-gradient(135deg,#1C0F05 0%,#3B2010 100%)' }}>
                    <div className="relative z-10 w-2/3">
                      <div className="text-[8px] font-bold tracking-[.12em] uppercase mb-[6px]" style={{ color: '#E8873A' }}>Born in Chennai. Fueling the world.</div>
                      <div className="font-display text-lg font-bold text-white leading-tight mb-[6px]">{selectedBanner.title}</div>
                      {selectedBanner.subtitle && <div className="text-[9px] mb-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{selectedBanner.subtitle}</div>}
                      {selectedBanner.ctaLabel && <span className="inline-block px-3 py-[5px] rounded-[5px] text-[9px] font-bold" style={{ background: '#E8873A', color: '#1a1a1a' }}>{selectedBanner.ctaLabel}</span>}
                    </div>
                    {selectedBanner.desktopImageUrl ? (
                      <div className="absolute right-0 top-0 bottom-0 w-[45%]">
                        <img src={selectedBanner.desktopImageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, #24140a, transparent)' }} />
                      </div>
                    ) : (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full text-[44px]"
                        style={{ width: 90, height: 90, background: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.12)' }}>{selectedBanner.emoji}</div>
                    )}
                  </div>
                )}
                {/* Menu banner preview */}
                {selectedBanner.type === 'menu' && (
                  <div className="flex items-center gap-3 px-4 py-[14px] rounded-lg m-3" style={{ background: '#FFF3E0', border: '1px solid rgba(212,114,42,0.15)' }}>
                    <span className="text-[36px] flex-shrink-0">{selectedBanner.emoji}</span>
                    <div>
                      <div className="font-display text-[13px] font-bold" style={{ color: 'var(--text-primary)' }}>{selectedBanner.title}</div>
                      {selectedBanner.subtitle && <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{selectedBanner.subtitle}</div>}
                      {selectedBanner.ctaLabel && <span className="inline-block mt-[6px] px-[10px] py-1 rounded-[5px] text-[9px] font-bold text-white" style={{ background: 'var(--orange)' }}>{selectedBanner.ctaLabel}</span>}
                    </div>
                  </div>
                )}
                {/* Popup preview */}
                {selectedBanner.type === 'popup' && (
                  <div className="flex items-center justify-center rounded-lg p-4" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="rounded-[10px] p-4 text-center" style={{ width: 180, background: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                      <div className="text-[28px] mb-2">{selectedBanner.emoji}</div>
                      <div className="font-display text-xs font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{selectedBanner.title}</div>
                      {selectedBanner.subtitle && <div className="text-[10px] mb-[10px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{selectedBanner.subtitle}</div>}
                      {selectedBanner.ctaLabel && <div className="block px-[14px] py-[6px] rounded-[6px] text-[10px] font-bold text-white mb-[6px]" style={{ background: 'var(--orange)' }}>{selectedBanner.ctaLabel}</div>}
                      <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>No thanks</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail section */}
              <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between px-[14px] py-[10px]" style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                  <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>Banner details</span>
                  <span className="text-[11px] font-semibold cursor-pointer" style={{ color: 'var(--orange)' }} onClick={() => handleEdit(selectedBanner)}>Edit →</span>
                </div>
                <div className="flex flex-col gap-2 px-[14px] py-3">
                  <DetailRow label="Name" value={selectedBanner.name} />
                  <DetailRow label="Type" value={TYPE_COLORS[selectedBanner.type].label + ' banner'} />
                  <DetailRow label="Title" value={selectedBanner.title} />
                  {selectedBanner.subtitle && <DetailRow label="Subtitle" value={selectedBanner.subtitle} />}
                  {selectedBanner.ctaLabel && <DetailRow label="CTA label" value={selectedBanner.ctaLabel} />}
                  {selectedBanner.ctaLink && <DetailRow label="CTA link" value={`fuskit.com${selectedBanner.ctaLink}`} isLink />}
                  <DetailRow label="Status" value={`${STATUS_STYLES[selectedBanner.status].label}${selectedBanner.status === 'active' ? ' — Live now' : ''}`}
                    valueColor={STATUS_STYLES[selectedBanner.status].color} />
                  <DetailRow label="Schedule" value={selectedBanner.schedule} />
                  <DetailRow label="Display order" value={String(selectedBanner.order)} />
                  {selectedBanner.altText && <DetailRow label="Alt text" value={selectedBanner.altText} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BannerDrawer open={drawerOpen} mode={drawerMode} banner={editingBanner} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
      <DeleteModal open={deleteModalOpen} categoryName={deletingBanner?.name || ''} onClose={() => { setDeleteModalOpen(false); setDeletingBanner(null); }} onConfirm={handleConfirmDelete} />
    </div>
  );
};

/* Helpers */
const StatCard: React.FC<{ icon: string; bg: string; value: number; label: string }> = ({ icon, bg, value, label }) => (
  <div className="flex items-center gap-[10px] px-[14px] py-[10px] rounded-[10px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="flex items-center justify-center rounded-lg flex-shrink-0 text-sm" style={{ width: 30, height: 30, background: bg }}>{icon}</div>
    <div>
      <div className="font-display text-[17px] font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; isLink?: boolean; valueColor?: string }> = ({ label, value, isLink, valueColor }) => (
  <div className="flex items-start gap-2">
    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--text-muted)', minWidth: 100 }}>{label}</span>
    <span className="text-[11px] font-medium leading-[1.5]" style={{ color: valueColor || (isLink ? 'var(--blue)' : 'var(--text-primary)'), textDecoration: isLink ? 'underline' : 'none', cursor: isLink ? 'pointer' : 'default' }}>{value}</span>
  </div>
);
