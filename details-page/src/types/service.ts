export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  price: number;
  specialties: string[];
  verified?: boolean;
  invited?: boolean;
}

export interface ServiceComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  timeline: string;
  location: string;
  distance: string;
  postedDate: string;
  images: string[];
  requester: {
    name: string;
    avatar: string;
    joinDate: string;
  };
  responses: ServiceProvider[];
  comments: ServiceComment[];
  views: number;
}

export interface SimilarService {
  id: string;
  name: string;
  icon: string;
}