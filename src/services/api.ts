import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';
import { LoginCredentials, AuthTokens, User } from '../types/auth';

// Interface pour les réponses d'erreur de l'API
interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Interface pour la réponse de login
interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

class ApiService {
  private baseURL: string;
  private authURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.authURL = API_CONFIG.AUTH_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Méthode générique pour les requêtes HTTP
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('/auth') 
      ? `${this.authURL}${endpoint.replace('/auth', '')}`
      : `${this.baseURL}${endpoint}`;

    // Configuration de base
    const config: RequestInit = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Ajouter le token d'authentification si disponible
    const token = await this.getAccessToken();
    if (token && !endpoint.includes('/jwt/create') && !endpoint.includes('/jwt/refresh')) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Gestion des erreurs HTTP
      if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/jwt/')) {
          // Token expiré, essayer de le rafraîchir
          const refreshed = await this.refreshAuthToken();
          if (refreshed) {
            // Retry la requête avec le nouveau token
            return this.request<T>(endpoint, options);
          } else {
            // Échec du refresh, déconnecter l'utilisateur
            await this.clearTokens();
            throw new ApiError({
              message: 'Session expirée, veuillez vous reconnecter',
              status: 401,
            });
          }
        }

        const errorData = await response.json().catch(() => ({}));
        throw new ApiError({
          message: errorData.detail || errorData.message || 'Erreur de réseau',
          status: response.status,
          details: errorData,
        });
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new ApiError({
          message: 'Timeout - La requête a pris trop de temps',
          status: 408,
        });
      }
      
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        message: 'Erreur de connexion réseau',
        details: error,
      });
    }
  }

  // Méthodes d'authentification
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await this.request<LoginResponse>('/auth/jwt/create/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Stocker les tokens
      await this.storeTokens({
        access: response.access,
        refresh: response.refresh,
      });

      // Récupérer le profil utilisateur complet
      const userProfile = await this.getUserProfile();
      
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>('/auth/profile/');
  }

  async refreshAuthToken(): Promise<boolean> {
    try {
      const refreshToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        return false;
      }

      const response = await this.request<{ access: string }>('/auth/jwt/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: refreshToken }),
      });

      // Stocker le nouveau token d'accès
      await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Méthodes de gestion des tokens
  private async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.multiSet([
      [API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, tokens.access],
      [API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh],
    ]);
  }

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
      API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
      API_CONFIG.STORAGE_KEYS.USER_DATA,
    ]);
  }

  // Méthodes Analytics
  async getAnalytics(months: number = 6): Promise<any> {
    return this.request<any>(`/transactions/analytics/?months=${months}`);
  }

  async getDashboardStats(): Promise<any> {
    return this.request<any>('/transactions/dashboard_stats/');
  }

  async getBudgetOverview(): Promise<any> {
    return this.request<any>('/budgets/overview/');
  }

  async getTransactions(params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/transactions/${queryString}`);
  }

  // Méthodes utilitaires
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}

// Export d'une instance singleton
export const apiService = new ApiService();
export default apiService;