
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Shield, 
  Clock, 
  Star, 
  Users, 
 
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,

} from 'lucide-react'

export function HomePage() {
  const services = [
    {
      id: 'cleaning',
      name: 'التنظيف',
      description: 'خدمات التنظيف المنزلية والمكتبية',
      icon: '🧹',
      color: 'bg-blue-500',
      providers: 1250
    },
    {
      id: 'plumbing',
      name: 'السباكة',
      description: 'إصلاح وصيانة أنظمة السباكة',
      icon: '🔧',
      color: 'bg-green-500',
      providers: 890
    },
    {
      id: 'electrical',
      name: 'الكهرباء',
      description: 'أعمال الكهرباء والصيانة',
      icon: '⚡',
      color: 'bg-yellow-500',
      providers: 756
    },
    {
      id: 'moving',
      name: 'النقل',
      description: 'خدمات النقل والانتقال',
      icon: '🚚',
      color: 'bg-purple-500',
      providers: 432
    },
    {
      id: 'painting',
      name: 'الدهان',
      description: 'أعمال الدهان والديكور',
      icon: '🎨',
      color: 'bg-pink-500',
      providers: 654
    },
    {
      id: 'carpentry',
      name: 'النجارة',
      description: 'أعمال النجارة والأثاث',
      icon: '🔨',
      color: 'bg-orange-500',
      providers: 543
    }
  ]

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'آمن وموثوق',
      description: 'جميع مزودي الخدمات موثقين ومتحقق منهم'
    },
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      title: 'سريع وفعال',
      description: 'احصل على الخدمة في أقل من 24 ساعة'
    },
    {
      icon: <Star className="h-8 w-8 text-accent" />,
      title: 'جودة عالية',
      description: 'خدمات عالية الجودة بأسعار مناسبة'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'دعم محلي',
      description: 'فريق دعم مصري متاح على مدار الساعة'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'مزود خدمة موثق' },
    { number: '50,000+', label: 'خدمة مكتملة' },
    { number: '4.8', label: 'تقييم متوسط' },
    { number: '24/7', label: 'دعم متواصل' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit font-cairo">
                  منصة الخدمات العربية الأولى في مصر
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground font-cairo leading-tight">
                  ابحث عن الخدمات
                  <span className="text-primary block">بسهولة وأمان</span>
                </h1>
                <p className="text-xl text-muted-foreground font-cairo leading-relaxed">
                  منصة Naafe تربطك بأفضل مزودي الخدمات المحترفين في مصر. 
                  احصل على خدمات عالية الجودة بأسعار مناسبة مع ضمان الأمان والموثوقية.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="font-cairo text-lg px-8 py-6">
                  <Search className="mr-2 h-5 w-5" />
                  ابحث عن خدمة
                </Button>
                <Button variant="outline" size="lg" className="font-cairo text-lg px-8 py-6">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  كن مزود خدمة
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-cairo">موثقين ومتحقق منهم</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-cairo">ضمان الجودة</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-cairo">دعم 24/7</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  {services.slice(0, 4).map((service) => (
                    <Card key={service.id} className="bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl mb-2">{service.icon}</div>
                        <h3 className="font-semibold font-cairo">{service.name}</h3>
                        <p className="text-xs text-muted-foreground font-cairo">{service.providers} مزود</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary font-cairo">{stat.number}</div>
                <div className="text-muted-foreground font-cairo mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-cairo mb-4">
              خدماتنا المتنوعة
            </h2>
            <p className="text-xl text-muted-foreground font-cairo max-w-2xl mx-auto">
              نقدم مجموعة واسعة من الخدمات المنزلية والمكتبية بجودة عالية وأسعار مناسبة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle className="font-cairo text-xl">{service.name}</CardTitle>
                  <CardDescription className="font-cairo">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-sm text-muted-foreground font-cairo mb-4">
                    {service.providers} مزود خدمة متاح
                  </div>
                  <Button variant="outline" className="w-full font-cairo">
                    ابحث الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-cairo mb-4">
              لماذا تختار Naafe؟
            </h2>
            <p className="text-xl text-muted-foreground font-cairo max-w-2xl mx-auto">
              نتميز بالجودة والموثوقية والأمان في جميع خدماتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-background">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold font-cairo mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground font-cairo">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground font-cairo mb-4">
            ابدأ رحلتك مع Naafe اليوم
          </h2>
          <p className="text-xl text-primary-foreground/90 font-cairo mb-8 max-w-2xl mx-auto">
            انضم إلى آلاف العملاء الراضين واحصل على أفضل الخدمات من مزودين موثقين
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-cairo text-lg px-8 py-6">
              <Search className="mr-2 h-5 w-5" />
              ابحث عن خدمة
            </Button>
            <Button size="lg" variant="outline" className="font-cairo text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Users className="mr-2 h-5 w-5" />
              كن مزود خدمة
            </Button>
          </div>

          <div className="flex justify-center space-x-8 mt-8">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
              <Phone className="mr-2 h-4 w-4" />
              اتصل بنا
            </Button>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/20">
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
