import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ColorTest() {
  return (
    <div className="p-8 space-y-6" dir="rtl">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-cairo">اختبار الألوان</h1>
        <p className="text-muted-foreground font-cairo">اختبار نظام الألوان الجديد</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Background Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">ألوان الخلفية</CardTitle>
            <CardDescription className="font-cairo">اختبار ألوان الخلفية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-12 bg-background border rounded flex items-center justify-center">
              <span className="text-foreground font-cairo">خلفية</span>
            </div>
            <div className="h-12 bg-card border rounded flex items-center justify-center">
              <span className="text-card-foreground font-cairo">بطاقة</span>
            </div>
            <div className="h-12 bg-muted rounded flex items-center justify-center">
              <span className="text-muted-foreground font-cairo">صامت</span>
            </div>
          </CardContent>
        </Card>

        {/* Primary Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الألوان الأساسية</CardTitle>
            <CardDescription className="font-cairo">اختبار الألوان الأساسية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-12 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-cairo font-semibold">أساسي</span>
            </div>
            <div className="h-12 bg-secondary rounded flex items-center justify-center">
              <span className="text-secondary-foreground font-cairo font-semibold">ثانوي</span>
            </div>
            <div className="h-12 bg-accent rounded flex items-center justify-center">
              <span className="text-accent-foreground font-cairo font-semibold">تأكيد</span>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الأزرار</CardTitle>
            <CardDescription className="font-cairo">اختبار أزرار مختلفة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full font-cairo">زر أساسي</Button>
            <Button variant="secondary" className="w-full font-cairo">زر ثانوي</Button>
            <Button variant="outline" className="w-full font-cairo">زر إطار</Button>
            <Button variant="ghost" className="w-full font-cairo">زر شفاف</Button>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">ألوان النصوص</CardTitle>
            <CardDescription className="font-cairo">اختبار ألوان النصوص</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground font-cairo">نص عادي</p>
            <p className="text-muted-foreground font-cairo">نص صامت</p>
            <p className="text-primary font-cairo">نص أساسي</p>
            <p className="text-secondary font-cairo">نص ثانوي</p>
            <p className="text-accent font-cairo">نص تأكيد</p>
          </CardContent>
        </Card>

        {/* Semantic Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الألوان الدلالية</CardTitle>
            <CardDescription className="font-cairo">اختبار الألوان الدلالية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-8 bg-success rounded flex items-center justify-center">
              <span className="text-success-foreground text-sm font-cairo">نجح</span>
            </div>
            <div className="h-8 bg-warning rounded flex items-center justify-center">
              <span className="text-warning-foreground text-sm font-cairo">تحذير</span>
            </div>
            <div className="h-8 bg-destructive rounded flex items-center justify-center">
              <span className="text-destructive-foreground text-sm font-cairo">خطأ</span>
            </div>
          </CardContent>
        </Card>

        {/* Borders */}
        <Card>
          <CardHeader>
            <CardTitle className="font-cairo">الحدود</CardTitle>
            <CardDescription className="font-cairo">اختبار ألوان الحدود</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-8 border border-border rounded flex items-center justify-center">
              <span className="text-foreground text-sm font-cairo">حدود عادية</span>
            </div>
            <div className="h-8 border-2 border-primary rounded flex items-center justify-center">
              <span className="text-primary text-sm font-cairo">حدود أساسية</span>
            </div>
            <div className="h-8 border-2 border-destructive rounded flex items-center justify-center">
              <span className="text-destructive text-sm font-cairo">حدود خطأ</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
