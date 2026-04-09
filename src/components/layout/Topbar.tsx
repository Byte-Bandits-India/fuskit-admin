import React, { useState, useRef, useEffect } from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';
import type { UserData } from '@/types';
import { notificationsApi, type NotificationDTO } from '@/services/api';
import { hasModuleViewPerm } from './DashboardLayout';

interface TopbarProps {
  breadcrumb?: string[];
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
  user?: UserData | null;
  onNavClick?: (id: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  breadcrumb = ['Dashboard', 'Overview'],
  sidebarOpen,
  onToggleSidebar,
  onLogout,
  user,
  onNavClick,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const menuOptions = [
    { id: 'dashboard', label: 'Dashboard', mod: 'dashboard' },
    { id: 'users-permissions', label: 'Users & Permissions', mod: 'users' },
    { id: 'categories', label: 'Categories', mod: 'categories' },
    { id: 'menu-items', label: 'Menu Items', mod: 'items' },
    { id: 'banner-settings', label: 'Banner settings', mod: 'banners' },
    { id: 'manage-stores', label: 'Manage Stores', mod: 'stores' },
    { id: 'gallery', label: 'Gallery', mod: 'gallery' },
  ].filter(opt => {
    if (opt.mod === 'dashboard') return true;
    return hasModuleViewPerm(user, opt.mod);
  });

  const filteredOptions = menuOptions.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = user;

  const fetchNotifs = async () => {
    try {
      const resCount = await notificationsApi.unreadCount();
      setUnreadCount(resCount.count);
      const resList = await notificationsApi.list();
      setNotifications(resList.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // optional: add interval check here
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 flex-shrink-0"
      style={{
        height: 56,
        background: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Sidebar toggle */}
      <div
        onClick={onToggleSidebar}
        className="flex items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-[var(--bg-hover-sb)]"
        style={{
          width: 34, height: 34,
          color: 'var(--orange)',
        }}
      >
        {sidebarOpen ? <ThunderboltOutlined style={{ fontSize: 16 }} /> : <ThunderboltOutlined style={{ fontSize: 16 }} />}
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-[6px] text-xs" style={{ color: 'var(--text-muted)' }}>
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i > 0 && (
              <span style={{ color: 'rgba(240,217,192,0.3)' }}>/</span>
            )}
            <span
              className={i === breadcrumb.length - 1 ? 'font-semibold' : ''}
              style={i === breadcrumb.length - 1 ? { color: '#fff' } : { color: 'rgba(240,217,192,0.6)' }}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Center search */}
      <div className="flex-1 flex justify-end">
        <div
          className="hidden sm:flex items-center gap-2 rounded-full px-4 py-[7px] cursor-text transition-colors"
          style={{
            width: 320,
            maxWidth: '100%',
            background: 'white',
            border: '1px solid rgba(240,217,192,0.12)',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,217,192,0.2)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,217,192,0.12)')}
          onClick={e => {
            const input = e.currentTarget.querySelector('input');
            if (input) input.focus();
          }}
        >
          <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: '#552710' }}>
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            className="text-xs flex-1 bg-transparent border-none outline-none"
            placeholder="Search menu, stores, settings…"
            style={{ color: '#552710' }}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setFilterOpen(true);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (filteredOptions.length > 0 && onNavClick) {
                  onNavClick(filteredOptions[0].id);
                  setSearchQuery('');
                  setFilterOpen(false);
                }
              }
            }}
          />
          <div className="relative flex items-center" ref={filterRef}>
            <div
              className="flex items-center justify-center rounded-full cursor-pointer transition-colors flex-shrink-0"
              style={{
                width: 24,
                height: 24,
                background: 'rgba(245, 106, 39, 0.1)',
                border: '1px solid #F56A27',
                color: '#F56A27',
              }}
              onClick={e => {
                e.stopPropagation();
                setFilterOpen(!filterOpen);
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(245, 106, 39, 0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(245, 106, 39, 0.1)')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </div>
            {filterOpen && (
              <div
                className="absolute right-0 top-[125%] mt-[8px] w-48 rounded-lg shadow-xl overflow-hidden backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                }}
                onClick={e => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-[var(--border)]">
                  <div className="text-[12px] font-semibold text-[var(--text-primary)]">Navigation Menu</div>
                </div>
                <div className="p-1 flex flex-col gap-0.5">
                  {filteredOptions.length === 0 && (
                    <div className="px-2 py-3 text-center text-[11px] text-[var(--text-muted)]">
                      No matching pages
                    </div>
                  )}
                  {filteredOptions.map(opt => (
                    <div 
                      key={opt.id} 
                      className="flex items-center gap-2 px-2 py-2 rounded hover:bg-[var(--bg-hover)] cursor-pointer text-[12px] font-medium transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                      onClick={() => {
                        if (onNavClick) onNavClick(opt.id);
                        setFilterOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] text-[var(--orange)] opacity-80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="M12 5l7 7-7 7"></path>
                      </svg>
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-[10px]">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <IconButton hasNotif={unreadCount > 0 || notifications.some(n => !n.read)} onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) fetchNotifs(); }}>
            <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'rgba(240,217,192,0.6)' }}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </IconButton>

          {notifOpen && (
            <div
              className="absolute right-0 mt-2 w-[280px] sm:w-[320px] rounded-lg shadow-xl overflow-hidden backdrop-blur-md z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="px-4 py-3 border-b border-[var(--border)] flex justify-between items-center">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Notifications</div>
                <span
                  className="text-[10px] text-[var(--orange)] cursor-pointer hover:underline"
                  onClick={async () => {
                    await notificationsApi.markAllRead();
                    fetchNotifs();
                  }}
                >Mark all read</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.length === 0 && (
                  <div className="px-4 py-6 text-center text-[12px] text-[var(--text-muted)]">No notifications</div>
                )}
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] cursor-pointer flex gap-3 transition-colors"
                    onClick={async () => {
                      if (!n.read) {
                        await notificationsApi.markRead(n.id);
                        fetchNotifs();
                      }
                    }}
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: !n.read ? 'var(--red)' : 'transparent' }}></div>
                    <div>
                      <div className="text-[12px] font-medium text-[var(--text-primary)]">{n.title}</div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.description}</div>
                      <div className="text-[10px] mt-1" style={{ color: 'rgba(240,217,192,0.4)' }}>{n.time || 'Recently'}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center border-t border-[var(--border)] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
                <span className="text-[11px] font-medium text-[var(--text-primary)]">View all notifications</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-[6px] rounded-lg cursor-pointer transition-all"
            style={{
              background: 'rgba(240,217,192,0.06)',
              border: '1px solid rgba(212,114,42,0.3)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,114,42,0.3)';
            }}
          >
            <div
              className="flex items-center justify-center rounded-full text-[10px] font-bold"
              style={{
                width: 28, height: 28,
                background: currentUser?.avatarColor || 'var(--orange)',
                color: '#fff',
              }}
            >
              {currentUser?.initials || 'FO'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white">{currentUser?.name || 'Fuskit Owner'}</div>
              <div className="text-[10px]" style={{ color: 'rgba(240,217,192,0.5)' }}>{currentUser?.email || 'super admin'}</div>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 ml-1 hidden sm:block transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                color: 'rgba(240,217,192,0.4)',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden backdrop-blur-md z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <button
                className="w-full text-left px-4 py-3 text-[13px] font-medium transition-colors flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              >
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--red)' }}>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface IconButtonProps {
  children: React.ReactNode;
  hasNotif?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ children, hasNotif, onClick }) => (
  <div
    className="relative flex items-center justify-center rounded-lg cursor-pointer transition-all"
    onClick={onClick}
    style={{
      width: 34, height: 34,
      background: 'rgba(240,217,192,0.06)',
      border: '1px solid rgba(240,217,192,0.1)',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'rgba(240,217,192,0.12)';
      el.style.borderColor = 'rgba(240,217,192,0.2)';
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.background = 'rgba(240,217,192,0.06)';
      el.style.borderColor = 'rgba(240,217,192,0.1)';
    }}
  >
    {children}
    {hasNotif && (
      <span
        className="absolute rounded-full"
        style={{
          top: 8, right: 9,
          width: 7, height: 7,
          background: 'var(--red)',
          border: '1.5px solid var(--bg-sidebar)',
          zIndex: 50,
        }}
      />
    )}
  </div>
);
