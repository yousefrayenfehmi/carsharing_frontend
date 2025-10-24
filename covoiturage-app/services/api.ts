import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../config';

/**
 * Configuration de l'API backend
 * La configuration de l'URL est centralisée dans config.ts
 */

/**
 * Instance Axios configurée
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur pour ajouter le token JWT à chaque requête
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Vérifier d'abord si c'est une route admin
      if (config.url?.startsWith('/admin')) {
        const adminToken = await SecureStore.getItemAsync('adminToken');
        if (adminToken) {
          config.headers.Authorization = `Bearer ${adminToken}`;
          return config;
        }
      }
      
      // Sinon utiliser le token utilisateur normal
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Intercepteur pour gérer les erreurs de réponse
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expiré ou invalide
    if (error.response?.status === 401) {
      // Supprimer le token et rediriger vers login de manière sécurisée
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('user');
      // L'application gérera la redirection via le contexte d'auth
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };

