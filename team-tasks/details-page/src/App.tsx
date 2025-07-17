import React from 'react';
import PostedService from './components/PostedService';
import { ServiceRequest } from './types/service';

// Mock data
const mockService: ServiceRequest = {
  id: '1',
  title: 'Kitchen Deep Clean',
  description: "I need a thorough deep clean of my kitchen, including appliances, cabinets, and floors. I'm looking for someone with experience in deep cleaning and attention to detail.",
  category: 'Cleaning Services',
  budget: { min: 150, max: 200 },
  timeline: 'Flexible',
  location: 'Your Location',
  distance: '10 miles',
  postedDate: '2 days ago',
  views: 25,
  images: [
    'https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2062428/pexels-photo-2062428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2062429/pexels-photo-2062429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/2062430/pexels-photo-2062430.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ],
  requester: {
    name: 'Sophia',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    joinDate: '2021',
  },
  responses: [
    {
      id: '1',
      name: 'Liam',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.8,
      price: 160,
      specialties: ['Deep Cleaning', 'Organization'],
      verified: true,
    },
    {
      id: '2',
      name: 'Ethan',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.9,
      price: 180,
      specialties: ['Deep Cleaning', 'Eco-Friendly'],
      verified: false,
    },
    {
      id: '3',
      name: 'Noah',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      rating: 4.7,
      price: 170,
      specialties: ['Deep Cleaning', 'Appliances'],
      verified: false,
    },
  ],
  comments: [
    {
      id: '1',
      author: 'Sophia',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      content: "Hi, I'm looking for a deep clean of my kitchen. It's been a while since it was thoroughly cleaned, so I need someone who can really get into the details. I'm flexible with the timeline but would like it done within the next week. My budget is between $150 and $200. Please let me know if you're interested and what your quote would be.",
      timestamp: '2 days ago',
    },
  ],
};

function App() {
  const handleInterested = () => {
    console.log('User interested in service');
  };

  const handleShare = () => {
    console.log('Share service');
  };

  const handleBookmark = () => {
    console.log('Bookmark service');
  };

  const handleReport = () => {
    console.log('Report service');
  };

  return (
    <PostedService
      service={mockService}
      onInterested={handleInterested}
      onShare={handleShare}
      onBookmark={handleBookmark}
      onReport={handleReport}
    />
  );
}

export default App;