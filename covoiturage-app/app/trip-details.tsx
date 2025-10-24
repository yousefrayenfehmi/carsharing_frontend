import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useTrips } from '@/hooks/use-trips';
import { useBookings } from '@/hooks/use-bookings';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TripDetailsScreen() {
  const { showError, showSuccess, showConfirm } = useAlert();
  const { getTripById } = useTrips();
  const { getTripBookings, confirmBookingNew } = useBookings();
  const [trip, setTrip] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);

  // Récupérer l'ID du trajet depuis les paramètres de navigation
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const loadTripDetails = async () => {
    if (!tripId) {
      showError('Erreur', 'ID du trajet manquant');
      return;
    }

    try {
      setLoading(true);
      const tripData = await getTripById(tripId);
      setTrip(tripData);

      // Charger les réservations du trajet
      const bookingsData = await getTripBookings(tripId);
      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Erreur lors du chargement des détails:', error);
      showError('Erreur de connexion', 'Impossible de charger les détails du trajet. Vérifiez votre connexion internet et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTripDetails();
    setRefreshing(false);
  };

  const handleConfirmBooking = async (bookingId: string) => {
    showConfirm(
      'Confirmer la réservation',
      'Êtes-vous sûr de vouloir confirmer cette réservation ?',
      async () => {
        try {
          setConfirmingBooking(bookingId);
          await confirmBookingNew(bookingId);
          showSuccess('Succès', 'La réservation a été confirmée avec succès');
          loadTripDetails(); // Recharger les détails
        } catch (error: any) {
          showError('Erreur', error.message);
        } finally {
          setConfirmingBooking(null);
        }
      }
    );
  };

  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.text?.secondary} />
        <Text style={styles.errorText}>Trajet non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo(trip.status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du Trajet</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Trip Card */}
        <View style={styles.tripCard}>
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <Ionicons name={statusInfo.icon as any} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.dateText}>
                {new Date(trip.departureTime).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {/* Route */}
          <View style={styles.route}>
            <View style={styles.routePoint}>
              <View style={styles.routeDot} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeCity}>{trip.departure.city}</Text>
                <Text style={styles.routeAddress}>{trip.departure.address}</Text>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeCity}>{trip.destination.city}</Text>
                <Text style={styles.routeAddress}>{trip.destination.address}</Text>
              </View>
            </View>
          </View>

          {/* Trip Info */}
          <View style={styles.tripInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>
                {String(trip.availableSeats)} place{trip.availableSeats > 1 ? 's' : ''} disponible{trip.availableSeats > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="cash" size={16} color={Colors.text.secondary} />
              <Text style={styles.infoText}>{String(trip.price)} DA par passager</Text>
            </View>
            {trip.distance && (
              <View style={styles.infoItem}>
                <Ionicons name="navigate" size={16} color={Colors.text.secondary} />
                <Text style={styles.infoText}>{String(trip.distance.toFixed(0))} km</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {trip.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{trip.description}</Text>
            </View>
          )}
        </View>

        {/* Bookings Section */}
        <View style={styles.bookingsSection}>
          <Text style={styles.sectionTitle}>
            Réservations ({String(bookings.length)})
          </Text>
          
          {bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyText}>Aucune réservation</Text>
            </View>
          ) : (
            bookings.map((booking: any) => (
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
                    style={[
                      styles.confirmButton,
                      confirmingBooking === booking._id && styles.confirmButtonDisabled
                    ]}
                    onPress={() => handleConfirmBooking(booking._id)}
                    disabled={confirmingBooking === booking._id}
                  >
                    {confirmingBooking === booking._id ? (
                      <ActivityIndicator size="small" color={Colors.text.white} />
                    ) : (
                      <View style={styles.confirmButtonContent}>
                        <Ionicons name="checkmark-circle-outline" size={18} color={Colors.text.white} />
                        <Text style={styles.confirmButtonText}>Confirmer</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  route: {
    marginBottom: 20,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  routeInfo: {
    flex: 1,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border.medium,
    marginLeft: 5,
    marginVertical: 4,
  },
  tripInfo: {
    marginBottom: 20,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  bookingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text.secondary,
  },
  bookingCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});
