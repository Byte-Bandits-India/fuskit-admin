import React, { useState, useMemo } from 'react';
import { UserDrawer, UserData, DEFAULT_MODULES } from '@/components/users/UserDrawer';
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

/* ───────── Data ───────── */
const INITIAL_USERS: UserData[] = [
  {
    id: '1', name: 'Fuskit Owner', email: 'owner@fusk-it.com', role: 'Super Admin', rolePreset: 'Custom',
    avatarColor: 'var(--orange)', initials: 'FO', status: 'active', lastActive: 'Just now',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
  {
    id: '2', name: 'Sheriff Ahmed', email: 'sheriff@fusk-it.com', role: 'Store Manager', rolePreset: 'Store Manager',
    avatarColor: 'var(--green)', initials: 'SA', status: 'active', lastActive: '2 hours ago',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
  {
    id: '3', name: 'Priya Nair', email: 'priya@fusk-it.com', role: 'Content Editor', rolePreset: 'Content Editor',
    avatarColor: 'var(--blue)', initials: 'PN', status: 'active', lastActive: 'Yesterday',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
  {
    id: '4', name: 'Arjun Dev', email: 'arjun@fusk-it.com', role: 'Social Media', rolePreset: 'Custom',
    avatarColor: 'var(--purple)', initials: 'AD', status: 'active', lastActive: '3 days ago',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
  {
    id: '5', name: 'Kavya Rao', email: 'kavya@fusk-it.com', role: 'Store Manager', rolePreset: 'Store Manager',
    avatarColor: 'var(--amber)', initials: 'KR', status: 'active', lastActive: '1 week ago',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
  {
    id: '6', name: 'Ravi Kumar', email: 'ravi.kumar@gmail.com', role: 'Support Agent', rolePreset: 'Support Agent',
    avatarColor: 'var(--text-muted)', initials: '', status: 'pending', lastActive: 'Never logged in',
    isGoogle: true, active: true, permissions: DEFAULT_MODULES,
  },
];

/* ───────── Role colors ───────── */
const roleStyle = (role: string): { bg: string; color: string; border: string } => {
  if (role === 'Super Admin') return { bg: 'var(--orange-light)', color: 'var(--orange)', border: 'rgba(212,114,42,0.25)' };
  if (role === 'Store Manager') return { bg: 'var(--green-bg)', color: 'var(--green)', border: 'rgba(45,134,83,0.2)' };
  if (role === 'Content Editor') return { bg: 'var(--blue-bg)', color: 'var(--blue)', border: 'rgba(45,114,184,0.2)' };
  if (role === 'Support Agent') return { bg: 'var(--purple-bg)', color: 'var(--purple)', border: 'rgba(124,77,184,0.2)' };
  return { bg: 'var(--amber-bg)', color: 'var(--amber)', border: 'rgba(196,122,26,0.2)' };
};

const permBadges = (role: string) => {
  if (role === 'Super Admin') return [{ label: 'Full access', cls: 'pm-full' }];
  if (role === 'Store Manager') return [{ label: 'Stores', cls: 'pm-full' }, { label: 'Menu view', cls: 'pm-view' }, { label: 'Banners ✕', cls: 'pm-none' }];
  if (role === 'Content Editor') return [{ label: 'Menu', cls: 'pm-full' }, { label: 'Banners', cls: 'pm-full' }, { label: 'Stores view', cls: 'pm-view' }, { label: 'Users ✕', cls: 'pm-none' }];
  if (role === 'Social Media') return [{ label: 'Gallery', cls: 'pm-full' }, { label: 'Menu view', cls: 'pm-view' }, { label: 'Stores ✕', cls: 'pm-none' }, { label: 'Users ✕', cls: 'pm-none' }];
  return [{ label: 'Pending acceptance', cls: 'pm-none' }];
};

type FilterStatus = 'all' | 'active' | 'pending' | 'inactive';

/* ───────── Component ───────── */
export const UsersPermissionsPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit' | 'perms'>('add');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState('');

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== 'All roles' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    customRoles: new Set(users.filter(u => !['Super Admin', 'Store Manager', 'Content Editor', 'Support Agent'].includes(u.role)).map(u => u.role)).size + 3,
    pending: users.filter(u => u.status === 'pending').length,
  };

  const openDrawer = (mode: 'add' | 'edit' | 'perms', user?: UserData) => {
    setDrawerMode(mode);
    setSelectedUser(user || null);
    setDrawerOpen(true);
  };

  const openDelete = (name: string) => {
    setDeleteUserName(name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setUsers(prev => prev.filter(u => u.name !== deleteUserName));
    setDeleteModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-5 min-h-full overflow-y-auto">

      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Users & Permissions</h1>
          <p className="text-xs mt-[2px]" style={{ color: 'var(--text-muted)' }}>Invite team members, assign custom roles and control exactly what each person can do</p>
        </div>
        <button onClick={() => openDrawer('add')} className="flex items-center gap-[6px] px-[18px] py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all whitespace-nowrap border-none"
          style={{ background: 'var(--orange)', color: '#fff', boxShadow: '0 2px 8px rgba(212,114,42,0.3)' }}>
          <PlusUserIcon /> Invite User
        </button>
      </div>

      {/* ═══ Stats ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-shrink-0">
        <StatCard icon={<UsersGroupIcon />} bg="var(--orange-light)" color="var(--orange)" value={stats.total} label="Total users" />
        <StatCard icon={<EyeIcon />} bg="var(--green-bg)" color="var(--green)" value={stats.active} label="Active" />
        <StatCard icon={<TagIcon />} bg="var(--blue-bg)" color="var(--blue)" value={stats.customRoles} label="Custom roles" />
        <StatCard icon={<LockIcon />} bg="var(--purple-bg)" color="var(--purple)" value={stats.pending} label="Pending invite" />
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-[280px]"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}><SearchIcon /></span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-xs w-full"
            placeholder="Search by name or email…"
            style={{ color: 'var(--text-primary)', fontFamily: "'Open Sans', sans-serif" }} />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs cursor-pointer outline-none"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontFamily: "'Open Sans', sans-serif", boxShadow: 'var(--shadow-sm)' }}>
          <option>All roles</option>
          <option>Super Admin</option>
          <option>Store Manager</option>
          <option>Content Editor</option>
          <option>Custom</option>
        </select>
        {(['all', 'active', 'pending', 'inactive'] as FilterStatus[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className="px-3 py-[7px] rounded-full text-[11px] cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: statusFilter === s ? 'var(--orange-light)' : 'var(--bg-card)',
              border: statusFilter === s ? '1px solid var(--orange)' : '1px solid var(--border)',
              color: statusFilter === s ? 'var(--orange)' : 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
            }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ═══ Table ═══ */}
      <div className="text-[11px] font-bold uppercase tracking-[.08em]" style={{ color: 'var(--text-muted)' }}>
        All users ({filtered.length})
      </div>
      <div className="rounded-[12px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)' }}>
                {['User', 'Role', 'Permissions', 'Last active', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-[14px] py-[10px] text-left text-[10px] font-bold uppercase tracking-[.07em] whitespace-nowrap"
                    style={{ color: 'var(--text-muted)', textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => {
                const rs = roleStyle(user.role);
                const badges = permBadges(user.role);
                const isPending = user.status === 'pending';
                const isOwner = user.name === 'Fuskit Owner';
                return (
                  <tr key={user.id}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)', opacity: isPending ? 0.7 : 1 }}
                    onClick={() => !isOwner && openDrawer('edit', user)}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                    {/* User cell */}
                    <td className="px-[14px] py-3">
                      <div className="flex items-center gap-[10px]">
                        {isPending ? (
                          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--bg-card2)', border: '1.5px dashed var(--border-strong)' }}>
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#A07850" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="#A07850" strokeWidth="2" /></svg>
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
                              background: b.cls === 'pm-full' ? 'var(--green-bg)' : b.cls === 'pm-view' ? 'var(--blue-bg)' : 'var(--bg-card2)',
                              color: b.cls === 'pm-full' ? 'var(--green)' : b.cls === 'pm-view' ? 'var(--blue)' : 'var(--text-muted)',
                              border: b.cls === 'pm-none' ? '1px solid var(--border)' : 'none',
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
                            boxShadow: user.status === 'active' ? '0 0 0 2px rgba(45,134,83,.2)' : 'none'
                          }} />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-[14px] py-3">
                      <div className="flex items-center justify-end gap-[5px]" onClick={e => e.stopPropagation()}>
                        {isPending ? (
                          <>
                            <ActionBtn icon={<SendIcon />} title="Resend invite" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" />
                            <ActionBtn icon={<TrashIcon />} title="Remove" hoverBg="var(--red-bg)" hoverBorder="var(--red)" hoverFill="var(--red)" onClick={() => openDelete(user.name)} />
                          </>
                        ) : isOwner ? (
                          <ActionBtn icon={<PermIcon />} title="View permissions" hoverBg="var(--blue-bg)" hoverBorder="var(--blue)" hoverFill="var(--blue)" onClick={() => openDrawer('perms', user)} />
                        ) : (
                          <>
                            <ActionBtn icon={<PermIcon />} title="Edit permissions" hoverBg="var(--blue-bg)" hoverBorder="var(--blue)" hoverFill="var(--blue)" onClick={() => openDrawer('edit', user)} />
                            <ActionBtn icon={<EditIcon />} title="Edit user" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => openDrawer('edit', user)} />
                            <ActionBtn icon={<TrashIcon />} title="Remove user" hoverBg="var(--red-bg)" hoverBorder="var(--red)" hoverFill="var(--red)" onClick={() => openDelete(user.name)} />
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
          {filtered.map(user => {
            const rs = roleStyle(user.role);
            const isPending = user.status === 'pending';
            const isOwner = user.name === 'Fuskit Owner';
            return (
              <div key={user.id} className="px-4 py-3 transition-colors" style={{ borderBottom: '1px solid var(--border)', opacity: isPending ? 0.7 : 1 }}
                onClick={() => !isOwner && openDrawer('edit', user)}>
                <div className="flex items-center gap-3 mb-2">
                  {isPending ? (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card2)', border: '1.5px dashed var(--border-strong)' }}>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#A07850" strokeWidth="2" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="#A07850" strokeWidth="2" /></svg>
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
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    {!isOwner && !isPending && <ActionBtn icon={<EditIcon />} title="Edit" hoverBg="var(--orange-light)" hoverBorder="var(--orange)" hoverFill="var(--orange)" onClick={() => openDrawer('edit', user)} small />}
                    {!isOwner && <ActionBtn icon={<TrashIcon />} title="Remove" hoverBg="var(--red-bg)" hoverBorder="var(--red)" hoverFill="var(--red)" onClick={() => openDelete(user.name)} small />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Modals ═══ */}
      <UserDrawer open={drawerOpen} mode={drawerMode} user={selectedUser} onClose={() => setDrawerOpen(false)} onSave={() => {}} />
      <DeleteModal open={deleteModalOpen} categoryName={deleteUserName} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} />
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
      onMouseEnter={e => { const el = e.currentTarget; el.style.background = hoverBg; el.style.borderColor = hoverBorder; el.style.color = hoverFill; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'var(--bg-card2)'; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; }}>
      {icon}
    </button>
  );
