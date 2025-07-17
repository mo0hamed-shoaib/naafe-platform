import React from 'react';
import { Listbox } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface Option {
  value: string;
  label: string;
}

interface UnifiedSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const UnifiedSelect: React.FC<UnifiedSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'اختر...',
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
}) => {
  const selectedOption = options.find(opt => opt.value === value);
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-deep-teal text-right">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'w-full border-2 border-gray-300 bg-white text-text-primary placeholder:text-gray-500 hover:border-gray-400 focus:border-deep-teal focus:bg-white hover:shadow-lg focus:shadow-xl rounded-lg shadow-md px-4 py-2 text-base transition-all duration-200 flex items-center justify-between',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/40',
              disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-75 border-gray-200',
            )}
          >
            <span className={cn(
              !selectedOption ? 'text-gray-500' : 'text-[#0e1b18]',
              'truncate flex-1 text-right'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="h-5 w-5 ml-2 text-gray-400 flex-shrink-0" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
            <Listbox.Option
              key="_placeholder"
              value=""
              disabled
              className="text-gray-400 px-4 py-2 cursor-default select-none"
            >
              {placeholder}
            </Listbox.Option>
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }: { active: boolean; selected: boolean }) =>
                  cn(
                    'px-4 py-2 cursor-pointer select-none text-right',
                    active ? 'bg-soft-teal/10 text-deep-teal' : 'text-[#0e1b18]',
                    selected && 'font-semibold bg-soft-teal/20 border-r-4 border-deep-teal'
                  )
                }
              >
                {({ selected }: { selected: boolean }) => (
                  <div className="flex items-center justify-between">
                    <span className="truncate flex-1">{option.label}</span>
                    {selected && <Check className="h-4 w-4 text-deep-teal ml-2" />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {error && (
        <p className="mt-1 text-sm text-red-600 text-right">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-secondary text-right">{helperText}</p>
      )}
    </div>
  );
};

export default UnifiedSelect; 