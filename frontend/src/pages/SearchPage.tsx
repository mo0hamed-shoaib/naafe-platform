import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FilterForm from '../components/ui/FilterForm';
import ServiceCard from '../components/ServiceCard';
import ServiceRequestCard from '../components/ServiceRequestCard';
import SearchTabs, { SearchTab } from '../components/ui/SearchTabs';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { useQuery } from '@tanstack/react-query';
import { FilterState } from '../types';
import { useUrlParams } from '../hooks/useUrlParams';
import { useAuth } from '../contexts/AuthContext';

const fetchListings = async (filters: FilterState) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  // Add more filters as needed (location, price, etc.)
  const res = await fetch(`/api/listings?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'فشل تحميل الخدمات');
  return json.data.listings || json.data.items || [];
};

const fetchRequests = async (filters: FilterState) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  // Add more filters as needed (location, price, etc.)
  const res = await fetch(`/api/requests?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'فشل تحميل الطلبات');
  return json.data.requests || json.data.jobRequests || json.data.items || [];
};

const SearchPage = () => {
  const navigate = useNavigate();
  const { user, logout, accessToken } = useAuth();
  const { getFiltersFromUrl, updateFiltersInUrl } = useUrlParams();
  
  const [filters, setFilters] = useState<FilterState>(getFiltersFromUrl());
  const [activeTab, setActiveTab] = useState<SearchTab>('services');
  const { data: listings = [], isLoading: listingsLoading, error: listingsError } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
  });
  const { data: requests = [], isLoading: requestsLoading, error: requestsError } = useQuery({
    queryKey: ['requests', filters],
    queryFn: () => fetchRequests(filters),
  });
  const [providerOfferRequestIds, setProviderOfferRequestIds] = useState<string[]>([]);

  // Map backend data to frontend types
  // Backend response is dynamic; we validate and map at runtime
  const mappedProviders = (listings as unknown[]).map((listing) => {
    const l = listing as Record<string, any>;
    return {
      id: l._id,
      name: l.provider?.name?.first && l.provider?.name?.last ? `${l.provider.name.first} ${l.provider.name.last}` : l.provider?.name || '',
      rating: l.rating ?? 0,
      category: l.category,
      description: l.description,
      location: l.location?.address || '',
      startingPrice: l.price?.amount ?? 0,
      imageUrl: l.provider?.avatarUrl || '',
      isPremium: l.provider?.isPremium || false,
      isTopRated: (l.rating ?? 0) >= 4.8 && (l.reviewCount ?? 0) > 10, // Example logic
      completedJobs: l.provider?.totalJobsCompleted ?? 0,
      isIdentityVerified: l.provider?.isVerified ?? false,
      availability: l.availability || { days: [], timeSlots: [] },
    };
  });

  const mappedRequests = (requests as unknown[]).map((req) => {
    const r = req as Record<string, any>;
    return {
      id: r._id,
      title: r.title,
      description: r.description,
      budget: r.budget,
      location: r.location?.address || '',
      postedBy: {
        id: r.seeker?._id || '',
        name: r.seeker?.name ? `${r.seeker.name.first} ${r.seeker.name.last}` : '',
        avatar: r.seeker?.avatarUrl || '',
        isPremium: r.seeker?.isPremium || false,
      },
      createdAt: r.createdAt,
      preferredDate: r.preferredDate || r.deadline,
      status: r.status,
      category: r.category,
      urgency: r.urgency,
      availability: r.availability || { days: [], timeSlots: [] },
    };
  });

  // Update URL when filters change
  useEffect(() => {
    updateFiltersInUrl(filters);
  }, [filters, updateFiltersInUrl]);

  useEffect(() => {
    const fetchProviderOffers = async () => {
      if (user && user.roles.includes('provider') && activeTab === 'requests') {
        try {
          type Offer = { jobRequest: string };
          const res = await fetch('/api/offers', {
            headers: { 'Authorization': `Bearer ${accessToken || localStorage.getItem('accessToken')}` },
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setProviderOfferRequestIds(data.data.map((offer: Offer) => offer.jobRequest));
          }
        } catch {
          // Optionally log error
        }
      }
    };
    fetchProviderOffers();
  }, [user, activeTab, accessToken]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      priceRange: '',
      rating: '',
      category: ''
    });
  };

  const handleTabChange = (tab: SearchTab) => {
    setActiveTab(tab);
  };

  const handleViewProviderDetails = (providerId: string) => {
    navigate(`/provider/${providerId}`);
  };

  const handleViewRequestDetails = (requestId: string) => {
    navigate(`/request/${requestId}`);
  };

  const handleInterestedInRequest = (requestId: string) => {
    // TODO: Implement interest functionality
    console.log('User interested in request:', requestId);
  };

  const getResultsText = () => {
    const count = activeTab === 'services' ? mappedProviders.length : mappedRequests.length;
    const hasFilters = filters.category || filters.location || filters.priceRange || filters.rating || filters.search;
    
    if (!hasFilters) {
      return activeTab === 'services' 
        ? `عرض ${count} مزود خدمة`
        : `عرض ${count} طلب خدمة`;
    }
    
    let text = `تم العثور على ${count} نتيجة`;
    if (filters.search) {
      text += ` لـ "${filters.search}"`;
    }
    if (filters.category) {
      text += ` في ${filters.category}`;
    }
    return text;
  };

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '/' },
    { label: 'نتائج البحث', active: true },
  ];

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <BaseCard className="p-8">
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {activeTab === 'services' ? 'لم يتم العثور على مزودي خدمات' : 'لم يتم العثور على طلبات خدمات'}
        </h3>
        <p className="text-text-secondary mb-4">
          {activeTab === 'services' 
            ? 'حاول تعديل المرشحات أو مصطلحات البحث للعثور على ما تبحث عنه.'
            : 'حاول تعديل المرشحات أو مصطلحات البحث للعثور على طلبات الخدمات المناسبة.'
          }
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="primary"
            onClick={handleClearFilters}
          >
            مسح جميع المرشحات
          </Button>
          {activeTab === 'requests' && (
            <Button
              variant="outline"
              onClick={() => navigate('/post-request')}
            >
              نشر طلب خدمة جديد
            </Button>
          )}
        </div>
      </BaseCard>
    </div>
  );

  return (
    <PageLayout
      title="نتائج البحث"
      subtitle={getResultsText()}
      breadcrumbItems={breadcrumbItems}
      onSearch={handleSearch}
      searchValue={filters.search}
      user={user}
      onLogout={logout}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <FilterForm
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            onSearch={handleSearch}
            variant="sidebar"
            activeTab={activeTab}
          />
        </div>
        
        <div className="w-full lg:w-3/4">
          <SearchTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          
          {activeTab === 'services' ? (
            listingsLoading ? (
              <div className="text-center py-12 text-lg text-deep-teal">جاري تحميل الخدمات...</div>
            ) : listingsError ? (
              <div className="text-center py-12 text-red-600">{listingsError.message}</div>
            ) : mappedProviders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {mappedProviders.map((provider) => (
                  <ServiceCard
                    key={provider.id}
                    provider={provider}
                    onViewDetails={handleViewProviderDetails}
                  />
                ))}
              </div>
            ) : (
              renderEmptyState()
            )
          ) : (
            requestsLoading ? (
              <div className="text-center py-12 text-lg text-deep-teal">جاري تحميل الطلبات...</div>
            ) : requestsError ? (
              <div className="text-center py-12 text-red-600">{requestsError.message}</div>
            ) : mappedRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {mappedRequests.map((request) => (
                  <ServiceRequestCard
                    key={request.id}
                    request={request}
                    onInterested={handleInterestedInRequest}
                    onViewDetails={handleViewRequestDetails}
                    alreadyApplied={providerOfferRequestIds.includes(request.id)}
                  />
                ))}
              </div>
            ) : (
              renderEmptyState()
            )
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default SearchPage; 