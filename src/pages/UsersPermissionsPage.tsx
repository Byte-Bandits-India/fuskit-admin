import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { UserDrawer } from '@/components/users/UserDrawer';
import type { UserData } from '@/types';
import { usersApi } from '@/services/api';
import { DeleteModal } from '@/components/categories/DeleteModal';

/* ───────── Icons ───────── */
const UsersGroupIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const TagIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const PlusUserIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width={13} height={13} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);
const PermIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-18 9 7 2 2 7 9-18z" />
  </svg>
);

/* ───────── Role colours ───────── */
const roleStyle = (role: string): { bg: string; color: string; border: string } => {
  if (role === 'Super Admin')    return { bg: 'var(--orange-light)', color: 'var(--orange)',  border: 'rgba(212,114,42,0.25)' };
  if (role === 'Store Manager')  return { bg: 'var(--green-bg)',     color: 'var(--green)',   border: 'rgba(45,134,83,0.2)'   };
  if (role === 'Content Editor') return { bg: 'var(--blue-bg)',      color: 'var(--blue)',    border: 'rgba(45,114,184,0.2)'  };
  if (role === 'Support Agent')  return { bg: 'var(--purple-bg)',    color: 'var(--purple)',  border: 'rgba(124,77,184,0.2)'  };
  return                                { bg: 'var(--amber-bg)',     color: 'var(--amber)',   border: 'rgba(196,122,26,0.2)'  };
};

const permBadges = (role: string) => {
  if (role === 'Super Admin')    return [{ label: 'Full access',   cls: 'pm-full' }];
  if (role === 'Store Manager')  return [{ label: 'Stores', cls: 'pm-full' }, { label: 'Menu view', cls: 'pm-view' }, { label: 'Banners ✕', cls: 'pm-none' }];
  if (role === 'Content Editor') return [{ label: 'Menu', cls: 'pm-full' }, { label: 'Banners', cls: 'pm-full' }, { label: 'Stores view', cls: 'pm-view' }, { label: 'Users ✕', cls: 'pm-none' }];
  if (role === 'Social Media')   return [{ label: 'Gallery', cls: 'pm-full' }, { label: 'Menu view', cls: 'pm-view' }, { label: 'Stores ✕', cls: 'pm-none' }, { label: 'Users ✕', cls: 'pm-none' }];
  return [{ label: 'Pending acceptance', cls: 'pm-none' }];
};

type FilterStatus = 'all' | 'active' | 'pending' | 'inactive';

/* ───────── Component ───────── */
export const UsersPermissionsPage: React.FC = () => {
  /* ── Data state ── */
  const [users, setUsers]         = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  /* ── Filter / search state ── */
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('All roles');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  /* ── Drawer state ── */
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerMode, setDrawerMode]   = useState<'add' | 'edit' | 'perms'>('add');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  /* ── Delete modal state ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId]       = useState('');
  const [deleteUserName, setDeleteUserName]   = useState('');

  /* ── Toast state ── */
  const [toast, setToast]   = useState('');
  const [toastErr, setToastErr] = useState(false);

  /* ───────── Load users from API ───────── */
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const raw = await usersApi.list();
      // Normalize: backend may return plain array OR { data: [] } / { users: [] }
      let list: UserData[];
      if (Array.isArray(raw)) {
        list = raw;
      } else {
        const wrapped = raw as Record<string, unknown>;
        list = (wrapped.data ?? wrapped.users ?? wrapped.results ?? []) as UserData[];
      }
      setUsers(list);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  /* ───────── Helpers ───────── */
  const showToast = (msg: string, isError = false) => {
    setToast(msg); setToastErr(isError);
    setTimeout(() => setToast(''), 3500);
  };

  /* ───────── Filtered list ───────── */
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== 'All roles' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* ───────── Stats ───────── */
  const stats = {
    total:       users.length,
    active:      users.filter((u) => u.status === 'active').length,
    customRoles: new Set(users.filter((u) => !['Super Admin', 'Store Manager', 'Content Editor', 'Support Agent'].includes(u.role)).map((u) => u.role)).size + 3,
    pending:     users.filter((u) => u.status === 'pending').length,
  };

  /* ───────── Drawer helpers ───────── */
  const openDrawer = (mode: 'add' | 'edit' | 'perms', user?: UserData) => {
    setDrawerMode(mode);
    setSelectedUser(user ?? null);
    setDrawerOpen(true);
  };

  const openDelete = (user: UserData) => {
    setDeleteUserId(user.id);
    setDeleteUserName(user.name);
    setDeleteModalOpen(true);
  };

  /* ───────── API actions ───────── */
  const handleDrawerSave = async (data: Partial<UserData>) => {
    if (drawerMode === 'add') {
      await usersApi.invite({
        name:        data.name!,
        email:       data.email!,
        role:        data.role!,
        rolePreset:  data.rolePreset!,
        avatarColor: data.avatarColor!,
        initials:    data.initials,
        permissions: data.permissions,
      });
      showToast(`Invite sent to ${data.email}!`);
    } else if (drawerMode === 'edit' && selectedUser) {
      await usersApi.update(selectedUser.id, data);
      showToast('User updated successfully.');
    }
    await loadUsers();
  };

  const handleDeleteConfirm = async () => {
    try {
      await usersApi.delete(deleteUserId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
      showToast(`${deleteUserName} has been removed.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete user.', true);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleResendInvite = async (user: UserData) => {
    try {
      await usersApi.resendInvite(user.id);
      showToast(`Invite resent to ${user.email}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to resend invite.', true);
    }
  };

  /* ───────── Render ───────── */
  return (
    <div className="flex flex-col gap-4 p-4 md:p-5 min-h-full overflow-y-auto bg-[#F7F3EE] rounded-xl">

      {/* ═══ Toast ═══ */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-semibold shadow-lg transition-all"
          style={{
            background: toastErr ? 'var(--red-bg)' : 'var(--green-bg)',
            color:      toastErr ? 'var(--red)'    : 'var(--green)',
            border:     toastErr ? '1px solid rgba(220,53,69,0.3)' : '1px solid rgba(45,134,83,0.3)',
            animation:  'slideInRight 0.25s ease',
          }}
        >
          {toastErr
            ? <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            : <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
          }
          {toast}
        </div>
      )}

      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Users & Permissions</h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>Invite team members, assign custom roles and control exactly what each person can do</p>
        </div>
        <button
          onClick={() => openDrawer('add')}
          className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap border-none"
          style={{ background: 'var(--orange)', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}
        >
          <PlusUserIcon /> Invite User
        </button>
      </div>

      {/* ═══ Stats ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
        <StatCard icon={<UsersGroupIcon />} bg="var(--orange-light)" color="var(--orange)" value={stats.total}       label="Total users"    />
        <StatCard icon={<EyeIcon />}        bg="var(--green-bg)"     color="var(--green)"  value={stats.active}      label="Active"         />
        <StatCard icon={<TagIcon />}        bg="var(--blue-bg)"      color="var(--blue)"   value={stats.customRoles} label="Custom roles"   />
        <StatCard icon={<LockIcon />}       bg="var(--purple-bg)"    color="var(--purple)" value={stats.pending}     label="Pending invite" />
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-[280px]"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-xs w-full"
            placeholder="Search by name or email…"
            style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif", boxShadow: 'var(--shadow-sm)' }}>
          <option>All roles</option>
          <option>Super Admin</option>
          <option>Store Manager</option>
          <option>Content Editor</option>
          <option>Custom</option>
        </select>
        {(['all', 'active', 'pending', 'inactive'] as FilterStatus[]).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-[7px] rounded-full text-[11px] cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: statusFilter === s ? 'var(--orange-light)' : 'var(--bg-card)',
              border:     statusFilter === s ? '1px solid var(--orange)' : '1px solid var(--border)',
              color:      statusFilter === s ? 'var(--orange)' : 'var(--text-secondary)',
              boxShadow:  'var(--shadow-sm)',
            }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ═══ Table ═══ */}
      <div className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: 'var(--text-muted)' }}>
        All users ({isLoading ? '…' : filtered.length})
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-[14px] py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="w-[34px] h-[34px] rounded-full animate-pulse" style={{ background: 'var(--bg-card2)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded animate-pulse" style={{ background: 'var(--bg-card2)' }} />
                <div className="h-2 w-1/2 rounded animate-pulse" style={{ background: 'var(--bg-card2)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load error */}
      {!isLoading && loadError && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-[12px]"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Failed to load users</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{loadError}</div>
          <button onClick={loadUsers} className="px-4 py-2 rounded-lg text-xs font-bold border-none cursor-pointer mt-1"
            style={{ background: 'var(--orange)', color: '#fff' }}>Retry</button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !loadError && (
        <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                  {['User', 'Role', 'Permissions', 'Last active', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-[14px] py-[10px] text-left text-[10px] font-bold uppercase tracking-[.07em] whitespace-nowrap"
                      style={{ color: 'var(--text-muted)', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[14px] py-8 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                      No users match your filters.
                    </td>
                  </tr>
                ) : filtered.map((user) => {
                  const rs        = roleStyle(user.role);
                  const badges    = permBadges(user.role);
                  const isPending = user.status === 'pending';
                  const isOwner   = user.role === 'Super Admin';
                  return (
                    <tr key={user.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: '1px solid var(--border)', opacity: isPending ? 0.75 : 1 }}
                      onClick={() => !isOwner && openDrawer('edit', user)}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                    >
                      {/* User */}
                      <td className="px-[14px] py-3">
                        <div className="flex items-center gap-[10px]">
                          {isPending ? (
                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--bg-card2)', border: '1.5px dashed var(--border-strong)' }}>
                              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#A07850" strokeWidth="2" strokeLinecap="round" />
                                <circle cx="12" cy="7" r="4" stroke="#A07850" strokeWidth="2" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-display"
                              style={{ background: user.avatarColor }}>{user.initials}</div>
                          )}
                          <div>
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {user.name}
                              {isOwner && <span className="text-[10px] font-normal ml-1" style={{ color: 'var(--text-muted)' }}>(you)</span>}
                              {isPending && (
                                <span className="inline-flex items-center gap-1 text-[9px] px-[7px] py-[2px] rounded-[10px] ml-1 font-bold"
                                  style={{ background: 'var(--amber-bg)', color: 'var(--amber)', border: '1px solid rgba(196,122,26,.2)' }}>Invite sent</span>
                              )}
                            </div>
                            <div className="text-[11px] mt-[1px]" style={{ color: 'var(--text-muted)' }}>
                              {user.email}
                              {user.isGoogle && (
                                <span className="inline-flex items-center gap-[3px] text-[9px] px-[6px] py-[1px] rounded-[10px] ml-1 font-semibold"
                                  style={{ background: 'var(--blue-bg)', color: 'var(--blue)' }}>G</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-[14px] py-3">
                        <span className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
                          style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>{user.role}</span>
                      </td>
                      {/* Permissions */}
                      <td className="px-[14px] py-3">
                        <div className="flex gap-[3px] flex-wrap">
                          {badges.map((b, i) => (
                            <span key={i} className="text-[9px] px-[6px] py-[2px] rounded-[5px] font-semibold whitespace-nowrap"
                              style={{
                                background: b.cls === 'pm-full' ? 'var(--green-bg)'  : b.cls === 'pm-view' ? 'var(--blue-bg)' : 'var(--bg-card2)',
                                color:      b.cls === 'pm-full' ? 'var(--green)'     : b.cls === 'pm-view' ? 'var(--blue)'    : 'var(--text-muted)',
                                border:     b.cls === 'pm-none' ? '1px solid var(--border)' : 'none',
                              }}>{b.label}</span>
                          ))}
                        </div>
                      </td>
                      {/* Last active */}
                      <td className="px-[14px] py-3 text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.lastActive}</td>
                      {/* Status */}
                      <td className="px-[14px] py-3">
                        <div className="flex items-center gap-[5px] text-[11px]">
                          <div className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                            style={{
                              background: user.status === 'active' ? 'var(--green)' : user.status === 'pending' ? 'var(--amber)' : 'var(--text-muted)',
                              boxShadow:  user.status === 'active' ? '0 0 0 2px rgba(45,134,83,.2)' : 'none',
                            }} />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-[14px] py-3">
                        <div className="flex items-center justify-end gap-[5px]" onClick={(e) => e.stopPropagation()}>
                          {isPending ? (
                            <>
                              <ActionBtn icon={<SendIcon />}  title="Resend invite" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => handleResendInvite(user)} />
                              <ActionBtn icon={<TrashIcon />} title="Remove"        hoverBg="var(--red-bg)"      hoverBorder="var(--red)"    hoverFill="var(--red)"    onClick={() => openDelete(user)} />
                            </>
                          ) : isOwner ? (
                            <ActionBtn icon={<PermIcon />} title="View permissions" hoverBg="var(--blue-bg)" hoverBorder="var(--blue)" hoverFill="var(--blue)" onClick={() => openDrawer('perms', user)} />
                          ) : (
                            <>
                              <ActionBtn icon={<PermIcon />}  title="Edit permissions" hoverBg="var(--blue-bg)"      hoverBorder="var(--blue)"   hoverFill="var(--blue)"   onClick={() => openDrawer('edit', user)} />
                              <ActionBtn icon={<EditIcon />}  title="Edit user"         hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => openDrawer('edit', user)} />
                              <ActionBtn icon={<TrashIcon />} title="Remove user"       hoverBg="var(--red-bg)"      hoverBorder="var(--red)"    hoverFill="var(--red)"    onClick={() => openDelete(user)} />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden">
            {filtered.map((user) => {
              const rs        = roleStyle(user.role);
              const isPending = user.status === 'pending';
              const isOwner   = user.role === 'Super Admin';
              return (
                <div key={user.id} className="px-4 py-3 transition-colors"
                  style={{ borderBottom: '1px solid var(--border)', opacity: isPending ? 0.75 : 1 }}
                  onClick={() => !isOwner && openDrawer('edit', user)}>
                  <div className="flex items-center gap-3 mb-2">
                    {isPending ? (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card2)', border: '1.5px dashed var(--border-strong)' }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#A07850" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="12" cy="7" r="4" stroke="#A07850" strokeWidth="2" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 font-display" style={{ background: user.avatarColor }}>{user.initials}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <span className="px-2 py-[3px] rounded-full text-[9px] font-bold" style={{ background: rs.bg, color: rs.color, border: `1px solid ${rs.border}` }}>{user.role}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1">
                      <div className="w-[6px] h-[6px] rounded-full"
                        style={{ background: user.status === 'active' ? 'var(--green)' : user.status === 'pending' ? 'var(--amber)' : 'var(--text-muted)' }} />
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)} · {user.lastActive}
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      {isPending && <ActionBtn icon={<SendIcon />} title="Resend" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => handleResendInvite(user)} small />}
                      {!isOwner && !isPending && <ActionBtn icon={<EditIcon />} title="Edit" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => openDrawer('edit', user)} small />}
                      {!isOwner && <ActionBtn icon={<TrashIcon />} title="Remove" hoverBg="var(--red-bg)" hoverBorder="var(--red)" hoverFill="var(--red)" onClick={() => openDelete(user)} small />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Modals ═══ */}
      <UserDrawer
        open={drawerOpen}
        mode={drawerMode}
        user={selectedUser}
        onClose={() => setDrawerOpen(false)}
        onSave={handleDrawerSave}
      />
      <DeleteModal
        open={deleteModalOpen}
        categoryName={deleteUserName}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

/* ───────── Sub-components ───────── */
const StatCard: React.FC<{ icon: React.ReactNode; bg: string; color: string; value: number; label: string }> = ({ icon, bg, color, value, label }) => (
  <div className="flex items-center gap-[10px] p-3 md:px-4 md:py-3 rounded-[10px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg, color }}>{icon}</div>
    <div>
      <div className="font-display text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] mt-[2px]" style={{ color: 'var(--text-muted)' }}>{label}</div>
    </div>
  </div>
);

const ActionBtn: React.FC<{ icon: React.ReactNode; title: string; hoverBg: string; hoverBorder: string; hoverFill: string; onClick?: () => void; small?: boolean }> =
  ({ icon, title, hoverBg, hoverBorder, hoverFill, onClick, small }) => (
    <button title={title} onClick={onClick}
      className={`${small ? 'w-6 h-6' : 'w-7 h-7'} rounded-[7px] flex items-center justify-center cursor-pointer transition-all`}
      style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
      onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = hoverBg; el.style.borderColor = hoverBorder; el.style.color = hoverFill; }}
      onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
      {icon}
    </button>
  );
