import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useTrips } from '@/hooks/use-trips';
import { useBookings } from '@/hooks/use-bookings';
import { tripService } from '@/services/trip-service';
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

export default function DashboardScreen() {
  const { showError } = useAlert();
  const { isAuthenticated, user } = useAuth();
  const { getMyTrips, loading: tripsLoading } = useTrips();
  const [trips, setTrips] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    totalRevenue: 0,
    totalCommission: 0,
    netRevenue: 0,
    totalPassengers: 0,
    averageRating: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  const loadDashboard = async () => {
    try {
      // Charger les statistiques depuis le backend
      const statsData = await tripService.getDriverStats();
      setStats(statsData);
      
      // Charger les trajets pour la liste
      const allTrips = await getMyTrips();
      setTrips(allTrips);
      
      // Derniers trajets (5 plus récents)
      const sorted = [...allTrips].sort((a, b) => 
        new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime()
      );
      setRecentTrips(sorted.slice(0, 5));
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="log-in-outline" size={64} color={Colors.text.secondary} />
          <Text style={styles.emptyTitle}>Connexion requise</Text>
          <Text style={styles.emptyText}>
            Connectez-vous pour accéder à votre tableau de bord
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{String(stats.averageRating.toFixed(1))}</Text>
          </View>
        </View>

        {/* Statistiques principales */}
        <View style={styles.statsGrid}>
          {/* Revenus nets */}
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="wallet" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.netRevenue.toFixed(2)} DA</Text>
            <Text style={styles.statLabel}>Revenus nets</Text>
            <Text style={styles.statSubtext}>
              (Commission: {stats.totalCommission.toFixed(2)} DA)
            </Text>
          </View>

          {/* Trajets actifs */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="car-sport" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.activeTrips}</Text>
            <Text style={styles.statLabel}>Trajets actifs</Text>
          </View>

          {/* Trajets terminés */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.statValue}>{stats.completedTrips}</Text>
            <Text style={styles.statLabel}>Trajets terminés</Text>
          </View>

          {/* Passagers transportés */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalPassengers}</Text>
            <Text style={styles.statLabel}>Passagers</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/publish')}
            >
              <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '15' }]}>
                <Ionicons name="add-circle" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.actionText}>Publier un trajet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/trips')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#2196F315' }]}>
                <Ionicons name="list" size={28} color="#2196F3" />
              </View>
              <Text style={styles.actionText}>Mes trajets</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/my-bookings')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#FF980015' }]}>
                <Ionicons name="calendar" size={28} color="#FF9800" />
              </View>
              <Text style={styles.actionText}>Réservations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/negotiations')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#9C27B015' }]}>
                <Ionicons name="chatbubbles" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>Négociations</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trajets récents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trajets récents</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/trips')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {tripsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : recentTrips.length === 0 ? (
            <View style={styles.emptyTrips}>
              <Ionicons name="car-outline" size={48} color={Colors.text.secondary} />
              <Text style={styles.emptyTripsText}>Aucun trajet publié</Text>
              <TouchableOpacity
                style={styles.publishFirstButton}
                onPress={() => router.push('/(tabs)/publish')}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.publishFirstButtonText}>Publier mon premier trajet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentTrips.map((trip) => (
              <View key={trip._id} style={styles.tripCard}>
                <View style={styles.tripHeader}>
                  <View style={styles.tripRoute}>
                    <View style={styles.tripRouteRow}>
                      <Ionicons name="location" size={16} color={Colors.primary} />
                      <Text style={styles.tripCity} numberOfLines={1}>{trip.departure.city}</Text>
                    </View>
                    <Ionicons name="arrow-forward" size={16} color={Colors.text.secondary} />
                    <View style={styles.tripRouteRow}>
                      <Ionicons name="location" size={16} color={Colors.error} />
                      <Text style={styles.tripCity} numberOfLines={1}>{trip.destination.city}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    trip.status === 'active' && styles.statusBadgeActive,
                    trip.status === 'completed' && styles.statusBadgeCompleted,
                    trip.status === 'cancelled' && styles.statusBadgeCancelled,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      trip.status === 'active' && styles.statusTextActive,
                      trip.status === 'completed' && styles.statusTextCompleted,
                      trip.status === 'cancelled' && styles.statusTextCancelled,
                    ]}>
                      {trip.status === 'active' && 'Actif'}
                      {trip.status === 'completed' && 'Terminé'}
                      {trip.status === 'cancelled' && 'Annulé'}
                    </Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.tripDetailItem}>
                    <Ionicons name="calendar-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.tripDetailText}>{formatDate(trip.departureTime)}</Text>
                  </View>
                  <View style={styles.tripDetailItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.tripDetailText}>{formatTime(trip.departureTime)}</Text>
                  </View>
                  <View style={styles.tripDetailItem}>
                    <Ionicons name="people-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.tripDetailText}>
                      {trip.passengers?.length || 0} / {trip.passengers?.length + trip.availableSeats || trip.availableSeats}
                    </Text>
                  </View>
                  <View style={styles.tripDetailItem}>
                    <Ionicons name="cash-outline" size={14} color={Colors.text.secondary} />
                    <Text style={styles.tripDetailText}>{String(trip.price.toFixed(2))} DA</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.viewTripButton}
                  onPress={() => router.push(`/(tabs)/trips`)}
                >
                  <Text style={styles.viewTripButtonText}>Voir les détails</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Conseils */}
        <View style={styles.section}>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb" size={24} color="#FFA500" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Conseil du jour</Text>
              <Text style={styles.tipText}>
                Ajoutez une description détaillée à vos trajets pour attirer plus de passagers !
              </Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: Colors.background.white,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  greeting: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statsGrid: {
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statCardPrimary: {
    borderColor: Colors.primary + '30',
    borderWidth: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  statSubtext: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTrips: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  emptyTripsText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
    marginBottom: 20,
  },
  publishFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  publishFirstButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  tripCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripRoute: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  tripCity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusBadgeActive: {
    backgroundColor: '#4CAF5020',
  },
  statusBadgeCompleted: {
    backgroundColor: '#2196F320',
  },
  statusBadgeCancelled: {
    backgroundColor: '#F4433620',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextActive: {
    color: '#4CAF50',
  },
  statusTextCompleted: {
    color: '#2196F3',
  },
  statusTextCancelled: {
    color: '#F44336',
  },
  tripDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  viewTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginTop: 8,
  },
  viewTripButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#8B7355',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

