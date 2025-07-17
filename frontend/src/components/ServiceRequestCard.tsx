import { MapPin, DollarSign, Clock, User, Calendar } from 'lucide-react';
import BaseCard from './ui/BaseCard';
import Button from './ui/Button';
import PremiumBadge from './ui/PremiumBadge';
import { ServiceRequest } from '../types';
import { translateLocation } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onInterested: (requestId: string) => void;
  onViewDetails: (requestId: string) => void;
  alreadyApplied?: boolean;
}

const ServiceRequestCard = ({ request, onInterested, onViewDetails, alreadyApplied }: ServiceRequestCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <BaseCard className={`
      hover:shadow-md border-l-4 border-l-blue-500 transition-all duration-300
      ${request.postedBy.isPremium 
        ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 shadow-xl hover:shadow-2xl relative overflow-hidden' 
        : 'border border-gray-200'
      }
    `}>
      {request.postedBy.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 pointer-events-none"></div>
      )}
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0 relative">
          <img
            src={request.postedBy.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'}
            alt={`${request.postedBy.name} profile`}
            className={`w-16 h-16 rounded-full object-cover ${
              request.postedBy.isPremium ? 'ring-2 ring-yellow-300' : ''
            }`}
          />
          {request.postedBy.isPremium && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <PremiumBadge size="sm" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h3 className="text-lg font-semibold text-text-primary text-right order-1 sm:order-1 sm:flex-1 sm:pr-3">
              {request.title}
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0 order-2 sm:order-2">
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(request.status)}`}>
                {request.status === 'open' ? 'مفتوح' : request.status === 'accepted' ? 'مقبول' : 'مغلق'}
              </span>
              {request.urgency && (
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency === 'high' ? 'عاجل' : request.urgency === 'medium' ? 'متوسط' : 'منخفض'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-right">
            <User className="h-4 w-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary">
              {request.postedBy.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-right">
            <MapPin className="h-4 w-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary">
              {translateLocation(request.location)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-2 text-right">
            <DollarSign className="h-4 w-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary">
              الميزانية: {request.budget.min} - {request.budget.max} جنيه
            </span>
          </div>
          
          {request.preferredDate && (
            <div className="flex items-center gap-2 mb-3 text-right">
              <Calendar className="h-4 w-4 text-text-secondary flex-shrink-0" />
              <span className="text-sm text-text-secondary">
                التاريخ المفضل: {formatDate(request.preferredDate)}
              </span>
            </div>
          )}
          
          <p className="text-sm text-text-secondary mb-4 text-right leading-relaxed">
            {request.description}
          </p>

          <div className="flex items-center gap-2 mb-2 text-right">
            <Clock className="h-4 w-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary">
              منذ {formatDate(request.createdAt)}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              {/* Clock icon is already used for the date, so no need to add it here */}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 min-w-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/requests/${request.id}`)}
                  className="w-full px-4"
              >
                عرض التفاصيل
              </Button>
              </div>
              <div className="flex-1 min-w-0">
              {request.status === 'open' && (
                  user && user.roles.includes('provider') ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/requests/${request.id}/respond`)}
                      className="w-full"
                      disabled={alreadyApplied}
                      title={alreadyApplied ? 'لقد قدمت عرضاً بالفعل لهذا الطلب' : undefined}
                    >
                      {alreadyApplied ? 'تم التقديم' : 'أنا مهتم'}
                    </Button>
                  ) : (
                    <Tippy
                      content={<span className="font-jakarta text-xs">يجب أن تكون مقدم خدمات للتقديم على هذا الطلب</span>}
                      placement="top"
                      arrow={true}
                      theme="light-border"
                      appendTo={document.body}
                      delay={[0, 0]}
                      zIndex={9999}
                    >
                      <div className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full cursor-not-allowed truncate"
                          disabled
                        >
                          للمقدمين فقط
                </Button>
                      </div>
                    </Tippy>
                  )
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ServiceRequestCard; 