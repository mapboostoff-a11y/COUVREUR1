import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeInjector } from '../components/renderer/ThemeInjector';
import { MetaTags } from '../components/renderer/MetaTags';

export const PublicLayout = () => {
  return (
    <HelmetProvider>
      <MetaTags />
      <ThemeInjector />
      <main className="min-h-screen flex flex-col">
        <Outlet />
      </main>
    </HelmetProvider>
  );
};
