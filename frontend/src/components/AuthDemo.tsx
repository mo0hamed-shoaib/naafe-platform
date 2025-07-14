import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import { User } from '../types';

const AuthDemo = () => {
  const { user, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const demoUser: User = {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isPremium: true
  };

  const demoUserNoAvatar: User = {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    isPremium: false
  };

  const handleLogin = async (userData: User) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    login(userData);
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    logout();
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Auth Demo</h3>
      <div className="space-y-2">
        {!user ? (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleLogin(demoUser)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل دخول (مع صورة)'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLogin(demoUserNoAvatar)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل دخول (بدون صورة)'}
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
          </Button>
        )}
      </div>
      {user && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-text-secondary">
            مسجل كـ: {user.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthDemo; 