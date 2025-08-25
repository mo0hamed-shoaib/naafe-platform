
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Phone, 
  Mail, 
  MessageCircle,
  Shield,
  Heart,
  Users,
  Award
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t" dir="rtl">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ن</span>
              </div>
              <span className="font-bold text-2xl text-foreground font-cairo">Naafe</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground font-cairo leading-relaxed">
              منصة الخدمات العربية الأولى في مصر. نربط طالبي الخدمات بالمزودين المحترفين بطريقة آمنة وموثوقة.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-cairo">الخدمات</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/cleaning" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  خدمات التنظيف
                </Link>
              </li>
              <li>
                <Link to="/services/plumbing" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  أعمال السباكة
                </Link>
              </li>
              <li>
                <Link to="/services/electrical" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  أعمال الكهرباء
                </Link>
              </li>
              <li>
                <Link to="/services/moving" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  خدمات النقل
                </Link>
              </li>
              <li>
                <Link to="/services/painting" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  أعمال الدهان
                </Link>
              </li>
              <li>
                <Link to="/services/carpentry" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  أعمال النجارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-cairo">الشركة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  الوظائف
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  الصحافة
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  الشركاء
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  المدونة
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-cairo">الدعم</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  الأمان والسلامة
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors font-cairo block py-2 hover:bg-accent/50 rounded px-2 -mx-2 text-center">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6 sm:my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <div className="icon-text">
              <Shield className="h-4 w-4" />
              <span className="font-cairo">آمن وموثوق</span>
            </div>
            <div className="icon-text">
              <Users className="h-4 w-4" />
              <span className="font-cairo">+10,000 مزود خدمة</span>
            </div>
            <div className="icon-text">
              <Award className="h-4 w-4" />
              <span className="font-cairo">جودة مضمونة</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Contact Info */}
            <div className="icon-text text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+20 123 456 7890</span>
            </div>
            <div className="icon-text text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>info@naafe.com</span>
            </div>
            <Button variant="secondary" size="sm" className="font-cairo hover:bg-secondary/80 transition-colors">
              <MessageCircle className="h-4 w-4 ml-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
          <p className="text-sm text-muted-foreground font-cairo text-center lg:text-right">
            © 2024 Naafe. جميع الحقوق محفوظة. صنع في مصر 
            <Heart className="inline h-4 w-4 mx-1 text-destructive" />
          </p>
          <div className="btn-group flex-col sm:flex-row items-center text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors font-cairo hover:bg-accent/50 rounded px-2 py-1 -mx-2">
              شروط الاستخدام
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors font-cairo hover:bg-accent/50 rounded px-2 py-1 -mx-2">
              سياسة الخصوصية
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors font-cairo hover:bg-accent/50 rounded px-2 py-1 -mx-2">
              ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
