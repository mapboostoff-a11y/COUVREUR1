import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LegalPage } from './pages/public/LegalPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Login } from './pages/auth/Login';
import { useAuthStore } from './store/use-auth-store';
import { useConfigStore } from './store/use-config-store';

const ConfigLoader = () => {
  const { fetchRemoteConfig } = useConfigStore();
  const location = useLocation();

  useEffect(() => {
    // Charger la config distante au démarrage et à chaque changement de route
    fetchRemoteConfig();
  }, [location.pathname, fetchRemoteConfig]);

  useEffect(() => {
    // Rafraîchir quand l'onglet redevient actif
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchRemoteConfig();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchRemoteConfig]);

  return null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ConfigLoader />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/confidentialite" element={<LegalPage />} />
          <Route path="/cgu" element={<LegalPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          {/* Add more admin routes here like /admin/preview, /admin/settings */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
