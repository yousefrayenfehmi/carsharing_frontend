import api from './api';
import * as SecureStore from 'expo-secure-store';

/**
 * Service d'authentification
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  wilaya?: string;
}

export interface Vehicle {
  brand: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  bio?: string;
  cin?: string;
  driverLicenseNumber?: string;
  vehicle?: Vehicle;
  rating: number;
  tripsCount: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  wilaya?: string;
  createdAt: string;
}

export interface AuthResponse {
  user?: User;
  admin?: any;
  isAdmin?: boolean;
  token: string;
  refreshToken?: string;
}

export const authService = {
  /**
   * Inscription avec email et mot de passe
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    console.log('credentials1', credentials);
    const response = await api.post('/auth/signup', credentials);
    const { user, token, refreshToken } = response.data.data;
    
    // Sauvegarder le token et l'utilisateur de manière sécurisée
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    if (refreshToken) {
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    
    return { user, token, refreshToken };
  },

  /**
   * Connexion avec email et mot de passe (utilisateurs et admins)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const { user, admin, isAdmin, token, refreshToken } = response.data.data;
    
    if (isAdmin && admin) {
      // Connexion admin - stocker dans AsyncStorage séparé
      await SecureStore.setItemAsync('adminToken', token);
      await SecureStore.setItemAsync('adminData', JSON.stringify(admin));
      if (refreshToken) {
        await SecureStore.setItemAsync('adminRefreshToken', refreshToken);
      }
      
      return { admin, isAdmin: true, token, refreshToken };
    } else {
      // Connexion utilisateur normale
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      if (refreshToken) {
        await SecureStore.setItemAsync('refreshToken', refreshToken);
      }
      
      return { user, isAdmin: false, token, refreshToken };
    }
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    const user = response.data.data;
    
    // Mettre à jour l'utilisateur en cache de manière sécurisée
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    
    return user;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Supprimer les données locales de manière sécurisée
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureStore.getItemAsync('userToken');
    return !!token;
  },

  /**
   * Récupérer l'utilisateur du cache
   */
  async getCachedUser(): Promise<User | null> {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  },

  /**
   * Envoyer un code de vérification par email
   */
  async sendEmailVerification(): Promise<void> {
    await api.post('/auth/send-email-verification');
  },

  /**
   * Vérifier l'email avec le code
   */
  async verifyEmail(code: string): Promise<void> {
    const response = await api.post('/auth/verify-email', { code });
    
    // Mettre à jour l'utilisateur en cache
    const cachedUser = await this.getCachedUser();
    if (cachedUser) {
      cachedUser.isEmailVerified = true;
      await SecureStore.setItemAsync('user', JSON.stringify(cachedUser));
    }
  },

  /**
   * Demander un code de réinitialisation de mot de passe
   */
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  /**
   * Vérifier le code de réinitialisation
   */
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/verify-reset-code', { email, code });
      return response.data.data.codeValid;
    } catch (error) {
      return false;
    }
  },

  /**
   * Réinitialiser le mot de passe avec le code
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { email, code, newPassword });
  },
};

