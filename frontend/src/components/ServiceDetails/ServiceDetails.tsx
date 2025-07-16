import React from 'react';

interface ServiceDetailsProps {
  service: any; // TODO: Replace 'any' with a proper type for service
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  if (!service) return null;
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4 text-right">
      <h1 className="text-2xl font-bold mb-2 text-deep-teal">{service.title}</h1>
      <p className="text-text-primary mb-2">{service.description}</p>
      <div className="flex flex-wrap gap-4 mb-2">
        <span className="bg-deep-teal/10 text-deep-teal px-2 py-1 rounded text-sm font-semibold">{service.category}</span>
        <span className="bg-bright-orange/10 text-bright-orange px-2 py-1 rounded text-sm font-semibold">
          الميزانية: {service.budget?.min} - {service.budget?.max} جنيه
        </span>
        {service.timeline && (
          <span className="bg-accent/10 text-accent px-2 py-1 rounded text-sm font-semibold">
            المدة: {service.timeline}
          </span>
        )}
      </div>
      {service.location && (
        <div className="text-sm text-text-secondary mb-2">
          <span>
            العنوان: {service.location.address || ''} {service.location.city || ''} {service.location.government || ''}
          </span>
        </div>
      )}
      {service.postedDate && (
        <div className="text-xs text-text-secondary">تاريخ النشر: {service.postedDate}</div>
      )}
    </div>
  );
};

export default ServiceDetails;