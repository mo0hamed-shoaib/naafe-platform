import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { User } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: User['role']
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground font-cairo">جاري التحقق من الحساب...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate page based on user role
    const roleRedirectMap: Record<User['role'], string> = {
      seeker: '/dashboard',
      provider: '/provider-dashboard',
      admin: '/admin-dashboard'
    }
    
    return <Navigate to={roleRedirectMap[user?.role || 'seeker']} replace />
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>
}

// Convenience components for specific roles
export function SeekerRoute({ children, fallbackPath }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="seeker" fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  )
}

export function ProviderRoute({ children, fallbackPath }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="provider" fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  )
}

export function AdminRoute({ children, fallbackPath }: Omit<ProtectedRouteProps, 'requiredRole'>) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath={fallbackPath}>
      {children}
    </ProtectedRoute>
  )
}
