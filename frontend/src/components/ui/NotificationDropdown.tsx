import React from 'react';
import { NotificationItem } from './NotificationBell';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  notifications: NotificationItem[];
  onClose?: () => void;
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`;
  return date.toLocaleDateString('ar-EG');
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onClose }) => {
  const navigate = useNavigate();

  const handleViewAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
    // Use setTimeout to ensure the dropdown closes before navigation
    setTimeout(() => {
      navigate('/notifications');
    }, 100);
  };

  const handleChatClick = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
    // Navigate to chat page
    setTimeout(() => {
      navigate(`/chat/${chatId}`);
    }, 100);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer_accepted':
        return CheckCircle;
      case 'offer_received':
        return MessageCircle;
      case 'new_message':
        return MessageCircle;
      default:
        return AlertCircle;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'offer_accepted':
        return 'bg-green-50 text-green-600';
      case 'offer_received':
        return 'bg-blue-50 text-blue-600';
      case 'new_message':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div 
      className="w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-800">الإشعارات</h3>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="p-6 text-center text-gray-400">لا توجد إشعارات جديدة</div>
        )}
        
        {notifications.slice(0, 10).map((notif) => {
          const Icon = getNotificationIcon(notif.type);
          const iconColor = getNotificationColor(notif.type);
          
          return (
            <div
              key={notif._id}
              className={`flex items-start gap-4 p-4 hover:bg-gray-50/80 transition-colors duration-150 cursor-pointer ${!notif.isRead ? 'bg-gray-50' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-grow">
                <p className="text-sm text-gray-700">
                  {truncate(notif.message, 60)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{timeAgo(notif.createdAt)}</p>
              </div>
              
              {notif.relatedChatId && (
                <button
                  className="ml-auto bg-primary text-white rounded-lg text-xs px-3 py-1.5 font-medium hover:bg-opacity-90 transition-colors"
                  onClick={(e) => handleChatClick(e, notif.relatedChatId!)}
                  aria-label="افتح الدردشة"
                >
                  دردشة
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <button
        className="block w-full text-center py-3 text-primary font-medium text-sm hover:underline bg-gray-50/50 transition-colors"
        onClick={handleViewAllClick}
      >
        عرض كل الإشعارات
      </button>
    </div>
  );
};

export default NotificationDropdown; 