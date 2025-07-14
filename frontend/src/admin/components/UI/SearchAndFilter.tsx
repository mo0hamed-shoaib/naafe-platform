import FormInput from '../../../components/ui/FormInput';
import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: Array<{ value: string; label: string }>;
  placeholder?: string;
}

const SearchAndFilter = ({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  placeholder = 'بحث...'
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <FormInput
          label="بحث"
          icon={<Search className="h-5 w-5 text-soft-teal" />}
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white"
        />
      </div>
      <div>
      <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-soft-teal pointer-events-none" />
        <select
          value={filterValue}
            onChange={e => onFilterChange(e.target.value)}
            className="select select-bordered w-full bg-white pl-10 pr-8 py-3 rounded-full text-[#0e1b18] focus:border-[#2D5D4F] focus:ring-2 focus:ring-[#2D5D4F] shadow-sm"
            title="تصفية حسب الفئة"
            aria-label="تصفية حسب الفئة"
        >
            {filterOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;