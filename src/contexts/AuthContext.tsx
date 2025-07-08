import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, AuthTokens, AuthContextType } from '../types/auth';
import { apiService } from '../services/api';
import { API_CONFIG } from '../config/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedUser, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (storedUser && accessToken && refreshToken) {
        setUser(JSON.parse(storedUser));
        setTokens({
          access: accessToken,
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Appel à l'API réelle
      const user = await apiService.login(credentials);
      
      // Récupérer les tokens depuis AsyncStorage (stockés par apiService)
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (accessToken && refreshToken) {
        const tokens: AuthTokens = {
          access: accessToken,
          refresh: refreshToken,
        };

        // Stocker les données utilisateur
        await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(user));

        setUser(user);
        setTokens(tokens);
      } else {
        throw new Error('Erreur lors de la récupération des tokens');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.clearTokens();
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    try {
      const success = await apiService.refreshAuthToken();
      if (!success) {
        await logout();
        throw new Error('Unable to refresh token');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};