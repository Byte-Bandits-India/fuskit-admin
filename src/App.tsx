import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { MenuItemsPage } from '@/pages/MenuItemsPage';
import { BannerSettingsPage } from '@/pages/BannerSettingsPage';
import { ManageStoresPage } from '@/pages/ManageStoresPage';
import { UsersPermissionsPage } from '@/pages/UsersPermissionsPage';
import { LoginPage } from '@/pages/LoginPage';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('fuskit_auth') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('fuskit_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      {(activeId) => {
        switch (activeId) {
          case 'categories':
            return <CategoriesPage />;
          case 'menu-items':
            return <MenuItemsPage />;
          case 'banner-settings':
            return <BannerSettingsPage />;
          case 'manage-stores':
            return <ManageStoresPage />;
          case 'users-permissions':
            return <UsersPermissionsPage />;
          default:
            return <DashboardPage />;
        }
      }}
    </DashboardLayout>
  );
}

export default App;
