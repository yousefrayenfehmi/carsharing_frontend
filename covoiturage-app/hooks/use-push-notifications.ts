import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './use-auth';
import { router } from 'expo-router';
import {
  initializeNotifications,
  unregisterPushToken,
} from '../services/notification.service';

/**
 * Hook pour gérer les notifications push
 */
export function usePushNotifications() {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Vérifier si les notifications sont disponibles (pas sur Expo Go SDK 53+)
    const notificationsAvailable = typeof Notifications.addNotificationReceivedListener === 'function';
    
    if (!notificationsAvailable) {
      console.log('⚠️ Notifications push non disponibles (Expo Go). Utilisez un development build.');
      return;
    }

    // Initialiser les notifications uniquement si l'utilisateur est connecté
    if (user) {
      initializeNotifications().then((token) => {
        if (token) {
          setExpoPushToken(token);
          console.log('✅ Notifications push initialisées avec le token:', token);
        }
      });
    }

    // Écouter les notifications reçues pendant que l'app est ouverte
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📱 Notification reçue:', notification);
      setNotification(notification);
    });

    // Écouter les interactions avec les notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification cliquée:', response);
      const data = response.notification.request.content.data;
      
      // Naviguer vers un écran spécifique selon le type de notification
      switch (data.type) {
        case 'new_booking':
          console.log('➡️ Navigation vers les réservations du trajet...');
          if (data.tripId) {
            // Naviguer vers les réservations du trajet spécifique
            router.push(`/trip-bookings?tripId=${data.tripId}`);
          } else {
            // Naviguer vers l'écran des trajets (qui affiche toutes les réservations)
            router.push('/(tabs)/trips');
          }
          break;
          
        case 'new_negotiation':
          console.log('➡️ Navigation vers les négociations...');
          if (data.tripId) {
            // Naviguer vers les négociations du trajet spécifique
            router.push(`/trip-negotiations/${data.tripId}`);
          } else {
            // Naviguer vers toutes les négociations
            router.push('/negotiations');
          }
          break;
          
        case 'booking_confirmed':
        case 'booking_rejected':
          console.log('➡️ Navigation vers mes réservations...');
          // Naviguer vers l'écran des réservations du passager
          router.push('/my-bookings');
          break;
          
        case 'counter_offer':
        case 'negotiation_accepted':
          console.log('➡️ Navigation vers les négociations...');
          if (data.tripId) {
            // Naviguer vers les négociations du trajet spécifique
            router.push(`/trip-negotiations/${data.tripId}`);
          } else if (data.negotiationId) {
            // Naviguer vers toutes les négociations (on pourrait améliorer pour ouvrir la négociation spécifique)
            router.push('/negotiations');
          } else {
            // Par défaut, naviguer vers toutes les négociations
            router.push('/negotiations');
          }
          break;
          
        case 'trip_cancelled':
          console.log('➡️ Navigation vers mes trajets...');
          // Naviguer vers l'écran des trajets
          router.push('/(tabs)/trips');
          break;
          
        default:
          console.log('⚠️ Type de notification inconnu:', data.type);
      }
    });

    // Nettoyer les listeners lors du démontage
    return () => {
      // Vérifier que la fonction existe avant de l'appeler
      if (notificationListener.current && typeof Notifications.removeNotificationSubscription === 'function') {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current && typeof Notifications.removeNotificationSubscription === 'function') {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      
      // Supprimer le push token lors de la déconnexion
      if (!user && expoPushToken) {
        unregisterPushToken(expoPushToken);
      }
    };
  }, [user, expoPushToken]);

  return {
    expoPushToken,
    notification,
  };
}

