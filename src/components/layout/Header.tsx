
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Plus,
  ChevronDown
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const services = [
    { name: 'التنظيف', description: 'خدمات التنظيف المنزلية', href: '/services/cleaning' },
    { name: 'السباكة', description: 'إصلاح وصيانة السباكة', href: '/services/plumbing' },
    { name: 'الكهرباء', description: 'أعمال الكهرباء والصيانة', href: '/services/electrical' },
    { name: 'النقل', description: 'خدمات النقل والانتقال', href: '/services/moving' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">ن</span>
              </div>
              <span className="font-bold text-xl text-foreground font-cairo">Naafe</span>
            </Link>
            
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 space-x-reverse">
              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="font-cairo hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    الخدمات
                    <ChevronDown className="mr-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="font-cairo">اختر الخدمة</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {services.map((service) => (
                    <DropdownMenuItem key={service.href} asChild>
                      <Link to={service.href} className="font-cairo hover:bg-accent hover:text-accent-foreground">
                        {service.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="ghost" asChild className="font-cairo hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <Link to="/providers">المزودين</Link>
              </Button>
              
              <Button variant="ghost" asChild className="font-cairo hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <Link to="/about">عن المنصة</Link>
              </Button>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Search - Hidden on mobile */}
            <Button variant="ghost" size="sm" className="hidden md:flex hover:bg-accent hover:text-accent-foreground">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hover:bg-accent hover:text-accent-foreground">
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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground">
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
                    <div className="flex flex-col space-y-1 space-y-reverse">
                      <p className="text-sm font-medium leading-none font-cairo">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center font-cairo hover:bg-accent hover:text-accent-foreground">
                      <User className="ml-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-cairo hover:bg-accent hover:text-accent-foreground">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="font-cairo hover:bg-accent hover:text-accent-foreground">
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Guest User Actions - Hidden on mobile */
              <div className="hidden md:flex items-center space-x-2 space-x-reverse">
                <Button variant="ghost" size="sm" asChild className="font-cairo hover:bg-accent hover:text-accent-foreground">
                  <Link to="/login">تسجيل الدخول</Link>
                </Button>
                <Button size="sm" asChild className="font-cairo">
                  <Link to="/register">إنشاء حساب</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild className="font-cairo hover:bg-secondary/80">
                  <Link to="/become-provider" className="flex items-center space-x-1 space-x-reverse">
                    <Plus className="h-4 w-4" />
                    <span>كن مزود خدمة</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden hover:bg-accent hover:text-accent-foreground">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]" dir="rtl">
                <SheetHeader>
                  <SheetTitle className="font-cairo text-right">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    <h3 className="font-semibold font-cairo text-sm text-muted-foreground">الخدمات</h3>
                    {services.map((service) => (
                      <Button
                        key={service.href}
                        variant="ghost"
                        asChild
                        className="w-full justify-start font-cairo hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to={service.href}>{service.name}</Link>
                      </Button>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <Button variant="ghost" asChild className="w-full justify-start font-cairo hover:bg-accent hover:text-accent-foreground">
                    <Link to="/providers" onClick={() => setIsMobileMenuOpen(false)}>المزودين</Link>
                  </Button>
                  
                  <Button variant="ghost" asChild className="w-full justify-start font-cairo hover:bg-accent hover:text-accent-foreground">
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>عن المنصة</Link>
                  </Button>
                  
                  <Separator />
                  
                  {/* Mobile Search */}
                  <Button variant="ghost" className="w-full justify-start font-cairo hover:bg-accent hover:text-accent-foreground">
                    <Search className="ml-2 h-4 w-4" />
                    البحث
                  </Button>
                  
                  {!isAuthenticated && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Button asChild className="w-full font-cairo">
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>تسجيل الدخول</Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full font-cairo hover:bg-accent hover:text-accent-foreground">
                          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>إنشاء حساب</Link>
                        </Button>
                        <Button variant="secondary" asChild className="w-full font-cairo hover:bg-secondary/80">
                          <Link to="/become-provider" onClick={() => setIsMobileMenuOpen(false)}>
                            <Plus className="ml-2 h-4 w-4" />
                            كن مزود خدمة
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
