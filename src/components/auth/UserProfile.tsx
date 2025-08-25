import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Camera, Save, Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  phone: z.string().regex(/^(\+20|0)?1[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح')
})

type ProfileFormData = z.infer<typeof profileSchema>

export function UserProfile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [_avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      
      // TODO: Replace with actual API call
      // const formData = new FormData()
      // formData.append('name', data.name)
      // formData.append('email', data.email)
      // formData.append('phone', data.phone)
      // if (avatarFile) {
      //   formData.append('avatar', avatarFile)
      // }
      // 
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   body: formData
      // })
      // const updatedUser = await response.json()
      
      // Mock API call for development
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      updateUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        avatar: avatarPreview || user?.avatar
      })
      
      setIsEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarFile(null)
    setAvatarPreview(null)
    reset()
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      seeker: 'باحث عن خدمات',
      provider: 'مزود خدمات',
      admin: 'مدير النظام'
    }
    return roleLabels[role as keyof typeof roleLabels] || role
  }

  const getRoleColor = (role: string) => {
    const roleColors = {
      seeker: 'bg-primary',
      provider: 'bg-secondary',
      admin: 'bg-accent'
    }
    return roleColors[role as keyof typeof roleColors] || 'bg-muted'
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage 
                src={avatarPreview || user?.avatar} 
                alt={user?.name}
              />
              <AvatarFallback className="text-2xl font-cairo">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-cairo">{user?.name}</CardTitle>
            <CardDescription className="font-cairo">{user?.email}</CardDescription>
            <div className="flex justify-center gap-2">
              <Badge className={`${getRoleColor(user?.role || '')} text-white font-cairo`}>
                {getRoleLabel(user?.role || '')}
              </Badge>
              {user?.isVerified && (
                <Badge variant="secondary" className="font-cairo">
                  موثق
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive font-cairo">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Account Info */}
            <Separator />
            <div className="space-y-2">
              <Label className="font-cairo text-sm text-muted-foreground">
                معلومات الحساب
              </Label>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground font-cairo">تاريخ الإنشاء:</span>
                  <p className="font-cairo">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-cairo">آخر تحديث:</span>
                  <p className="font-cairo">
                    {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ar-EG') : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1 font-cairo"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>جاري الحفظ...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>حفظ التغييرات</span>
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="font-cairo"
                >
                  <X className="ml-2 h-4 w-4" />
                  إلغاء
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full font-cairo"
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل الملف الشخصي
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
