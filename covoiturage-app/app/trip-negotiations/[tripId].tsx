import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useNegotiations } from '@/hooks/use-negotiations';
import { Negotiation } from '@/services/negotiation-service';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import {
  ActivityIndicator,
  Image,
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

export default function TripNegotiationsScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { showError, showSuccess, showConfirm } = useAlert();
  const { 
    getTripNegotiations, 
    counterOffer, 
    acceptNegotiation, 
    rejectNegotiation,
    loading 
  } = useNegotiations();
  
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedNegotiation, setExpandedNegotiation] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<{ [key: string]: string }>({});
  const [commissionRate, setCommissionRate] = useState(0.16); // Taux de commission dynamique

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

  const loadNegotiations = async () => {
    try {
      const data = await getTripNegotiations(tripId);
      setNegotiations(data);
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  useEffect(() => {
    if (tripId) {
      loadNegotiations();
    }
  }, [tripId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNegotiations();
    setRefreshing(false);
  }, [tripId]);

  const handleCounterOffer = async (negotiationId: string) => {
    const price = counterPrice[negotiationId];
    if (!price || parseFloat(price) <= 0) {
      showError('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    try {
      await counterOffer(negotiationId, {
        counterPrice: parseFloat(price),
        message: `Je vous propose ${price} DA pour ce trajet.`,
      });
      showSuccess('Succès', 'Contre-proposition envoyée au passager');
      setExpandedNegotiation(null);
      setCounterPrice({ ...counterPrice, [negotiationId]: '' });
      await loadNegotiations();
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  const handleAccept = async (negotiationId: string, price: number, passengerName: string) => {
    showConfirm(
      'Accepter la proposition',
      `Accepter ${price} DA de ${passengerName} ?`,
      async () => {
        try {
          await acceptNegotiation(negotiationId, `J'accepte votre proposition de ${price} DA.`);
          showSuccess('Succès', `Vous avez accepté l'offre de ${passengerName}. Le prix convenu est de ${price} DA.`);
          await loadNegotiations();
        } catch (error: any) {
          showError('Erreur', error.message);
        }
      }
    );
  };

  const handleReject = async (negotiationId: string, passengerName: string) => {
    showConfirm(
      'Refuser la proposition',
      `Refuser la proposition de ${passengerName} ?`,
      async () => {
        try {
          await rejectNegotiation(negotiationId, 'Je refuse cette proposition.');
          showSuccess('Succès', `Proposition de ${passengerName} refusée`);
          await loadNegotiations();
        } catch (error: any) {
          showError('Erreur', error.message);
        }
      }
    );
  };

  const renderNegotiationCard = (negotiation: Negotiation) => {
    const isExpanded = expandedNegotiation === negotiation._id;
    const passengerName = `${negotiation.passenger.firstName} ${negotiation.passenger.lastName}`;
    
    // Calculs de commission dynamique
    const clientPrice = negotiation.currentOffer;
    const commission = clientPrice * commissionRate;
    const driverAmount = clientPrice - commission;

    return (
      <View key={negotiation._id} style={styles.card}>
        {/* En-tête Passager */}
        <View style={styles.passengerHeader}>
          {negotiation.passenger.profilePicture ? (
            <Image 
              source={{ uri: negotiation.passenger.profilePicture }} 
              style={styles.passengerAvatar} 
            />
          ) : (
            <View style={styles.passengerAvatar}>
              <Text style={styles.passengerAvatarText}>
                {negotiation.passenger.firstName[0]}{negotiation.passenger.lastName[0]}
              </Text>
            </View>
          )}
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>{passengerName}</Text>
            {negotiation.passenger.rating && (
              <View style={styles.rating}>
                <Ionicons name="star" size={14} color="#FFA500" />
                <Text style={styles.ratingText}>
                  {negotiation.passenger.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>
          <View style={[
            styles.statusBadge,
            negotiation.status === 'pending' && styles.statusPending,
            negotiation.status === 'accepted' && styles.statusAccepted,
            negotiation.status === 'rejected' && styles.statusRejected,
            negotiation.status === 'expired' && styles.statusExpired,
          ]}>
            <Text style={styles.statusText}>
              {negotiation.status === 'pending' ? 'En attente' :
               negotiation.status === 'accepted' ? 'Acceptée' :
               negotiation.status === 'rejected' ? 'Refusée' : 'Expirée'}
            </Text>
          </View>
        </View>

        {/* Détails de l'offre */}
        <View style={styles.offerDetails}>
          <View style={styles.priceComparison}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Votre prix</Text>
              <Text style={styles.originalPrice}>{String(negotiation.originalPrice)} DA</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={Colors.text.secondary} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Offre actuelle</Text>
              <Text style={styles.currentPrice}>{String(negotiation.currentOffer)} DA</Text>
            </View>
          </View>

          {/* Détail de la commission */}
          <View style={styles.commissionCard}>
            <View style={styles.commissionRow}>
              <View style={styles.commissionLabelContainer}>
                <Ionicons name="cash-outline" size={14} color={Colors.text.secondary} />
                <Text style={styles.commissionLabel}>Prix proposé</Text>
              </View>
              <Text style={styles.commissionValue}>{String(clientPrice.toFixed(2))} DA</Text>
            </View>
            <View style={styles.commissionDivider} />
            <View style={styles.commissionRow}>
              <View style={styles.commissionLabelContainer}>
                <Ionicons name="remove-circle-outline" size={14} color="#FF6B6B" />
                <Text style={styles.commissionLabel}>Commission ({(commissionRate * 100).toFixed(0)}%)</Text>
              </View>
              <Text style={styles.commissionValueNegative}>-{String(commission.toFixed(2))} DA</Text>
            </View>
            <View style={styles.commissionDivider} />
            <View style={styles.commissionRow}>
              <View style={styles.commissionLabelContainer}>
                <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
                <Text style={styles.commissionLabelBold}>Vous recevrez</Text>
              </View>
              <Text style={styles.commissionValueTotal}>{String(driverAmount.toFixed(2))} DA</Text>
            </View>
          </View>

          {/* Message */}
          {negotiation.messages.length > 0 && (
            <View style={styles.messageContainer}>
              <Ionicons name="chatbubble-outline" size={14} color={Colors.text.secondary} />
              <Text style={styles.messageText} numberOfLines={2}>
                {negotiation.messages[negotiation.messages.length - 1].message}
              </Text>
            </View>
          )}
        </View>

        {/* Actions pour négociations en attente */}
        {negotiation.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setExpandedNegotiation(isExpanded ? null : negotiation._id)}
            >
              <Text style={styles.expandButtonText}>
                {isExpanded ? 'Masquer les options' : 'Répondre'}
              </Text>
              <Ionicons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={18} 
                color={Colors.primary} 
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.expandedActions}>
                {/* Boutons rapides */}
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(negotiation._id, negotiation.currentOffer, passengerName)}
                    disabled={loading}
                  >
                    <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
                    <Text style={styles.acceptButtonText}>Accepter (Vous recevrez {String(driverAmount.toFixed(2))} DA)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(negotiation._id, passengerName)}
                    disabled={loading}
                  >
                    <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                    <Text style={styles.rejectButtonText}>Refuser</Text>
                  </TouchableOpacity>
                </View>

                {/* Contre-proposition */}
                <View style={styles.counterOfferSection}>
                  <Text style={styles.counterOfferTitle}>Ou proposer un autre prix</Text>
                  <View style={styles.priceInputContainer}>
                    <TextInput
                      style={styles.priceInput}
                      placeholder="Votre contre-offre"
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
                        <Text style={styles.counterButtonText}>Envoyer ma contre-offre</Text>
                      </>
                    )}
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

  const pendingNegotiations = negotiations.filter(n => n.status === 'pending');
  const otherNegotiations = negotiations.filter(n => n.status !== 'pending');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Propositions de prix</Text>
        <View style={styles.placeholder} />
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
            <Ionicons name="chatbubbles-outline" size={64} color={Colors.text.disabled} />
            <Text style={styles.emptyText}>Aucune proposition reçue</Text>
            <Text style={styles.emptySubtext}>
              Les passagers intéressés pourront vous proposer leur prix
            </Text>
          </View>
        ) : (
          <>
            {/* Négociations en attente */}
            {pendingNegotiations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  En attente ({pendingNegotiations.length})
                </Text>
                {pendingNegotiations.map(renderNegotiationCard)}
              </View>
            )}

            {/* Autres négociations */}
            {otherNegotiations.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Historique</Text>
                {otherNegotiations.map(renderNegotiationCard)}
              </View>
            )}
          </>
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
  placeholder: {
    width: 32,
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
    paddingHorizontal: 20,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.background.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passengerAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
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
  offerDetails: {
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  priceComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.background.light,
    padding: 12,
    borderRadius: 8,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  commissionCard: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  commissionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commissionLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  commissionLabelBold: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  commissionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  commissionValueNegative: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  commissionValueTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  commissionDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  messageText: {
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
  },
  quickActions: {
    gap: 8,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.white,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  counterOfferSection: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
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
  dateText: {
    fontSize: 12,
    color: Colors.text.disabled,
    textAlign: 'right',
    marginTop: 8,
  },
});

