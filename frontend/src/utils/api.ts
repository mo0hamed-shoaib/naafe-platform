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
  },

  // Upgrade request endpoints
  upgradeRequests: {
    getMyRequests: (token: string) =>
      apiRequest('/api/upgrade-requests/me', {
        headers: getAuthHeaders(token),
      }),
  },
};

// Export the base URL for other uses (like Socket.IO)
export { API_BASE };
export default api;
