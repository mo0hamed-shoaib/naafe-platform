
import { Search, X } from 'lucide-react';
import { cn, translateLocation } from '../../utils/helpers';
import Button from './Button';
import AvailabilityFilter from './AvailabilityFilter';
import { FilterState } from '../../types';
import { LOCATIONS } from '../../utils/constants';
import { SearchTab } from './SearchTabs';
import { useEffect, useState } from 'react';
import { FormInput, FormSelect } from './';

interface FilterFormProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  onSearch?: (query: string) => void;
  variant?: 'inline' | 'sidebar';
  className?: string;
  activeTab?: SearchTab;
}

const FilterForm = ({
  filters,
  onFiltersChange,
  onClearFilters,
  onSearch,
  variant = 'inline',
  className,
  activeTab = 'services'
}: FilterFormProps) => {
  const handleInputChange = (field: keyof FilterState, value: string | boolean | { days: string[]; timeSlots: string[] }) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = filters.search.trim();
    if (searchQuery && onSearch) {
      onSearch(searchQuery);
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data.categories)) {
          setCategories(data.data.categories.map((cat: { name: string }) => cat.name));
        } else {
          setCategoriesError('فشل تحميل الفئات');
        }
      })
      .catch(() => setCategoriesError('فشل تحميل الفئات'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  if (variant === 'sidebar') {
    return (
      <div className={cn('bg-white rounded-lg p-6 shadow-sm', className)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">المرشحات</h2>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-deep-teal hover:text-deep-teal/80 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              مسح الكل
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              البحث
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary h-4 w-4 search-icon" />
              <FormInput
                type="text"
                placeholder={activeTab === 'services' ? "البحث عن الخدمات..." : "البحث عن طلبات الخدمات..."}
                value={filters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              الفئة
            </label>
            <FormSelect
              value={filters.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              options={[
                { value: '', label: 'جميع الفئات' },
                ...categories.map((cat) => ({ value: cat, label: cat }))
              ]}
              disabled={categoriesLoading}
              placeholder="اختر الفئة"
            />
            {categoriesError && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{categoriesError}</div>}
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              الموقع
            </label>
            <FormSelect
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              options={[
                { value: '', label: 'جميع المواقع' },
                ...LOCATIONS.map((location) => ({ value: location, label: translateLocation(location) }))
              ]}
              placeholder="اختر الموقع"
            />
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {activeTab === 'services' ? 'نطاق السعر' : 'نطاق الميزانية'}
            </label>
            <FormSelect
              value={filters.priceRange}
              onChange={(e) => handleInputChange('priceRange', e.target.value)}
              options={[
                { value: '', label: 'أي نطاق' },
                { value: '0-50', label: '0 - 200 جنيه' },
                { value: '50-100', label: '200 - 400 جنيه' },
                { value: '100+', label: '400+ جنيه' }
              ]}
              placeholder="اختر نطاق السعر"
            />
          </div>

          {/* Rating Filter - Only for Services */}
          {activeTab === 'services' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                الحد الأدنى للتقييم
              </label>
              <FormSelect
                value={filters.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                options={[
                  { value: '', label: 'أي تقييم' },
                  { value: '4+', label: '4+ نجوم' },
                  { value: '3+', label: '3+ نجوم' },
                  { value: 'any', label: 'أي تقييم' }
                ]}
                placeholder="اختر التقييم"
              />
            </div>
          )}

          {/* Premium Filter */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={filters.premiumOnly || false}
                onChange={(e) => handleInputChange('premiumOnly', e.target.checked ? 'true' : '')}
              />
              <span className="text-sm font-medium text-text-primary">
                عرض المستخدمين المميزين فقط
              </span>
            </label>
          </div>

          {/* Availability Filter */}
          <AvailabilityFilter
            selectedDays={filters.availability?.days || []}
            selectedTimeSlots={filters.availability?.timeSlots || []}
            onDaysChange={(days) => handleInputChange('availability', { 
              days,
              timeSlots: filters.availability?.timeSlots || []
            })}
            onTimeSlotsChange={(timeSlots) => handleInputChange('availability', { 
              days: filters.availability?.days || [],
              timeSlots
            })}
          />
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={cn('rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg sticky top-20 z-40 mb-8', className)}>
      <div className="card-body p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-center">
          <div className="relative sm:col-span-2 lg:col-span-2">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-text-secondary search-icon" />
            </div>
            <FormInput
              type="text"
              placeholder={activeTab === 'services' ? "البحث عن الخدمات..." : "البحث عن طلبات الخدمات..."}
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const searchQuery = filters.search.trim();
                  if (searchQuery && onSearch) {
                    onSearch(searchQuery);
                  }
                }
              }}
            />
          </div>
          
          <FormSelect
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            options={[
              { value: '', label: 'جميع المواقع' },
              ...LOCATIONS.map((location) => ({ value: location, label: translateLocation(location) }))
            ]}
            placeholder="اختر الموقع"
          />
          
          <FormSelect
            value={filters.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
            options={[
              { value: '', label: 'أي نطاق' },
              { value: '0-50', label: '$0 - $50' },
              { value: '50-100', label: '$50 - $100' },
              { value: '100+', label: '$100+' }
            ]}
            placeholder="اختر نطاق السعر"
          />
          
          <div className="flex items-center justify-between gap-2">
            <FormSelect
              value={filters.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              options={[
                { value: '', label: 'أي تقييم' },
                { value: '4+', label: '4+ نجوم' },
                { value: '3+', label: '3+ نجوم' },
                { value: 'any', label: 'أي تقييم' }
              ]}
              placeholder="اختر التقييم"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearFilters();
              }}
              className="text-text-secondary hover:text-deep-teal"
            >
              مسح
            </Button>
          </div>

          <Button
            type="submit"
            variant="primary"
          >
            بحث
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FilterForm; 