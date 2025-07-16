import React from 'react';

interface ServiceDetailsProps {
  service: any; // TODO: type
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  if (!service) return null;
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4 text-right">
      <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
      <p className="text-gray-700 mb-2">{service.description}</p>
      <div className="flex flex-wrap gap-4 mb-2">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{service.category}</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">الميزانية: {service.budget?.min} - {service.budget?.max} جنيه</span>
        {service.timeline && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">المدة: {service.timeline}</span>}
      </div>
      {service.location && (
        <div className="text-sm text-gray-600 mb-2">
          <span>العنوان: {service.location.address || ''} {service.location.city || ''} {service.location.government || ''}</span>
        </div>
      )}
      {service.postedDate && (
        <div className="text-xs text-gray-400">تاريخ النشر: {service.postedDate}</div>
      )}
    </div>
  );
};

export default ServiceDetails; 