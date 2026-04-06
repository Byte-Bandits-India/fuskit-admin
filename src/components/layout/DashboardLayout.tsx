import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useActiveNav } from '@/hooks/useActiveNav';

interface DashboardLayoutProps {
  children: React.ReactNode | ((activeId: string) => React.ReactNode);
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const { activeId, setActiveId } = useActiveNav('dashboard');

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
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: 'var(--bg-card)' }}>
        <Topbar
          breadcrumb={breadcrumb}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={onLogout}
        />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--bg-page)' }}
        >
          {typeof children === 'function' ? children(activeId) : children}
        </main>
      </div>
    </div>
  );
};
