import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeInjector } from '../components/renderer/ThemeInjector';

export const PublicLayout = () => {
  return (
    <HelmetProvider>
      <ThemeInjector />
      <main className="min-h-screen flex flex-col">
        <Outlet />
      </main>
    </HelmetProvider>
  );
};
