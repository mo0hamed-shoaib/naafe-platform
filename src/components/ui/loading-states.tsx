import { Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Main loading spinner
export function LoadingSpinner({ size = 'default', text = 'جاري التحميل...' }: {
  size?: 'sm' | 'default' | 'lg'
  text?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <span className="text-sm text-muted-foreground font-cairo">{text}</span>}
    </div>
  )
}

// Full page loading
export function FullPageLoading({ text = 'جاري تحميل الصفحة...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-lg text-muted-foreground font-cairo">{text}</p>
      </div>
    </div>
  )
}

// Skeleton loading for cards
export function CardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton loading for service cards
export function ServiceCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
        <div className="h-5 bg-muted rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-10 bg-muted rounded w-full"></div>
      </CardContent>
    </Card>
  )
}

// Skeleton loading for profile
export function ProfileSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </div>
          </div>
          
          {/* Form fields */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Status indicators
export function StatusIndicator({ 
  status, 
  text 
}: { 
  status: 'loading' | 'success' | 'error' | 'warning'
  text: string 
}) {
  const statusConfig = {
    loading: {
      icon: Loader2,
      className: 'text-primary animate-spin',
      bgClass: 'bg-primary/10'
    },
    success: {
      icon: CheckCircle,
      className: 'text-success',
      bgClass: 'bg-success/10'
    },
    error: {
      icon: AlertCircle,
      className: 'text-destructive',
      bgClass: 'bg-destructive/10'
    },
    warning: {
      icon: Clock,
      className: 'text-warning',
      bgClass: 'bg-warning/10'
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={`flex items-center space-x-2 p-3 rounded-lg ${config.bgClass}`}>
      <Icon className={`h-5 w-5 ${config.className}`} />
      <span className="text-sm font-cairo">{text}</span>
    </div>
  )
}

// Loading overlay for forms
export function LoadingOverlay({ isVisible, text = 'جاري الحفظ...' }: {
  isVisible: boolean
  text?: string
}) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground font-cairo">{text}</p>
      </div>
    </div>
  )
}

// Button loading state
export function ButtonLoading({ text = 'جاري التحميل...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="font-cairo">{text}</span>
    </div>
  )
}
