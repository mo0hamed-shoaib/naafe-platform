import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Bell, 
  Sun, 
  Lock, 
  Settings as SettingsIcon,
  Eye,
  Users,
  Key,
  Download,
  Trash2,
  CheckCircle
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { id: 'account', label: 'Account Information', icon: <User size={20} /> },
  { id: 'verification', label: 'Verification Center', icon: <Shield size={20} /> },
  { id: 'notifications', label: 'Notification Preferences', icon: <Bell size={20} /> },
  { id: 'theme', label: 'Theme Selection', icon: <Sun size={20} /> },
  { id: 'privacy', label: 'Privacy Settings', icon: <Lock size={20} /> },
  { id: 'management', label: 'Account Management', icon: <SettingsIcon size={20} /> },
];

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    app: true,
    email: false,
  });
  const [theme, setTheme] = useState('system');

  const toggleNotification = (type: 'app' | 'email') => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const renderAccountInformation = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Account Information</h2>
        <p className="text-[#50958A]">Update your personal details and preferences.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-[#2D5D4F] mb-6">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#0E1B18] mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5D4F] focus:border-transparent transition-all duration-300"
              id="fullName"
              type="text"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0E1B18] mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5D4F] focus:border-transparent transition-all duration-300"
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0E1B18] mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5D4F] focus:border-transparent transition-all duration-300"
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0E1B18] mb-2" htmlFor="dob">
              Date of Birth
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5D4F] focus:border-transparent transition-all duration-300"
              id="dob"
              type="date"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#0E1B18] mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#2D5D4F] focus:border-transparent transition-all duration-300"
              id="gender"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-[#2D5D4F] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1a3529] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Update Information
          </button>
        </div>
      </div>
    </div>
  );

  const renderVerificationCenter = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Verification Center</h2>
        <p className="text-[#50958A]">Verify your identity to unlock additional features and increase trust.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-[#2D5D4F]/5 to-[#F5A623]/5 border border-[#2D5D4F]/10">
          <div className="flex items-center gap-4">
            <div className="bg-[#2D5D4F] p-4 rounded-full text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-[#0E1B18] text-lg">Identity Verification</h4>
              <p className="text-[#50958A] mt-1">Verify your identity to unlock additional features and build trust with other users.</p>
            </div>
          </div>
          <button className="bg-[#F5A623] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#e6950e] transform hover:scale-105 transition-all duration-300 shadow-lg">
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationPreferences = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Notification Preferences</h2>
        <p className="text-[#50958A]">Customize how you receive updates and notifications.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-[#2D5D4F] mb-6">Communication Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">App Notifications</h4>
                <p className="text-[#50958A] text-sm mt-1">Receive notifications for requests, updates, and promotions.</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('app')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                notifications.app ? 'bg-[#2D5D4F]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  notifications.app ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">Email Notifications</h4>
                <p className="text-[#50958A] text-sm mt-1">Get email updates about your account and announcements.</p>
              </div>
            </div>
            <button
              onClick={() => toggleNotification('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                notifications.email ? 'bg-[#2D5D4F]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemeSelection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Theme Selection</h2>
        <p className="text-[#50958A]">Choose your preferred theme for the best visual experience.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-[#2D5D4F] mb-6">Appearance</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System Default' }
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:border-[#2D5D4F] transition-all duration-300">
              <input
                type="radio"
                name="theme"
                value={option.value}
                checked={theme === option.value}
                onChange={(e) => setTheme(e.target.value)}
                className="w-4 h-4 text-[#2D5D4F] focus:ring-[#2D5D4F]"
              />
              <span className="font-medium text-[#0E1B18]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Privacy Settings</h2>
        <p className="text-[#50958A]">Control your privacy and data sharing preferences.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-[#2D5D4F] mb-6">Privacy Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Eye size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">Profile Visibility</h4>
                <p className="text-[#50958A] text-sm mt-1">Control who can see your profile information.</p>
              </div>
            </div>
            <button className="bg-gray-100 text-[#0E1B18] font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              Manage
            </button>
          </div>
          
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">Blocked Users</h4>
                <p className="text-[#50958A] text-sm mt-1">Manage users you've blocked from contacting you.</p>
              </div>
            </div>
            <button className="bg-gray-100 text-[#0E1B18] font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountManagement = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-semibold text-[#0E1B18] mb-2">Account Management</h2>
        <p className="text-[#50958A]">Manage your account security and data.</p>
      </div>
      
      <div className="bg-[#FDF8F0] rounded-2xl shadow-md p-8">
        <h3 className="text-2xl font-semibold text-[#2D5D4F] mb-6">Security & Data</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Key size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">Change Password</h4>
                <p className="text-[#50958A] text-sm mt-1">Keep your account secure with a strong password.</p>
              </div>
            </div>
            <button className="bg-gray-100 text-[#0E1B18] font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-[#2D5D4F]/10 p-3 rounded-full text-[#2D5D4F]">
                <Download size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-[#0E1B18]">Download Account Data</h4>
                <p className="text-[#50958A] text-sm mt-1">Get a copy of all your data and activity.</p>
              </div>
            </div>
            <button className="bg-gray-100 text-[#0E1B18] font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300">
              Download
            </button>
          </div>
          
          <div className="flex items-center justify-between p-6 rounded-xl bg-red-50 border border-red-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Delete Account</h4>
                <p className="text-red-600 text-sm mt-1">Permanently delete your account and all data.</p>
              </div>
            </div>
            <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountInformation();
      case 'verification':
        return renderVerificationCenter();
      case 'notifications':
        return renderNotificationPreferences();
      case 'theme':
        return renderThemeSelection();
      case 'privacy':
        return renderPrivacySettings();
      case 'management':
        return renderAccountManagement();
      default:
        return renderAccountInformation();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-xl min-h-screen sticky top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#0E1B18] mb-8">Settings</h1>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-[#2D5D4F] text-white shadow-lg transform scale-105'
                      : 'text-[#50958A] hover:bg-[#2D5D4F]/5 hover:text-[#2D5D4F]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;