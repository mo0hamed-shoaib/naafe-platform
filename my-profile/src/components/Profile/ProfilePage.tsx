import React, { useState } from 'react';
import { Phone, Mail, MapPin, Share2, MessageCircle } from 'lucide-react';
import AvatarCard from './AvatarCard';
import EditableField from './EditableField';
import ServiceCard from './ServiceCard';
import ReviewSection from './ReviewSection';
import { ProfileData, EditableFields, Service } from '../../types/Profile';

interface ProfilePageProps {
  profileData: ProfileData;
  onUpdateProfile?: (fields: Partial<EditableFields>) => void;
  onContactProvider?: () => void;
  onShareProfile?: () => void;
  onBookService?: (serviceId: string) => void;
  isRTL?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  profileData,
  onUpdateProfile,
  onContactProvider,
  onShareProfile,
  onBookService,
  isRTL = false,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about' | 'schedule'>('services');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  
  const [editableFields, setEditableFields] = useState<EditableFields>({
    phone: profileData.phone || '',
    email: profileData.email || '',
    location: profileData.location,
    bio: profileData.bio,
  });

  const handleFieldEdit = (field: string) => {
    setEditingField(field);
  };

  const handleFieldSave = (field: string, value: string) => {
    const updatedFields = { ...editableFields, [field]: value };
    setEditableFields(updatedFields);
    setEditingField(null);
    onUpdateProfile?.(updatedFields);
  };

  const handleFieldCancel = () => {
    setEditingField(null);
  };

  const filteredServices = profileData.services.filter(
    (service) => serviceFilter === 'all' || service.category === serviceFilter
  );

  const ratingDistribution = {
    5: 70,
    4: 20,
    3: 5,
    2: 3,
    1: 2,
  };

  const tabs = [
    { key: 'services', label: 'Services Offered' },
    { key: 'reviews', label: 'Reviews & Ratings' },
    { key: 'about', label: 'About Me' },
  ];

  return (
    <div className={`min-h-screen bg-naafe-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-naafe-card rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <AvatarCard
                avatar={profileData.avatar}
                name={profileData.name}
                title={profileData.title}
                location={editableFields.location}
                rating={profileData.rating}
                reviewCount={profileData.reviewCount}
                isVerified={profileData.isVerified}
                isPremium={true}
              />
              
              <div className="flex flex-col gap-3 lg:ml-auto shrink-0 w-full lg:w-auto">
                <button
                  onClick={onContactProvider}
                  className="btn btn-primary w-full lg:w-auto font-jakarta"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Provider
                </button>
                <button
                  onClick={onShareProfile}
                  className="btn btn-secondary w-full lg:w-auto font-jakarta"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </button>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-accent w-full lg:w-auto font-jakarta"
                >
                  {isEditing ? 'Done Editing' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Editable Contact Info */}
            {isEditing && (
              <div className="mt-8 pt-8 border-t border-base-300">
                <h3 className="text-lg font-semibold mb-4 font-jakarta">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="Phone"
                    value={editableFields.phone}
                    isEditing={editingField === 'phone'}
                    onEdit={() => handleFieldEdit('phone')}
                    onSave={(value) => handleFieldSave('phone', value)}
                    onCancel={handleFieldCancel}
                    type="tel"
                    placeholder="Enter phone number"
                    rtl={isRTL}
                  />
                  <EditableField
                    label="Email"
                    value={editableFields.email}
                    isEditing={editingField === 'email'}
                    onEdit={() => handleFieldEdit('email')}
                    onSave={(value) => handleFieldSave('email', value)}
                    onCancel={handleFieldCancel}
                    type="email"
                    placeholder="Enter email address"
                    rtl={isRTL}
                  />
                  <EditableField
                    label="Location"
                    value={editableFields.location}
                    isEditing={editingField === 'location'}
                    onEdit={() => handleFieldEdit('location')}
                    onSave={(value) => handleFieldSave('location', value)}
                    onCancel={handleFieldCancel}
                    placeholder="Enter location"
                    rtl={isRTL}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-base-300 mb-8">
            <nav className="flex space-x-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-semibold transition-colors ${
                    activeTab === tab.key
                      ? 'border-naafe-primary text-naafe-primary'
                      : 'border-transparent text-neutral/70 hover:border-base-300 hover:text-neutral'
                  } font-jakarta`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'services' && (
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-neutral font-jakarta">Interior Design Services</h2>
                  <div className="flex gap-2">
                    {(['all', 'residential', 'commercial'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setServiceFilter(filter)}
                        className={`btn btn-sm font-jakarta ${
                          serviceFilter === filter ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onBookNow={onBookService || (() => {})}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection
                rating={profileData.rating}
                reviewCount={profileData.reviewCount}
                reviews={profileData.reviews}
                ratingDistribution={ratingDistribution}
              />
            )}

            {activeTab === 'about' && (
              <section className="bg-naafe-card rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-neutral mb-4 font-jakarta">About Me</h2>
                <EditableField
                  label="Biography"
                  value={editableFields.bio}
                  isEditing={editingField === 'bio'}
                  onEdit={() => handleFieldEdit('bio')}
                  onSave={(value) => handleFieldSave('bio', value)}
                  onCancel={handleFieldCancel}
                  type="textarea"
                  placeholder="Tell us about yourself..."
                  rtl={isRTL}
                />
                
                {/* Portfolio Section */}
                <div className="mt-8 pt-8 border-t border-base-300">
                  <h3 className="text-2xl font-bold text-neutral mb-6 font-jakarta">Portfolio</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="rounded-xl overflow-hidden aspect-square bg-naafe-card border-2 border-dashed border-naafe-primary/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-naafe-primary/40 mb-2">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <p className="text-naafe-primary/60 text-sm font-medium font-jakarta">Coming Soon</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;