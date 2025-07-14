import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AvatarCard from '../components/Profile/AvatarCard';
import EditableField from '../components/Profile/EditableField';
import ServiceCard from '../components/Profile/ServiceCard';
import ReviewSection from '../components/Profile/ReviewSection';
import { Button } from '../components/ui';
import { Service, Review } from '../types/Profile';
import Header from '../components/Header';
import Footer from '../components/Footer';
// TODO: Adapt types to your main types/index.ts

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  // TODO: Fetch additional profile data (services, reviews, etc.) from backend
  // For now, use user from context as base profile
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<'all' | 'residential' | 'commercial'>('all');

  // TODO: Replace with real editable fields from backend
  const [editableFields, setEditableFields] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    location: user?.profile?.location?.address || '',
    bio: user?.profile?.bio || '',
  });

  // TODO: Fetch services and reviews from backend
  const services: Service[] = [];
  const reviews: Review[] = [];
  const rating = 0;
  const reviewCount = 0;
  const isVerified = user?.isVerified || false;

  const handleFieldEdit = (field: string) => setEditingField(field);
  const handleFieldSave = (field: string, value: string) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
    setEditingField(null);
    // TODO: Call backend to update profile field
  };
  const handleFieldCancel = () => setEditingField(null);

  const filteredServices: Service[] = services.filter(
    (service: Service) => serviceFilter === 'all' || service.category === serviceFilter
  );

  const tabs = [
    { key: 'services', label: 'الخدمات المقدمة' },
    { key: 'reviews', label: 'التقييمات والمراجعات' },
    { key: 'about', label: 'عن المستخدم' },
  ];

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col" dir="rtl">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Profile Header */}
          <div className="bg-light-cream rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="flex-1">
                <AvatarCard
                  avatar={user?.avatarUrl || user?.avatar || ''}
                  name={user ? `${user.name?.first ?? ''} ${user.name?.last ?? ''}` : ''}
                  title={user?.role || ''}
                  location={editableFields.location}
                  rating={rating}
                  reviewCount={reviewCount}
                  isVerified={isVerified}
                  isPremium={user?.isPremium || false}
                />
              </div>
              <div className="flex flex-col gap-3 w-full max-w-xs lg:ml-auto lg:w-60 mt-6 lg:mt-0 self-end">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="font-jakarta"
                  // onClick={...}
                >
                  تواصل مع المستخدم
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  className="font-jakarta"
                  // onClick={...}
                >
                  مشاركة الملف الشخصي
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className="font-jakarta"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'تم' : 'تعديل الملف الشخصي'}
                </Button>
              </div>
            </div>
            {/* Editable Contact Info */}
            {isEditing && (
              <div className="mt-8 pt-8 border-t border-base-300">
                <h3 className="text-lg font-semibold mb-4 font-jakarta">معلومات التواصل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField
                    label="رقم الهاتف"
                    value={editableFields.phone}
                    isEditing={editingField === 'phone'}
                    onEdit={() => handleFieldEdit('phone')}
                    onSave={(value) => handleFieldSave('phone', value)}
                    onCancel={handleFieldCancel}
                    type="tel"
                    placeholder="أدخل رقم الهاتف"
                    rtl
                  />
                  <EditableField
                    label="البريد الإلكتروني"
                    value={editableFields.email}
                    isEditing={editingField === 'email'}
                    onEdit={() => handleFieldEdit('email')}
                    onSave={(value) => handleFieldSave('email', value)}
                    onCancel={handleFieldCancel}
                    type="email"
                    placeholder="أدخل البريد الإلكتروني"
                    rtl
                  />
                  <EditableField
                    label="الموقع"
                    value={editableFields.location}
                    isEditing={editingField === 'location'}
                    onEdit={() => handleFieldEdit('location')}
                    onSave={(value) => handleFieldSave('location', value)}
                    onCancel={handleFieldCancel}
                    placeholder="أدخل الموقع"
                    rtl
                  />
                </div>
              </div>
            )}
          </div>
          {/* Tabs */}
          <div className="border-b border-base-300 mb-8">
            <div role="tablist" aria-label="Profile Tabs">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <Button
                    key={tab.key}
                    variant={activeTab === tab.key ? 'primary' : 'ghost'}
                    size="sm"
                    className={`font-jakarta rounded-none border-b-2 ${activeTab === tab.key ? 'border-deep-teal text-deep-teal' : 'border-transparent text-soft-teal hover:border-base-300 hover:text-deep-teal'}`}
                    aria-selected={activeTab === tab.key}
                    aria-controls={`tabpanel-${tab.key}`}
                    role="tab"
                    onClick={() => setActiveTab(tab.key as 'services' | 'reviews' | 'about')}
                    style={{ minWidth: 100 }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'services' && (
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-deep-teal font-jakarta">الخدمات</h2>
                  <div className="flex gap-2">
                    {(['all', 'residential', 'commercial'] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant={serviceFilter === filter ? 'primary' : 'ghost'}
                        size="sm"
                        className="font-jakarta"
                        onClick={() => setServiceFilter(filter)}
                      >
                        {filter === 'all' ? 'الكل' : filter === 'residential' ? 'سكني' : 'تجاري'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service: Service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onBookNow={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}
            {activeTab === 'reviews' && (
              <ReviewSection
                rating={rating}
                reviewCount={reviewCount}
                reviews={reviews as Review[]}
                ratingDistribution={{}}
              />
            )}
            {activeTab === 'about' && (
              <section className="bg-light-cream rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-deep-teal mb-4 font-jakarta">عن المستخدم</h2>
                <EditableField
                  label="السيرة الذاتية"
                  value={editableFields.bio}
                  isEditing={editingField === 'bio'}
                  onEdit={() => handleFieldEdit('bio')}
                  onSave={(value) => handleFieldSave('bio', value)}
                  onCancel={handleFieldCancel}
                  type="textarea"
                  placeholder="اكتب عن نفسك..."
                  rtl
                />
                {/* Portfolio Section (optional) */}
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage; 