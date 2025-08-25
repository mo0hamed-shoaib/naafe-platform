import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // TODO: Send error to logging service
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-cairo">حدث خطأ غير متوقع</CardTitle>
            <CardDescription className="font-cairo">
              عذراً، حدث خطأ أثناء تحميل هذه الصفحة
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground font-cairo mb-2">
                  تفاصيل الخطأ:
                </p>
                <p className="text-xs text-muted-foreground font-mono-technical">
                  {error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-3">
              <Button onClick={onRetry} className="w-full font-cairo">
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة المحاولة
              </Button>
              
              <Button variant="outline" asChild className="w-full font-cairo">
                <Link to="/">
                  <Home className="ml-2 h-4 w-4" />
                  العودة للصفحة الرئيسية
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground font-cairo">
                إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Hook for functional components to throw errors
export function useErrorHandler() {
  return (error: Error) => {
    throw error
  }
}

// Component for displaying specific error messages
export function ErrorMessage({ 
  title = 'حدث خطأ', 
  message = 'حدث خطأ أثناء تنفيذ العملية',
  onRetry,
  showRetry = true
}: {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
}) {
  return (
    <div className="text-center space-y-4 p-6">
      <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold font-cairo">{title}</h3>
        <p className="text-muted-foreground font-cairo">{message}</p>
      </div>

      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="font-cairo">
          <RefreshCw className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}
