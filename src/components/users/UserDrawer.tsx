import React, { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

/* ───────── Types ───────── */
export type RolePreset = 'Store Manager' | 'Content Editor' | 'Support Agent' | 'Custom';

export interface PermissionSet {
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ModulePerms {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconBg: string;
  rows: { name: string; perms: PermissionSet; viewOnly?: boolean }[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  rolePreset: RolePreset;
  avatarColor: string;
  initials: string;
  permissions: ModulePerms[];
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  isGoogle: boolean;
  active: boolean;
}

interface UserDrawerProps {
  open: boolean;
  mode: 'add' | 'edit' | 'perms';
  user: UserData | null;
  onClose: () => void;
  onSave: (data: Partial<UserData>) => void;
}

/* ───────── Icons ───────── */
const XIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width={10} height={10} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
);
const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
);

/* ───────── Role Presets ───────── */
const ROLE_PRESETS: { name: RolePreset; color: string; desc: string }[] = [
  { name: 'Store Manager', color: 'var(--green)', desc: 'Full stores access, menu view only, no banners or users' },
  { name: 'Content Editor', color: 'var(--blue)', desc: 'Full menu + banners access, stores view only, no users' },
  { name: 'Support Agent', color: 'var(--purple)', desc: 'View only across menu, stores and banners. No edit or delete' },
  { name: 'Custom', color: 'var(--amber)', desc: 'Define a unique role name and set permissions manually' },
];

/* ───────── Default permission modules ───────── */
export const DEFAULT_MODULES: ModulePerms[] = [
  {
    id: 'categories', name: 'Menu Categories',
    icon: <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
    iconBg: 'var(--orange-light)',
    rows: [{ name: 'Categories', perms: { create: true, view: true, edit: true, delete: false } }]
  },
  {
    id: 'items', name: 'Menu Items',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><circle cx="12" cy="12" r="9" fill="none" stroke="var(--blue)" strokeWidth="2" /></svg>,
    iconBg: 'var(--blue-bg)',
    rows: [
      { name: 'Products', perms: { create: true, view: true, edit: true, delete: false } },
      { name: 'Prices', perms: { create: false, view: true, edit: false, delete: false } },
    ]
  },
  {
    id: 'banners', name: 'Banners',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="var(--green)" strokeWidth="2" /></svg>,
    iconBg: 'var(--green-bg)',
    rows: [
      { name: 'Hero banners', perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Announcement bar', perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Popups & scheduled', perms: { create: false, view: false, edit: false, delete: false } },
    ]
  },
  {
    id: 'stores', name: 'Stores',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><path d="M12 2C8.13 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3.13-7-7-7z" fill="var(--purple)" /></svg>,
    iconBg: 'var(--purple-bg)',
    rows: [
      { name: 'Store info & hours', perms: { create: true, view: true, edit: true, delete: false } },
      { name: 'Exclusive items', perms: { create: true, view: true, edit: true, delete: true } },
      { name: 'Store gallery', perms: { create: true, view: true, edit: true, delete: true } },
    ]
  },
  {
    id: 'gallery', name: 'Gallery',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="var(--amber)" strokeWidth="2" /></svg>,
    iconBg: 'var(--amber-bg)',
    rows: [{ name: 'Photos & media', perms: { create: false, view: false, edit: false, delete: false } }]
  },
  {
    id: 'users', name: 'Users & Permissions',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="var(--red)" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="var(--red)" strokeWidth="2" fill="none" /></svg>,
    iconBg: 'var(--red-bg)',
    rows: [
      { name: 'Invite & manage users', perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Edit permissions', perms: { create: false, view: false, edit: false, delete: false } },
    ]
  },
  {
    id: 'dashboard', name: 'Dashboard & Analytics',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="14" y="3" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="3" y="14" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="14" y="14" width="7" height="7" rx="1" fill="var(--blue)" /></svg>,
    iconBg: 'var(--blue-bg)',
    rows: [
      { name: 'View dashboard', perms: { create: false, view: true, edit: false, delete: false }, viewOnly: true },
      { name: 'Page & store analytics', perms: { create: false, view: true, edit: false, delete: false }, viewOnly: true },
    ]
  },
];

/* ───────── COMPONENT ───────── */
export const UserDrawer: React.FC<UserDrawerProps> = ({ open, mode, user, onClose, onSave }) => {
  const [selectedPreset, setSelectedPreset] = useState<RolePreset>(user?.rolePreset || 'Store Manager');
  const [roleName, setRoleName] = useState(user?.role || 'Store Manager');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['categories', 'items']));
  const [modules, setModules] = useState<ModulePerms[]>(user?.permissions || DEFAULT_MODULES);
  const [accountActive, setAccountActive] = useState(user?.active ?? true);

  if (!open) return null;

  const isPerms = mode === 'perms';
  const isEdit = mode === 'edit';

  const title = isEdit ? 'Edit User' : isPerms ? 'View Permissions' : 'Invite User';
  const subtitle = isEdit ? `Editing permissions for ${user?.name}` : isPerms ? `${user?.name} — Super Admin (read-only)` : 'Add a team member and set their permissions';
  const saveLabel = isEdit ? 'Save changes' : isPerms ? 'Close' : 'Send invite';

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const togglePerm = (moduleId: string, rowIdx: number, key: keyof PermissionSet) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        rows: m.rows.map((r, i) => {
          if (i !== rowIdx) return r;
          return { ...r, perms: { ...r.perms, [key]: !r.perms[key] } };
        })
      };
    }));
  };

  const toggleAll = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      const allChecked = m.rows.every(r => !r.viewOnly && r.perms.create && r.perms.view && r.perms.edit && r.perms.delete);
      return {
        ...m,
        rows: m.rows.map(r => r.viewOnly ? r : { ...r, perms: { create: !allChecked, view: !allChecked, edit: !allChecked, delete: !allChecked } })
      };
    }));
    if (!expandedModules.has(moduleId)) setExpandedModules(prev => new Set(prev).add(moduleId));
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#1C0F05]/35 z-[100] transition-opacity" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] z-[101] flex flex-col shadow-[-8px_0_32px_rgba(44,26,14,0.14)]"
        style={{ background: 'var(--bg-card)', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <p className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
          <button onClick={onClose} className="w-[30px] h-[30px] rounded-lg flex items-center justify-center transition-all border cursor-pointer"
            style={{ background: 'var(--bg-card2)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.background = 'var(--red-bg)'; el.style.borderColor = 'var(--red)'; el.style.color = 'var(--red)'; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">

          {/* User Info */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>👤</span> User info
            </h3>
            <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Full name <span style={{ color: 'var(--orange)' }}>*</span></label>
                <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={user?.name}
                  placeholder="e.g. Sheriff Ahmed"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Gmail address <span style={{ color: 'var(--orange)' }}>*</span></label>
                <input type="email" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" defaultValue={user?.email}
                  placeholder="name@gmail.com"
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              </div>
            </div>
            <div className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg text-[11px] mb-[10px]"
              style={{ background: 'var(--blue-bg)', border: '1px solid rgba(45,114,184,0.2)', color: 'var(--blue)' }}>
              <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-[1px]">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              An invite email will be sent to their Gmail. They sign in using Google — no separate password needed.
            </div>
          </div>

          {/* Role */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>🏷️</span> Role name
            </h3>
            <div className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg text-[11px] mb-[14px]"
              style={{ background: 'var(--orange-light)', border: '1px solid rgba(212,114,42,0.2)', color: 'var(--orange-dim)' }}>
              <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-[1px]">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" />
              </svg>
              Roles are just labels — the actual permissions are set individually in the matrix below. Use presets to fill quickly.
            </div>
            {/* Preset cards */}
            <div className="grid grid-cols-2 gap-2 mb-[14px]">
              {ROLE_PRESETS.map(rp => (
                <div key={rp.name}
                  className="p-[10px] rounded-[10px] cursor-pointer transition-all"
                  style={{ border: selectedPreset === rp.name ? '1.5px solid var(--orange)' : '1.5px solid var(--border)', background: selectedPreset === rp.name ? 'var(--orange-light)' : 'transparent' }}
                  onClick={() => { setSelectedPreset(rp.name); if (rp.name !== 'Custom') setRoleName(rp.name); else setRoleName(''); }}>
                  <div className="flex items-center gap-[7px] mb-1">
                    <div className="w-[10px] h-[10px] rounded-full" style={{ background: rp.color }} />
                    <div className="text-xs font-bold" style={{ color: selectedPreset === rp.name ? 'var(--orange)' : 'var(--text-primary)' }}>{rp.name === 'Custom' ? 'Custom role' : rp.name}</div>
                  </div>
                  <div className="text-[10px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{rp.desc}</div>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>Role display name <span style={{ color: 'var(--orange)' }}>*</span></label>
              <input type="text" className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors" value={roleName} onChange={e => setRoleName(e.target.value)}
                placeholder="e.g. Social Media Manager, Franchise Partner…"
                style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
              <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>This is how the role appears in the users table and the user's profile.</div>
            </div>
          </div>

          {/* Permission Matrix */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>🔒</span> Permission matrix
              <span className="text-[10px] font-normal normal-case tracking-normal ml-1" style={{ color: 'var(--text-muted)' }}>Click a module to expand</span>
            </h3>

            <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {/* Matrix header */}
              <div className="grid gap-1 px-[14px] py-2" style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px', background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                <div className="text-[10px] font-bold uppercase tracking-[.06em]" style={{ color: 'var(--text-muted)' }}>Module</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--green)' }}>Create</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--blue)' }}>View</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--orange)' }}>Edit</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--red)' }}>Delete</div>
              </div>

              {/* Modules */}
              {modules.map(mod => {
                const isExpanded = expandedModules.has(mod.id);
                return (
                  <div key={mod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Module header */}
                    <div className="flex items-center gap-2 px-[14px] py-2 cursor-pointer transition-colors select-none"
                      style={{ background: 'var(--bg-card2)' }}
                      onClick={() => toggleModule(mod.id)}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}>
                      <div className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: mod.iconBg }}>{mod.icon}</div>
                      <div className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{mod.name}</div>
                      <button className="text-[10px] font-semibold cursor-pointer bg-transparent border-none" style={{ color: 'var(--orange)' }}
                        onClick={e => { e.stopPropagation(); toggleAll(mod.id); }}>Toggle all</button>
                      <span className="transition-transform" style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}><ChevronIcon /></span>
                    </div>
                    {/* Permission rows */}
                    {isExpanded && mod.rows.map((row, ri) => (
                      <div key={ri} className="grid gap-1 px-[14px] py-[9px] items-center transition-colors"
                        style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px', borderTop: '1px solid var(--border)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                        <div className="text-xs pl-[30px]" style={{ color: 'var(--text-secondary)' }}>{row.name}</div>
                        {(['create', 'view', 'edit', 'delete'] as const).map(key => {
                          const disabled = row.viewOnly && key !== 'view';
                          const checked = row.perms[key];
                          const colorMap = { create: 'var(--green)', view: 'var(--blue)', edit: 'var(--orange)', delete: 'var(--red)' };
                          return (
                            <div key={key} className="flex justify-center">
                              <div
                                className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center cursor-pointer transition-all flex-shrink-0"
                                style={{
                                  border: checked ? `1.5px solid ${colorMap[key]}` : '1.5px solid var(--border-strong)',
                                  background: checked ? colorMap[key] : 'transparent',
                                  opacity: disabled ? 0.3 : 1,
                                  pointerEvents: disabled ? 'none' : 'auto',
                                }}
                                onClick={() => togglePerm(mod.id, ri, key)}>
                                {checked && <CheckIcon />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account status */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>ℹ️</span> Account status
            </h3>
            <div className="flex items-center justify-between px-[13px] py-[10px] rounded-lg mb-3" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
              <div>
                <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Active account</div>
                <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>When off, this user is blocked from logging into the admin panel</div>
              </div>
              <Toggle on={accountActive} onToggle={() => setAccountActive(!accountActive)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-[14px] border-t flex gap-[10px] flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="px-4 py-[10px] rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={() => { onSave({}); onClose(); }} className="flex-1 py-[10px] rounded-lg text-[13px] font-bold text-white transition-all cursor-pointer border-none"
            style={{ background: 'var(--orange)', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange-dim)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--orange)'; }}>
            {saveLabel}
          </button>
        </div>
      </div>
    </>
  );
};
