import React from 'react';
import { Users, Wrench, DollarSign, CheckCircle, Plus, AlertTriangle } from 'lucide-react';
import SummaryCard from '../components/UI/SummaryCard';
import { ActivityItem } from '../types';

const AdminOverview: React.FC = () => {
  const summaryData = [
    {
      title: "إجمالي المستخدمين",
      value: "12,548",
      icon: Users,
      iconColor: "text-soft-teal"
    },
    {
      title: "الخدمات النشطة", 
      value: "3,492",
      icon: Wrench,
      iconColor: "text-soft-teal"
    },
    {
      title: "الإيرادات (شهرياً)",
      value: "EGP 150,320",
      icon: DollarSign,
      iconColor: "text-soft-teal"
    }
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'user_signup',
      message: 'تسجيل جديد للمستخدم: أحمد محمود',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      icon: 'CheckCircle',
      color: 'bg-green-500'
    },
    {
      id: '2',
      type: 'service_posted',
      message: 'تم نشر خدمة جديدة: تنظيف المنزل في الزمالك',
      timestamp: new Date(Date.now() - 32 * 60 * 1000),
      icon: 'Plus',
      color: 'bg-bright-orange'
    },
    {
      id: '3',
      type: 'report_flagged',
      message: 'تم تحذير التقرير: محتوى غير مناسب على الخدمة #4521',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: 'AlertTriangle',
      color: 'bg-bright-orange'
    }
  ];

  const formatTime = (timestamp: Date) => {
    const diff = Date.now() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} ساعة سابقاً`;
    }
    return `${minutes} دقيقة سابقاً`;
  };

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'Plus':
        return <Plus className="h-5 w-5 text-white" />;
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <CheckCircle className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-deep-teal">نظرة عامة</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            iconColor={item.iconColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-3 bg-light-cream rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-deep-teal mb-4">نمو المستخدمين</h3>
          <div className="h-64 flex items-center justify-center">
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 500 200"
            >
              <defs>
                <linearGradient id="userGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2D5D4F" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2D5D4F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 150 C 50 120, 100 80, 150 100 S 250 180, 300 140 S 400 20, 450 50 L 500 60 L 500 200 L 0 200 Z"
                fill="url(#userGradient)"
              />
              <path
                d="M 0 150 C 50 120, 100 80, 150 100 S 250 180, 300 140 S 400 20, 450 50 L 500 60"
                fill="none"
                stroke="#2D5D4F"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Service Categories Chart */}
        <div className="lg:col-span-2 bg-light-cream rounded-2xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-deep-teal mb-4">فئات الخدمات</h3>
          <div className="h-64 flex items-center justify-center">
            <svg className="w-40 h-40" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#F5A623"
                strokeWidth="20"
                strokeDasharray="282.74 628.32"
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#50958A"
                strokeWidth="20"
                strokeDasharray="188.49 628.32"
                transform="rotate(72 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#2D5D4F"
                strokeWidth="20"
                strokeDasharray="157.08 628.32"
                transform="rotate(180 100 100)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-light-cream rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-deep-teal mb-4">النشاطات الأخيرة</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Timeline line */}
              {index < recentActivity.length - 1 && (
                <div className="absolute left-8 top-12 w-0.5 h-8 bg-warm-cream z-0" />
              )}
              
              {/* Activity icon */}
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${activity.color} relative z-10`}>
                {getActivityIcon(activity.icon)}
              </div>

              {/* Activity content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-deep-teal">
                    {activity.message}
                  </p>
                  <time className="text-sm text-soft-teal whitespace-nowrap">
                    {formatTime(activity.timestamp)}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;