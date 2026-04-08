import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import type { UserData } from '@/types';
import { hasModuleViewPerm } from './DashboardLayout';

// Asset imports
import logoImg from '@/assets/logo.png';
import dashImg from '@/assets/dash.png';
import menuImg from '@/assets/menu.png';
import manageImg from '@/assets/manage.png';
import storeImg from '@/assets/store.png';
import uploadImg from '@/assets/upload.png';
import siteImg from '@/assets/site.png';

interface SidebarProps {
  activeId: string;
  onNavClick: (id: string) => void;
  isOpen: boolean;
  user?: UserData | null;
}

/* ─── Chevron (keep as SVG — no image for this) ──────── */
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

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ─── Reusable image icon component ──────────────────── */
const ImgIcon: React.FC<{ src: string; size?: number; className?: string; style?: React.CSSProperties }> = ({
  src, size = 15, className = '', style,
}) => (
  <img
    src={src}
    alt=""
    className={`flex-shrink-0 ${className}`}
    style={{ width: size, height: size, objectFit: 'contain', ...style }}
    draggable={false}
  />
);

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavClick, isOpen, user }) => {
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
        <img src={logoImg} alt="Logo" className="w-full h-auto max-w-[100px]" />
        {!collapsed && (
          <div className="flex items-center justify-center min-w-0">
            <div className="text-[12px] mt-[16px]" style={{ color: 'var(--text-sidebar-m)' }}>Admin Panel</div>
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
            background: 'linear-gradient(180deg, #F56A27 0%, #DD5E21 100%)',
            boxShadow: 'inset 0 -2px 0 #DD5E21',
          } : {}}
          title={collapsed ? 'Dashboard' : undefined}
        >
          <ImgIcon
            src={dashImg}
            size={15}
            style={{
              filter: activeId === 'dashboard'
                ? 'brightness(0) invert(1)'
                : 'brightness(0) invert(76%) sepia(2%) saturate(91%) hue-rotate(352deg) brightness(85%) contrast(85%)',
              opacity: 1,
            }}
          />
          {!collapsed && (
            <span
              className="text-[13px] font-semibold"
              style={{ color: activeId === 'dashboard' ? '#fff' : '#ADACAB' }}
            >
              Dashboard
            </span>
          )}
        </div>
      </div>

      {/* Users & Permissions */}
      {hasModuleViewPerm(user, 'users') && (
        <div className={cn('mt-1', collapsed ? 'px-1' : 'px-2')}>
          <div
            onClick={() => onNavClick('users-permissions')}
            className={cn(
              'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-all',
              collapsed ? 'justify-center px-0' : 'px-3',
              activeId === 'users-permissions' ? 'sidebar-item-active' : 'sidebar-item-hover'
            )}
            title={collapsed ? 'Users & Permissions' : undefined}
          >
            <ImgIcon
              src={manageImg}
              size={15}
              style={{
                filter: activeId === 'users-permissions'
                  ? 'brightness(0) saturate(100%) invert(52%) sepia(85%) saturate(500%) hue-rotate(350deg)'
                  : 'brightness(0) invert(76%) sepia(2%) saturate(91%) hue-rotate(352deg) brightness(85%) contrast(85%)',
                opacity: 1,
              }}
            />
            {!collapsed && (
              <span
                className="text-[13px]"
                style={{
                  color: activeId === 'users-permissions' ? 'var(--orange)' : '#ADACAB',
                  fontWeight: activeId === 'users-permissions' ? 600 : 400,
                }}
              >
                Users & Permissions
              </span>
            )}
          </div>
        </div>
      )}

      {/* Menu section (collapsible) */}
      {(hasModuleViewPerm(user, 'categories') || hasModuleViewPerm(user, 'items')) && (
        <div className={cn('mt-1', collapsed ? 'px-1' : 'px-2')}>
          <div
            onClick={() => collapsed ? undefined : setMenuOpen(!menuOpen)}
            className={cn(
              'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-colors sidebar-item-hover',
              collapsed ? 'justify-center px-0' : 'px-3',
            )}
            title={collapsed ? 'Menu' : undefined}
          >
            <ImgIcon
              src={menuImg}
              size={15}
              style={{
                filter: 'brightness(0) invert(76%) sepia(2%) saturate(91%) hue-rotate(352deg) brightness(85%) contrast(85%)',
                opacity: 1,
              }}
            />
            {!collapsed && (
              <>
                <span className="text-[13px] flex-1" style={{ color: '#ADACAB' }}>Menu</span>
                <span style={{ color: '#ADACAB' }}>
                  <ChevronIcon open={menuOpen} />
                </span>
              </>
            )}
          </div>

        {!collapsed && menuOpen && (
          <div className="ml-3 pl-0">
            {[
              { id: 'categories', label: 'Categories', mod: 'categories' },
              { id: 'menu-items', label: 'Menu Items', mod: 'items' },
            ]
            .filter(item => hasModuleViewPerm(user, item.mod))
            .map(item => (
              <div
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={cn(
                  "flex items-center gap-[8px] pl-4 pr-3 py-[7px] cursor-pointer transition-colors rounded-r-lg border-l-2",
                  activeId === item.id ? "sidebar-item-active" : "sidebar-item-hover"
                )}
                style={{
                  borderColor: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.1)'
                }}
              >
                <span
                  className="text-[12px]"
                  style={{ color: activeId === item.id ? 'var(--orange)' : '#ADACAB' }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
        </div>
      )}

      {/* Site settings section (collapsible) */}
      {(hasModuleViewPerm(user, 'banners') || hasModuleViewPerm(user, 'stores')) && (
        <div className={cn('mt-1 mb-4', collapsed ? 'px-1' : 'px-2')}>
          <div
            onClick={() => collapsed ? undefined : setSettingsOpen(!settingsOpen)}
            className={cn(
              'flex items-center gap-[10px] py-[9px] rounded-lg cursor-pointer transition-colors sidebar-item-hover',
              collapsed ? 'justify-center px-0' : 'px-3',
            )}
            title={collapsed ? 'Site settings' : undefined}
          >
            <ImgIcon
              src={siteImg}
              size={15}
              style={{
                filter: 'brightness(0) invert(76%) sepia(2%) saturate(91%) hue-rotate(352deg) brightness(85%) contrast(85%)',
                opacity: 1,
              }}
            />
            {!collapsed && (
              <>
                <span className="text-[13px] flex-1" style={{ color: '#ADACAB' }}>Site settings</span>
                <span style={{ color: '#ADACAB' }}>
                  <ChevronIcon open={settingsOpen} />
                </span>
              </>
            )}
          </div>

          {!collapsed && settingsOpen && (
            <div className="ml-3 pl-0">
              {[
                { id: 'banner-settings', label: 'Banner settings', mod: 'banners' },
                { id: 'manage-stores', label: 'Manage Stores', badge: 2, mod: 'stores' },
              ]
              .filter(item => hasModuleViewPerm(user, item.mod))
              .map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavClick(item.id)}
                  className={cn(
                    "flex items-center gap-[8px] pl-4 pr-3 py-[7px] cursor-pointer transition-colors rounded-r-lg border-l-2",
                    activeId === item.id ? "sidebar-item-active" : "sidebar-item-hover"
                  )}
                  style={{
                    borderColor: activeId === item.id ? 'var(--orange)' : 'rgba(240,217,192,0.1)'
                  }}>
                  <span
                    className="text-[12px] flex-1"
                    style={{
                      color: activeId === item.id ? 'var(--orange)' : '#ADACAB',
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
                        color: '#ADACAB',
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
      )}

      {/* Quick Actions */}
      <div
        className={cn(
          'relative mt-auto pb-4 m-2 rounded-xl overflow-hidden backdrop-blur-2xl border border-white/20',
          collapsed ? 'px-1' : 'px-3'
        )}
        style={{
          background: 'linear-gradient(90deg, rgba(52,31,19,0.5) 0%, rgba(92,52,31,0.5) 48%, rgba(52,31,19,0.5) 100%)',
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
            style={{ color: '#ADACAB' }}
          >
            Quick Actions
          </div>
        )}
        {[
          { id: 'upload-banner', label: 'Upload Banner', img: uploadImg, isPrimary: false, mod: 'banners' },
          { id: 'add-store', label: 'Add Store', img: storeImg, isPrimary: false, mod: 'stores' },
          { id: 'add-product', label: 'Add Product', img: null, isPrimary: false, mod: 'items' },
          { id: 'manage-users', label: 'Manage Users', img: manageImg, isPrimary: false, mod: 'users' },
        ]
        .filter(action => hasModuleViewPerm(user, action.mod))
        .map(action => (
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
              action.isPrimary ? '' : 'sidebar-item-hover'
            )}
            style={action.isPrimary ? {
              background: 'linear-gradient(180deg, #F56A27 0%, #DD5E21 100%)',
              boxShadow: 'inset 0 -2px 0 #DD5E21',
            } : {}}
            title={collapsed ? action.label : undefined}
          >
            {action.img ? (
              <ImgIcon
                src={action.img}
                size={14}
                style={{
                  filter: action.isPrimary
                    ? 'brightness(0) invert(1)'
                    : 'brightness(0) invert(76%) sepia(2%) saturate(91%) hue-rotate(352deg) brightness(85%) contrast(85%)',
                  opacity: 1,
                }}
              />
            ) : (
              <span style={{ color: action.isPrimary ? '#fff' : '#ADACAB' }}>
                <PlusIcon />
              </span>
            )}
            {!collapsed && (
              <span
                className="text-[12px]"
                style={{ color: action.isPrimary ? '#fff' : '#ADACAB' }}
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
