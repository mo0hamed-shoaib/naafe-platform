import React from 'react';
import ProfilePage from './components/Profile/ProfilePage';
import { mockProfileData } from './data/mockProfileData';
import { EditableFields } from './types/Profile';

function App() {
  const handleUpdateProfile = (fields: Partial<EditableFields>) => {
    console.log('Profile updated:', fields);
    // Here you would typically update the profile data via API
  };

  const handleContactProvider = () => {
    console.log('Contact provider clicked');
    // Here you would typically open a contact modal or redirect
  };

  const handleShareProfile = () => {
    console.log('Share profile clicked');
    // Here you would typically open a share dialog
  };

  const handleBookService = (serviceId: string) => {
    console.log('Book service clicked:', serviceId);
    // Here you would typically navigate to booking page
  };

  return (
    <div className="min-h-screen bg-naafe-bg" data-theme="naafe">
      <ProfilePage
        profileData={mockProfileData}
        onUpdateProfile={handleUpdateProfile}
        onContactProvider={handleContactProvider}
        onShareProfile={handleShareProfile}
        onBookService={handleBookService}
        isRTL={false} // Set to true for Arabic RTL support
      />
    </div>
  );
}

export default App;