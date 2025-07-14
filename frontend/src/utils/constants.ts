// Application constants and configuration

export const APP_CONFIG = {
  name: "نافع",
  description: "ابحث عن المساعدة التي تحتاجها من محترفينا المحليين الموثوقين",
  version: "1.0.0"
};

export const ROUTES = {
  HOME: "/",
  CATEGORIES: "/categories",
  SEARCH: "/search",
  PROVIDER_DETAILS: "/provider/:id",
  SERVICES: "/services",
  BUSINESS: "/business",
  EXPLORE: "/explore"
} as const;

export const PRICE_RANGES = {
  LOW: { value: "$", label: "$ (Under $30)", max: 30 },
  MEDIUM: { value: "$$", label: "$$ ($30 - $60)", min: 30, max: 60 },
  HIGH: { value: "$$$", label: "$$$ (Over $60)", min: 60 }
} as const;

export const RATING_OPTIONS = [
  { value: "4", label: "4+ نجوم" },
  { value: "4.5", label: "4.5+ نجوم" },
  { value: "5", label: "5 نجوم" }
] as const;

export const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA", 
  "Chicago, IL",
  "Austin, TX",
  "San Francisco, CA"
] as const;

export const CATEGORIES = [
  "التنظيف",
  "الدراسة", 
  "التصوير",
  "إصلاح المنزل",
  "تنسيق الحدائق"
] as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "naafe_user_preferences",
  SEARCH_HISTORY: "naafe_search_history",
  RECENT_VIEWS: "naafe_recent_views"
} as const;

// API endpoints (for future integration)
export const API_ENDPOINTS = {
  CATEGORIES: "/api/categories",
  PROVIDERS: "/api/providers",
  REQUESTS: "/api/requests",
  SEARCH: "/api/search",
  PROVIDER_DETAILS: "/api/providers/:id",
  REQUEST_DETAILS: "/api/requests/:id",
  POST_REQUEST: "/api/requests"
} as const; 