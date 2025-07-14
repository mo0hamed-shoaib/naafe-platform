
import { cn } from '../../utils/helpers';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'search';
  size?: 'sm' | 'md' | 'lg';
}

const FormInput = ({
  label,
  error,
  icon,
  variant = 'default',
  size = 'md',
  className,
  id,
  ...props
}: FormInputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    default: 'input input-bordered bg-light-cream focus:border-deep-teal text-text-primary placeholder:text-text-secondary',
    search: 'pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal transition-colors bg-white text-text-primary'
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'w-full rounded-lg transition-colors',
            sizeClasses[size],
            variantClasses[variant],
            icon && variant === 'default' ? 'pl-10' : '',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput; 