import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'

// User types
export interface User {
  id: string
  email: string
  name: string
  role: 'seeker' | 'provider' | 'admin'
  avatar?: string
  phone?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Authentication context interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshToken: () => Promise<void>
}

// Registration data interface
export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  role?: 'seeker' | 'provider'
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated
  const isAuthenticated = !!user

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('naafe_token')
      if (token) {
        // Validate token and get user data
        await validateToken(token)
      }
    } catch (error) {
      console.error('Authentication initialization failed:', error)
      localStorage.removeItem('naafe_token')
    } finally {
      setIsLoading(false)
    }
  }

  // Validate JWT token
  const validateToken = async (_token: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/validate', {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // if (!response.ok) throw new Error('Invalid token')
      // const userData = await response.json()
      
      // Mock user data for development
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'أحمد محمد',
        role: 'seeker',
        avatar: undefined,
        phone: '+201234567890',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setUser(mockUser)
    } catch (error) {
      throw new Error('Token validation failed')
    }
  }

  // Login function
  const login = async (email: string, _password: string) => {
    try {
      setIsLoading(true)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })
      // if (!response.ok) throw new Error('Login failed')
      // const { token, user: userData } = await response.json()
      
      // Mock login for development
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'أحمد محمد',
        role: 'seeker',
        avatar: undefined,
        phone: '+201234567890',
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      // Store token
      localStorage.setItem('naafe_token', mockToken)
      
      // Set user
      setUser(mockUser)
      
      toast.success('تم تسجيل الدخول بنجاح')
    } catch (error) {
      toast.error('فشل في تسجيل الدخول')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // if (!response.ok) throw new Error('Registration failed')
      // const { token, user: newUser } = await response.json()
      
      // Mock registration for development
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      const mockUser: User = {
        id: '1',
        email: userData.email,
        name: userData.name,
        role: userData.role || 'seeker',
        avatar: undefined,
        phone: userData.phone,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      // Store token
      localStorage.setItem('naafe_token', mockToken)
      
      // Set user
      setUser(mockUser)
      
      toast.success('تم إنشاء الحساب بنجاح')
    } catch (error) {
      toast.error('فشل في إنشاء الحساب')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('naafe_token')
    setUser(null)
    toast.success('تم تسجيل الخروج بنجاح')
  }

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('naafe_token')
      if (token) {
        await validateToken(token)
      }
    } catch (error) {
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
