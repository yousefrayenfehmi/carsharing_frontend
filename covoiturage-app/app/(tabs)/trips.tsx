import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { useAlert } from '@/contexts/alert-context';
import { useTrips } from '@/hooks/use-trips';
import { useNegotiations } from '@/hooks/use-negotiations';
import { useBookings } from '@/hooks/use-bookings';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TripsScreen() {
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess, showConfirm } = useAlert();
  const { getMyTrips, loading, cancelTrip, completeTrip } = useTrips();
  const { getTripNegotiations } = useNegotiations();
  const { getTripBookings, confirmBookingNew } = useBookings();
  const [trips, setTrips] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [negotiationsCounts, setNegotiationsCounts] = useState<{ [key: string]: number }>({});
  const [tripBookings, setTripBookings] = useState<{ [key: string]: any[] }>({});
  const [cancellingTrip, setCancellingTrip] = useState<string | null>(null);
  const [completingTrip, setCompletingTrip] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadTrips = async () => {
    try {
      const data = await getMyTrips(); // Charger tous les trajets (actifs, terminés, annulés)
      setTrips(data);
      
      // Charger le nombre de négociations en attente pour chaque trajet
      const counts: { [key: string]: number } = {};
      const bookings: { [key: string]: any[] } = {};
      
      for (const trip of data) {
        try {
          // Charger les négociations
          const negotiations = await getTripNegotiations(trip._id);
          counts[trip._id] = negotiations.filter((n: any) => n.status === 'pending').length;
          
          // Charger les réservations
          const tripBookings = await getTripBookings(trip._id);
          bookings[trip._id] = tripBookings;
        } catch (error) {
          counts[trip._id] = 0;
          bookings[trip._id] = [];
        }
      }
      setNegotiationsCounts(counts);
      setTripBookings(bookings);
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  const getBookingStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return 'Inconnu';
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'confirmed':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getFilteredTrips = () => {
    if (selectedStatus === 'all') {
      return trips;
    }
    return trips.filter(trip => trip.status === selectedStatus);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTrips();
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  }, []);

  const handleViewNegotiations = (tripId: string) => {
    router.push(`/trip-negotiations/${tripId}` as any);
  };

  const handleCancelTrip = async (tripId: string) => {
    showConfirm(
      'Annuler le trajet',
      'Êtes-vous sûr de vouloir annuler ce trajet ? Cette action est irréversible.',
      async () => {
        try {
          setCancellingTrip(tripId);
          await cancelTrip(tripId);
          showSuccess('Succès', 'Le trajet a été annulé avec succès');
          loadTrips(); // Recharger la liste
        } catch (error: any) {
          showError('Erreur', error.message || 'Erreur lors de l\'annulation');
        } finally {
          setCancellingTrip(null);
        }
      }
    );
  };

  const handleCompleteTrip = async (tripId: string) => {
    showConfirm(
      'Terminer le trajet',
      'Marquer ce trajet comme terminé ? Les réservations confirmées seront également marquées comme terminées.',
      async () => {
        try {
          setCompletingTrip(tripId);
          await completeTrip(tripId);
          showSuccess('Succès', 'Le trajet a été marqué comme terminé');
          loadTrips(); // Recharger la liste
        } catch (error: any) {
          showError('Erreur', error.message || 'Erreur lors du marquage comme terminé');
        } finally {
          setCompletingTrip(null);
        }
      }
    );
  };

  const handleConfirmBooking = async (bookingId: string, tripId: string) => {
    showConfirm(
      'Confirmer la réservation',
      'Êtes-vous sûr de vouloir confirmer cette réservation ?',
      async () => {
        try {
          await confirmBookingNew(bookingId);
          showSuccess('Succès', 'La réservation a été confirmée avec succès');
          loadTrips(); // Recharger pour mettre à jour les réservations
        } catch (error: any) {
          showError('Erreur', error.message);
        }
      }
    );
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          text: 'Actif',
          color: '#4CAF50',
          icon: 'checkmark-circle',
          bgColor: '#E8F5E8'
        };
      case 'completed':
        return {
          text: 'Terminé',
          color: '#2196F3',
          icon: 'checkmark-done-circle',
          bgColor: '#E3F2FD'
        };
      case 'cancelled':
        return {
          text: 'Annulé',
          color: '#F44336',
          icon: 'close-circle',
          bgColor: '#FFEBEE'
        };
      default:
        return {
          text: 'Inconnu',
          color: '#9E9E9E',
          icon: 'help-circle',
          bgColor: '#F5F5F5'
        };
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notAuthContainer}>
          <Ionicons name="car-outline" size={80} color={Colors.text.light} />
          <Text style={styles.notAuthTitle}>Vous n'êtes pas connecté</Text>
          <Text style={styles.notAuthSubtitle}>
            Connectez-vous pour voir vos trajets publiés
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Trajets</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/publish')}
        >
          <Ionicons name="add-circle" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtres de statut */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[
            { key: 'all', label: 'Tous', icon: 'list' },
            { key: 'active', label: 'Actifs', icon: 'checkmark-circle' },
            { key: 'completed', label: 'Terminés', icon: 'checkmark-done-circle' },
            { key: 'cancelled', label: 'Annulés', icon: 'close-circle' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedStatus === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedStatus(filter.key)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={16} 
                color={selectedStatus === filter.key ? Colors.text.white : Colors.primary} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedStatus === filter.key && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>Aucun trajet publié</Text>
            <Text style={styles.emptySubtext}>
              Publiez votre premier trajet pour commencer à covoiturer
            </Text>
            <TouchableOpacity
              style={styles.publishButton}
              onPress={() => router.push('/(tabs)/publish')}
            >
              <Ionicons name="add" size={20} color={Colors.text.white} />
              <Text style={styles.publishButtonText}>Publier un trajet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          getFilteredTrips().map((trip: any) => (
            <View key={trip._id} style={styles.tripCard}>
              {/* En-tête */}
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar" size={16} color={Colors.primary} />
                  <Text style={styles.dateText}>
                    {new Date(trip.departureTime).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View style={styles.headerRight}>
                  {/* Statut du trajet */}
                  {(() => {
                    const statusInfo = getStatusInfo(trip.status);
                    return (
                      <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                        <Ionicons name={statusInfo.icon as any} size={12} color={statusInfo.color} />
                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                          {statusInfo.text}
                        </Text>
                      </View>
                    );
                  })()}
                  
                  {/* Badge des négociations */}
                  {trip.priceType === 'negotiable' && (negotiationsCounts[trip._id] || 0) > 0 && (
                    <View style={styles.negotiationBadge}>
                      <Ionicons name="chatbubbles" size={12} color={Colors.text.white} />
                      <Text style={styles.negotiationBadgeText}>
                        {String(negotiationsCounts[trip._id] || 0)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Itinéraire */}
              <View style={styles.route}>
                <View style={styles.routePoint}>
                  <View style={styles.departureIcon}>
                    <View style={styles.departureDot} />
                  </View>
                  <View style={styles.routeTextContainer}>
                    <Text style={styles.routeCity}>{String(trip.departure?.city || 'Départ')}</Text>
                    {trip.departure?.address && (
                      <Text style={styles.routeAddress} numberOfLines={1}>
                        {String(trip.departure.address)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.routeLine} />

                <View style={styles.routePoint}>
                  <View style={styles.destinationIcon}>
                    <Ionicons name="location" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.routeTextContainer}>
                    <Text style={styles.routeCity}>{String(trip.destination?.city || 'Destination')}</Text>
                    {trip.destination?.address && (
                      <Text style={styles.routeAddress} numberOfLines={1}>
                        {String(trip.destination.address)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Informations */}
              <View style={styles.tripInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="people" size={16} color={Colors.text.secondary} />
                  <Text style={styles.infoText}>
                    {String(trip.availableSeats || 0)} place{(trip.availableSeats || 0) > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="cash" size={16} color={Colors.text.secondary} />
                  <Text style={styles.infoText}>{String(trip.price || 0)} DA</Text>
                  {trip.priceType === 'negotiable' && (
                    <View style={styles.negotiableTag}>
                      <Text style={styles.negotiableTagText}>Négociable</Text>
                    </View>
                  )}
                </View>
                {trip.distance && typeof trip.distance === 'number' && (
                  <View style={styles.infoItem}>
                    <Ionicons name="navigate" size={16} color={Colors.text.secondary} />
                    <Text style={styles.infoText}>{String(trip.distance.toFixed(0))} km</Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <View style={styles.primaryActions}>
                  {trip.priceType === 'negotiable' && (
                    <TouchableOpacity
                      style={styles.negotiationsButton}
                      onPress={() => handleViewNegotiations(trip._id)}
                    >
                      <Ionicons name="chatbubbles-outline" size={18} color={Colors.primary} />
                      <Text style={styles.negotiationsButtonText}>
                        Voir les propositions
                        {(negotiationsCounts[trip._id] || 0) > 0 && ` (${String(negotiationsCounts[trip._id] || 0)})`}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.bookingsButton}
                    onPress={() => router.push(`/trip-bookings?tripId=${trip._id}`)}
                  >
                    <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
                    <Text style={styles.bookingsButtonText}>
                      Réservations
                      {(tripBookings[trip._id] || []).length > 0 && ` (${String((tripBookings[trip._id] || []).length)})`}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push(`/trip-details?tripId=${trip._id}`)}
                  >
                    <Text style={styles.detailsButtonText}>Détails</Text>
                    <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                
                {/* Boutons d'action - seulement pour les trajets actifs */}
                {trip.status === 'active' && (
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                      style={[
                        styles.completeButton,
                        completingTrip === trip._id && styles.completeButtonDisabled
                      ]}
                      onPress={() => handleCompleteTrip(trip._id)}
                      disabled={completingTrip === trip._id}
                    >
                      {completingTrip === trip._id ? (
                        <ActivityIndicator size="small" color={Colors.text.white} />
                      ) : (
                        <View style={styles.buttonContent}>
                          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.text.white} />
                          <Text style={styles.completeButtonText}>Terminer</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        cancellingTrip === trip._id && styles.cancelButtonDisabled
                      ]}
                      onPress={() => handleCancelTrip(trip._id)}
                      disabled={cancellingTrip === trip._id}
                    >
                      {cancellingTrip === trip._id ? (
                        <ActivityIndicator size="small" color={Colors.text.white} />
                      ) : (
                        <View style={styles.buttonContent}>
                          <Ionicons name="close-circle-outline" size={18} color={Colors.text.white} />
                          <Text style={styles.cancelButtonText}>Annuler</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Affichage des réservations */}
              {(tripBookings[trip._id] || []).length > 0 && (
                <View style={styles.bookingsSection}>
                  <Text style={styles.bookingsSectionTitle}>
                    Réservations ({String(tripBookings[trip._id].length)})
                  </Text>
                  {tripBookings[trip._id].map((booking: any) => (
                    <View key={booking._id} style={styles.bookingCard}>
                      <View style={styles.bookingHeader}>
                        <View style={styles.passengerInfo}>
                          <Text style={styles.passengerName}>
                            {String(booking.passenger?.firstName || '')} {String(booking.passenger?.lastName || '')}
                          </Text>
                          <Text style={styles.bookingDetails}>
                            {String(booking.seats)} place{booking.seats > 1 ? 's' : ''} • {String(booking.totalPrice)} DA
                          </Text>
                        </View>
                        <View style={[
                          styles.bookingStatusBadge,
                          { backgroundColor: getBookingStatusColor(booking.status) }
                        ]}>
                          <Text style={styles.bookingStatusText}>
                            {getBookingStatusText(booking.status)}
                          </Text>
                        </View>
                      </View>
                      
                      {booking.status === 'pending' && (
                        <TouchableOpacity
                          style={styles.confirmBookingButton}
                          onPress={() => handleConfirmBooking(booking._id, trip._id)}
                        >
                          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primary} />
                          <Text style={styles.confirmBookingButtonText}>Confirmer</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  notAuthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
  },
  notAuthSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
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
    marginBottom: 16,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
  tripCard: {
    backgroundColor: Colors.background.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  negotiationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  negotiationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
  route: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  departureIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  departureDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  destinationIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border.medium,
    marginLeft: 11,
    marginVertical: 4,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  tripInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  negotiableTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  negotiableTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  actions: {
    gap: 8,
  },
  primaryActions: {
    flexDirection: 'row',
    flexWrap: 'wrap', // permet aux boutons de passer sur 2 lignes sur petits écrans
    gap: 8,
  },
  negotiationsButton: {
    flex: 1,
    minWidth: '32%', // 3 colonnes max
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  negotiationsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    flexShrink: 1, // le texte peut se compacter sur 2 lignes
  },
  bookingsButton: {
    flex: 1,
    minWidth: '32%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.light,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  bookingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    flexShrink: 1,
  },
  detailsButton: {
    flex: 1,
    minWidth: '32%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    textAlign: 'center',
    flexShrink: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  completeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelButtonDisabled: {
    backgroundColor: '#FFB3B3',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    backgroundColor: Colors.background.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.light,
    marginRight: 8,
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  filterButtonTextActive: {
    color: Colors.text.white,
  },
  // Styles pour les réservations
  bookingsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  bookingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  bookingCard: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  bookingDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  bookingStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
  confirmBookingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  confirmBookingButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
});

