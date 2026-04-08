import React, { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';
import type { UserData, ModulePerms, PermissionSet, RolePreset, ModuleRow } from '@/types';

// Re-export for backwards compat (UsersPermissionsPage imports UserData from here)
export type { UserData, ModulePerms, PermissionSet, RolePreset, ModuleRow };

/* ───────── Local display type (adds React icon node) ───────── */
interface ModulePermsDisplay extends ModulePerms {
  icon: React.ReactNode;
}

interface UserDrawerProps {
  open: boolean;
  mode: 'add' | 'edit' | 'perms';
  user: UserData | null;
  onClose: () => void;
  /** Async — drawer waits for this to resolve before closing */
  onSave: (data: Partial<UserData>) => Promise<void>;
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
const SpinnerIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    style={{ animation: 'spin 0.8s linear infinite' }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

/* ───────── Role Presets ───────── */
const ROLE_PRESETS: { name: RolePreset; color: string; desc: string }[] = [
  { name: 'Store Manager',  color: 'var(--green)',  desc: 'Full stores access, menu view only, no banners or users' },
  { name: 'Content Editor', color: 'var(--blue)',   desc: 'Full menu + banners access, stores view only, no users' },
  { name: 'Support Agent',  color: 'var(--purple)', desc: 'View only across menu, stores and banners. No edit or delete' },
  { name: 'Custom',         color: 'var(--amber)',  desc: 'Define a unique role name and set permissions manually' },
];

/* ───────── Avatar colour palette ───────── */
const AVATAR_COLORS = [
  'var(--orange)', 'var(--green)', 'var(--blue)',
  'var(--purple)', 'var(--amber)',
];

/* ───────── Helpers ───────── */
function computeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Merge saved permissions (without icons) with DEFAULT_MODULES (which have icons) */
function mergeWithDefaults(
  saved: ModulePerms[],
  defaults: ModulePermsDisplay[]
): ModulePermsDisplay[] {
  return defaults.map((def) => {
    const match = saved.find((p) => p.id === def.id);
    return match ? { ...def, rows: match.rows } : def;
  });
}

/** Strip icon from display modules before sending to API */
function toApiPerms(mods: ModulePermsDisplay[]): ModulePerms[] {
  return mods.map(({ id, name, iconBg, rows }) => ({ id, name, iconBg, rows }));
}

/* ───────── Default permission modules ───────── */
export const DEFAULT_MODULES: ModulePermsDisplay[] = [
  {
    id: 'categories', name: 'Menu Categories',
    icon: <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
    iconBg: 'var(--orange-light)',
    rows: [{ name: 'Categories', perms: { create: true, view: true, edit: true, delete: false } }],
  },
  {
    id: 'items', name: 'Menu Items',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><circle cx="12" cy="12" r="9" fill="none" stroke="var(--blue)" strokeWidth="2" /></svg>,
    iconBg: 'var(--blue-bg)',
    rows: [
      { name: 'Products', perms: { create: true, view: true, edit: true, delete: false } },
      { name: 'Prices',   perms: { create: false, view: true, edit: false, delete: false } },
    ],
  },
  {
    id: 'banners', name: 'Banners',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="var(--green)" strokeWidth="2" /></svg>,
    iconBg: 'var(--green-bg)',
    rows: [
      { name: 'Hero banners',         perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Announcement bar',     perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Popups & scheduled',   perms: { create: false, view: false, edit: false, delete: false } },
    ],
  },
  {
    id: 'stores', name: 'Stores',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><path d="M12 2C8.13 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3.13-7-7-7z" fill="var(--purple)" /></svg>,
    iconBg: 'var(--purple-bg)',
    rows: [
      { name: 'Store info & hours', perms: { create: true, view: true, edit: true, delete: false } },
      { name: 'Exclusive items',    perms: { create: true, view: true, edit: true, delete: true  } },
      { name: 'Store gallery',      perms: { create: true, view: true, edit: true, delete: true  } },
    ],
  },
  {
    id: 'gallery', name: 'Gallery',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="var(--amber)" strokeWidth="2" /></svg>,
    iconBg: 'var(--amber-bg)',
    rows: [{ name: 'Photos & media', perms: { create: false, view: false, edit: false, delete: false } }],
  },
  {
    id: 'users', name: 'Users & Permissions',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="var(--red)" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="var(--red)" strokeWidth="2" fill="none" /></svg>,
    iconBg: 'var(--red-bg)',
    rows: [
      { name: 'Invite & manage users', perms: { create: false, view: false, edit: false, delete: false } },
      { name: 'Edit permissions',      perms: { create: false, view: false, edit: false, delete: false } },
    ],
  },
  {
    id: 'dashboard', name: 'Dashboard & Analytics',
    icon: <svg viewBox="0 0 24 24" width={11} height={11}><rect x="3" y="3" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="14" y="3" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="3" y="14" width="7" height="7" rx="1" fill="var(--blue)" /><rect x="14" y="14" width="7" height="7" rx="1" fill="var(--blue)" /></svg>,
    iconBg: 'var(--blue-bg)',
    rows: [
      { name: 'View dashboard',         perms: { create: false, view: true, edit: false, delete: false }, viewOnly: true },
      { name: 'Page & store analytics', perms: { create: false, view: true, edit: false, delete: false }, viewOnly: true },
    ],
  },
];

/* ───────── COMPONENT ───────── */
export const UserDrawer: React.FC<UserDrawerProps> = ({ open, mode, user, onClose, onSave }) => {
  const [selectedPreset, setSelectedPreset] = useState<RolePreset>(user?.rolePreset ?? 'Store Manager');
  const [roleName, setRoleName]             = useState(user?.role ?? 'Store Manager');
  const [nameVal, setNameVal]               = useState(user?.name ?? '');
  const [emailVal, setEmailVal]             = useState(user?.email ?? '');
  const [accountActive, setAccountActive]   = useState(user?.active ?? true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['categories', 'items']));
  const [modules, setModules] = useState<ModulePermsDisplay[]>(
    user?.permissions ? mergeWithDefaults(user.permissions, DEFAULT_MODULES) : DEFAULT_MODULES
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  React.useEffect(() => {
    if (open) {
      setSelectedPreset(user?.rolePreset ?? 'Store Manager');
      setRoleName(user?.role ?? 'Store Manager');
      setNameVal(user?.name ?? '');
      setEmailVal(user?.email ?? '');
      setAccountActive(user?.active ?? true);
      setModules(user?.permissions ? mergeWithDefaults(user.permissions, DEFAULT_MODULES) : DEFAULT_MODULES);
      setFormError('');
    }
  }, [open, user]);

  if (!open) return null;

  const isPerms = mode === 'perms';
  const isEdit  = mode === 'edit';
  const isAdd   = mode === 'add';

  const title     = isEdit ? 'Edit User' : isPerms ? 'View Permissions' : 'Invite User';
  const subtitle  = isEdit
    ? `Editing permissions for ${user?.name}`
    : isPerms
    ? `${user?.name} — Super Admin (read-only)`
    : 'Add a team member and set their permissions';
  const saveLabel = isPerms ? 'Close' : isEdit ? 'Save changes' : 'Send invite';

  /* ── Module helpers ── */
  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePerm = (moduleId: string, rowIdx: number, key: keyof PermissionSet) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id !== moduleId
          ? m
          : {
              ...m,
              rows: m.rows.map((r, i) =>
                i !== rowIdx ? r : { ...r, perms: { ...r.perms, [key]: !r.perms[key] } }
              ),
            }
      )
    );
  };

  const toggleAll = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const allChecked = m.rows.every(
          (r) => !r.viewOnly && r.perms.create && r.perms.view && r.perms.edit && r.perms.delete
        );
        return {
          ...m,
          rows: m.rows.map((r) =>
            r.viewOnly ? r : { ...r, perms: { create: !allChecked, view: !allChecked, edit: !allChecked, delete: !allChecked } }
          ),
        };
      })
    );
    if (!expandedModules.has(moduleId))
      setExpandedModules((prev) => new Set(prev).add(moduleId));
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (isPerms) { onClose(); return; }

    // Validate
    if (!nameVal.trim()) { setFormError('Full name is required.'); return; }
    if (isAdd && !emailVal.trim()) { setFormError('Gmail address is required.'); return; }
    if (isAdd && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim())) {
      setFormError('Please enter a valid email address.'); return;
    }
    if (!roleName.trim()) { setFormError('Role display name is required.'); return; }

    const payload: Partial<UserData> = {
      name:        nameVal.trim(),
      email:       emailVal.trim(),
      role:        roleName.trim(),
      rolePreset:  selectedPreset,
      active:      accountActive,
      permissions: toApiPerms(modules),
      initials:    computeInitials(nameVal.trim()),
      avatarColor: user?.avatarColor ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    };

    setIsSaving(true);
    setFormError('');
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#1C0F05]/35 z-[100] transition-opacity" onClick={onClose} />
      <div
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] z-[101] flex flex-col shadow-[-8px_0_32px_rgba(44,26,14,0.14)]"
        style={{ background: 'var(--bg-card)', animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <p className="text-[11px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center transition-all border cursor-pointer"
            style={{ background: 'var(--bg-card2)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = 'var(--red-bg)'; el.style.borderColor = 'var(--red)'; el.style.color = 'var(--red)'; }}
            onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}
          >
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-[18px]">

          {/* User Info */}
          {!isPerms && (
            <div className="mb-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--orange)' }}>👤</span> User info
              </h3>
              <div className="grid grid-cols-2 gap-[10px] mb-[13px]">
                <div>
                  <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                    Full name <span style={{ color: 'var(--orange)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
                    value={nameVal}
                    onChange={(e) => { setNameVal(e.target.value); setFormError(''); }}
                    placeholder="e.g. Sheriff Ahmed"
                    disabled={isPerms || isSaving}
                    style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                    Gmail address <span style={{ color: 'var(--orange)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
                    value={emailVal}
                    onChange={(e) => { setEmailVal(e.target.value); setFormError(''); }}
                    placeholder="name@gmail.com"
                    disabled={isEdit || isPerms || isSaving}
                    style={{
                      background: isEdit ? 'var(--bg-card2)' : 'var(--bg-card2)',
                      border: '1px solid var(--border)',
                      color: isEdit ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontFamily: "'Open Sans', sans-serif",
                      opacity: isEdit ? 0.6 : 1,
                    }}
                  />
                  {isEdit && (
                    <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Email cannot be changed after invite.</div>
                  )}
                </div>
              </div>
              {isAdd && (
                <div
                  className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg text-[11px]"
                  style={{ background: 'var(--blue-bg)', border: '1px solid rgba(45,114,184,0.2)', color: 'var(--blue)' }}
                >
                  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-[1px]">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                  </svg>
                  An invite email will be sent to their Gmail. They sign in using Google — no separate password needed.
                </div>
              )}
            </div>
          )}

          {/* Role */}
          {!isPerms && (
            <div className="mb-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--orange)' }}>🏷️</span> Role name
              </h3>
              <div
                className="flex items-start gap-[7px] px-3 py-[9px] rounded-lg text-[11px] mb-[14px]"
                style={{ background: 'var(--orange-light)', border: '1px solid rgba(212,114,42,0.2)', color: 'var(--orange-dim)' }}
              >
                <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-[1px]">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" />
                </svg>
                Roles are just labels — the actual permissions are set individually below. Use presets to fill quickly.
              </div>
              <div className="grid grid-cols-2 gap-2 mb-[14px]">
                {ROLE_PRESETS.map((rp) => (
                  <div
                    key={rp.name}
                    className="p-[10px] rounded-[10px] cursor-pointer transition-all"
                    style={{
                      border: selectedPreset === rp.name ? '1.5px solid var(--orange)' : '1.5px solid var(--border)',
                      background: selectedPreset === rp.name ? 'var(--orange-light)' : 'transparent',
                    }}
                    onClick={() => {
                      setSelectedPreset(rp.name);
                      if (rp.name !== 'Custom') setRoleName(rp.name);
                      else setRoleName('');
                    }}
                  >
                    <div className="flex items-center gap-[7px] mb-1">
                      <div className="w-[10px] h-[10px] rounded-full" style={{ background: rp.color }} />
                      <div className="text-xs font-bold" style={{ color: selectedPreset === rp.name ? 'var(--orange)' : 'var(--text-primary)' }}>
                        {rp.name === 'Custom' ? 'Custom role' : rp.name}
                      </div>
                    </div>
                    <div className="text-[10px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{rp.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-[5px]" style={{ color: 'var(--text-primary)' }}>
                  Role display name <span style={{ color: 'var(--orange)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-[11px] py-2 rounded-lg text-xs outline-none transition-colors"
                  value={roleName}
                  onChange={(e) => { setRoleName(e.target.value); setFormError(''); }}
                  placeholder="e.g. Social Media Manager, Franchise Partner…"
                  disabled={isSaving}
                  style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
                />
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>This is how the role appears in the users table.</div>
              </div>
            </div>
          )}

          {/* Permission Matrix */}
          <div className="mb-5">
            <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--orange)' }}>🔒</span> Permission matrix
              <span className="text-[10px] font-normal normal-case tracking-normal ml-1" style={{ color: 'var(--text-muted)' }}>
                {isPerms ? 'Read-only view' : 'Click a module to expand'}
              </span>
            </h3>
            <div className="rounded-[10px] overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {/* Matrix header */}
              <div
                className="grid gap-1 px-[14px] py-2"
                style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px', background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}
              >
                <div className="text-[10px] font-bold uppercase tracking-[.06em]" style={{ color: 'var(--text-muted)' }}>Module</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--green)' }}>Create</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--blue)' }}>View</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--orange)' }}>Edit</div>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-center" style={{ color: 'var(--red)' }}>Delete</div>
              </div>

              {/* Modules */}
              {modules.map((mod) => {
                const isExpanded = expandedModules.has(mod.id);
                return (
                  <div key={mod.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <div
                      className="flex items-center gap-2 px-[14px] py-2 cursor-pointer transition-colors select-none"
                      style={{ background: 'var(--bg-card2)' }}
                      onClick={() => toggleModule(mod.id)}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
                    >
                      <div className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center flex-shrink-0" style={{ background: mod.iconBg }}>{mod.icon}</div>
                      <div className="text-xs font-semibold flex-1" style={{ color: 'var(--text-primary)' }}>{mod.name}</div>
                      {!isPerms && (
                        <button
                          className="text-[10px] font-semibold cursor-pointer bg-transparent border-none"
                          style={{ color: 'var(--orange)' }}
                          onClick={(e) => { e.stopPropagation(); toggleAll(mod.id); }}
                        >
                          Toggle all
                        </button>
                      )}
                      <span className="transition-transform" style={{ color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                        <ChevronIcon />
                      </span>
                    </div>
                    {isExpanded && mod.rows.map((row, ri) => (
                      <div
                        key={ri}
                        className="grid gap-1 px-[14px] py-[9px] items-center transition-colors"
                        style={{ gridTemplateColumns: '1fr 80px 80px 80px 80px', borderTop: '1px solid var(--border)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                      >
                        <div className="text-xs pl-[30px]" style={{ color: 'var(--text-secondary)' }}>{row.name}</div>
                        {(['create', 'view', 'edit', 'delete'] as const).map((key) => {
                          const disabled = isPerms || (row.viewOnly && key !== 'view');
                          const checked  = row.perms[key];
                          const colorMap = { create: 'var(--green)', view: 'var(--blue)', edit: 'var(--orange)', delete: 'var(--red)' };
                          return (
                            <div key={key} className="flex justify-center">
                              <div
                                className="w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all flex-shrink-0"
                                style={{
                                  border:        checked ? `1.5px solid ${colorMap[key]}` : '1.5px solid var(--border-strong)',
                                  background:    checked ? colorMap[key] : 'transparent',
                                  opacity:       disabled ? 0.3 : 1,
                                  pointerEvents: disabled ? 'none' : 'auto',
                                  cursor:        disabled ? 'default' : 'pointer',
                                }}
                                onClick={() => !disabled && togglePerm(mod.id, ri, key)}
                              >
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
          {!isPerms && (
            <div className="mb-5">
              <h3 className="text-[11px] font-bold uppercase tracking-[.08em] pb-[6px] border-b mb-[10px] flex items-center gap-[6px]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--orange)' }}>ℹ️</span> Account status
              </h3>
              <div className="flex items-center justify-between px-[13px] py-[10px] rounded-lg" style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)' }}>
                <div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Active account</div>
                  <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>When off, this user is blocked from logging into the admin panel</div>
                </div>
                <Toggle on={accountActive} onToggle={() => setAccountActive(!accountActive)} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-[14px] border-t flex flex-col gap-2 flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          {/* Inline error */}
          {formError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
              style={{ background: 'var(--red-bg)', border: '1px solid rgba(220,53,69,0.25)', color: 'var(--red)' }}>
              <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              {formError}
            </div>
          )}
          <div className="flex gap-[10px]">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-[10px] rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-[10px] rounded-lg text-[13px] font-bold text-white transition-all cursor-pointer border-none flex items-center justify-center gap-2"
              style={{ background: isSaving ? 'var(--orange-dim)' : 'var(--orange)', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
            >
              {isSaving ? <><SpinnerIcon /><span>Saving…</span></> : saveLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
