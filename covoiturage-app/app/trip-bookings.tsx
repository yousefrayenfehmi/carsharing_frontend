import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useBookings } from '@/hooks/use-bookings';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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

export default function TripBookingsScreen() {
  const { showError, showSuccess, showConfirm } = useAlert();
  const { getTripBookings, loading, confirmBookingNew } = useBookings();
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
  
  // Récupérer l'ID du trajet depuis les paramètres de navigation
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const loadBookings = async () => {
    if (!tripId) {
      showError('Erreur', 'ID du trajet manquant');
      return;
    }
    
    try {
      const data = await getTripBookings(tripId);
      setBookings(data);
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, []);

  const handleConfirmBooking = async (bookingId: string) => {
    showConfirm(
      'Confirmer la réservation',
      'Êtes-vous sûr de vouloir confirmer cette réservation ?',
      async () => {
        try {
          setConfirmingBooking(bookingId);
          await confirmBookingNew(bookingId);
          showSuccess('Succès', 'La réservation a été confirmée avec succès');
          loadBookings(); // Recharger la liste
        } catch (error: any) {
          showError('Erreur', error.message || 'Erreur lors de la confirmation');
        } finally {
          setConfirmingBooking(null);
        }
      }
    );
  };

  const renderBookingCard = (booking: any) => {
    const passenger = booking.passenger;
    const trip = booking.trip;

    return (
      <View key={booking._id} style={styles.card}>
        {/* Header avec passager info */}
        <View style={styles.cardHeader}>
          <View style={styles.passengerSection}>
            {passenger?.profilePicture ? (
              <Image source={{ uri: passenger.profilePicture }} style={styles.passengerAvatar} />
            ) : (
              <View style={styles.passengerAvatar}>
                <Text style={styles.passengerAvatarText}>
                  {String(passenger?.firstName?.[0] || '')}{String(passenger?.lastName?.[0] || '')}
                </Text>
              </View>
            )}
            <View style={styles.passengerInfo}>
              <Text style={styles.passengerName}>
                {String(passenger?.firstName || '')} {String(passenger?.lastName || '')}
              </Text>
              {passenger?.rating && (
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>{String(passenger.rating.toFixed(1))}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            booking.status === 'pending' && styles.statusPending,
            booking.status === 'confirmed' && styles.statusConfirmed,
            booking.status === 'completed' && styles.statusCompleted,
            booking.status === 'cancelled' && styles.statusCancelled,
          ]}>
            <Text style={styles.statusText}>
              {booking.status === 'pending' ? 'En attente' :
               booking.status === 'confirmed' ? 'Confirmée' :
               booking.status === 'completed' ? 'Terminée' :
               booking.status === 'cancelled' ? 'Annulée' : 'Inconnu'}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.route}>
          <View style={styles.routePoint}>
            <View style={styles.routeDot} />
            <Text style={styles.routeCity}>{String(trip?.departure?.city || 'Départ')}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.routeCity}>{String(trip?.destination?.city || 'Destination')}</Text>
          </View>
        </View>

        {/* Booking info */}
        <View style={styles.bookingInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {new Date(trip?.departureTime).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{String(booking.seats)} place{booking.seats > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{String(booking.totalPrice)} DA</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
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
                  <Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {booking.status === 'confirmed' && (
            <View style={styles.confirmedInfo}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
              <Text style={styles.confirmedText}>Réservation confirmée</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Réservations du Trajet</Text>
        <View style={styles.placeholder} />
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
        ) : bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>Aucune réservation pour ce trajet</Text>
          </View>
        ) : (
          bookings.map(renderBookingCard)
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 32,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.light,
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.background.white,
    margin: 16,
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
  passengerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  passengerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  passengerAvatarText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#FFF3CD',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusCompleted: {
    backgroundColor: '#E0E7FF',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  route: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  routeCity: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border.medium,
    marginLeft: 5,
    marginVertical: 4,
  },
  bookingInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  actionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  confirmedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    gap: 8,
  },
  confirmedText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
