
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Plus
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface HeaderProps {
  isAuthenticated?: boolean
  user?: {
    name: string
    email: string
    avatar?: string
    role: 'seeker' | 'provider' | 'admin'
  }
}

export function Header({ isAuthenticated = false, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">ن</span>
              </div>
              <span className="font-bold text-xl text-foreground font-cairo">Naafe</span>
            </Link>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Main Navigation */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-cairo">الخدمات</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <div className="grid grid-cols-2 gap-2">
                        <Link to="/services/cleaning" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="font-semibold font-cairo">التنظيف</div>
                          <div className="text-sm text-muted-foreground">خدمات التنظيف المنزلية</div>
                        </Link>
                        <Link to="/services/plumbing" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="font-semibold font-cairo">السباكة</div>
                          <div className="text-sm text-muted-foreground">إصلاح وصيانة السباكة</div>
                        </Link>
                        <Link to="/services/electrical" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="font-semibold font-cairo">الكهرباء</div>
                          <div className="text-sm text-muted-foreground">أعمال الكهرباء والصيانة</div>
                        </Link>
                        <Link to="/services/moving" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                          <div className="font-semibold font-cairo">النقل</div>
                          <div className="text-sm text-muted-foreground">خدمات النقل والانتقال</div>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/providers" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 font-cairo">
                    المزودين
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 font-cairo">
                    عن المنصة
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {isAuthenticated && user ? (
              /* Authenticated User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none font-cairo">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-cairo">الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-cairo">الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-cairo">تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Guest User Actions */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login" className="font-cairo">تسجيل الدخول</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register" className="font-cairo">إنشاء حساب</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/become-provider" className="font-cairo flex items-center space-x-1">
                    <Plus className="h-4 w-4" />
                    <span>كن مزود خدمة</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
