import { useAuth } from '../../../contexts/AuthContext';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-deep-teal">جاري التحقق من الصلاحيات...</div>;
  }

  if (!isAuthenticated || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setSidebarOpen((open) => !open);
  const closeSidebar = () => setSidebarOpen(false);
  const handleReturnToCategories = () => navigate('/categories');

  return (
    <div className="min-h-screen bg-warm-cream">
      <Header onMenuClick={toggleSidebar} title="Admin Dashboard" />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 lg:ml-0">
          <div className="container mx-auto p-4 lg:p-8">
            <button
              className="mb-4 px-4 py-2 bg-deep-teal text-warm-cream rounded hover:bg-soft-teal transition-colors"
              onClick={handleReturnToCategories}
            >
              العودة إلى الفئات
            </button>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;