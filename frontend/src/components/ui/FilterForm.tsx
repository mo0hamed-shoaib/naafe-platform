
import { Search, X } from 'lucide-react';
import { cn, translateCategory, translateLocation } from '../../utils/helpers';
import Button from './Button';
import AvailabilityFilter from './AvailabilityFilter';
import { FilterState } from '../../types';
import { LOCATIONS } from '../../utils/constants';
import { SearchTab } from './SearchTabs';
import { useEffect, useState } from 'react';

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
          setCategories(data.data.categories.map((cat: any) => cat.name));
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
              <input
                type="text"
                placeholder={activeTab === 'services' ? "البحث عن الخدمات..." : "البحث عن طلبات الخدمات..."}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-teal/20 focus:border-deep-teal transition-colors bg-white text-text-primary search-input hover:border-deep-teal/60"
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
            <select
              className="select select-bordered w-full bg-white border-gray-300 focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 text-text-primary hover:border-deep-teal/60 transition-colors"
              value={filters.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              aria-label="تصفية حسب الفئة"
              title="تصفية حسب الفئة"
              disabled={categoriesLoading}
            >
              <option value="">جميع الفئات</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {categoriesError && <div className="text-red-600 text-sm text-right bg-red-50 p-2 rounded-lg border border-red-200 mt-2">{categoriesError}</div>}
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              الموقع
            </label>
            <select
              className="select select-bordered w-full bg-white border-gray-300 focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 text-text-primary hover:border-deep-teal/60 transition-colors"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              aria-label="تصفية حسب الموقع"
              title="تصفية حسب الموقع"
            >
              <option value="">جميع المواقع</option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {translateLocation(location)}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              {activeTab === 'services' ? 'نطاق السعر' : 'نطاق الميزانية'}
            </label>
            <select
              className="select select-bordered w-full bg-white border-gray-300 focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 text-text-primary hover:border-deep-teal/60 transition-colors"
              value={filters.priceRange}
              onChange={(e) => handleInputChange('priceRange', e.target.value)}
              aria-label="تصفية حسب نطاق السعر"
              title="تصفية حسب نطاق السعر"
            >
              <option value="">أي سعر</option>
              <option value="0-50">0 - 200 جنيه</option>
              <option value="50-100">200 - 400 جنيه</option>
              <option value="100+">400+ جنيه</option>
            </select>
          </div>

          {/* Rating Filter - Only for Services */}
          {activeTab === 'services' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                الحد الأدنى للتقييم
              </label>
              <select
                className="select select-bordered w-full bg-white border-gray-300 focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 text-text-primary hover:border-deep-teal/60 transition-colors"
                value={filters.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                aria-label="تصفية حسب الحد الأدنى للتقييم"
                title="تصفية حسب الحد الأدنى للتقييم"
              >
                <option value="">أي تقييم</option>
                <option value="4+">4+ نجوم</option>
                <option value="3+">3+ نجوم</option>
                <option value="any">أي تقييم</option>
              </select>
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
            <input
              type="text"
              placeholder={activeTab === 'services' ? "البحث عن الخدمات..." : "البحث عن طلبات الخدمات..."}
              className="input input-bordered w-full pr-10 bg-light-cream focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 rounded-full text-text-primary placeholder:text-text-secondary search-input hover:border-deep-teal/60 transition-colors"
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
          
          <select
            className="select select-bordered bg-light-cream focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 rounded-full text-text-primary hover:border-deep-teal/60 transition-colors"
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            aria-label="تصفية حسب الموقع"
            title="تصفية حسب الموقع"
          >
            <option value="">جميع المواقع</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {translateLocation(location)}
              </option>
            ))}
          </select>
          
          <select
            className="select select-bordered bg-light-cream focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 rounded-full text-text-primary hover:border-deep-teal/60 transition-colors"
            value={filters.priceRange}
            onChange={(e) => handleInputChange('priceRange', e.target.value)}
            aria-label="تصفية حسب نطاق السعر"
            title="تصفية حسب نطاق السعر"
          >
            <option value="">نطاق السعر</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100+">$100+</option>
          </select>
          
          <div className="flex items-center justify-between gap-2">
            <select
              className="select select-bordered bg-light-cream focus:border-deep-teal focus:ring-2 focus:ring-deep-teal/20 rounded-full flex-1 text-text-primary hover:border-deep-teal/60 transition-colors"
              value={filters.rating}
              onChange={(e) => handleInputChange('rating', e.target.value)}
              aria-label="تصفية حسب التقييم"
              title="تصفية حسب التقييم"
            >
              <option value="">التقييم</option>
              <option value="4+">4+ نجوم</option>
              <option value="3+">3+ نجوم</option>
              <option value="any">أي تقييم</option>
            </select>
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