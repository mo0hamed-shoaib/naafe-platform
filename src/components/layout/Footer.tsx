
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
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">ن</span>
              </div>
              <span className="font-bold text-2xl text-foreground font-cairo">Naafe</span>
            </div>
            <p className="text-muted-foreground font-cairo leading-relaxed">
              منصة الخدمات العربية الأولى في مصر. نربط طالبي الخدمات بالمزودين المحترفين بطريقة آمنة وموثوقة.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
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
                <Link to="/services/cleaning" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  خدمات التنظيف
                </Link>
              </li>
              <li>
                <Link to="/services/plumbing" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  أعمال السباكة
                </Link>
              </li>
              <li>
                <Link to="/services/electrical" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  أعمال الكهرباء
                </Link>
              </li>
              <li>
                <Link to="/services/moving" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  خدمات النقل
                </Link>
              </li>
              <li>
                <Link to="/services/painting" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  أعمال الدهان
                </Link>
              </li>
              <li>
                <Link to="/services/carpentry" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
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
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  عن المنصة
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  الوظائف
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  الصحافة
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  الشركاء
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
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
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  الأمان والسلامة
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors font-cairo">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span className="font-cairo">آمن وموثوق</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-cairo">+10,000 مزود خدمة</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span className="font-cairo">جودة مضمونة</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Contact Info */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+20 123 456 7890</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>info@naafe.com</span>
            </div>
            <Button variant="secondary" size="sm" className="font-cairo">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className="text-sm text-muted-foreground font-cairo">
            © 2024 Naafe. جميع الحقوق محفوظة. صنع في مصر 
            <Heart className="inline h-4 w-4 mx-1 text-destructive" />
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors font-cairo">
              شروط الاستخدام
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors font-cairo">
              سياسة الخصوصية
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors font-cairo">
              ملفات تعريف الارتباط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
