import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Sun, 
  Lock, 
  Settings as SettingsIcon,
  Eye,
  Key,
  Download,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone,
  Megaphone
} from 'lucide-react';
import { FormInput, FormTextarea } from "../components/ui";
import Header from '../components/Header';
import Footer from '../components/Footer';
import SettingsNavigation from '../components/settings/SettingsNavigation';
import SettingsSection from '../components/settings/SettingsSection';
import SettingsCard from '../components/settings/SettingsCard';
import SettingsToggle from '../components/settings/SettingsToggle';
import { useAuth } from '../contexts/AuthContext';

interface UserSettings {
  notifications: {
    app: boolean;
    email: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showPhone: boolean;
    showEmail: boolean;
    allowMessages: boolean;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
    language: 'ar' | 'en';
  };
  account: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    dataRetention: 'indefinite' | '1year' | '6months';
  };
}

const SettingsPage: React.FC = () => {
  const { user, accessToken } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      app: true,
      email: false,
      sms: false,
      marketing: false
    },
    privacy: {
      profileVisibility: 'public',
      showPhone: false,
      showEmail: false,
      allowMessages: true
    },
    theme: {
      mode: 'system',
      language: 'ar'
    },
    account: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      dataRetention: 'indefinite'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigationItems = [
    { 
      id: 'account', 
      label: 'معلومات الحساب', 
      icon: User,
      description: 'تحديث المعلومات الشخصية'
    },
    { 
      id: 'verification', 
      label: 'مركز التحقق', 
      icon: Shield,
      description: 'التحقق من الهوية'
    },
    { 
      id: 'notifications', 
      label: 'إعدادات الإشعارات', 
      icon: Bell,
      description: 'تخصيص الإشعارات'
    },
    { 
      id: 'theme', 
      label: 'المظهر', 
      icon: Sun,
      description: 'اختيار المظهر واللغة'
    },
    { 
      id: 'privacy', 
      label: 'إعدادات الخصوصية', 
      icon: Lock,
      description: 'التحكم في الخصوصية'
    },
    { 
      id: 'management', 
      label: 'إدارة الحساب', 
      icon: SettingsIcon,
      description: 'الأمان والبيانات'
    },
  ];

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSettings(data.data.settings);
        }
      } catch {
        console.error('Error fetching settings');
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchSettings();
    }
  }, [accessToken]);

  // Update settings
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.data.settings);
        setSuccess('تم تحديث الإعدادات بنجاح');
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'حدث خطأ أثناء تحديث الإعدادات');
      }
    } catch {
      setError('حدث خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  const renderAccountInformation = () => (
    <SettingsSection
      title="معلومات الحساب"
      description="تحديث معلوماتك الشخصية والتفاصيل الأساسية"
      icon={User}
    >
      <SettingsCard title="المعلومات الشخصية">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="fullName">
              الاسم الكامل
            </label>
            <FormInput
              id="fullName"
              type="text"
              label="الاسم الكامل"
              placeholder="أدخل اسمك الكامل"
              defaultValue={`${user?.name?.first || ''} ${user?.name?.last || ''}`}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="email">
              البريد الإلكتروني
            </label>
            <FormInput
              id="email"
              type="email"
              label="البريد الإلكتروني"
              placeholder="أدخل بريدك الإلكتروني"
              defaultValue={user?.email || ''}
              className="w-full"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="phone">
              رقم الهاتف
            </label>
            <FormInput
              id="phone"
              type="tel"
              label="رقم الهاتف"
              placeholder="أدخل رقم هاتفك"
              defaultValue={user?.phone || ''}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="bio">
              نبذة شخصية
            </label>
            <FormTextarea
              id="bio"
              label="نبذة شخصية"
              placeholder="اكتب نبذة عن نفسك"
              defaultValue={user?.profile?.bio || ''}
              className="w-full"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button 
            className="bg-deep-teal text-white font-semibold py-3 px-8 rounded-xl hover:bg-deep-teal/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'جاري التحديث...' : 'تحديث المعلومات'}
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderVerificationCenter = () => (
    <SettingsSection
      title="مركز التحقق"
      description="التحقق من هويتك لفتح الميزات الإضافية وزيادة الثقة"
      icon={Shield}
    >
      <SettingsCard title="التحقق من الهوية">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-deep-teal/5 to-bright-orange/5 border border-deep-teal/10">
          <div className="flex items-center gap-4">
            <div className="bg-deep-teal p-4 rounded-full text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-lg">التحقق من الهوية</h4>
              <p className="text-text-secondary mt-1">التحقق من هويتك لفتح الميزات الإضافية وبناء الثقة مع المستخدمين الآخرين.</p>
            </div>
          </div>
          <button className="bg-bright-orange text-white font-semibold py-3 px-6 rounded-xl hover:bg-bright-orange/90 transform hover:scale-105 transition-all duration-300 shadow-lg">
            تحقق الآن
          </button>
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderNotificationPreferences = () => (
    <SettingsSection
      title="إعدادات الإشعارات"
      description="تخصيص كيفية استلامك للتحديثات والإشعارات"
      icon={Bell}
    >
      <SettingsCard title="إعدادات التواصل">
        <div className="space-y-6">
          <SettingsToggle
            label="إشعارات التطبيق"
            description="استلام إشعارات للطلبات والتحديثات والعروض الترويجية"
            checked={settings.notifications.app}
            onChange={(checked) => updateSettings({ notifications: { ...settings.notifications, app: checked } })}
            icon={<Bell size={20} />}
          />
          
          <SettingsToggle
            label="إشعارات البريد الإلكتروني"
            description="استلام تحديثات البريد الإلكتروني حول حسابك والإعلانات"
            checked={settings.notifications.email}
            onChange={(checked) => updateSettings({ notifications: { ...settings.notifications, email: checked } })}
            icon={<Mail size={20} />}
          />
          
          <SettingsToggle
            label="إشعارات الرسائل النصية"
            description="استلام إشعارات مهمة عبر الرسائل النصية"
            checked={settings.notifications.sms}
            onChange={(checked) => updateSettings({ notifications: { ...settings.notifications, sms: checked } })}
            icon={<Smartphone size={20} />}
          />
          
          <SettingsToggle
            label="الإعلانات التسويقية"
            description="استلام عروض خاصة وأخبار عن الخدمات الجديدة"
            checked={settings.notifications.marketing}
            onChange={(checked) => updateSettings({ notifications: { ...settings.notifications, marketing: checked } })}
            icon={<Megaphone size={20} />}
          />
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderThemeSelection = () => (
    <SettingsSection
      title="المظهر"
      description="اختر المظهر المفضل لديك للحصول على أفضل تجربة بصرية"
      icon={Sun}
    >
      <SettingsCard title="المظهر واللغة">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-text-primary mb-4">المظهر</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { value: 'light', label: 'فاتح' },
                { value: 'dark', label: 'داكن' },
                { value: 'system', label: 'حسب النظام' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-deep-teal transition-all duration-300 bg-white">
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={settings.theme.mode === option.value}
                    onChange={(e) => updateSettings({ theme: { ...settings.theme, mode: e.target.value as 'light' | 'dark' | 'system' } })}
                    className="w-4 h-4 text-deep-teal focus:ring-deep-teal"
                  />
                  <span className="font-medium text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-text-primary mb-4">اللغة</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { value: 'ar', label: 'العربية' },
                { value: 'en', label: 'English' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-deep-teal transition-all duration-300 bg-white">
                  <input
                    type="radio"
                    name="language"
                    value={option.value}
                    checked={settings.theme.language === option.value}
                    onChange={(e) => updateSettings({ theme: { ...settings.theme, language: e.target.value as 'ar' | 'en' } })}
                    className="w-4 h-4 text-deep-teal focus:ring-deep-teal"
                  />
                  <span className="font-medium text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderPrivacySettings = () => (
    <SettingsSection
      title="إعدادات الخصوصية"
      description="التحكم في خصوصيتك وتفضيلات مشاركة البيانات"
      icon={Lock}
    >
      <SettingsCard title="التحكم في الخصوصية">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-deep-teal/10 p-3 rounded-full text-deep-teal">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">رؤية الملف الشخصي</h4>
                <p className="text-text-secondary text-sm mt-1">التحكم في من يمكنه رؤية معلومات ملفك الشخصي.</p>
              </div>
            </div>
            <select
              className="select select-bordered bg-white text-text-primary font-semibold focus:border-deep-teal focus:outline-none"
              value={settings.privacy.profileVisibility}
              onChange={(e) => updateSettings({ privacy: { ...settings.privacy, profileVisibility: e.target.value as 'public' | 'private' | 'friends' } })}
              aria-label="اختر مستوى رؤية الملف الشخصي"
            >
              <option value="public">عام</option>
              <option value="friends">الأصدقاء</option>
              <option value="private">خاص</option>
            </select>
          </div>
          
          <SettingsToggle
            label="إظهار رقم الهاتف"
            description="السماح للمستخدمين الآخرين برؤية رقم هاتفك"
            checked={settings.privacy.showPhone}
            onChange={(checked) => updateSettings({ privacy: { ...settings.privacy, showPhone: checked } })}
            icon={<Smartphone size={20} />}
          />
          
          <SettingsToggle
            label="إظهار البريد الإلكتروني"
            description="السماح للمستخدمين الآخرين برؤية بريدك الإلكتروني"
            checked={settings.privacy.showEmail}
            onChange={(checked) => updateSettings({ privacy: { ...settings.privacy, showEmail: checked } })}
            icon={<Mail size={20} />}
          />
          
          <SettingsToggle
            label="السماح بالرسائل"
            description="السماح للمستخدمين الآخرين بإرسال رسائل لك"
            checked={settings.privacy.allowMessages}
            onChange={(checked) => updateSettings({ privacy: { ...settings.privacy, allowMessages: checked } })}
            icon={<MessageSquare size={20} />}
          />
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderAccountManagement = () => (
    <SettingsSection
      title="إدارة الحساب"
      description="إدارة أمان حسابك وبياناتك"
      icon={SettingsIcon}
    >
      <SettingsCard title="الأمان والبيانات">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-deep-teal/10 p-3 rounded-full text-deep-teal">
                <Key size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">تغيير كلمة المرور</h4>
                <p className="text-text-secondary text-sm mt-1">حافظ على أمان حسابك بكلمة مرور قوية.</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white">
              تغيير
            </button>
          </div>
          
          <SettingsToggle
            label="المصادقة الثنائية"
            description="إضافة طبقة أمان إضافية لحسابك"
            checked={settings.account.twoFactorAuth}
            onChange={(checked) => updateSettings({ account: { ...settings.account, twoFactorAuth: checked } })}
            icon={<Shield size={20} />}
          />
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-deep-teal/10 p-3 rounded-full text-deep-teal">
                <Download size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary">تحميل بيانات الحساب</h4>
                <p className="text-text-secondary text-sm mt-1">احصل على نسخة من جميع بياناتك ونشاطك.</p>
              </div>
            </div>
            <button className="btn btn-outline btn-sm text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white">
              تحميل
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-red-800">حذف الحساب</h4>
                <p className="text-red-600 text-sm mt-1">حذف حسابك وبياناتك نهائياً.</p>
              </div>
            </div>
            <button className="btn btn-error btn-sm">
              حذف
            </button>
          </div>
        </div>
      </SettingsCard>
    </SettingsSection>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountInformation();
      case 'verification':
        return renderVerificationCenter();
      case 'notifications':
        return renderNotificationPreferences();
      case 'theme':
        return renderThemeSelection();
      case 'privacy':
        return renderPrivacySettings();
      case 'management':
        return renderAccountManagement();
      default:
        return renderAccountInformation();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream" dir="rtl">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-text-secondary">جاري التحميل...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream" dir="rtl">
      <Header />
      <div className="flex pt-20">
        <SettingsNavigation
          items={navigationItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">{success}</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}
            
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage; 