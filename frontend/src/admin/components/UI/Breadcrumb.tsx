import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 space-x-reverse mb-6" aria-label="Breadcrumb">
      <Link
        to="/admin"
        className="flex items-center text-deep-teal hover:text-bright-orange transition-colors font-bold"
        aria-label="الرئيسية"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronLeft className="h-4 w-4 text-deep-teal" />
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-deep-teal hover:text-bright-orange transition-colors text-sm font-bold"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-deep-teal font-bold text-sm">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 