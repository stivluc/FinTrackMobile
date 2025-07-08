// Configuration API pour FinTrack Mobile
export const API_CONFIG = {
  BASE_URL: 'https://fintrack-api-czav.onrender.com/api',
  AUTH_URL: 'https://fintrack-api-czav.onrender.com/api/auth',
  TIMEOUT: 10000, // 10 secondes
  
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/jwt/create/',
      REFRESH: '/jwt/refresh/',
      PROFILE: '/profile/',
      PROFILE_STATS: '/profile/statistics/',
    },
    TRANSACTIONS: {
      LIST: '/transactions/',
      DASHBOARD: '/transactions/dashboard_stats/',
      ANALYTICS: '/transactions/analytics/',
    },
    BUDGETS: {
      LIST: '/budgets/',
      OVERVIEW: '/budgets/overview/',
    },
    CATEGORIES: {
      LIST: '/categories/',
    },
    ACCOUNTS: {
      LIST: '/accounts/',
    },
    ASSETS: {
      LIST: '/assets/',
      PORTFOLIO: '/assets/portfolio_summary/',
    },
  },
  
  // Clés de stockage pour AsyncStorage
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'fintrack_access_token',
    REFRESH_TOKEN: 'fintrack_refresh_token',
    USER_DATA: 'fintrack_user_data',
  },
} as const;