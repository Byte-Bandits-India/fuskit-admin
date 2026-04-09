import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useActiveNav } from '@/hooks/useActiveNav';
import { authApi } from '@/services/api';
import type { UserData } from '@/types';

export function hasModuleViewPerm(user: UserData | null | undefined, modId: string): boolean {
  if (!user) return false;
  if (user.role === 'Super Admin') return true;
  const mod = user.permissions?.find((m) => m.id === modId);
  if (!mod) return false;
  return mod.rows.some((r) => r.perms.view || r.perms.edit || r.perms.create || r.perms.delete);
}

interface DashboardLayoutProps {
  children: React.ReactNode | ((activeId: string) => React.ReactNode);
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const { activeId, setActiveId } = useActiveNav('dashboard');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    authApi.getMe()
      .then(setCurrentUser)
      .catch((err) => {
        console.error(err);
        onLogout();
      });
  }, [onLogout]);

  // Open on desktop, closed on mobile by default
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  // Build breadcrumb from activeId
  const breadcrumbMap: Record<string, string[]> = {
    dashboard: ['Dashboard', 'Overview'],
    categories: ['Dashboard', 'Menu', 'Categories'],
    'menu-items': ['Dashboard', 'Menu', 'Menu Items'],
    'banner-settings': ['Dashboard', 'Site settings', 'Banner settings'],
    'manage-stores': ['Dashboard', 'Site settings', 'Manage Stores'],
    gallery: ['Dashboard', 'Site settings', 'Gallery'],
  };

  const breadcrumb = breadcrumbMap[activeId] || ['Dashboard'];

  return (
    <div className="flex h-screen overflow-hidden w-full relative">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeId={activeId}
        onNavClick={(id) => {
          setActiveId(id);
          if (window.innerWidth < 768) setSidebarOpen(false); // Auto close on mobile navigation
        }}
        isOpen={sidebarOpen}
        user={currentUser}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          breadcrumb={breadcrumb}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
          user={currentUser}
          onNavClick={(id) => setActiveId(id)}
        />
        <main
          className="flex-1 overflow-y-auto bg-[#2C1A0E]"
        >
          {(() => {
            const modIdMap: Record<string, string> = {
              'categories': 'categories',
              'menu-items': 'items',
              'banner-settings': 'banners',
              'manage-stores': 'stores',
              'users-permissions': 'users',
              'dashboard': 'dashboard',
            };
            const reqMod = modIdMap[activeId];
            if (reqMod && currentUser && !hasModuleViewPerm(currentUser, reqMod)) {
              return (
                <div className="flex items-center justify-center h-full flex-col text-center" style={{ color: 'var(--text-muted)' }}>
                  <svg viewBox="0 0 24 24" width={48} height={48} fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                  <p className="text-sm">You do not have permission to view this module.</p>
                </div>
              );
            }
            return typeof children === 'function' ? children(activeId) : children;
          })()}
        </main>
      </div>
    </div>
  );
};
