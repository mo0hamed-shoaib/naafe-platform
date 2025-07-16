import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { ServiceProvider } from '../types/service';

interface ResponsesSectionProps {
  responses: ServiceProvider[];
}

const ResponsesSection: React.FC<ResponsesSectionProps> = ({ responses }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'invited'>('all');
  const [sortBy, setSortBy] = useState('rating');
  const [filterBy, setFilterBy] = useState('all');

  const invitedCount = responses.filter(r => r.invited).length;
  const filteredResponses = responses.filter(response => {
    if (activeTab === 'invited' && !response.invited) return false;
    if (filterBy === 'verified' && !response.verified) return false;
    return true;
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-deep-teal mb-4">
        Responses ({responses.length})
      </h2>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="tabs tabs-bordered">
          <button 
            className={`tab tab-bordered ${activeTab === 'all' ? 'tab-active text-deep-teal' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({responses.length})
          </button>
          <button 
            className={`tab tab-bordered ${activeTab === 'invited' ? 'tab-active text-deep-teal' : ''}`}
            onClick={() => setActiveTab('invited')}
          >
            Invited ({invitedCount})
          </button>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="select select-bordered select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
          </select>
          <select 
            className="select select-bordered select-sm"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Providers</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResponses.map((provider) => (
          <div key={provider.id} className="card bg-base-100 shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition-shadow">
            <div className="avatar mb-4">
              <div className="w-24 h-24 rounded-full mx-auto">
                <img src={provider.avatar} alt={provider.name} />
              </div>
            </div>
            
            <h3 className="font-semibold text-deep-teal mb-2">{provider.name}</h3>
            
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">{provider.rating}</span>
            </div>
            
            <p className="text-lg font-bold text-bright-orange mb-1">${provider.price}</p>
            <p className="text-xs text-gray-500 mb-4">{provider.specialties.join(', ')}</p>
            
            {provider.verified && (
              <div className="flex justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" title="Verified Provider" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsesSection;