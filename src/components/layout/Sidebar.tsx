import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  activeId: string;
  onNavClick: (id: string) => void;
  isOpen: boolean;
}

/* ─── Icons ──────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CategoriesIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const MenuItemsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const SiteSettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);

const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    className="w-3 h-3 transition-transform duration-200 ml-auto"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavClick, isOpen }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);

  const collapsed = !isOpen;

  return (
    <aside
      className={cn(
        "flex flex-col overflow-y-auto overflow-x-hidden flex-shrink-0 transition-all duration-300",
        "fixed inset-y-0 left-0 z-50 h-[100dvh] md:relative md:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl md:shadow-none" : "-translate-x-full"
      )}
      style={{
        width: collapsed ? 60 : 240,
        minWidth: collapsed ? 60 : 240,
        background: 'var(--bg-sidebar)',
      }}
    >
      {/* Logo + Toggle row */}
      <div className="flex items-center gap-[10px] px-3 py-[18px]" style={{ borderBottom: '1px solid var(--border-sb)' }}>
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-[10px]"
          style={{
            width: 36, height: 36,
            background: 'var(--orange-light)',
            border: '1px solid rgba(212,114,42,0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="var(--orange)">
            <circle cx="12" cy="9" r="5" />
            <circle cx="5" cy="17" r="3" />
            <circle cx="19" cy="17" r="3" />
            <circle cx="12" cy="20" r="3" />
          </svg>
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-bold" style={{ color: 'var(--orange)' }}>Fusk-it</div>
            <div className="text-[9px] mt-[1px]" style={{ color: 'var(--text-sidebar-m)' }}>Admin Panel</div>
          </div>
        )}
      </div>

      {/* Dashboard */}
      <div className={cn('pt-1', collapsed ? 'px-1' : 'px-2')}>
        <div
          onClick={() => onNavClick('dashboard')}
          className={cn(
            'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-all',
            collapsed ? 'justify-center px-0' : 'px-3',
            activeId === 'dashboard' ? '' : 'hover:bg-[var(--bg-hover-sb)]'
          )}
          style={activeId === 'dashboard' ? {
            background: 'var(--orange)',
          } : {}}
          title={collapsed ? 'Dashboard' : undefined}
        >
          <span style={{ fill: activeId === 'dashboard' ? '#fff' : 'rgba(240,217,192,0.45)' }}>
            <DashboardIcon />
          </span>
          {!collapsed && (
            <span
              className="text-[13px] font-semibold"
              style={{ color: activeId === 'dashboard' ? '#fff' : 'rgba(240,217,192,0.6)' }}
            >
              Dashboard
            </span>
          )}
        </div>
      </div>

      {/* Users & Permissions */}
      <div className={cn('mt-1', collapsed ? 'px-1' : 'px-2')}>
        <div
          onClick={() => onNavClick('users-permissions')}
          className={cn(
            'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-all',
            collapsed ? 'justify-center px-0' : 'px-3',
            activeId === 'users-permissions' ? '' : 'hover:bg-[var(--bg-hover-sb)]'
          )}
          style={activeId === 'users-permissions' ? {
            background: 'rgba(212,114,42,0.18)',
          } : {}}
          title={collapsed ? 'Users & Permissions' : undefined}
        >
          <span style={{ color: activeId === 'users-permissions' ? 'var(--orange)' : 'rgba(240,217,192,0.45)', fill: activeId === 'users-permissions' ? 'var(--orange)' : 'rgba(240,217,192,0.45)' }}>
            <UsersIcon />
          </span>
          {!collapsed && (
            <span
              className="text-[13px]"
              style={{
                color: activeId === 'users-permissions' ? 'var(--orange)' : 'rgba(240,217,192,0.6)',
                fontWeight: activeId === 'users-permissions' ? 600 : 400,
              }}
            >
              Users & Permissions
            </span>
          )}
        </div>
      </div>

      {/* Menu section (collapsible) */}
      <div className={cn('mt-1', collapsed ? 'px-1' : 'px-2')}>
        <div
          onClick={() => collapsed ? undefined : setMenuOpen(!menuOpen)}
          className={cn(
            'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-hover-sb)]',
            collapsed ? 'justify-center px-0' : 'px-3',
          )}
          title={collapsed ? 'Menu' : undefined}
        >
          <span style={{ fill: 'rgba(240,217,192,0.45)', color: 'rgba(240,217,192,0.45)' }}>
            <MenuIcon />
          </span>
          {!collapsed && (
            <>
              <span className="text-[13px] flex-1" style={{ color: 'rgba(240,217,192,0.6)' }}>Menu</span>
              <span style={{ color: 'rgba(240,217,192,0.4)' }}>
                <ChevronIcon open={menuOpen} />
              </span>
            </>
          )}
        </div>

        {!collapsed && menuOpen && (
          <div className="ml-3 border-l border-[rgba(240,217,192,0.1)] pl-0">
            {[
              { id: 'categories', label: 'Categories', icon: <CategoriesIcon /> },
              { id: 'menu-items', label: 'Menu Items', icon: <MenuItemsIcon /> },
            ].map(item => (
              <div
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className="flex items-center gap-[8px] pl-4 pr-3 py-[7px] cursor-pointer transition-colors hover:bg-[var(--bg-hover-sb)] rounded-r-lg"
                style={activeId === item.id ? { background: 'rgba(212,114,42,0.15)' } : {}}
              >
                <span style={{ color: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.35)', fill: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.35)' }}>
                  {item.icon}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.5)' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Site settings section (collapsible) */}
      <div className={cn('mt-1 mb-4', collapsed ? 'px-1' : 'px-2')}>
        <div
          onClick={() => collapsed ? undefined : setSettingsOpen(!settingsOpen)}
          className={cn(
            'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-hover-sb)]',
            collapsed ? 'justify-center px-0' : 'px-3',
          )}
          title={collapsed ? 'Site settings' : undefined}
        >
          <span style={{ color: 'rgba(240,217,192,0.45)' }}>
            <SiteSettingsIcon />
          </span>
          {!collapsed && (
            <>
              <span className="text-[13px] flex-1" style={{ color: 'rgba(240,217,192,0.6)' }}>Site settings</span>
              <span style={{ color: 'rgba(240,217,192,0.4)' }}>
                <ChevronIcon open={settingsOpen} />
              </span>
            </>
          )}
        </div>

        {!collapsed && settingsOpen && (
          <div className="ml-3 border-l-2 pl-0" style={{ borderColor: activeId === 'banner-settings' ? 'var(--orange)' : 'rgba(240,217,192,0.1)' }}>
            {[
              { id: 'banner-settings', label: 'Banner settings' },
              { id: 'manage-stores', label: 'Manage Stores', badge: 2 },
              { id: 'gallery', label: 'Gallery', badge: 24 }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className="flex items-center gap-[8px] pl-4 pr-3 py-[7px] cursor-pointer transition-colors hover:bg-[var(--bg-hover-sb)] rounded-r-lg"
              >
                <span
                  className="text-[12px] flex-1"
                  style={{
                    color: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.5)',
                    fontWeight: activeId === item.id ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    className="text-[10px] px-[6px] py-[1px] rounded-[10px]"
                    style={{
                      background: 'rgba(240,217,192,0.12)',
                      color: 'rgba(240,217,192,0.5)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        className={cn(
          'relative mt-auto pb-4 m-2 rounded-xl overflow-hidden backdrop-blur-2xl border border-white/20',
          collapsed ? 'px-1' : 'px-3'
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
          boxShadow: `
      0 10px 40px rgba(0,0,0,0.5),
      inset 0 1px 0 rgba(255,255,255,0.25),
      inset 0 -1px 0 rgba(255,255,255,0.05)
    `,
        }}
      >
        {!collapsed && (
          <div
            className="text-[9px] font-bold tracking-[.12em] uppercase px-1 m-4"
            style={{ color: 'var(--text-sidebar-m)' }}
          >
            Quick Actions
          </div>
        )}
        {[
          { id: 'upload-banner', label: 'Upload Banner', icon: <UploadIcon />, isPrimary: false },
          { id: 'add-store', label: 'Add Store', icon: <StoreIcon />, isPrimary: false },
          { id: 'add-product', label: 'Add Product', icon: <PlusIcon />, isPrimary: true },
          { id: 'manage-users', label: 'Manage Users', icon: <UsersIcon />, isPrimary: false },
        ].map(action => (
          <div
            key={action.id}
            onClick={() => {
              if (action.id === 'upload-banner') onNavClick('banner-settings');
              if (action.id === 'add-store') onNavClick('manage-stores');
              if (action.id === 'add-product') onNavClick('menu-items');
              if (action.id === 'manage-users') onNavClick('users-permissions');
            }}
            className={cn(
              'flex items-center gap-[8px] py-[8px] rounded-lg cursor-pointer transition-all mb-[3px]',
              collapsed ? 'justify-center px-0' : 'px-3',
              action.isPrimary ? '' : 'hover:bg-[var(--bg-hover-sb)]'
            )}
            style={action.isPrimary ? {
              background: 'var(--orange)',
            } : {}}
            title={collapsed ? action.label : undefined}
          >
            <span style={{
              color: action.isPrimary ? '#fff' : 'rgba(240,217,192,0.45)',
              fill: action.isPrimary ? '#fff' : 'rgba(240,217,192,0.45)',
            }}>
              {action.icon}
            </span>
            {!collapsed && (
              <span
                className="text-[12px]"
                style={{ color: action.isPrimary ? '#fff' : 'rgba(240,217,192,0.55)' }}
              >
                {action.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
