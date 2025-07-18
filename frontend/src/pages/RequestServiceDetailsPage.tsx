import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ServiceDetailsContainer from '../components/ServiceDetails';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/ui/BackButton';
import { useAuth } from '../contexts/AuthContext';
import { useOfferContext } from '../contexts/OfferContext';

interface Offer {
  id: string;
  providerId?: string;
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
  jobRequestSeekerId?: string;
}

const RequestServiceDetailsPage = () => {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const { offers, addNewOffer, setOffers } = useOfferContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [service, setService] = useState<any>(null); // TODO: Replace 'any' with proper type after mapping
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch offers
  const fetchOffers = useCallback(async () => {
    if (!id) return;
    try {
      const offersRes = await fetch(`/api/requests/${id}/offers`, {
        headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {},
      });
      const offersData = await offersRes.json();
      if (offersData.success) {
        // Map backend offers to frontend responses model
        const mappedOffers = (offersData.data?.offers || []).map((offer: {
          _id: string;
          provider?: {
            _id?: string;
            name?: { first?: string; last?: string } | string;
            avatarUrl?: string;
            rating?: number;
            specialties?: string[];
            verified?: boolean
          };
          jobRequest?: {
            _id?: string;
            seeker?: string;
            title?: string;
            status?: string;
          };
          budget?: { min?: number };
          message?: string;
          estimatedTimeDays?: number;
          availableDates?: string[];
          timePreferences?: string[];
          createdAt: string;
        }): Offer => ({
          id: offer._id,
          providerId: offer.provider?._id,
          name: typeof offer.provider?.name === 'object'
            ? `${offer.provider.name.first || ''} ${offer.provider.name.last || ''}`.trim()
            : offer.provider?.name || '',
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
          jobRequestSeekerId: offer.jobRequest?.seeker,
        }));
        setOffers(mappedOffers);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  }, [id, accessToken, setOffers]);

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
        // Fetch offers
        await fetchOffers();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, fetchOffers]);

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
          <BackButton to="/search" className="mb-4" />
        </div>
        
        {/* Service Details */}
        <ServiceDetailsContainer
          service={service}
          offers={offers}
          onInterested={() => {}}
          onShare={() => {}}
          onBookmark={() => {}}
          onReport={() => {}}
          onOfferAdded={addNewOffer}
          onOffersRefresh={fetchOffers}
        />
      </main>
      <Footer />
    </div>
  );
};

export default RequestServiceDetailsPage; 