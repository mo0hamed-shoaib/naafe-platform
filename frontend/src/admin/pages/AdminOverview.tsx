import React from 'react';
import { Users, Wrench, DollarSign, CheckCircle, Plus, AlertTriangle, TrendingUp, TrendingDown, BarChart3, PieChart, Clock, MessageSquare, FileText } from 'lucide-react';
import { ActivityItem } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../components/UI/Breadcrumb';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// API functions
const fetchDashboardStats = async (token: string | null) => {
  const res = await fetch('/api/admin/stats', {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('فشل تحميل إحصائيات لوحة التحكم');
  const json = await res.json();
  if (!json.success || !json.data) throw new Error('الاستجابة من الخادم غير متوقعة');
  return json.data;
};

const AdminOverview: React.FC = () => {
  const { accessToken } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats', accessToken],
    queryFn: () => fetchDashboardStats(accessToken),
    enabled: !!accessToken,
  });

  const summaryData = [
    {
      title: "إجمالي المستخدمين",
      value: stats?.totalUsers?.toLocaleString() || "0",
      icon: Users,
      iconColor: "text-soft-teal",
      change: stats?.userGrowth || 0,
      changeType: stats?.userGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "الخدمات النشطة", 
      value: stats?.activeServices?.toLocaleString() || "0",
      icon: Wrench,
      iconColor: "text-soft-teal",
      change: stats?.serviceGrowth || 0,
      changeType: stats?.serviceGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "طلبات الخدمة النشطة",
      value: stats?.activeRequests?.toLocaleString() || "0",
      icon: FileText,
      iconColor: "text-soft-teal",
      change: stats?.requestGrowth || 0,
      changeType: stats?.requestGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "الإيرادات (شهرياً)",
      value: `EGP ${stats?.monthlyRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      iconColor: "text-soft-teal",
      change: stats?.revenueGrowth || 0,
      changeType: stats?.revenueGrowth > 0 ? 'increase' : 'decrease'
    },
    {
      title: "البلاغات المعلقة",
      value: stats?.pendingComplaints?.toLocaleString() || "0",
      icon: MessageSquare,
      iconColor: "text-red-500",
      change: 0,
      changeType: 'neutral'
    }
  ];

  // Chart data for user growth
  const userGrowthData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'المستخدمين الجدد',
        data: [120, 190, 300, 500, 200, 300],
        borderColor: '#2D5D4F',
        backgroundColor: 'rgba(45, 93, 79, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart data for service categories
  const serviceCategoriesData = {
    labels: ['سباكة', 'كهرباء', 'تنظيف', 'حدائق', 'تصميم', 'أخرى'],
    datasets: [
      {
        data: [30, 25, 20, 15, 8, 2],
        backgroundColor: [
          '#2D5D4F',
          '#F5A623',
          '#50958A',
          '#8BC34A',
          '#FF9800',
          '#9C27B0',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  // Chart data for revenue
  const revenueData = {
    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
    datasets: [
      {
        label: 'الإيرادات الشهرية',
        data: [15000, 25000, 18000, 32000, 28000, 35000],
        backgroundColor: 'rgba(245, 166, 35, 0.8)',
        borderColor: '#F5A623',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Cairo',
            size: 12,
          },
          color: '#2D5D4F',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(45, 93, 79, 0.1)',
        },
        ticks: {
          font: {
            family: 'Cairo',
            size: 10,
          },
          color: '#2D5D4F',
        },
      },
      x: {
        grid: {
          color: 'rgba(45, 93, 79, 0.1)',
        },
        ticks: {
          font: {
            family: 'Cairo',
            size: 10,
          },
          color: '#2D5D4F',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Cairo',
            size: 11,
          },
          color: '#2D5D4F',
          usePointStyle: true,
        },
      },
    },
  };

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

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-lg text-deep-teal">جاري التحميل...</div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb items={[{ label: 'لوحة التحكم' }]} />
      <h2 className="text-4xl font-bold text-deep-teal">نظرة عامة</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className="bg-light-cream rounded-2xl p-8 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-[#f5a623]/10">
                  <item.icon className="h-7 w-7 text-[#f5a623]" />
                </div>
                <span className="text-lg font-bold text-[#1a3d32]">{item.title}</span>
              </div>
              {item.change !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(item.change)}%</span>
                </div>
              )}
            </div>
            <p className="text-3xl font-extrabold text-[#1a3d32] mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-3 bg-light-cream rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-[#2D5D4F]/10">
              <BarChart3 className="h-7 w-7 text-[#2D5D4F]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a3d32]">نمو المستخدمين</h3>
          </div>
          <div className="h-64">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Service Categories Chart */}
        <div className="lg:col-span-2 bg-light-cream rounded-2xl p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-[#f5a623]/10">
              <PieChart className="h-7 w-7 text-[#f5a623]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1a3d32]">فئات الخدمات</h3>
          </div>
          <div className="h-64">
            <Doughnut data={serviceCategoriesData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-light-cream rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-[#50958A]/10">
            <DollarSign className="h-7 w-7 text-[#50958A]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a3d32]">الإيرادات الشهرية</h3>
        </div>
        <div className="h-64">
          <Bar data={revenueData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-light-cream rounded-2xl p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-[#F5A623]/10">
            <Clock className="h-7 w-7 text-[#F5A623]" />
          </div>
          <h3 className="text-2xl font-bold text-[#1a3d32]">النشاط الأخير</h3>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className={`p-2 rounded-full ${activity.color}`}>
                {getActivityIcon(activity.icon)}
              </div>
              <div className="flex-1">
                <p className="text-[#1a3d32] font-medium">{activity.message}</p>
                <p className="text-[#50958A] text-sm">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;