import React from 'react';
import { Calendar, Clock, MessageCircle, Star } from 'lucide-react';
import Badge from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';

interface Response {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price: number;
  specialties: string[];
  verified?: boolean;
  message?: string;
  estimatedTimeDays?: number;
  availableDates?: string[];
  timePreferences?: string[];
  createdAt?: string;
  jobRequestSeekerId?: string; // Added this field to check if the user is the seeker
}

interface ResponsesSectionProps {
  responses: Response[];
  onOfferAdded?: (newOffer: Response) => void;
  onOffersRefresh?: () => Promise<void>;
}

const ResponsesSection: React.FC<ResponsesSectionProps> = ({ 
  responses, 
  onOfferAdded, 
  onOffersRefresh 
}) => {
  const { user, accessToken } = useAuth();
  if (!responses || responses.length === 0) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimePreferenceLabel = (pref: string) => {
    switch (pref) {
      case 'morning': return 'صباحاً';
      case 'afternoon': return 'ظهراً';
      case 'evening': return 'مساءً';
      case 'flexible': return 'مرن';
      default: return pref;
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refresh offers to show updated status
        if (onOffersRefresh) {
          await onOffersRefresh();
        }
        alert('تم قبول العرض بنجاح');
      } else {
        alert(data.error?.message || 'فشل في قبول العرض');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('حدث خطأ أثناء قبول العرض');
    }
  };

  const handleRejectOffer = async (offerId: string) => {
    if (!accessToken) return;
    
    try {
      const response = await fetch(`/api/offers/${offerId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // Refresh offers to show updated status
        if (onOffersRefresh) {
          await onOffersRefresh();
        }
        alert('تم رفض العرض بنجاح');
      } else {
        alert(data.error?.message || 'فشل في رفض العرض');
      }
    } catch (error) {
      console.error('Error rejecting offer:', error);
      alert('حدث خطأ أثناء رفض العرض');
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 text-right text-deep-teal">العروض المقدمة ({responses.length})</h2>
      <div className="space-y-4">
        {responses.map((resp) => (
          <div key={resp.id} className="bg-white rounded-lg shadow-lg p-6 border border-deep-teal/10">
            {/* Provider Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={resp.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"}
                alt={resp.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-deep-teal/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-deep-teal">{resp.name}</h3>
                  {resp.verified && (
                    <Badge variant="top-rated" size="sm">
                      موثوق
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-deep-teal">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{resp.rating} ({resp.specialties.length} تخصص)</span>
                  </div>
                  <div className="font-semibold text-deep-teal">
                    {resp.price} جنيه
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            {resp.specialties.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-deep-teal mb-2">التخصصات:</p>
                <div className="flex flex-wrap gap-2">
                  {resp.specialties.map((specialty, index) => (
                    <Badge key={index} variant="category" size="sm">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Message */}
            {resp.message && (
              <div className="mb-4 p-3 bg-warm-cream rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-deep-teal" />
                  <span className="text-sm font-medium text-deep-teal">الرسالة:</span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed">{resp.message}</p>
              </div>
            )}

            {/* Availability Information */}
            {((resp.availableDates && resp.availableDates.length > 0) || (resp.timePreferences && resp.timePreferences.length > 0)) && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-deep-teal mb-3">التواريخ والأوقات المتاحة:</h4>
                
                {/* Available Dates */}
                {resp.availableDates && resp.availableDates.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-deep-teal" />
                      <span className="text-sm font-medium text-deep-teal">التواريخ المتاحة:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resp.availableDates.slice(0, 5).map((date, index) => (
                        <Badge key={index} variant="category" size="sm">
                          {formatDate(date)}
                        </Badge>
                      ))}
                      {resp.availableDates.length > 5 && (
                        <Badge variant="category" size="sm">
                          +{resp.availableDates.length - 5} أكثر
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Time Preferences */}
                {resp.timePreferences && resp.timePreferences.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-deep-teal" />
                      <span className="text-sm font-medium text-deep-teal">تفضيلات الوقت:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resp.timePreferences.map((pref, index) => (
                        <Badge key={index} variant="category" size="sm">
                          {getTimePreferenceLabel(pref)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estimated Time */}
                {resp.estimatedTimeDays && (
                  <div className="text-sm text-deep-teal">
                    <span className="font-medium">المدة المتوقعة:</span> {resp.estimatedTimeDays} يوم
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {user && user._id === resp.jobRequestSeekerId && (
              <div className="flex gap-3 pt-4 border-t border-deep-teal/10">
                <button 
                  onClick={() => handleAcceptOffer(resp.id)}
                  className="flex-1 bg-deep-teal text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium shadow"
                >
                  قبول العرض
                </button>
                <button 
                  onClick={() => handleRejectOffer(resp.id)}
                  className="flex-1 bg-warm-cream text-deep-teal py-2 px-4 rounded-lg hover:bg-deep-teal/10 transition-colors font-medium border border-deep-teal/20"
                >
                  رفض العرض
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsesSection; 