import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import FilterForm from './ui/FilterForm';
import CategoryCard from './CategoryCard';
import CustomTaskCTA from './CustomTaskCTA';
import { serviceCategories } from '../data/categories';
import { useFilters } from '../hooks/useFilters';
import { useSort } from '../hooks/useSort';
import { ServiceCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ServiceCategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { filters, updateFilters, clearFilters } = useFilters();
  const { sortBy, updateSort, sortedCategories, sortOptions } = useSort(serviceCategories);

  const breadcrumbItems = [
    { label: 'الرئيسية', href: '#' },
    { label: 'جميع الخدمات', active: true },
  ];

  const handleCategoryClick = useCallback((category: ServiceCategory) => {
    navigate(`/search?category=${encodeURIComponent(category.name)}`);
  }, [navigate]);

  const handlePostTask = useCallback(() => {
    // Handle post task action
  }, []);

  const handleSearch = useCallback((query: string) => {
    // Build search URL with all current filters
    const params = new URLSearchParams();
    params.set('query', query);
    
    if (filters.location) params.set('location', filters.location);
    if (filters.priceRange) params.set('priceRange', filters.priceRange);
    if (filters.rating) params.set('rating', filters.rating);
    
    navigate(`/search?${params.toString()}`);
  }, [navigate, filters]);

  return (
    <>
      <PageLayout
        title="تصفح جميع الخدمات"
        subtitle="ابحث عن المساعدة التي تحتاجها من محترفينا المحليين الموثوقين."
        breadcrumbItems={breadcrumbItems}
        onSearch={handleSearch}
        user={user}
        onLogout={logout}
      >
        <FilterForm
          filters={filters}
          onFiltersChange={updateFilters}
          onClearFilters={clearFilters}
          onSearch={handleSearch}
        />

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-text-primary">جميع الفئات</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary whitespace-nowrap">ترتيب حسب:</span>
            <select
              className="select select-bordered select-sm bg-white focus:border-deep-teal rounded-full text-text-primary"
              value={sortBy}
              onChange={(e) => updateSort(e.target.value)}
              aria-label="ترتيب الفئات حسب"
              title="ترتيب الفئات حسب"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
          
          <CustomTaskCTA onPostTask={handlePostTask} />
        </div>
      </PageLayout>
      {/* AuthDemo removed */}
    </>
  );
};

export default ServiceCategoriesPage;