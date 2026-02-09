import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
