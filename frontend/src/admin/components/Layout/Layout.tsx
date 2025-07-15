import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastProvider } from '../../contexts/ToastContext';

const AdminLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-deep-teal">جاري التحقق من الصلاحيات...</div>;
  }

  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-warm-cream">
        <Header onMenuClick={toggleSidebar} title="Admin Dashboard" />
        <div className="flex min-h-screen">
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} className="h-screen" />
          <main className="flex-1 lg:ml-0">
            <div className="container mx-auto p-4 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default AdminLayout;