import React from 'react';
import { Share2, Bookmark, Home, Car, Eye, Flag, ShieldCheck } from 'lucide-react';
import { ServiceRequest, SimilarService } from '../types/service';

interface ServiceSidebarProps {
  service: ServiceRequest;
  onInterested?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
}

const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  service,
  onInterested,
  onShare,
  onBookmark,
  onReport
}) => {
  const similarServices: SimilarService[] = [
    { id: '1', name: 'House Cleaning', icon: 'home' },
    { id: '2', name: 'Carpet Cleaning', icon: 'car' },
    { id: '3', name: 'Window Cleaning', icon: 'eye' },
  ];

  const IconComponent = ({ iconName }: { iconName: string }) => {
    switch (iconName) {
      case 'home': return <Home className="h-5 w-5" />;
      case 'car': return <Car className="h-5 w-5" />;
      case 'eye': return <Eye className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      {/* Action Buttons */}
      <div className="flex lg:hidden justify-end gap-2 mb-4">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={onShare}
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
        <button 
          className="btn btn-ghost btn-circle"
          onClick={onBookmark}
          aria-label="Bookmark"
        >
          <Bookmark className="h-5 w-5" />
        </button>
      </div>

      {/* Main Action Card */}
      <div className="card bg-base-100 shadow-lg rounded-2xl p-6">
        <button 
          className="btn btn-primary w-full mb-6 transition-all duration-300 hover:scale-105"
          onClick={onInterested}
        >
          I'm Interested
        </button>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-500">Category</span>
            <span className="text-sm font-medium text-deep-teal">{service.category}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-500">Posted</span>
            <span className="text-sm font-medium">{service.postedDate}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-500">Location Radius</span>
            <span className="text-sm font-medium">{service.distance}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-sm text-gray-500">Responses</span>
            <span className="text-sm font-medium text-bright-orange">{service.responses.length}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500">Views</span>
            <span className="text-sm font-medium">{service.views}</span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="card bg-base-100 shadow-lg rounded-2xl p-6 border-l-4 border-bright-orange">
        <h3 className="text-lg font-bold text-deep-teal mb-2">AI Summary</h3>
        <p className="text-sm text-gray-700">
          Based on your request, the top responders are highly rated providers with relevant experience in deep cleaning services.
        </p>
      </div>

      {/* Smart Match */}
      <div className="card bg-base-100 shadow-lg rounded-2xl p-6 border-l-4 border-bright-orange">
        <h3 className="text-lg font-bold text-deep-teal mb-2">Smart Match</h3>
        <p className="text-sm text-gray-700">
          We recommend providers who specialize in eco-friendly cleaning and have high customer satisfaction ratings.
        </p>
      </div>

      {/* Similar Services */}
      <div className="card bg-base-100 shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-bold text-deep-teal mb-4">Similar Services</h3>
        <ul className="space-y-3">
          {similarServices.map((service) => (
            <li key={service.id}>
              <a className="flex items-center gap-4 text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors">
                <IconComponent iconName={service.icon} />
                <span>{service.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Trust & Safety */}
      <div className="card bg-base-100 shadow-lg rounded-2xl p-6">
        <h3 className="text-lg font-bold text-deep-teal mb-4">Trust & Safety</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-4 text-sm text-deep-teal">
            <ShieldCheck className="h-5 w-5" />
            <span>Naafe' Safety Promise</span>
          </li>
          <li>
            <button 
              className="flex items-center gap-4 text-sm hover:bg-gray-50 p-2 rounded-md cursor-pointer transition-colors text-gray-600 hover:text-gray-800"
              onClick={onReport}
            >
              <Flag className="h-5 w-5" />
              <span>Report this request</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ServiceSidebar;