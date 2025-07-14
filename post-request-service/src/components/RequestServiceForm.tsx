import React, { useState } from 'react';
import { Edit3, Archive, FileText, DollarSign, MapPin, Calendar } from 'lucide-react';

interface RequestServiceFormData {
  requestTitle: string;
  category: string;
  requestDescription: string;
  minBudget: string;
  maxBudget: string;
  government: string;
  city: string;
  street: string;
  apartmentNumber: string;
  additionalInformation: string;
  preferredDateTime: string;
}

interface RequestServiceFormProps {
  onSubmit?: (data: RequestServiceFormData) => void;
  className?: string;
}

const RequestServiceForm: React.FC<RequestServiceFormProps> = ({ onSubmit, className = '' }) => {
  const [formData, setFormData] = useState<RequestServiceFormData>({
    requestTitle: '',
    category: '',
    requestDescription: '',
    minBudget: '',
    maxBudget: '',
    government: '',
    city: '',
    street: '',
    apartmentNumber: '',
    additionalInformation: '',
    preferredDateTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const categories = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Gardening',
    'Home Repair',
    'Beauty Services',
    'Photography',
    'Tutoring',
    'Technology Support',
    'Food & Catering'
  ];

  return (
    <div className={`min-h-screen bg-bg-cream font-cairo ${className}`}>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-card-cream rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Request a Service
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Title */}
            <div className="form-control">
              <label className="label" htmlFor="requestTitle">
                <span className="label-text flex items-center text-gray-700 text-base font-bold">
                  <Edit3 className="w-5 h-5 mr-2 text-primary" />
                  Request Title
                </span>
              </label>
              <input
                type="text"
                id="requestTitle"
                name="requestTitle"
                value={formData.requestTitle}
                onChange={handleChange}
                placeholder="e.g., Expert Plumbing Repair"
                className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div className="form-control">
              <label className="label" htmlFor="category">
                <span className="label-text flex items-center text-gray-700 text-base font-bold">
                  <Archive className="w-5 h-5 mr-2 text-primary" />
                  Category
                </span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full bg-white focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Request Description */}
            <div className="form-control">
              <label className="label" htmlFor="requestDescription">
                <span className="label-text flex items-center text-gray-700 text-base font-bold">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Request Description
                </span>
              </label>
              <textarea
                id="requestDescription"
                name="requestDescription"
                value={formData.requestDescription}
                onChange={handleChange}
                placeholder="Describe the service you need in detail. The more information, the better!"
                className="textarea textarea-bordered min-h-[120px] bg-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            {/* Budget Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label" htmlFor="minBudget">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Minimum Budget (EGP)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="minBudget"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleChange}
                    placeholder="50"
                    className="input input-bordered w-full bg-white focus:border-primary focus:outline-none pr-12"
                    min="0"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">EGP</span>
                  </div>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="maxBudget">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Maximum Budget (EGP)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="maxBudget"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleChange}
                    placeholder="200"
                    className="input input-bordered w-full bg-white focus:border-primary focus:outline-none pr-12"
                    min="0"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">EGP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label" htmlFor="government">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Government
                  </span>
                </label>
                <input
                  type="text"
                  id="government"
                  name="government"
                  value={formData.government}
                  onChange={handleChange}
                  placeholder="e.g., Cairo, Giza, Alexandria"
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="city">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    City
                  </span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Nasr City, Maadi, Zamalek"
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label" htmlFor="street">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Street
                  </span>
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g., Tahrir Street, Mohamed Farid Street"
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label" htmlFor="apartmentNumber">
                  <span className="label-text flex items-center text-gray-700 text-base font-bold">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    Apartment Number
                  </span>
                </label>
                <input
                  type="text"
                  id="apartmentNumber"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                  placeholder="e.g., Apt 12, Floor 3"
                  className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-control">
              <label className="label" htmlFor="additionalInformation">
                <span className="label-text flex items-center text-gray-700 text-base font-bold">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Additional Information
                  <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
                </span>
              </label>
              <textarea
                id="additionalInformation"
                name="additionalInformation"
                value={formData.additionalInformation}
                onChange={handleChange}
                placeholder="Add any helpful address information, landmarks, pin location, or special instructions..."
                className="textarea textarea-bordered min-h-[100px] bg-white focus:border-primary focus:outline-none"
              />
            </div>

            {/* Preferred Date & Time */}
            <div className="form-control">
              <label className="label" htmlFor="preferredDateTime">
                <span className="label-text flex items-center text-gray-700 text-base font-bold">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Preferred Date & Time
                </span>
              </label>
              <input
                type="datetime-local"
                id="preferredDateTime"
                name="preferredDateTime"
                value={formData.preferredDateTime}
                onChange={handleChange}
                className="input input-bordered w-full bg-white focus:border-primary focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="btn w-full bg-accent hover:bg-accent/90 text-white font-bold border-none transition-all duration-300 focus:ring-2 focus:ring-accent/50"
              >
                Post Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestServiceForm;