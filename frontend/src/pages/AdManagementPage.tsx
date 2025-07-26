import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface Ad {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  status: 'pending' | 'active' | 'paused' | 'cancelled' | 'rejected';
  placement: {
    location: string;
    type: string;
  };
  budget: {
    total: number;
    spent: number;
    currency: string;
  };
  startDate: string;
  endDate: string;
  duration: string;
  performance: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
  createdAt: string;
}

const AdManagementPage: React.FC = () => {
  const { user, accessToken } = useAuth();
  const { showToast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingAd, setCancellingAd] = useState<string | null>(null);

  useEffect(() => {
    fetchUserAds();
  }, []);

  const fetchUserAds = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ads/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAds(data.data || []);
      } else {
        showToast('error', 'فشل في تحميل الإعلانات');
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      showToast('error', 'فشل في تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAd = async (adId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الإعلان؟')) {
      return;
    }

    try {
      setCancellingAd(adId);
      const response = await fetch(`/api/ads/${adId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast('success', 'تم إلغاء الإعلان بنجاح');
        fetchUserAds(); // Refresh the list
      } else {
        showToast('error', data.error?.message || 'فشل في إلغاء الإعلان');
      }
    } catch (error) {
      console.error('Error cancelling ad:', error);
      showToast('error', 'فشل في إلغاء الإعلان');
    } finally {
      setCancellingAd(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'نشط' };
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'في الانتظار' };
      case 'paused':
        return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', text: 'متوقف مؤقتاً' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'ملغي' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'مرفوض' };
      default:
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100', text: 'غير محدد' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'إدارة الإعلانات', active: true },
  ];

  if (loading) {
    return (
      <PageLayout
        title="إدارة الإعلانات"
        subtitle="عرض وإدارة إعلاناتك"
        breadcrumbItems={breadcrumbItems}
        user={user}
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="إدارة الإعلانات"
      subtitle="عرض وإدارة إعلاناتك"
      breadcrumbItems={breadcrumbItems}
      user={user}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <BaseCard className="p-4 text-center">
            <div className="text-2xl font-bold text-deep-teal">{ads.length}</div>
            <div className="text-sm text-text-secondary">إجمالي الإعلانات</div>
          </BaseCard>
          <BaseCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {ads.filter(ad => ad.status === 'active').length}
            </div>
            <div className="text-sm text-text-secondary">إعلانات نشطة</div>
          </BaseCard>
          <BaseCard className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {ads.reduce((total, ad) => total + ad.performance.impressions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">إجمالي المشاهدات</div>
          </BaseCard>
          <BaseCard className="p-4 text-center">
            <div className="text-2xl font-bold text-deep-teal">
              {ads.reduce((total, ad) => total + ad.performance.clicks, 0).toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">إجمالي النقرات</div>
          </BaseCard>
        </div>

        {/* Ads List */}
        {ads.length === 0 ? (
          <BaseCard className="p-8 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-deep-teal mb-2">لا توجد إعلانات</h3>
            <p className="text-text-secondary mb-4">لم تقم بإنشاء أي إعلانات بعد</p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/advertise'}
            >
              إنشاء إعلان جديد
            </Button>
          </BaseCard>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => {
              const statusInfo = getStatusInfo(ad.status);
              const StatusIcon = statusInfo.icon;
              const remainingDays = calculateRemainingDays(ad.endDate);

              return (
                <BaseCard key={ad._id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Ad Image */}
                    <div className="lg:w-1/4">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">لا توجد صورة</span>
                        </div>
                      )}
                    </div>

                    {/* Ad Details */}
                    <div className="lg:w-2/4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-deep-teal mb-1">{ad.title}</h3>
                          <p className="text-text-secondary text-sm mb-2">{ad.description}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusInfo.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                          <span className={statusInfo.color}>{statusInfo.text}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-deep-teal" />
                          <span className="text-text-secondary">
                            {ad.placement.location} - {ad.placement.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-deep-teal" />
                          <span className="text-text-secondary">
                            {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-deep-teal" />
                          <span className="text-text-secondary">
                            {ad.budget.total} {ad.budget.currency}
                          </span>
                        </div>
                        {remainingDays > 0 && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="text-accent font-semibold">
                              {remainingDays} يوم متبقي
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Eye className="w-4 h-4 text-deep-teal" />
                            <span className="font-bold text-deep-teal">
                              {ad.performance.impressions.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-text-secondary">مشاهدات</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <MousePointer className="w-4 h-4 text-accent" />
                            <span className="font-bold text-accent">
                              {ad.performance.clicks.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-text-secondary">نقرات</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-bold text-green-600">
                              {ad.performance.ctr.toFixed(2)}%
                            </span>
                          </div>
                          <span className="text-xs text-text-secondary">معدل النقر</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-1/4 flex flex-col gap-2">
                      {ad.status === 'active' && remainingDays > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelAd(ad._id)}
                          disabled={cancellingAd === ad._id}
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          {cancellingAd === ad._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          إلغاء الإعلان
                        </Button>
                      )}
                      
                      {ad.targetUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(ad.targetUrl, '_blank')}
                          className="text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white"
                        >
                          عرض الرابط
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.location.href = '/advertise'}
                        className="text-deep-teal hover:bg-deep-teal/10"
                      >
                        إنشاء إعلان جديد
                      </Button>
                    </div>
                  </div>
                </BaseCard>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdManagementPage; 