import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"

export function ThemeTest() {
  return (
    <div className="p-8 space-y-6" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-cairo">اختبار نظام الألوان</h1>
        <p className="text-muted-foreground font-cairo">تحقق من عمل نظام الألوان في الوضعين الفاتح والداكن</p>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الألوان الأساسية</CardTitle>
            <CardDescription className="font-cairo">الألوان الرئيسية للمنصة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-cairo font-semibold">أساسي</span>
              </div>
              <div className="h-12 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-secondary-foreground font-cairo font-semibold">ثانوي</span>
              </div>
              <div className="h-12 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-cairo font-semibold">تأكيد</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semantic Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الألوان الدلالية</CardTitle>
            <CardDescription className="font-cairo">ألوان الحالات المختلفة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="default" className="w-full justify-center font-cairo">نجح</Badge>
              <Badge variant="secondary" className="w-full justify-center font-cairo">تحذير</Badge>
              <Badge variant="destructive" className="w-full justify-center font-cairo">خطأ</Badge>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-success rounded flex items-center justify-center">
                <span className="text-success-foreground text-sm font-cairo">نجح</span>
              </div>
              <div className="h-8 bg-warning rounded flex items-center justify-center">
                <span className="text-warning-foreground text-sm font-cairo">تحذير</span>
              </div>
              <div className="h-8 bg-destructive rounded flex items-center justify-center">
                <span className="text-destructive-foreground text-sm font-cairo">خطأ</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">العناصر التفاعلية</CardTitle>
            <CardDescription className="font-cairo">الأزرار والروابط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button className="w-full font-cairo">زر أساسي</Button>
              <Button variant="secondary" className="w-full font-cairo">زر ثانوي</Button>
              <Button variant="outline" className="w-full font-cairo">زر إطار</Button>
              <Button variant="ghost" className="w-full font-cairo">زر شفاف</Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">ألوان الخلفية</CardTitle>
            <CardDescription className="font-cairo">خلفيات العناصر المختلفة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-background border rounded flex items-center justify-center">
                <span className="text-foreground text-sm font-cairo">خلفية</span>
              </div>
              <div className="h-8 bg-card border rounded flex items-center justify-center">
                <span className="text-card-foreground text-sm font-cairo">بطاقة</span>
              </div>
              <div className="h-8 bg-muted rounded flex items-center justify-center">
                <span className="text-muted-foreground text-sm font-cairo">صامت</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">ألوان النصوص</CardTitle>
            <CardDescription className="font-cairo">ألوان النصوص المختلفة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-foreground font-cairo">نص عادي</p>
              <p className="text-muted-foreground font-cairo">نص صامت</p>
              <p className="text-primary font-cairo">نص أساسي</p>
              <p className="text-secondary font-cairo">نص ثانوي</p>
              <p className="text-accent font-cairo">نص تأكيد</p>
            </div>
          </CardContent>
        </Card>

        {/* Borders */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الحدود</CardTitle>
            <CardDescription className="font-cairo">ألوان الحدود</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-8 border border-border rounded flex items-center justify-center">
                <span className="text-foreground text-sm font-cairo">حدود عادية</span>
              </div>
              <div className="h-8 border-2 border-primary rounded flex items-center justify-center">
                <span className="text-primary text-sm font-cairo">حدود أساسية</span>
              </div>
              <div className="h-8 border-2 border-destructive rounded flex items-center justify-center">
                <span className="text-destructive text-sm font-cairo">حدود خطأ</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
