import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Password reset form schema
const forgotPasswordSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      
      // TODO: Replace with actual API call
      // await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: data.email })
      // })
      
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary font-cairo">Naafe</h1>
            </Link>
            <p className="text-muted-foreground font-cairo mt-2">
              منصة الخدمات العربية في مصر
            </p>
          </div>

          {/* Success Card */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-cairo text-foreground">
                  تم إرسال رابط إعادة تعيين كلمة المرور
                </h2>
                <p className="text-muted-foreground font-cairo">
                  تحقق من بريدك الإلكتروني واتبع التعليمات لإعادة تعيين كلمة المرور
                </p>
              </div>

              <div className="space-y-4">
                <Button asChild className="w-full font-cairo">
                  <Link to="/login">
                    <ArrowLeft className="ml-2 h-4 w-4" />
                    العودة لتسجيل الدخول
                  </Link>
                </Button>
                
                <p className="text-sm text-muted-foreground font-cairo">
                  لم تستلم البريد الإلكتروني؟{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    إعادة المحاولة
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary font-cairo">Naafe</h1>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">
            منصة الخدمات العربية في مصر
          </p>
        </div>

        {/* Password Reset Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-cairo">نسيت كلمة المرور؟</CardTitle>
            <CardDescription className="font-cairo">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-cairo">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    className="pr-10 font-cairo"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive font-cairo">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-cairo text-lg py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </div>
                ) : (
                  <span>إرسال رابط إعادة التعيين</span>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary/80 font-cairo font-semibold"
              >
                <ArrowLeft className="inline ml-1 h-4 w-4" />
                العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground font-cairo">
            بالاستمرار، أنت توافق على{' '}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              شروط الاستخدام
            </Link>{' '}
            و{' '}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
