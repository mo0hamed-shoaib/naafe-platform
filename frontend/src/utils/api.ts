// Centralized API utility for backend communication
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Ensure API_BASE_URL has proper protocol
const getApiBaseUrl = () => {
  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    return API_BASE_URL;
  }
  return `https://${API_BASE_URL}`;
};

const API_BASE = getApiBaseUrl();

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
  
  return fetch(url, config);
};

// Helper function to get auth headers
export const getAuthHeaders = (token?: string | null) => {
  if (!token) return {};
  
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Specific API functions for common endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (userData: any) =>
      apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    
    refreshToken: (refreshToken: string) =>
      apiRequest('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),
  },

  // User endpoints
  user: {
    getMe: (token: string) =>
      apiRequest('/api/users/me', {
        headers: getAuthHeaders(token),
      }),
    
    getById: (userId: string, token: string) =>
      apiRequest(`/api/users/${userId}`, {
        headers: getAuthHeaders(token),
      }),
    
    getStats: (userId: string, token: string) =>
      apiRequest(`/api/users/${userId}/stats`, {
        headers: getAuthHeaders(token),
      }),
    
    getUserListings: (userId: string, token: string) =>
      apiRequest(`/api/users/${userId}/listings`, {
        headers: getAuthHeaders(token),
      }),
    
    getMyListings: (token: string) =>
      apiRequest('/api/listings/users/me/listings', {
        headers: getAuthHeaders(token),
      }),
    
    getMyRequests: (token: string) =>
      apiRequest('/api/users/me/requests', {
        headers: getAuthHeaders(token),
      }),
    
    getSavedServices: (token: string) =>
      apiRequest('/api/users/me/saved-services', {
        headers: getAuthHeaders(token),
      }),

    checkSavedService: (serviceId: string, token: string) =>
      apiRequest(`/api/users/me/saved-services/${serviceId}`, {
        headers: getAuthHeaders(token),
      }),

    saveService: (serviceId: string, token: string) =>
      apiRequest(`/api/users/me/saved-services/${serviceId}`, {
        method: 'POST',
        headers: getAuthHeaders(token),
      }),

    unsaveService: (serviceId: string, token: string) =>
      apiRequest(`/api/users/me/saved-services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }),
    
    getSkills: (token: string) =>
      apiRequest('/api/users/me/skills', {
        headers: getAuthHeaders(token),
      }),
    
    updateSkills: (skills: string[], token: string) =>
      apiRequest('/api/users/me/skills', {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ skills }),
      }),
    
    getPortfolio: (userId: string, token: string) =>
      apiRequest(`/api/users/${userId}/portfolio`, {
        headers: getAuthHeaders(token),
      }),
  },

  // Category endpoints
  categories: {
    getAll: () => apiRequest('/api/categories'),
  },

  // Provider endpoints
  providers: {
    getFeatured: () => apiRequest('/api/users/providers/featured'),
  },

  // Ad endpoints
  ads: {
    getActive: (type: string, location: string, limit: number) =>
      apiRequest(`/api/ads/active?type=${type}&location=${location}&limit=${limit}`),
    
    getMyAds: (token: string) =>
      apiRequest('/api/ads/my-ads', {
        headers: getAuthHeaders(token),
      }),
  },

  // Request endpoints
  requests: {
    getAll: (params?: URLSearchParams) =>
      apiRequest(`/api/requests${params ? `?${params.toString()}` : ''}`),
    
    getById: (id: string) => apiRequest(`/api/requests/${id}`),
    
    create: (requestData: any, token: string) =>
      apiRequest('/api/requests', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(requestData),
      }),

    getOffers: (id: string, token: string) =>
      apiRequest(`/api/requests/${id}/offers`, {
        headers: getAuthHeaders(token),
      }),
  },

  // Listing endpoints
  listings: {
    getAll: (params?: URLSearchParams) =>
      apiRequest(`/api/listings/listings${params ? `?${params.toString()}` : ''}`),
    
    create: (listingData: any, token: string) =>
      apiRequest('/api/listings/listings', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(listingData),
      }),
  },

  // Notification endpoints
  notifications: {
    get: (token: string, limit?: number) =>
      apiRequest(`/api/notifications?limit=${limit || 10}`, {
        headers: getAuthHeaders(token),
      }),
    
    markAsRead: (notificationId: string, token: string) =>
      apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      }),
    
    markAllAsRead: (token: string) =>
      apiRequest('/api/notifications/mark-all-read', {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      }),
  },

  // Upgrade request endpoints
  upgradeRequests: {
    getMyRequests: (token: string) =>
      apiRequest('/api/upgrade-requests/me', {
        headers: getAuthHeaders(token),
      }),
    
    markAsViewed: (token: string) =>
      apiRequest('/api/upgrade-requests/viewed', {
        method: 'PATCH',
        headers: getAuthHeaders(token),
      }),
  },

  // Reports endpoints
  reports: {
    create: (data: any, token: string) =>
      apiRequest('/api/reports', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(data),
      }),
  },

  // Admin endpoints
  admin: {
    getUpgradeRequests: (token: string) =>
      apiRequest('/api/admin/upgrade-requests', {
        headers: getAuthHeaders(token),
      }),
    
    createUpgradeRequest: (payload: any, token: string) =>
      apiRequest('/api/admin/upgrade-requests', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      }),

    getStats: (token: string) =>
      apiRequest('/api/admin/stats', {
        headers: getAuthHeaders(token),
      }),

    getUserGrowthData: (token: string) =>
      apiRequest('/api/admin/charts/user-growth', {
        headers: getAuthHeaders(token),
      }),

    getServiceCategoriesData: (token: string) =>
      apiRequest('/api/admin/charts/service-categories', {
        headers: getAuthHeaders(token),
      }),

    getRevenueData: (token: string) =>
      apiRequest('/api/admin/charts/revenue', {
        headers: getAuthHeaders(token),
      }),

    getActivityData: (token: string) =>
      apiRequest('/api/admin/activity', {
        headers: getAuthHeaders(token),
      }),

    getUsers: (page: number, token: string) =>
      apiRequest(`/api/users?page=${page}`, {
        headers: getAuthHeaders(token),
      }),

    getVerifications: (page: number, token: string) =>
      apiRequest(`/api/verification/all?page=${page}`, {
        headers: getAuthHeaders(token),
      }),

    getCategories: (page: number, token: string) =>
      apiRequest(`/api/categories?page=${page}`, {
        headers: getAuthHeaders(token),
      }),

    getComplaints: (page: number, token: string) =>
      apiRequest(`/api/complaints/admin?page=${page}`, {
        headers: getAuthHeaders(token),
      }),
  },

  // Review endpoints
  reviews: {
    getUserReviews: (userId: string, token: string) =>
      apiRequest(`/api/reviews/user/${userId}`, {
        headers: getAuthHeaders(token),
      }),

    create: (payload: any, token: string) =>
      apiRequest('/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      }),
  },

  // Payment endpoints
  payment: {
    getTransactions: (page: number, limit: number, token: string) =>
      apiRequest(`/api/payment/transactions?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(token),
      }),
  },

  // Chat endpoints
  chat: {
    getConversations: (page: number, limit: number, token: string) =>
      apiRequest(`/api/chat/conversations?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(token),
      }),
    
    getConversation: (conversationId: string, token: string) =>
      apiRequest(`/api/chat/conversations/${conversationId}`, {
        headers: getAuthHeaders(token),
      }),
    
    getConversationMessages: (conversationId: string, page: number, limit: number, token: string) =>
      apiRequest(`/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(token),
      }),
  },

  // Offer endpoints
  offers: {
    getByJobRequestAndProvider: (jobRequestId: string, providerId: string, token: string) =>
      apiRequest(`/api/offers?jobRequest=${jobRequestId}&provider=${providerId}`, {
        headers: getAuthHeaders(token),
      }),

    getById: (offerId: string, token: string) =>
      apiRequest(`/api/offers/${offerId}`, {
        headers: getAuthHeaders(token),
      }),

    getNegotiationHistory: (offerId: string, token: string) =>
      apiRequest(`/api/offers/${offerId}/negotiation-history`, {
        headers: getAuthHeaders(token),
      }),

    checkPaymentStatus: (offerId: string, token: string) =>
      apiRequest(`/api/payment/check-status/${offerId}`, {
        headers: getAuthHeaders(token),
      }),

    accept: (offerId: string, token: string) =>
      apiRequest(`/api/offers/${offerId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders(token),
      }),

    createEscrowPayment: (payload: any, token: string) =>
      apiRequest('/api/payment/create-escrow-payment', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      }),

    complete: (offerId: string, token: string) =>
      apiRequest(`/api/offers/${offerId}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(token),
      }),

    cancelRequest: (offerId: string, payload: any, token: string) =>
      apiRequest(`/api/offers/${offerId}/cancel-request`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      }),
  },
};

// Export the base URL for other uses (like Socket.IO)
export { API_BASE };
export default api;
