import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import AppHeader from './AppHeader';
import Footer from '../../components/layout/Footer';
import ScrollToTop from '../../components/common/ScrollToTop';
import NotFoundPage from '../../pages/NotFoundPage';

import { publicRoutes } from '../routing/publicRoutes';
import { protectedRoutes } from '../routing/protectedRoutes';
import { adminAliasRoutes, adminRoutes } from '../routing/adminRoutes';
import { AuthenticatedLayout, AdminLayout } from '../routing/ProtectedLayouts';

const renderRoutes = (routes) => {
  return routes.map((route) => {
    if (route.index) {
      return <Route key={route.key} index element={route.element} />;
    }

    return <Route key={route.key || route.path} path={route.path} element={route.element} />;
  });
};

const AppShell = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-zinc-50">
      <ScrollToTop />
      <AppHeader />
      <main className="flex-1">
        <Routes>
          {renderRoutes(publicRoutes)}

          <Route element={<AuthenticatedLayout />}>{renderRoutes(protectedRoutes)}</Route>

          <Route element={<AdminLayout />}>
            {renderRoutes(adminAliasRoutes)}
            <Route path="/admin">{renderRoutes(adminRoutes)}</Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminPath ? <Footer /> : null}
    </div>
  );
};

export default AppShell;