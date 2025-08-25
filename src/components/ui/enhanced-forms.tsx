import { forwardRef, useState } from 'react'
import { Eye, EyeOff, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from './loading-states'

// Enhanced Input with icon and validation
interface EnhancedInputProps {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number'
  icon?: React.ComponentType<{ className?: string }>
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ label, placeholder, type = 'text', icon: Icon, error, required, disabled, className, value, onChange, onBlur }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className={`space-y-2 ${className}`}>
        <Label htmlFor={label} className="font-cairo text-sm font-medium">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </Label>
        
        <div className="relative">
          {Icon && (
            <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          )}
          
          <Input
            ref={ref}
            id={label}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false)
              onBlur?.()
            }}
            disabled={disabled}
            className={`pr-10 font-cairo transition-all duration-200 ${
              Icon ? 'pl-10' : ''
            } ${
              error ? 'border-destructive focus:border-destructive' : ''
            } ${
              isFocused ? 'ring-2 ring-primary/20' : ''
            }`}
          />
          
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive font-cairo flex items-center space-x-1">
            <span className="w-1 h-1 bg-destructive rounded-full"></span>
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }
)

EnhancedInput.displayName = 'EnhancedInput'

// Phone Input with Egypt-specific validation
interface PhoneInputProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function PhoneInput({ 
  label = 'رقم الهاتف', 
  value, 
  onChange, 
  error, 
  required, 
  disabled 
}: PhoneInputProps) {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '')
    
    // Format Egyptian phone number
    if (cleaned.startsWith('20')) {
      return `+${cleaned}`
    } else if (cleaned.startsWith('0')) {
      return `+20${cleaned.slice(1)}`
    } else if (cleaned.length === 10) {
      return `+20${cleaned}`
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+20${cleaned}`
    }
    
    return cleaned
  }

  const handleChange = (input: string) => {
    const formatted = formatPhoneNumber(input)
    onChange?.(formatted)
  }

  return (
    <EnhancedInput
      label={label}
      type="tel"
      placeholder="+201234567890"
      icon={Phone}
      value={value}
      onChange={handleChange}
      error={error}
      required={required}
      disabled={disabled}
    />
  )
}

// Location Input with Egypt cities
interface LocationInputProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function LocationInput({ 
  label = 'المحافظة', 
  value, 
  onChange, 
  error, 
  required, 
  disabled 
}: LocationInputProps) {
  const egyptGovernorates = [
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'الشرقية',
    'الغربية',
    'المنوفية',
    'القليوبية',
    'المنيا',
    'أسيوط',
    'سوهاج',
    'قنا',
    'الأقصر',
    'أسوان',
    'بني سويف',
    'الفيوم',
    'دمياط',
    'كفر الشيخ',
    'الدقهلية',
    'البحيرة',
    'مطروح',
    'شمال سيناء',
    'جنوب سيناء',
    'البحر الأحمر',
    'الوادي الجديد'
  ]

  return (
    <div className="space-y-2">
      <Label className="font-cairo text-sm font-medium">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="font-cairo">
          <SelectValue placeholder="اختر المحافظة" />
        </SelectTrigger>
        <SelectContent>
          {egyptGovernorates.map((governorate) => (
            <SelectItem key={governorate} value={governorate}>
              {governorate}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-destructive font-cairo flex items-center space-x-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// Service Category Selector
interface ServiceCategorySelectorProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}

export function ServiceCategorySelector({ 
  label = 'نوع الخدمة', 
  value, 
  onChange, 
  error, 
  required, 
  disabled 
}: ServiceCategorySelectorProps) {
  const serviceCategories = [
    { value: 'cleaning', label: 'التنظيف', icon: '🧹' },
    { value: 'plumbing', label: 'السباكة', icon: '🔧' },
    { value: 'electrical', label: 'الكهرباء', icon: '⚡' },
    { value: 'moving', label: 'النقل', icon: '🚚' },
    { value: 'painting', label: 'الدهان', icon: '🎨' },
    { value: 'carpentry', label: 'النجارة', icon: '🔨' },
    { value: 'gardening', label: 'الحدائق', icon: '🌱' },
    { value: 'maintenance', label: 'الصيانة', icon: '🔧' }
  ]

  return (
    <div className="space-y-2">
      <Label className="font-cairo text-sm font-medium">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="font-cairo">
          <SelectValue placeholder="اختر نوع الخدمة" />
        </SelectTrigger>
        <SelectContent>
          {serviceCategories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              <div className="flex items-center space-x-2">
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-destructive font-cairo flex items-center space-x-1">
          <span className="w-1 h-1 bg-destructive rounded-full"></span>
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// Form Section Component
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-cairo text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="font-cairo">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

// Form Actions Component
interface FormActionsProps {
  onSubmit: () => void
  onCancel?: () => void
  submitText?: string
  cancelText?: string
  isLoading?: boolean
  disabled?: boolean
  showCancel?: boolean
}

export function FormActions({ 
  onSubmit, 
  onCancel, 
  submitText = 'حفظ', 
  cancelText = 'إلغاء',
  isLoading = false,
  disabled = false,
  showCancel = true
}: FormActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <Button
        type="submit"
        onClick={onSubmit}
        disabled={disabled || isLoading}
        className="flex-1 font-cairo"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" text="جاري الحفظ..." />
        ) : (
          submitText
        )}
      </Button>
      
      {showCancel && onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="font-cairo"
        >
          {cancelText}
        </Button>
      )}
    </div>
  )
}

// Validation Status Component
interface ValidationStatusProps {
  isValid: boolean
  message: string
  showIcon?: boolean
}

export function ValidationStatus({ isValid, message, showIcon = true }: ValidationStatusProps) {
  return (
    <div className={`flex items-center space-x-2 text-sm ${
      isValid ? 'text-success' : 'text-destructive'
    }`}>
      {showIcon && (
        <div className={`w-2 h-2 rounded-full ${
          isValid ? 'bg-success' : 'bg-destructive'
        }`} />
      )}
      <span className="font-cairo">{message}</span>
    </div>
  )
}
