import api from './api';
import { Vehicle, User } from './auth-service';
import * as SecureStore from 'expo-secure-store';

/**
 * Service pour la gestion des utilisateurs
 */

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  cin?: string;
  driverLicenseNumber?: string;
  vehicle?: Vehicle;
}

export const userService = {
  /**
   * Récupérer le profil d'un utilisateur
   */
  async getUserProfile(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Mettre à jour son profil
   */
  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await api.put('/users/profile', data);
    const updatedUser = response.data.data;
    
    // Mettre à jour le cache local
    await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  /**
   * Upload une photo de profil
   */
  async uploadProfilePicture(imageUri: string): Promise<any> {
    const formData = new FormData();
    
    // Extraire l'extension du fichier
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('profilePicture', {
      uri: imageUri,
      name: `profile.${fileType}`,
      type: `image/${fileType}`,
    } as any);

    const response = await api.post('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Récupérer les trajets d'un utilisateur
   */
  async getUserTrips(id: string, role: 'driver' | 'passenger' = 'driver'): Promise<any[]> {
    const response = await api.get(`/users/${id}/trips`, {
      params: { role },
    });
    return response.data.data;
  },

  /**
   * Récupérer les avis d'un utilisateur
   */
  async getUserReviews(id: string): Promise<any[]> {
    const response = await api.get(`/users/${id}/reviews`);
    return response.data.data;
  },

  /**
   * Supprimer son compte
   */
  async deleteAccount(): Promise<void> {
    await api.delete('/users/account');
  },
};

