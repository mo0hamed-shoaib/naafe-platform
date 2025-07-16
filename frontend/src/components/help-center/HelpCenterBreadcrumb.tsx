import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HelpCenterBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const HelpCenterBreadcrumb: React.FC<HelpCenterBreadcrumbProps> = ({
  items,
  className
}) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)} aria-label="مسار التنقل">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronLeft className="w-4 h-4 text-gray-400 mx-2" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-text-secondary hover:text-deep-teal transition-colors duration-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default HelpCenterBreadcrumb; 