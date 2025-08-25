import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  Menu, 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Briefcase,
  FileText,
  MessageSquare,
  Star,
  Award,
  Users,
  BarChart3,
  HelpCircle,
  Phone
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const baseItems = [
      {
        title: 'الرئيسية',
        href: '/',
        icon: Home
      },
      {
        title: 'الملف الشخصي',
        href: '/profile',
        icon: User
      }
    ]

    const seekerItems = [
      {
        title: 'البحث عن خدمات',
        href: '/search',
        icon: Search
      },
      {
        title: 'طلباتي',
        href: '/my-requests',
        icon: FileText
      },
      {
        title: 'المحادثات',
        href: '/messages',
        icon: MessageSquare
      },
      {
        title: 'التقييمات',
        href: '/reviews',
        icon: Star
      }
    ]

    const providerItems = [
      {
        title: 'لوحة التحكم',
        href: '/provider-dashboard',
        icon: BarChart3
      },
      {
        title: 'الطلبات الواردة',
        href: '/incoming-requests',
        icon: Briefcase
      },
      {
        title: 'خدماتي',
        href: '/my-services',
        icon: Award
      },
      {
        title: 'العملاء',
        href: '/clients',
        icon: Users
      },
      {
        title: 'التقييمات',
        href: '/provider-reviews',
        icon: Star
      }
    ]

    const adminItems = [
      {
        title: 'لوحة الإدارة',
        href: '/admin-dashboard',
        icon: BarChart3
      },
      {
        title: 'إدارة المستخدمين',
        href: '/admin/users',
        icon: Users
      },
      {
        title: 'إدارة الخدمات',
        href: '/admin/services',
        icon: Award
      },
      {
        title: 'التقارير',
        href: '/admin/reports',
        icon: FileText
      },
      {
        title: 'إعدادات النظام',
        href: '/admin/settings',
        icon: Settings
      }
    ]

    switch (user.role) {
      case 'seeker':
        return [...baseItems, ...seekerItems]
      case 'provider':
        return [...baseItems, ...providerItems]
      case 'admin':
        return [...baseItems, ...adminItems]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold font-cairo truncate">{user?.name}</p>
            <div className="flex items-center space-x-2">
              <Badge className={`${getRoleColor(user?.role || '')} text-white text-xs font-cairo`}>
                {getRoleLabel(user?.role || '')}
              </Badge>
              {user?.isVerified && (
                <Badge variant="secondary" className="text-xs font-cairo">
                  موثق
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                setIsMobileOpen(false)
                onClose?.()
              }}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors font-cairo ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Footer Actions */}
      <div className="p-4 space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start font-cairo">
          <Settings className="ml-2 h-4 w-4" />
          الإعدادات
        </Button>
        
        <Button variant="ghost" size="sm" className="w-full justify-start font-cairo">
          <HelpCircle className="ml-2 h-4 w-4" />
          المساعدة
        </Button>
        
        <Button variant="ghost" size="sm" className="w-full justify-start font-cairo">
          <Phone className="ml-2 h-4 w-4" />
          اتصل بنا
        </Button>

        <Separator />

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="w-full justify-start font-cairo text-destructive hover:text-destructive"
        >
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="font-cairo">القائمة</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 md:right-0 z-50 bg-background border-l ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <SidebarContent />
      </div>

      {/* Overlay for desktop */}
      {isOpen && (
        <div 
          className="hidden md:block fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
    </>
  )
}
