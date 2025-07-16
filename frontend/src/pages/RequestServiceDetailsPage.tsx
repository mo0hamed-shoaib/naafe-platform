import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServiceDetailsContainer from '../components/ServiceDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../contexts/AuthContext';

const RequestServiceDetailsPage = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [service, setService] = useState<any>(null); // TODO: Replace 'any' with proper type after mapping
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/requests/${id}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error?.message || 'Failed to fetch');
        // TODO: Map backend jobRequest to frontend service model as needed
        setService({
          ...data.data.jobRequest,
          // Map location/address fields, images, requester, etc. as needed
          images: (data.data.jobRequest.attachments || []).map((a: { url: string }) => a.url),
          requester: data.data.jobRequest.seeker ? {
            name: typeof data.data.jobRequest.seeker.name === 'object'
              ? `${data.data.jobRequest.seeker.name.first || ''} ${data.data.jobRequest.seeker.name.last || ''}`.trim()
              : data.data.jobRequest.seeker.name || '',
            avatar: data.data.jobRequest.seeker.avatarUrl,
            createdAt: data.data.jobRequest.seeker.createdAt,
          } : null,
          // Add comments: [] if not present
          comments: [],
        });
        // Fetch offers with Authorization header
        const offersRes = await fetch(`/api/requests/${id}/offers`, {
          headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {},
        });
        const offersData = await offersRes.json();
        // TODO: Map backend offers to frontend responses model as needed
        setOffers((offersData.data?.offers || []).map((offer: {
          _id: string;
          provider?: { name?: string; avatarUrl?: string; rating?: number; specialties?: string[]; verified?: boolean };
          budget?: { min?: number };
          message?: string;
          estimatedTimeDays?: number;
          availableDates?: string[];
          timePreferences?: string[];
          createdAt: string;
        }) => ({
          id: offer._id,
          name: offer.provider?.name || '',
          avatar: offer.provider?.avatarUrl || '',
          rating: offer.provider?.rating || 0,
          price: offer.budget?.min || 0,
          specialties: offer.provider?.specialties || [],
          verified: offer.provider?.verified || false,
          message: offer.message || '',
          estimatedTimeDays: offer.estimatedTimeDays || 1,
          availableDates: offer.availableDates || [],
          timePreferences: offer.timePreferences || [],
          createdAt: offer.createdAt,
        })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, accessToken]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-deep-teal text-lg">جاري التحميل...</div>
      </main>
      <Footer />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </main>
      <Footer />
    </div>
  );
  
  if (!service) return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-deep-teal text-lg">لم يتم العثور على الخدمة</div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-warm-cream">
      <Header />
      <main className="flex-1">
        {/* Back Button Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BackButton className="mb-4" />
        </div>
        
        {/* Service Details */}
        <ServiceDetailsContainer
          service={service}
          offers={offers}
          onInterested={() => {}}
          onShare={() => {}}
          onBookmark={() => {}}
          onReport={() => {}}
        />
      </main>
      <Footer />
    </div>
  );
};

export default RequestServiceDetailsPage; 