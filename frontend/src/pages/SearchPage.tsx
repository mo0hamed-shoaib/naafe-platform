import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import FilterForm from '../components/ui/FilterForm';
import ServiceCard from '../components/ServiceCard';
import ServiceRequestCard from '../components/ServiceRequestCard';
import SearchTabs, { SearchTab } from '../components/ui/SearchTabs';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { mockServiceProviders, mockServiceRequests } from '../data/mockData';
import { FilterState, ServiceProvider, ServiceRequest } from '../types';
import { useUrlParams } from '../hooks/useUrlParams';
import { translateCategory, translateCategoryToEnglish, translateLocationToEnglish, translateLocation } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getFiltersFromUrl, updateFiltersInUrl } = useUrlParams();
  
  const [filters, setFilters] = useState<FilterState>(getFiltersFromUrl());
  const [activeTab, setActiveTab] = useState<SearchTab>('services');
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>(mockServiceProviders);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>(mockServiceRequests);

  // Update URL when filters change
  useEffect(() => {
    updateFiltersInUrl(filters);
  }, [filters, updateFiltersInUrl]);

  // Filter providers based on current filters and search query
  useEffect(() => {
    let results = [...mockServiceProviders];

    // Filter by category
    if (filters.category) {
      const englishCategory = translateCategoryToEnglish(filters.category);
      results = results.filter(provider => 
        provider.category.toLowerCase() === englishCategory.toLowerCase()
      );
    }

    // Filter by location
    if (filters.location) {
      const englishLocation = translateLocationToEnglish(filters.location);
      results = results.filter(provider => 
        provider.location === englishLocation
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      results = results.filter(provider => {
        const price = provider.startingPrice;
        switch (filters.priceRange) {
          case '0-50': return price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100+': return price > 100;
          case '$': return price < 30;
          case '$$': return price >= 30 && price <= 60;
          case '$$$': return price > 60;
          default: return true;
        }
      });
    }

    // Filter by rating
    if (filters.rating) {
      const ratingValue = filters.rating;
      if (ratingValue.includes('+')) {
        const minRating = parseFloat(ratingValue.replace('+', ''));
        results = results.filter(provider => provider.rating >= minRating);
      } else {
        const minRating = parseInt(ratingValue);
        if (!isNaN(minRating)) {
          results = results.filter(provider => provider.rating >= minRating);
        }
      }
    }

    // Filter by premium status
    if (filters.premiumOnly) {
      results = results.filter(provider => provider.isPremium);
    }

    // Filter by availability
    if (filters.availability?.days?.length || filters.availability?.timeSlots?.length) {
      results = results.filter(provider => {
        const hasMatchingDays = !filters.availability?.days?.length || 
          filters.availability.days.some(day => provider.availability.days.includes(day));
        const hasMatchingTimeSlots = !filters.availability?.timeSlots?.length || 
          filters.availability.timeSlots.some(slot => provider.availability.timeSlots.includes(slot));
        return hasMatchingDays && hasMatchingTimeSlots;
      });
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(provider =>
        provider.name.toLowerCase().includes(query) ||
        translateCategory(provider.category).toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        translateLocation(provider.location).toLowerCase().includes(query)
      );
    }

    setFilteredProviders(results);
  }, [filters]);

  // Filter requests based on current filters and search query
  useEffect(() => {
    let results = [...mockServiceRequests];

    // Filter by category
    if (filters.category) {
      const englishCategory = translateCategoryToEnglish(filters.category);
      results = results.filter(request => 
        request.category.toLowerCase() === englishCategory.toLowerCase()
      );
    }

    // Filter by location
    if (filters.location) {
      const englishLocation = translateLocationToEnglish(filters.location);
      results = results.filter(request => 
        request.location === englishLocation
      );
    }

    // Filter by budget range (using price range filter)
    if (filters.priceRange) {
      results = results.filter(request => {
        const avgBudget = (request.budget.min + request.budget.max) / 2;
        switch (filters.priceRange) {
          case '0-50': return avgBudget <= 50;
          case '50-100': return avgBudget > 50 && avgBudget <= 100;
          case '100+': return avgBudget > 100;
          case '$': return avgBudget < 30;
          case '$$': return avgBudget >= 30 && avgBudget <= 60;
          case '$$$': return avgBudget > 60;
          default: return true;
        }
      });
    }

    // Filter by premium status
    if (filters.premiumOnly) {
      results = results.filter(request => request.postedBy.isPremium);
    }

    // Filter by availability
    if (filters.availability?.days?.length || filters.availability?.timeSlots?.length) {
      results = results.filter(request => {
        const hasMatchingDays = !filters.availability?.days?.length || 
          filters.availability.days.some(day => request.availability.days.includes(day));
        const hasMatchingTimeSlots = !filters.availability?.timeSlots?.length || 
          filters.availability.timeSlots.some(slot => request.availability.timeSlots.includes(slot));
        return hasMatchingDays && hasMatchingTimeSlots;
      });
    }

    // Filter by search query
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(request =>
        request.title.toLowerCase().includes(query) ||
        translateCategory(request.category).toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query) ||
        translateLocation(request.location).toLowerCase().includes(query) ||
        request.postedBy.name.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(results);
  }, [filters]);

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
    const count = activeTab === 'services' ? filteredProviders.length : filteredRequests.length;
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
            filteredProviders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredProviders.map((provider) => (
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
            filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredRequests.map((request) => (
                  <ServiceRequestCard
                    key={request.id}
                    request={request}
                    onInterested={handleInterestedInRequest}
                    onViewDetails={handleViewRequestDetails}
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