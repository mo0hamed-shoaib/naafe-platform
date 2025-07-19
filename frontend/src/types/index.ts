export interface ServiceCategory {
  id: string;
  name: string;
  serviceCount: number;
  startingPrice: number;
  icon: React.ComponentType<{ className?: string }>;
  dateAdded?: string; // ISO date string for sorting by recently added
  numServices?: number;
  avgServicePrice?: number;
  numRequests?: number;
  avgRequestPrice?: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  rating: number;
  category: string;
  description: string;
  location: string;
  startingPrice: number;
  imageUrl: string;
  isPremium: boolean;
  isTopRated: boolean;
  completedJobs: number;
  isIdentityVerified: boolean;
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: string;
  postedBy: {
    id: string;
    name: string;
    avatar?: string;
    isPremium: boolean;
  };
  createdAt: string;
  preferredDate?: string;
  status: 'open' | 'accepted' | 'closed';
  category: string;
  urgency?: 'low' | 'medium' | 'high';
  availability: {
    days: string[];
    timeSlots: string[];
  };
}

export interface FilterState {
  search: string;
  location: string;
  priceRange: string;
  rating: string;
  category?: string;
  tab?: 'services' | 'requests';
  premiumOnly?: boolean;
  availability?: {
    days: string[];
    timeSlots: string[];
  };
}

export interface SortOption {
  value: string;
  label: string;
}

export interface User {
  id: string;
  name: { first: string; last: string };
  email: string;
  avatar?: string;
  avatarUrl?: string;
  isPremium?: boolean;
  isTopRated?: boolean;
  isVerified?: boolean;
  phone?: string;
  roles: ('admin' | 'seeker' | 'provider')[];
  profile?: {
    bio?: string;
    location?: {
      address?: string;
      coordinates?: [number, number];
    };
  };
}