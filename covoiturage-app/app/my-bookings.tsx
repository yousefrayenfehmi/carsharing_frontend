import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useBookings } from '@/hooks/use-bookings';
import { ReviewModal } from '@/components/review-modal';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Location from 'expo-location';
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

type TabType = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function MyBookingsScreen() {
  const { showError, showSuccess, showConfirm } = useAlert();
  const { getMyBookings, loading, cancelBookingWithLocation } = useBookings();
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [refreshing, setRefreshing] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const loadBookings = async (status?: TabType) => {
    try {
      const data = await getMyBookings(status);
      setBookings(data);
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  useEffect(() => {
    loadBookings(activeTab);
  }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings(activeTab);
    setRefreshing(false);
  }, [activeTab]);

  const handleReview = (booking: any) => {
    setSelectedBooking(booking);
    setReviewModalVisible(true);
  };

  const handleReviewSuccess = () => {
    loadBookings(activeTab);
  };

  const handleCancelBooking = async (bookingId: string) => {
    showConfirm(
      'Annuler la réservation',
      'Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.',
      async () => {
        try {
          setCancellingBooking(bookingId);
          
          // Demander la permission de géolocalisation
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            showError('Permission requise', 'La géolocalisation est nécessaire pour annuler une réservation.');
            setCancellingBooking(null);
            return;
          }

          // Obtenir la position actuelle
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          await cancelBookingWithLocation(
            bookingId,
            location.coords.latitude,
            location.coords.longitude,
            'Annulation par le passager'
          );
          
          showSuccess('Succès', 'La réservation a été annulée avec succès');
          loadBookings(activeTab); // Recharger la liste
        } catch (error: any) {
          showError('Erreur', error.message || 'Erreur lors de l\'annulation');
        } finally {
          setCancellingBooking(null);
        }
      }
    );
  };

  const renderBookingCard = (booking: any) => {
    const driver = booking.driver || booking.trip?.driver;
    const trip = booking.trip;

    return (
      <View key={booking._id} style={styles.card}>
        {/* Header avec driver info */}
        <View style={styles.cardHeader}>
          <View style={styles.driverSection}>
            {driver?.profilePicture ? (
              <Image source={{ uri: driver.profilePicture }} style={styles.driverAvatar} />
            ) : (
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>
                  {String(driver?.firstName?.[0] || '')}{String(driver?.lastName?.[0] || '')}
                </Text>
              </View>
            )}
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {String(driver?.firstName || '')} {String(driver?.lastName || '')}
              </Text>
              {driver?.rating && (
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>{String(driver.rating.toFixed(1))}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={[
            styles.statusBadge,
            booking.status === 'confirmed' && styles.statusConfirmed,
            booking.status === 'completed' && styles.statusCompleted,
            booking.status === 'cancelled' && styles.statusCancelled,
          ]}>
            <Text style={styles.statusText}>
              {booking.status === 'confirmed' ? 'Confirmée' :
               booking.status === 'completed' ? 'Terminée' :
               booking.status === 'cancelled' ? 'Annulée' : 'En attente'}
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
          {booking.status === 'completed' && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => handleReview(booking)}
            >
              <Ionicons name="star-outline" size={18} color={Colors.primary} />
              <Text style={styles.reviewButtonText}>Noter le conducteur</Text>
            </TouchableOpacity>
          )}
          
          {booking.status === 'confirmed' && (
            <TouchableOpacity
              style={[
                styles.cancelButton,
                cancellingBooking === booking._id && styles.cancelButtonDisabled
              ]}
              onPress={() => handleCancelBooking(booking._id)}
              disabled={cancellingBooking === booking._id}
            >
              {cancellingBooking === booking._id ? (
                <ActivityIndicator size="small" color={Colors.text.white} />
              ) : (
                <>
                  <Ionicons name="close-circle-outline" size={18} color={Colors.text.white} />
                  <Text style={styles.cancelButtonText}>Annuler la réservation</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          {booking.status === 'pending' && (
            <View style={styles.pendingInfo}>
              <Ionicons name="time-outline" size={18} color={Colors.text.secondary} />
              <Text style={styles.pendingText}>En attente de confirmation par le conducteur</Text>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Réservations</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            En attente
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'confirmed' && styles.activeTab]}
          onPress={() => setActiveTab('confirmed')}
        >
          <Text style={[styles.tabText, activeTab === 'confirmed' && styles.activeTabText]}>
            Confirmées
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Terminées
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>
            Annulées
          </Text>
        </TouchableOpacity>
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
            <Text style={styles.emptyText}>
              {activeTab === 'pending' ? 'Aucune réservation en attente' :
               activeTab === 'confirmed' ? 'Aucune réservation confirmée' :
               activeTab === 'completed' ? 'Aucune réservation terminée' :
               'Aucune réservation annulée'}
            </Text>
          </View>
        ) : (
          bookings.map(renderBookingCard)
        )}
      </ScrollView>

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          visible={reviewModalVisible}
          bookingId={selectedBooking._id}
          driverName={`${selectedBooking.driver?.firstName || ''} ${selectedBooking.driver?.lastName || ''}`}
          onClose={() => {
            setReviewModalVisible(false);
            setSelectedBooking(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
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
    marginBottom: 16,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
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
    height: 20,
    backgroundColor: Colors.border.medium,
    marginLeft: 5,
    marginVertical: 4,
  },
  bookingInfo: {
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
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
  pendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    gap: 8,
  },
  pendingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});


