import React from 'react';
import { ServiceRequest } from '../types/service';

interface ServiceDetailsProps {
  service: ServiceRequest;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
  return (
    <div className="card bg-base-100 shadow-lg rounded-2xl p-6 mb-8">
      <h1 className="text-3xl font-bold text-deep-teal mb-2">{service.title}</h1>
      
      <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-2">
        <span>{service.category}</span>
        <span>•</span>
        <span>Posted {service.postedDate}</span>
        <span>•</span>
        <span>{service.distance}</span>
      </div>
      
      <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-4">
        <div>
          <p className="text-sm text-gray-500">Budget</p>
          <p className="font-semibold text-deep-teal">
            ${service.budget.min} - ${service.budget.max}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Timeline</p>
          <p className="font-semibold text-deep-teal">{service.timeline}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;