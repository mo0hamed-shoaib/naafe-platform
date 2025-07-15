import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: { first: string; last: string };
  phone: string;
  role: 'seeker' | 'provider';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE = '/api/auth';
const USER_API = '/api/users/me';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => localStorage.getItem('refreshToken')
  );
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile if token exists
  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      fetch(USER_API, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('فشل تحميل بيانات المستخدم');
          const data = await res.json();
          setUser(data.data.user);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'فشل تسجيل الدخول');
        setLoading(false);
        return null;
      }
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser(data.data.user);
      setLoading(false);
      return data.data.user; // Return user object
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
      return null;
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'فشل إنشاء الحساب');
        setLoading(false);
        return false;
      }
      // Auto-login after registration
      const loginSuccess = await login(payload.email, payload.password);
      setLoading(false);
      return loginSuccess;
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 