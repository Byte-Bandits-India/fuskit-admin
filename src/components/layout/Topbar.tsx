import React, { useState, useRef, useEffect } from 'react';
import { ThunderboltOutlined } from '@ant-design/icons';

interface TopbarProps {
  breadcrumb?: string[];
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  breadcrumb = ['Dashboard', 'Overview'],
  sidebarOpen,
  onToggleSidebar,
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
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
            background: 'rgba(240,217,192,0.08)',
            border: '1px solid rgba(240,217,192,0.12)',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,217,192,0.2)')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,217,192,0.12)')}
          onClick={e => {
            const input = e.currentTarget.querySelector('input');
            if (input) input.focus();
          }}
        >
          <svg viewBox="0 0 24 24" className="w-[13px] h-[13px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'rgba(240,217,192,0.4)' }}>
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            className="text-xs flex-1 bg-transparent border-none outline-none"
            placeholder="Search menu, stores, settings…"
            style={{ color: 'rgba(240,217,192,0.8)' }}
          />
          <kbd
            className="text-[10px] px-[5px] py-[1px] rounded hidden lg:inline"
            style={{
              background: 'rgba(240,217,192,0.08)',
              border: '1px solid rgba(240,217,192,0.15)',
              color: 'rgba(240,217,192,0.4)',
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-[10px]">
        {/* Notification bell */}
        <IconButton hasNotif>
          <svg viewBox="0 0 24 24" className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'rgba(240,217,192,0.6)' }}>
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </IconButton>

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
                background: 'var(--orange)',
                color: '#fff',
              }}
            >
              FO
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white">Fuskit Owner</div>
              <div className="text-[10px]" style={{ color: 'rgba(240,217,192,0.5)' }}>super admin</div>
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
}

const IconButton: React.FC<IconButtonProps> = ({ children, hasNotif }) => (
  <div
    className="relative flex items-center justify-center rounded-lg cursor-pointer transition-all"
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
          top: 6, right: 6,
          width: 7, height: 7,
          background: 'var(--orange)',
          border: '1.5px solid var(--bg-sidebar)',
        }}
      />
    )}
  </div>
);
