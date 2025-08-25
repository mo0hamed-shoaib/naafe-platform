import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useAuth, RegisterData } from '@/contexts/AuthContext'

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  phone: z.string().regex(/^(\+20|0)?1[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  confirmPassword: z.string(),
  role: z.enum(['seeker', 'provider'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'seeker'
    }
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      const userData: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role
      }
      await registerUser(userData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions = [
    {
      value: 'seeker' as const,
      title: 'باحث عن خدمات',
      description: 'أحتاج خدمات منزلية أو مهنية',
      icon: '🏠',
      features: ['البحث عن مزودي الخدمات', 'طلب خدمات متنوعة', 'تقييم الخدمات']
    },
    {
      value: 'provider' as const,
      title: 'مزود خدمات',
      description: 'أقدم خدمات منزلية أو مهنية',
      icon: '🛠️',
      features: ['عرض خدماتك', 'استقبال الطلبات', 'إدارة الأعمال']
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary font-cairo">Naafe</h1>
          </Link>
          <p className="text-muted-foreground font-cairo mt-2">
            منصة الخدمات العربية في مصر
          </p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-cairo">إنشاء حساب جديد</CardTitle>
            <CardDescription className="font-cairo">
              انضم إلى منصة Naafe وابدأ رحلتك
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <Label className="font-cairo text-base">نوع الحساب</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map((role) => (
                  <div
                    key={role.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedRole === role.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      // Set the role value
                      const event = { target: { value: role.value } }
                      register('role').onChange(event)
                    }}
                  >
                    {selectedRole === role.value && (
                      <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-primary" />
                    )}
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{role.icon}</div>
                      <h3 className="font-semibold font-cairo">{role.title}</h3>
                      <p className="text-sm text-muted-foreground font-cairo">
                        {role.description}
                      </p>
                      <div className="space-y-1">
                        {role.features.map((feature, index) => (
                          <div key={index} className="text-xs text-muted-foreground font-cairo">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="text-sm text-destructive font-cairo">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Separator />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-cairo">
                  الاسم الكامل
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    className="pr-10 font-cairo"
                    {...register('name')}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive font-cairo">
                    {errors.name.message}
                  </p>
                )}
              </div>

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

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-cairo">
                  رقم الهاتف
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+201234567890"
                    className="pr-10 font-cairo"
                    {...register('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive font-cairo">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-cairo">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10 font-cairo"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive font-cairo">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-cairo">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور"
                    className="pr-10 font-cairo"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive font-cairo">
                    {errors.confirmPassword.message}
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
                    <span>جاري إنشاء الحساب...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>إنشاء الحساب</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-cairo">
                لديك حساب بالفعل؟
              </p>
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary/80 font-cairo font-semibold"
              >
                تسجيل الدخول
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
