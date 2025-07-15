import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import FilterForm from './ui/FilterForm';
import CategoryCard from './CategoryCard';
import CustomTaskCTA from './CustomTaskCTA';
import { useFilters } from '../hooks/useFilters';
import { ServiceCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ServiceCategoriesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { filters, updateFilters, clearFilters } = useFilters();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories);
        } else {
          setCategoriesError('فشل تحميل الفئات');
        }
      })
      .catch(() => setCategoriesError('فشل تحميل الفئات'))
      .finally(() => setCategoriesLoading(false));
  }, []);

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
          {/* Sorting removed: implement if needed for backend categories */}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoriesLoading ? (
            <div className="text-center py-12 text-lg text-deep-teal col-span-full">جاري تحميل الفئات...</div>
          ) : categoriesError ? (
            <div className="text-center py-12 text-red-600 col-span-full">{categoriesError}</div>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category._id || category.id || category.name}
                category={{
                  ...category,
                  serviceCount: category.serviceCount || 0,
                  startingPrice: category.startingPrice || 0,
                  icon: category.icon || (() => <span />),
                }}
                onClick={handleCategoryClick}
              />
            ))
          ) : (
            <div className="text-center py-12 text-text-secondary col-span-full">لا توجد فئات متاحة حالياً.</div>
          )}
          <CustomTaskCTA onPostTask={handlePostTask} />
        </div>
      </PageLayout>
      {/* AuthDemo removed */}
    </>
  );
};

export default ServiceCategoriesPage;