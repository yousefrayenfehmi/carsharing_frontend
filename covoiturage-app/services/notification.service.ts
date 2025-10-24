import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './api';

/**
 * Service de gestion des notifications push
 */

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Demander la permission pour les notifications push
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    console.log('⚠️ Les notifications push ne fonctionnent que sur un appareil physique');
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Demander la permission si pas encore accordée
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Permission refusée pour les notifications');
      return false;
    }

    console.log('✅ Permission accordée pour les notifications');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la demande de permission:', error);
    return false;
  }
};

/**
 * Obtenir le push token Expo
 */
export const getPushToken = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('⚠️ Les notifications push ne fonctionnent que sur un appareil physique');
    return null;
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (!projectId) {
      console.error('❌ Project ID non trouvé dans app.json');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log('📱 Push token obtenu:', token.data);
    return token.data;
  } catch (error) {
    console.error('❌ Erreur lors de l\'obtention du push token:', error);
    return null;
  }
};

/**
 * Enregistrer le push token sur le serveur
 */
export const registerPushToken = async (token: string): Promise<boolean> => {
  try {
    const deviceType = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';
    
    await api.post('/push-tokens', {
      token,
      deviceType,
    });

    console.log('✅ Push token enregistré sur le serveur');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement du push token:', error);
    return false;
  }
};

/**
 * Supprimer le push token du serveur (lors de la déconnexion)
 */
export const unregisterPushToken = async (token: string): Promise<boolean> => {
  try {
    await api.delete(`/push-tokens/${encodeURIComponent(token)}`);
    console.log('✅ Push token supprimé du serveur');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du push token:', error);
    return false;
  }
};

/**
 * Configurer le canal de notification pour Android
 */
export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notifications générales',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
      sound: 'default',
    });

    // Canal pour les réservations
    await Notifications.setNotificationChannelAsync('bookings', {
      name: 'Réservations',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
      sound: 'default',
    });

    // Canal pour les négociations
    await Notifications.setNotificationChannelAsync('negotiations', {
      name: 'Négociations',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F59E0B',
      sound: 'default',
    });

    console.log('✅ Canaux de notifications Android configurés');
  }
};

/**
 * Initialiser le système de notifications
 */
export const initializeNotifications = async (): Promise<string | null> => {
  try {
    // Configurer les canaux Android
    await setupNotificationChannel();

    // Demander les permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Obtenir le push token
    const token = await getPushToken();
    if (!token) {
      return null;
    }

    // Enregistrer le token sur le serveur
    await registerPushToken(token);

    return token;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des notifications:', error);
    return null;
  }
};

/**
 * Afficher une notification locale (pour les tests)
 */
export const showLocalNotification = async (title: string, body: string, data?: any) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null, // Immédiatement
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'affichage de la notification:', error);
  }
};

