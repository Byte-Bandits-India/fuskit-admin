import React, { useState, useEffect } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import { StoreDrawer, Store, ExclusiveItem } from '@/components/stores/StoreDrawer';
import { DeleteModal } from '@/components/categories/DeleteModal';

import { storesApi } from '@/services/api';

const VISIT_DATA = {
  chennai: { total: '4,891', change: '↑ 12% vs last week', bars: [55, 65, 80, 60, 90, 100, 85] },
  bangalore: { total: '3,204', change: '↑ 8% vs last week', bars: [40, 55, 70, 50, 80, 95, 75] }
};

/* ───────── SVG ICONS ───────── */
const MapPinIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
);
const EditIcon = ({ size = 11 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const PlusIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
);
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" /><path d="M21 15l-5-5L5 21" /></svg>
);
const PhoneIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" /></svg>
);
const MessageIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
);
const MailIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" strokeLinecap="round" /></svg>
);
const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" /></svg>
);
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>
);
const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const StoreIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
);

/* ───────── TODAY ───────── */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const todayName = DAYS[new Date().getDay()];

/* ───────── COMPONENT ───────── */
export const ManageStoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tempClosed, setTempClosed] = useState(false);
  const [meta, setMeta] = useState<any>(null);

  const fetchStores = async () => {
    try {
      const res = await storesApi.list();
      setStores(res.data);
      setMeta(res.meta);
      if (res.data.length > 0 && !selectedId) {
        setSelectedId(res.data[0].id);
        setTempClosed(res.data[0].temporarilyClosed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const selectedStore = stores.find(s => s.id === selectedId) || stores[0];
  const showOnWebsite = selectedStore?.enabled ?? false;
  const exclusives = selectedStore?.exclusiveItems ?? [];
  const gallery = selectedStore?.gallery ?? [];
  const visits = VISIT_DATA[selectedId as keyof typeof VISIT_DATA] || VISIT_DATA.chennai;

  const handleAdd = () => { setDrawerMode('add'); setDrawerOpen(true); };
  const handleEdit = () => { setDrawerMode('edit'); setDrawerOpen(true); };
  const handleSave = async (data: Partial<Store>) => {
    try {
      if (drawerMode === 'edit' && selectedStore) {
        await storesApi.update(selectedStore.id, data as any);
      } else {
        await storesApi.create(data as any);
      }
      fetchStores();
    } catch (e) {
      console.error('Failed to save store', e);
    }
  };

  const toggleWebsite = async () => {
    if (!selectedStore) return;
    try {
      await storesApi.update(selectedStore.id, { enabled: !selectedStore.enabled });
      fetchStores();
    } catch (e) { console.error(e); }
  };

  const toggleTempClosed = async () => {
    if (!selectedStore) return;
    try {
      const nextVal = !tempClosed;
      setTempClosed(nextVal);
      await storesApi.update(selectedStore.id, { temporarilyClosed: nextVal });
      fetchStores();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!selectedStore) return;
    try {
      await storesApi.delete(selectedStore.id);
      setSelectedId('');
      fetchStores();
    } catch (e) { console.error(e); }
  };

  /* ── Exclusive items CRUD ── */
  const addExclusiveItem = async (item: ExclusiveItem) => {
    if (!selectedStore) return;
    try {
      await storesApi.addExclusiveItem(selectedStore.id, item);
      fetchStores();
    } catch (e) { console.error(e); }
  };

  const removeExclusiveItem = async (index: number) => {
    if (!selectedStore) return;
    try {
      await storesApi.removeExclusiveItem(selectedStore.id, index);
      fetchStores();
    } catch (e) { console.error(e); }
  };

  /* ── Gallery CRUD ── */
  const addGalleryPhoto = async (emoji: string) => {
    // Note: API expects a file, this is mock logic for the UI emoji placeholder
    // In a real implementation you would use storesApi.addGalleryPhoto(storeId, file)
    setStores(prev => prev.map(s =>
      s.id === selectedId
        ? { ...s, gallery: [...s.gallery, emoji] }
        : s
    ));
  };

  const removeGalleryPhoto = async (index: number) => {
    if (!selectedStore) return;
    try {
      await storesApi.removeGalleryPhoto(selectedStore.id, index);
      fetchStores();
    } catch (e) { console.error(e); }
  };

  const managerInitials = selectedStore?.managerName
    ? selectedStore.managerName.split(' ').map(w => w[0]).join('').toUpperCase()
    : '??';

  return (
    <div className="flex flex-col gap-4 p-4 md:p-5 min-h-full overflow-y-auto bg-[#F7F3EE] rounded-xl">

      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Stores</h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>View and manage all Fusk-it outlets — hours, contact, exclusive items and more</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-[6px] px-[14px] py-[9px] rounded-lg text-xs font-semibold cursor-pointer transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <PlusIcon /> Add Store
        </button>
      </div>

      {/* ═══ STATS STRIP ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
        <StatCard icon={<StoreIcon />} bg="var(--orange-light)" color="var(--orange)" value={meta?.total || 0} label="Total stores" />
        <StatCard icon={<EyeIcon />} bg="var(--green-bg)" color="var(--green)" value={meta?.open || 0} label="Open now" />
        <StatCard icon={<ClipboardIcon />} bg="var(--blue-bg)" color="var(--blue)" value={meta?.totalMenuItems || 0} label="Total menu items" />
        <StatCard icon={<UsersIcon />} bg="var(--red-bg)" color="var(--red)" value={meta?.totalExclusiveItems || 0} label="Exclusive items total" />
      </div>

      {/* ═══ STORE TABS ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[10px]">
        <div className="flex gap-1 p-1 rounded-[10px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          {stores.map(store => (
            <button key={store.id} onClick={() => setSelectedId(store.id)}
              className="px-4 py-[7px] rounded-[7px] text-xs font-semibold flex items-center gap-[7px] transition-all cursor-pointer"
              style={{
                color: selectedId === store.id ? '#fff' : 'var(--text-muted)',
                background: selectedId === store.id ? 'var(--orange)' : 'transparent',
                boxShadow: selectedId === store.id ? '0 2px 6px rgba(212,114,42,0.3)' : 'none'
              }}>
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: selectedId === store.id ? 'rgba(255,255,255,0.7)' : (store.enabled ? 'var(--green)' : 'var(--red)') }} />
              {store.name}
            </button>
          ))}
        </div>
        <button onClick={handleAdd} className="flex items-center gap-[6px] px-[18px] py-[7px] rounded-[8px] text-xs font-bold transition-all cursor-pointer"
          style={{ background: 'var(--orange)', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}>
          <PlusIcon /> Add New Store
        </button>
      </div>

      {/* ═══ STORE FULL PAGE: 2-column grid ═══ */}
      {selectedStore && (
        <div className="flex flex-col lg:grid gap-4 items-start" style={{ gridTemplateColumns: '1fr 340px' }}>

          {/* ═══ LEFT COLUMN ═══ */}
          <div className="flex flex-col gap-[14px] w-full min-w-0">

            {/* ── Hero Card ── */}
            <div className="rounded-[14px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="h-[200px] relative flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg,#1C0F05 0%,#4A2C16 50%,#1C0F05 100%)' }}>
                <div className="text-[80px] absolute opacity-[0.18]">🏪</div>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,15,5,.7) 0%, transparent 60%)' }} />
                {/* Hero actions */}
                <div className="absolute top-3 right-3 flex gap-[6px]">
                  <button onClick={handleEdit} className="px-3 py-[6px] rounded-[7px] text-[11px] font-bold flex items-center gap-[5px] transition-all cursor-pointer border-none" style={{ background: '#fff', color: 'var(--text-primary)' }}>
                    <EditIcon /> Edit store
                  </button>
                  <button className="px-3 py-[6px] rounded-[7px] text-[11px] font-bold flex items-center gap-[5px] transition-all cursor-pointer border-none" style={{ background: 'var(--orange)', color: '#fff' }}>
                    <ExternalIcon /> View on site
                  </button>
                </div>
                {/* Hero info */}
                <div className="absolute bottom-[14px] left-4">
                  <div className="font-display text-[22px] font-bold text-white leading-none">{selectedStore.name}</div>
                  <div className="text-xs mt-[3px] flex items-center gap-[5px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <MapPinIcon size={11} /> {selectedStore.address?.split(',').slice(0, 3).join(',')}
                  </div>
                  <div className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-full text-[10px] font-bold mt-[6px]"
                    style={{ background: showOnWebsite ? 'var(--green-bg)' : 'var(--red-bg)', color: showOnWebsite ? 'var(--green)' : 'var(--red)', border: `1px solid ${showOnWebsite ? 'rgba(45,134,83,.25)' : 'rgba(201,64,64,.25)'}` }}>
                    <div className="w-[6px] h-[6px] rounded-full" style={{ background: 'currentColor' }} />
                    {showOnWebsite ? 'Open now' : 'Closed'}
                  </div>
                </div>
              </div>
              {/* Quick stats bar */}
              <div className="px-4 py-4 flex flex-wrap gap-x-6 gap-y-3 items-center">
                <QuickStat value={selectedStore.rating ? selectedStore.rating.toString() : "—"} label="Rating" />
                <Divider />
                <QuickStat value={selectedStore.reviewCount ? `${selectedStore.reviewCount}+` : "0"} label="Reviews" />
                <Divider />
                <QuickStat value={selectedStore.menuItemCount?.toString() || "0"} label="Menu items" />
                <Divider />
                <QuickStat value={selectedStore.exclusiveItemCount?.toString() || "0"} label="Exclusives" />
                <Divider />
                <QuickStat value={selectedStore.foundedYear?.toString() || "—"} label="Founded" />
              </div>
            </div>

            {/* ── Location & Contact ── */}
            <InfoCard title="Location & contact" icon={<MapPinIcon />} onEdit={handleEdit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                <DetailItem label="Full address" value={selectedStore.address} fullWidth />
                <DetailItem label="Phone" value={selectedStore.phone} />
                <DetailItem label="WhatsApp" value={selectedStore.whatsapp || '—'} />
                <DetailItem label="Email" value={selectedStore.email || '—'} />
                <DetailItem label="Google Maps link" value={selectedStore.mapsLink?.replace('https://', '')} isLink />
              </div>

              {/* Map embed placeholder */}
              <div className="mt-[14px] w-full h-[180px] rounded-[10px] relative overflow-hidden flex flex-col items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', border: '1px solid var(--border)' }}>
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(45,134,83,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(45,134,83,.08) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="w-10 h-10 rounded-full flex items-center justify-center z-[1]" style={{ background: 'var(--orange)', boxShadow: '0 4px 12px rgba(212,114,42,0.4)' }}>
                  <MapPinIcon size={20} />
                </div>
                <div className="text-xs font-semibold z-[1]" style={{ color: 'var(--text-secondary)' }}>Google Maps embed — {selectedStore.address?.split(',')[0]}</div>
              </div>
              <div className="flex gap-2 mt-[10px]">
                <MapBtn label="Update embed link" icon={<EditIcon />} />
                <MapBtn label="Open in Maps" icon={<ExternalIcon />} />
              </div>
            </InfoCard>

            {/* ── Opening Hours ── */}
            <InfoCard title="Opening hours" icon={<ClockIcon />} onEdit={handleEdit}>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-[6px]">
                {selectedStore.hours && Object.entries(selectedStore.hours).map(([day, h]) => {
                  const isToday = day === todayName;
                  return (
                    <div key={day} className="rounded-lg p-2 text-center"
                      style={{ background: isToday ? 'var(--orange-light)' : 'var(--bg-card2)', border: `1px solid ${isToday ? 'var(--orange)' : 'var(--border)'}` }}>
                      <div className="text-[9px] font-bold uppercase mb-1" style={{ color: isToday ? 'var(--orange)' : 'var(--text-muted)' }}>{day}</div>
                      <div className="text-[10px] font-semibold" style={{ color: h.closed ? 'var(--red)' : 'var(--green)' }}>{h.closed ? 'Closed' : 'Open'}</div>
                      {!h.closed && <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-secondary)' }}>{h.open}–{h.close}</div>}
                    </div>
                  );
                })}
              </div>
            </InfoCard>

            {/* ── Store Manager ── */}
            <InfoCard title="Store manager" icon={<UserIcon />} onEdit={handleEdit}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 font-display"
                  style={{ background: 'var(--orange-light)', border: '2px solid rgba(212,114,42,0.3)', color: 'var(--orange)' }}>
                  {managerInitials}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedStore.managerName || '—'}</div>
                  <div className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Store Manager — {selectedStore.name}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-[10px]">
                <ManagerBtn label="Call" icon={<PhoneIcon size={12} />} />
                <ManagerBtn label="WhatsApp" icon={<MessageIcon size={12} />} variant="whatsapp" />
                <ManagerBtn label="Email" icon={<MailIcon size={12} />} />
              </div>
            </InfoCard>

            {/* ── Exclusive Items ── */}
            <InfoCard title={`Exclusive items — ${selectedStore.city} only`} icon={<StarIcon />} editLabel="Manage" onEdit={() => { }}>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                {exclusives.map((item, i) => (
                  <div key={i} className="flex items-center gap-[9px] px-3 py-[10px] rounded-[10px] transition-all cursor-pointer relative group"
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>
                    <div className="text-[22px] flex-shrink-0">{item.emoji}</div>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</div>
                      <div className="text-[11px] font-semibold mt-[1px]" style={{ color: 'var(--orange)' }}>{item.price}</div>
                      <span className="inline-block text-[9px] px-[6px] py-[2px] rounded-[10px] mt-[3px] font-bold" style={{ background: 'var(--purple-bg)', color: 'var(--purple)' }}>{selectedStore.city} only</span>
                    </div>
                    {/* Remove button */}
                    <button onClick={(e) => { e.stopPropagation(); removeExclusiveItem(i); }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                      style={{ background: 'var(--red-bg)', color: 'var(--red)', fontSize: 10, fontWeight: 700 }}
                      title="Remove item">✕</button>
                  </div>
                ))}
                {/* Add exclusive */}
                <div className="flex flex-col items-center justify-center gap-1 px-3 py-[14px] rounded-[10px] cursor-pointer transition-all"
                  style={{ background: 'var(--orange-bg)', border: '1.5px dashed rgba(212,114,42,0.3)' }}
                  onClick={() => {
                    const emojis = ['🍔', '🌮', '🍕', '🥪', '🧆', '🍜', '🥗', '🍿'];
                    const names = ['Spicy Wrap', 'Cheese Burst', 'Tandoori Roll', 'Paneer Tikka', 'Veg Delight', 'Double Crunch', 'Smoky BBQ', 'Masala Fries'];
                    const idx = Math.floor(Math.random() * emojis.length);
                    const price = `₹${Math.floor(Math.random() * 150) + 99}`;
                    addExclusiveItem({ emoji: emojis[idx], name: names[idx], price });
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-light)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,114,42,0.5)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,114,42,0.3)'; }}>
                  <PlusIcon size={18} />
                  <span className="text-[11px] font-semibold" style={{ color: 'var(--orange)' }}>Add exclusive</span>
                </div>
              </div>
            </InfoCard>

            {/* ── Store Photos ── */}
            <InfoCard title="Store photos" icon={<ImageIcon />} editLabel="Manage gallery" onEdit={() => { }}>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((g, i) => (
                  <div key={i} className="w-20 h-20 rounded-[9px] flex-shrink-0 flex items-center justify-center text-[28px] cursor-pointer transition-all relative overflow-hidden group"
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                    {g}
                    {/* Hover overlay with remove */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(212,114,42,0.15)' }}>
                      <button onClick={(e) => { e.stopPropagation(); removeGalleryPhoto(i); }}
                        className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-none"
                        style={{ background: 'var(--red-bg)', color: 'var(--red)', fontSize: 10, fontWeight: 700 }}
                        title="Remove photo">✕</button>
                    </div>
                  </div>
                ))}
                {/* Add thumb */}
                <div className="w-20 h-20 rounded-[9px] flex-shrink-0 flex flex-col items-center justify-center gap-[3px] cursor-pointer transition-all"
                  style={{ background: 'var(--orange-bg)', border: '1.5px dashed rgba(212,114,42,0.35)' }}
                  onClick={() => {
                    const emojis = ['📸', '🍽️', '🎨', '🎵', '🌺', '🏖️', '🎪', '🍰'];
                    addGalleryPhoto(emojis[Math.floor(Math.random() * emojis.length)]);
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-light)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,114,42,0.6)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-bg)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,114,42,0.35)'; }}>
                  <PlusIcon size={18} />
                  <span className="text-[9px] font-semibold" style={{ color: 'var(--orange)' }}>Add</span>
                </div>
              </div>
            </InfoCard>

          </div>

          {/* ═══ RIGHT COLUMN ═══ */}
          <div className="flex flex-col gap-[14px] w-full lg:sticky lg:top-0">

            {/* ── Status Control ── */}
            <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="px-4 py-3 border-b flex items-center gap-[7px] text-[13px] font-semibold" style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--orange)' }}><InfoIcon /></span> Store status
              </div>
              <div className="p-4 flex flex-col gap-[10px]">
                {/* Live indicator */}
                <div className="flex items-center gap-[7px] px-3 py-2 rounded-lg text-[11px] font-semibold"
                  style={{ background: showOnWebsite ? 'var(--green-bg)' : 'var(--red-bg)', border: `1px solid ${showOnWebsite ? 'rgba(45,134,83,0.2)' : 'rgba(201,64,64,0.2)'}`, color: showOnWebsite ? 'var(--green)' : 'var(--red)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: showOnWebsite ? 'var(--green)' : 'var(--red)', boxShadow: `0 0 0 3px ${showOnWebsite ? 'rgba(45,134,83,0.2)' : 'rgba(201,64,64,0.2)'}` }} />
                  {selectedStore.name} is currently {showOnWebsite ? 'open and live on the website' : 'hidden from the website'}
                </div>
                {/* Toggle: show on website */}
                <div className="flex items-center justify-between px-[13px] py-[10px] rounded-lg" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Show on website</div>
                    <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Customers can see this store on the store locator</div>
                  </div>
                  <Toggle on={showOnWebsite} onToggle={toggleWebsite} />
                </div>
                {/* Toggle: temporarily closed */}
                <div className="flex items-center justify-between px-[13px] py-[10px] rounded-lg" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Mark as temporarily closed</div>
                    <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>Shows "Temporarily closed" badge on the site</div>
                  </div>
                  <Toggle on={tempClosed} onToggle={toggleTempClosed} />
                </div>
                {/* Warning */}
                <div className="flex items-start gap-[7px] px-3 py-2 rounded-lg text-[11px]"
                  style={{ background: 'var(--amber-bg)', border: '1px solid rgba(196,122,26,0.2)', color: 'var(--amber)' }}>
                  <span className="mt-[1px] flex-shrink-0"><AlertIcon /></span>
                  Hiding a store removes it from the store locator and product availability immediately.
                </div>
              </div>
            </div>

            {/* ── Quick Contact ── */}
            <InfoCard title="Quick contact" icon={<PhoneIcon />}>
              <div className="flex flex-col gap-2">
                <QuickContactRow icon={<PhoneIcon />} iconBg="var(--blue-bg)" iconColor="var(--blue)" label="Call store" value={selectedStore.phone} />
                <QuickContactRow icon={<MessageIcon />} iconBg="rgba(37,211,102,0.1)" iconColor="#128C7E" label="WhatsApp" value={selectedStore.whatsapp || '—'} />
                <QuickContactRow icon={<MapPinIcon />} iconBg="var(--red-bg)" iconColor="var(--red)" label="Get directions" value="Google Maps" />
                <QuickContactRow icon={<MailIcon />} iconBg="var(--orange-light)" iconColor="var(--orange)" label="Email store" value={selectedStore.email || '—'} />
              </div>
            </InfoCard>

            {/* ── Store Page Visits ── */}
            <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div className="text-[13px] font-semibold flex items-center gap-[7px]" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--orange)' }}><BarChartIcon /></span> Store page visits
                </div>
                <span className="text-[11px] font-semibold" style={{ color: 'var(--orange)' }}>This week</span>
              </div>
              <div className="px-4 py-3">
                <div className="text-[10px] uppercase tracking-[.06em] mb-2" style={{ color: 'var(--text-muted)' }}>Weekly visitors</div>
                <div className="font-display text-xl font-bold mb-[6px]" style={{ color: 'var(--text-primary)' }}>{visits.total}</div>
                <div className="text-[10px] font-semibold" style={{ color: 'var(--green)' }}>{visits.change}</div>
                {/* Bars */}
                <div className="flex items-end gap-[3px] h-10 mt-[10px]">
                  {visits.bars.map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-[3px] cursor-pointer transition-opacity hover:opacity-75 mini-bar-anim"
                      style={{ height: `${h}%`, background: 'var(--orange)', opacity: 0.3 + (h / 100) * 0.7, animationDelay: `${i * 0.06}s` }} />
                  ))}
                </div>
                <div className="flex justify-between mt-[3px]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <span key={d} className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Danger Zone ── */}
            <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,64,64,0.2)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="px-4 py-3 border-b flex items-center gap-[7px] text-[13px] font-semibold" style={{ color: 'var(--red)', borderColor: 'rgba(201,64,64,0.15)' }}>
                <AlertIcon /> Danger zone
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button onClick={() => setDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-[13px] py-[9px] rounded-lg text-xs font-medium transition-all cursor-pointer"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--red-bg)'; el.style.borderColor = 'rgba(201,64,64,0.3)'; el.style.color = 'var(--red)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
                  <TrashIcon /> Delete this store
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══ MODALS ═══ */}
      <StoreDrawer open={drawerOpen} mode={drawerMode} store={drawerMode === 'edit' ? selectedStore : null} onClose={() => setDrawerOpen(false)} onSave={handleSave} />
      <DeleteModal open={deleteModalOpen} categoryName={selectedStore?.name || ''} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
};

/* ───────── SUB-COMPONENTS ───────── */

const StatCard: React.FC<{ icon: React.ReactNode; bg: string; color: string; value: number; label: string }> = ({ icon, bg, color, value, label }) => (
  <div className="flex items-center gap-[10px] p-3 md:px-4 md:py-3 rounded-[10px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg, color }}>
      {icon}
    </div>
    <div>
      <div className="font-display text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);

const QuickStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <div className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
    <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
  </div>
);

const Divider = () => <div className="w-[1px] h-8 hidden sm:block" style={{ background: 'var(--border)' }} />;

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  editLabel?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}
const InfoCard: React.FC<InfoCardProps> = ({ title, icon, editLabel = 'Edit', onEdit, children }) => (
  <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
      <div className="text-[13px] font-semibold flex items-center gap-[7px]" style={{ color: 'var(--text-primary)' }}>
        <span style={{ color: 'var(--orange)' }}>{icon}</span> {title}
      </div>
      {onEdit && (
        <button onClick={onEdit} className="text-[11px] font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-none" style={{ color: 'var(--orange)' }}>
          <EditIcon /> {editLabel}
        </button>
      )}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string; fullWidth?: boolean; isLink?: boolean }> = ({ label, value, fullWidth, isLink }) => (
  <div className={fullWidth ? 'col-span-1 sm:col-span-2' : ''}>
    <div className="text-[10px] uppercase tracking-[.05em] mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
    <div className="text-[13px] font-medium leading-[1.5]" style={{ color: isLink ? 'var(--blue)' : 'var(--text-primary)', cursor: isLink ? 'pointer' : 'default' }}>{value}</div>
  </div>
);

const MapBtn: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
  <button className="flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold cursor-pointer transition-all bg-transparent"
    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
    {icon} {label}
  </button>
);

const ManagerBtn: React.FC<{ label: string; icon: React.ReactNode; variant?: 'default' | 'whatsapp' }> = ({ label, icon, variant = 'default' }) => {
  const isWA = variant === 'whatsapp';
  return (
    <button className="flex items-center gap-[5px] px-3 py-[6px] rounded-[7px] text-[11px] font-semibold cursor-pointer transition-all"
      style={{
        border: `1px solid ${isWA ? 'rgba(37,211,102,0.3)' : 'var(--border)'}`,
        background: isWA ? 'rgba(37,211,102,0.06)' : 'var(--bg-card2)',
        color: isWA ? '#128C7E' : 'var(--text-secondary)'
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = isWA ? 'rgba(37,211,102,0.5)' : 'var(--border-strong)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = isWA ? 'rgba(37,211,102,0.3)' : 'var(--border)'; }}>
      {icon} {label}
    </button>
  );
};

const QuickContactRow: React.FC<{ icon: React.ReactNode; iconBg: string; iconColor: string; label: string; value: string }> = ({ icon, iconBg, iconColor, label, value }) => (
  <div className="flex items-center gap-[10px] px-3 py-[9px] rounded-lg cursor-pointer transition-all"
    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>
    <div className="w-7 h-7 rounded-[7px] flex items-center justify-center flex-shrink-0" style={{ background: iconBg, color: iconColor }}>{icon}</div>
    <div className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{label}</div>
    <div className="text-[11px] hidden sm:block" style={{ color: 'var(--text-muted)' }}>{value}</div>
    <span style={{ color: 'var(--text-muted)' }}><ChevronRightIcon /></span>
  </div>
);
