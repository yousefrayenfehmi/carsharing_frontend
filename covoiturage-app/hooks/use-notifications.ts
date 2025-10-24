import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNegotiations } from './use-negotiations';
import { Negotiation } from '@/services/negotiation-service';

interface NotificationState {
  hasNewUpdates: boolean;
  pendingCount: number;
  acceptedCount: number;
  rejectedCount: number;
}

export function useNotifications() {
  const { getMyNegotiations } = useNegotiations();
  const [notifications, setNotifications] = useState<NotificationState>({
    hasNewUpdates: false,
    pendingCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  });
  const [isPolling, setIsPolling] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Fonction pour vérifier les mises à jour
  const checkForUpdates = async () => {
    if (isPolling) return; // Éviter les appels multiples
    
    try {
      setIsPolling(true);
      const negotiations = await getMyNegotiations();
      
      if (!negotiations || !Array.isArray(negotiations)) {
        return;
      }
      
      const pending = negotiations.filter(n => n.status === 'pending');
      const accepted = negotiations.filter(n => n.status === 'accepted');
      const rejected = negotiations.filter(n => n.status === 'rejected');

      // Vérifier s'il y a de nouvelles négociations acceptées ou refusées
      const hasNewAccepted = accepted.some(n => 
        new Date(n.updatedAt) > lastChecked
      );
      const hasNewRejected = rejected.some(n => 
        new Date(n.updatedAt) > lastChecked
      );

      setNotifications({
        hasNewUpdates: hasNewAccepted || hasNewRejected,
        pendingCount: pending.length || 0,
        acceptedCount: accepted.length || 0,
        rejectedCount: rejected.length || 0,
      });

      if (hasNewAccepted || hasNewRejected) {
        setLastChecked(new Date());
      }
    } catch (error) {
      console.log('Erreur lors de la vérification des notifications:', error);
    } finally {
      setIsPolling(false);
    }
  };

  // Démarrer le polling
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Vérifier immédiatement
    checkForUpdates();
    
    // Puis toutes les 30 secondes
    intervalRef.current = setInterval(checkForUpdates, 30000);
  };

  // Arrêter le polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Gérer les changements d'état de l'app
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan, vérifier les mises à jour
        checkForUpdates();
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  // Démarrer/arrêter le polling selon l'état de l'app
  useEffect(() => {
    if (appStateRef.current === 'active') {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, []);

  // Marquer les notifications comme lues
  const markAsRead = () => {
    setNotifications(prev => ({
      ...prev,
      hasNewUpdates: false,
    }));
    setLastChecked(new Date());
  };

  return {
    notifications,
    checkForUpdates,
    markAsRead,
  };
}
