
import { MapPin, DollarSign } from 'lucide-react';
import BaseCard from './ui/BaseCard';
import RatingDisplay from './ui/RatingDisplay';
import Button from './ui/Button';
import PremiumBadge from './ui/PremiumBadge';
import TopRatedBadge from './ui/TopRatedBadge';
import { translateCategory, translateLocation } from '../utils/helpers';
import { ServiceProvider } from '../types';

interface ServiceCardProps {
  provider: ServiceProvider;
  onViewDetails: (providerId: string) => void;
}

const ServiceCard = ({ provider, onViewDetails }: ServiceCardProps) => {
  return (
    <BaseCard className={`
      hover:shadow-md transition-all duration-300
      ${provider.isPremium 
        ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 shadow-xl hover:shadow-2xl relative overflow-hidden' 
        : 'border border-gray-200'
      }
      ${provider.isTopRated ? 'ring-2 ring-teal-300 shadow-lg' : ''}
      ${provider.isPremium && provider.isTopRated ? 'ring-2 ring-teal-300 shadow-2xl' : ''}
    `}>
      {provider.isPremium && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 pointer-events-none"></div>
      )}
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0 relative">
          <img
            src={provider.imageUrl}
            alt={`${provider.name} profile`}
            className={`w-16 h-16 rounded-full object-cover ${
              provider.isPremium ? 'ring-2 ring-yellow-300' : ''
            }`}
          />
          {provider.isPremium && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <PremiumBadge size="sm" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <h3 className="text-lg font-semibold text-text-primary text-right order-1 sm:order-1 sm:flex-1 sm:pr-3">
              {provider.name}
            </h3>
            <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0 order-2 sm:order-2">
              {provider.isTopRated && (
                <TopRatedBadge size="sm" />
              )}
              <span className="text-xs sm:text-sm text-text-secondary bg-light-cream px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
                {translateCategory(provider.category)}
              </span>
            </div>
          </div>
          
          <div className="mb-3">
            <RatingDisplay rating={provider.rating} />
          </div>
          
          <div className="flex items-center gap-2 mb-3 text-right">
            <MapPin className="h-4 w-4 text-text-secondary flex-shrink-0" />
            <span className="text-sm text-text-secondary">
              {translateLocation(provider.location)}
            </span>
          </div>
          
          <p className="text-sm text-text-secondary mb-4 text-right leading-relaxed">
            {provider.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-bright-orange flex-shrink-0" />
              <span className="text-sm font-medium text-text-primary">
                يبدأ من {provider.startingPrice} جنيه
              </span>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              onClick={() => onViewDetails(provider.id)}
              className="w-full sm:w-auto"
            >
              عرض التفاصيل
            </Button>
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

export default ServiceCard; 