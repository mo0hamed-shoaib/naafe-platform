// Temporary fix for TypeScript module resolution
import React from 'react';
import ServiceGallery from './ServiceGallery.tsx';
import ServiceDetails from './ServiceDetails.tsx';
import RequesterInfo from './RequesterInfo.tsx';
import ResponsesSection from './ResponsesSection.tsx';
import CommentsSection from './CommentsSection.tsx';
import ServiceSidebar from './ServiceSidebar.tsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ServiceDetailsContainerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any; // TODO: type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offers: any[];
  onInterested?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
  onOfferAdded?: (newOffer: any) => void;
  onOffersRefresh?: () => Promise<void>;
}

const ServiceDetailsContainer: React.FC<ServiceDetailsContainerProps> = ({
  service,
  offers,
  onInterested,
  onShare,
  onBookmark,
  onReport,
  onOfferAdded,
  onOffersRefresh
}) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <ServiceGallery images={service.images} title={service.title} />
          <ServiceDetails service={service} />
          <RequesterInfo requester={service.requester} />
          <ResponsesSection 
            responses={offers} 
            onOfferAdded={onOfferAdded}
            onOffersRefresh={onOffersRefresh}
          />
          <CommentsSection comments={service.comments || []} />
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <ServiceSidebar
            service={service}
            onInterested={onInterested}
            onShare={onShare}
            onBookmark={onBookmark}
            onReport={onReport}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsContainer; 