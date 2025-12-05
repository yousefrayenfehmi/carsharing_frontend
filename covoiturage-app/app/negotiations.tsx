import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useNegotiations } from '@/hooks/use-negotiations';
import { useNotifications } from '@/hooks/use-notifications';
import { Negotiation } from '@/services/negotiation-service';
import { NotificationBanner } from '@/components/notification-banner';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type TabType = 'pending' | 'accepted' | 'rejected';

export default function NegotiationsScreen() {
  const { showError, showSuccess, showConfirm } = useAlert();
  const { 
    getMyNegotiations, 
    counterOffer, 
    acceptNegotiation, 
    rejectNegotiation,
    loading 
  } = useNegotiations();
  
  const { notifications, markAsRead } = useNotifications();
  
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNegotiation, setExpandedNegotiation] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<{ [key: string]: string }>({});
  const [commissionRate, setCommissionRate] = useState(0.16); // Taux de commission dynamique
  const [notificationBanner, setNotificationBanner] = useState<{
    visible: boolean;
    type: 'accepted' | 'rejected' | 'counter_offer';
    message: string;
  }>({
    visible: false,
    type: 'accepted',
    message: '',
  });

  // Charger le taux de commission au montage
  useEffect(() => {
    const loadCommissionRate = async () => {
      try {
        const { rate } = await adminService.getCommissionRate();
        setCommissionRate(rate);
      } catch (error) {
        console.error('Erreur chargement commission:', error);
        // Garder la valeur par défaut de 0.16 en cas d'erreur
      }
    };
    loadCommissionRate();
  }, []);

  const loadNegotiations = async (status?: TabType) => {
    try {
      const data = await getMyNegotiations(status);
      setNegotiations(data);
      
      // Vérifier s'il y a de nouvelles réponses
      const newAccepted = data.filter(n => 
        n.status === 'accepted' && 
        new Date(n.updatedAt) > new Date(Date.now() - 60000) // Dernière minute
      );
      const newRejected = data.filter(n => 
        n.status === 'rejected' && 
        new Date(n.updatedAt) > new Date(Date.now() - 60000) // Dernière minute
      );

      if (newAccepted.length > 0) {
        const trip = newAccepted[0].trip;
        setNotificationBanner({
          visible: true,
          type: 'accepted',
          message: `Votre proposition de ${newAccepted[0].currentOffer} DA pour ${trip.departure.city} → ${trip.destination.city} a été acceptée !`,
        });
      } else if (newRejected.length > 0) {
        const trip = newRejected[0].trip;
        setNotificationBanner({
          visible: true,
          type: 'rejected',
          message: `Votre proposition pour ${trip.departure.city} → ${trip.destination.city} a été refusée.`,
        });
      }
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadNegotiations(activeTab);
  }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNegotiations(activeTab);
    setRefreshing(false);
  }, [activeTab]);

  const handleCounterOffer = async (negotiationId: string) => {
    const price = counterPrice[negotiationId];
    if (!price || parseFloat(price) <= 0) {
      showError('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    try {
      await counterOffer(negotiationId, {
        counterPrice: parseFloat(price),
        message: `Je propose ${price} DA.`,
      });
      showSuccess('Succès', 'Contre-proposition envoyée');
      setExpandedNegotiation(null);
      setCounterPrice({ ...counterPrice, [negotiationId]: '' });
      await loadNegotiations(activeTab);
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  const handleAccept = async (negotiationId: string, price: number) => {
    showConfirm(
      'Accepter la proposition',
      `Êtes-vous sûr d'accepter le prix de ${price} DA ?`,
      async () => {
        try {
          await acceptNegotiation(negotiationId);
          showSuccess('Succès', 'Négociation acceptée !');
          await loadNegotiations(activeTab);
        } catch (error: any) {
          showError('Erreur', error.message);
        }
      }
    );
  };

  const handleReject = async (negotiationId: string) => {
    showConfirm(
      'Rejeter la proposition',
      'Êtes-vous sûr de vouloir rejeter cette proposition ?',
      async () => {
        try {
          await rejectNegotiation(negotiationId);
          showSuccess('Succès', 'Négociation rejetée');
          await loadNegotiations(activeTab);
        } catch (error: any) {
          showError('Erreur', error.message);
        }
      }
    );
  };

  const renderNegotiationCard = (negotiation: Negotiation) => {
    const isExpanded = expandedNegotiation === negotiation._id;
    const lastMessage = negotiation.messages[negotiation.messages.length - 1];
    
    // Calculs de commission dynamique
    const clientPrice = negotiation.currentOffer;
    const commission = clientPrice * commissionRate;
    const driverAmount = clientPrice - commission;

    return (
      <View key={negotiation._id} style={styles.card}>
        {/* En-tête */}
        <View style={styles.cardHeader}>
          <View style={styles.routeInfo}>
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.cityText} numberOfLines={1}>
              {String(negotiation.trip.departure.city)}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.text.secondary} />
            <Text style={styles.cityText} numberOfLines={1}>
              {String(negotiation.trip.destination.city)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            negotiation.status === 'pending' && styles.statusPending,
            negotiation.status === 'accepted' && styles.statusAccepted,
            negotiation.status === 'rejected' && styles.statusRejected,
            negotiation.status === 'expired' && styles.statusExpired,
          ]}>
            <Text style={styles.statusText}>
              {negotiation.status === 'pending' ? 'En cours' :
               negotiation.status === 'accepted' ? 'Acceptée' :
               negotiation.status === 'rejected' ? 'Rejetée' : 'Expirée'}
            </Text>
          </View>
        </View>

        {/* Informations sur le prix */}
        <View style={styles.priceInfo}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix initial :</Text>
            <Text style={styles.priceValue}>{String(negotiation.originalPrice)} DA</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Offre actuelle :</Text>
            <Text style={[styles.priceValue, styles.currentOffer]}>
              {String(negotiation.currentOffer)} DA
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dernière offre par :</Text>
            <Text style={styles.priceValue}>
              {negotiation.lastOfferBy === 'driver' ? 'Conducteur' : 'Passager'}
            </Text>
          </View>
        </View>

        {/* Détail de la commission */}
        <View style={styles.commissionInfo}>
          <Text style={styles.commissionTitle}>💡 Répartition du prix</Text>
          <View style={styles.commissionDetailsSmall}>
            <View style={styles.commissionRowSmall}>
              <Text style={styles.commissionLabelSmall}>Commission ({(commissionRate * 100).toFixed(0)}%)</Text>
              <Text style={styles.commissionValueSmall}>-{String(commission.toFixed(2))} DA</Text>
            </View>
            <View style={styles.commissionRowSmall}>
              <Text style={styles.commissionLabelSmall}>Le conducteur reçoit</Text>
              <Text style={styles.driverAmountValue}>{String(driverAmount.toFixed(2))} DA</Text>
            </View>
          </View>
        </View>

        {/* Dernier message */}
        <View style={styles.lastMessage}>
          <Ionicons name="chatbubble-outline" size={14} color={Colors.text.secondary} />
          <Text style={styles.lastMessageText} numberOfLines={2}>
            {lastMessage.message}
          </Text>
        </View>

        {/* Actions pour les négociations en cours */}
        {negotiation.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setExpandedNegotiation(isExpanded ? null : negotiation._id)}
            >
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={Colors.primary} 
              />
              <Text style={styles.expandButtonText}>
                {isExpanded ? 'Masquer' : 'Voir les options'}
              </Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedActions}>
                {/* Contre-proposition */}
                <View style={styles.counterOfferSection}>
                  <Text style={styles.counterOfferTitle}>Faire une contre-proposition</Text>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="Nouveau prix"
                      keyboardType="numeric"
                      value={counterPrice[negotiation._id] || ''}
                      onChangeText={(text) => 
                        setCounterPrice({ ...counterPrice, [negotiation._id]: text })
                      }
                    />
                    <Text style={styles.currencyText}>DA</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => handleCounterOffer(negotiation._id)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={Colors.text.white} />
                    ) : (
                      <>
                        <Ionicons name="sync" size={16} color={Colors.text.white} />
                        <Text style={styles.counterButtonText}>Proposer</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Accepter / Rejeter */}
                <View style={styles.decisionButtons}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(negotiation._id)}
                    disabled={loading}
                  >
                    <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                    <Text style={styles.rejectButtonText}>Refuser</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(negotiation._id, negotiation.currentOffer)}
                    disabled={loading}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={Colors.text.white} />
                    <Text style={styles.acceptButtonText}>Accepter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Date */}
        <Text style={styles.dateText}>
          {new Date(negotiation.updatedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Notification Banner */}
      <NotificationBanner
        visible={notificationBanner.visible}
        type={notificationBanner.type}
        message={notificationBanner.message}
        onPress={() => {
          setNotificationBanner({ ...notificationBanner, visible: false });
          markAsRead();
        }}
        onDismiss={() => {
          setNotificationBanner({ ...notificationBanner, visible: false });
          markAsRead();
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Négociations</Text>
        {notifications.hasNewUpdates && (
          <View style={styles.notificationDot} />
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            En cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text style={[styles.tabText, activeTab === 'accepted' && styles.activeTabText]}>
            Acceptées
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
          onPress={() => setActiveTab('rejected')}
        >
          <Text style={[styles.tabText, activeTab === 'rejected' && styles.activeTabText]}>
            Rejetées
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : negotiations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>
              {activeTab === 'pending' ? 'Aucune négociation en cours' :
               activeTab === 'accepted' ? 'Aucune négociation acceptée' :
               'Aucune négociation rejetée'}
            </Text>
          </View>
        ) : (
          negotiations.map(renderNegotiationCard)
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    right: 0,
    top: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.background.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusAccepted: {
    backgroundColor: '#D1FAE5',
  },
  statusRejected: {
    backgroundColor: '#FEE2E2',
  },
  statusExpired: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  priceInfo: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  currentOffer: {
    color: Colors.primary,
    fontSize: 16,
  },
  commissionInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  commissionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  commissionDetailsSmall: {
    gap: 6,
  },
  commissionRowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionLabelSmall: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  commissionValueSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  driverAmountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  lastMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  lastMessageText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  actions: {
    gap: 12,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  expandedActions: {
    gap: 16,
    paddingTop: 8,
  },
  counterOfferSection: {
    gap: 12,
  },
  counterOfferTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  counterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  counterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  decisionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 6,
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    gap: 6,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  dateText: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'right',
    marginTop: 8,
  },
});

