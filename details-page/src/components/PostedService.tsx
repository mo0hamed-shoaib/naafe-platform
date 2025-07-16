import React from 'react';
import { Share2, Bookmark } from 'lucide-react';
import Header from './Header';
import Breadcrumb from './Breadcrumb';
import ServiceGallery from './ServiceGallery';
import ServiceDetails from './ServiceDetails';
import RequesterInfo from './RequesterInfo';
import ResponsesSection from './ResponsesSection';
import CommentsSection from './CommentsSection';
import ServiceSidebar from './ServiceSidebar';
import { ServiceRequest } from '../types/service';

interface PostedServiceProps {
  service: ServiceRequest;
  onInterested?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
}

const PostedService: React.FC<PostedServiceProps> = ({
  service,
  onInterested,
  onShare,
  onBookmark,
  onReport
}) => {
  const breadcrumbItems = [
    { label: 'Home', href: '#' },
    { label: service.category, href: '#' },
    { label: service.title, current: true },
  ];

  return (
    <div className="min-h-screen bg-warm-cream" data-theme="naafe">
      <Header userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuDURiT7J2zFXQu5ZgFgvsC2pu5EtFC3XrE0W_H48oWgWFQXW5-0mrixmLM2fReh0bWhDxTjqLSShGRbPfAoBpY-4k4GUOHIIJ5MDZXLumk6L5KG7v-cAz_d7ZW24ZoweL8AcMK5dLEK_q7zmGJG7UqHL4qlZxaLbnv4vba4NoCy7FTJEzbcRCPWctIXJ-5gPiuAL7CmWOfDjeefXdSB96dn9BwSNL_KEWk5HO6_g_j036uNUpMoYyAgK7elBAI_ld-ct-7-yLwDzJ4" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            
            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex justify-end items-center mb-4 gap-2">
              <button 
                className="btn btn-ghost btn-circle hover:bg-gray-200 transition-colors"
                onClick={onShare}
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                className="btn btn-ghost btn-circle hover:bg-gray-200 transition-colors"
                onClick={onBookmark}
                aria-label="Bookmark"
              >
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
            
            <ServiceGallery images={service.images} title={service.title} />
            <ServiceDetails service={service} />
            <RequesterInfo requester={service.requester} />
            <ResponsesSection responses={service.responses} />
            <CommentsSection comments={service.comments} />
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
      </main>
    </div>
  );
};

export default PostedService;