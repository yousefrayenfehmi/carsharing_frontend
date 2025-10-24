import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../services/admin.service';
import { Colors } from '../constants/colors';

export default function AdminUserStats() {
  const router = useRouter();
  const { userId, userName } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month'>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadStats();
  }, [selectedPeriod, selectedMonth, selectedYear]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const params = selectedPeriod === 'month' ? { month: selectedMonth, year: selectedYear } : {};
      const data = await adminService.getUserStats(
        userId as string,
        params.month,
        params.year
      );
      setStats(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Statistiques</Text>
          <Text style={styles.subtitle}>{String(userName || stats?.user?.name)}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* En tant que Conducteur */}
        {stats?.asDriver && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍✈️ Statistiques Conducteur</Text>

            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="cash-outline" size={32} color="#4CAF50" />
                <Text style={styles.statValue}>{String(stats.asDriver.totalRevenue)} DA</Text>
                <Text style={styles.statLabel}>Chiffre d'affaire généré</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="trending-up" size={32} color="#FF9800" />
                <Text style={styles.statValue}>{String(stats.asDriver.totalCommission)} DA</Text>
                <Text style={styles.statLabel}>Commission générée</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="wallet-outline" size={32} color="#2196F3" />
                <Text style={styles.statValue}>{String(stats.asDriver.netRevenue)} DA</Text>
                <Text style={styles.statLabel}>Revenu net</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="car-outline" size={32} color="#9C27B0" />
                <Text style={styles.statValue}>{String(stats.asDriver.totalTrips)}</Text>
                <Text style={styles.statLabel}>Total trajets</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-circle-outline" size={32} color="#4CAF50" />
                <Text style={styles.statValue}>{String(stats.asDriver.completedTrips)}</Text>
                <Text style={styles.statLabel}>Trajets complétés</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="close-circle-outline" size={32} color="#F44336" />
                <Text style={styles.statValue}>{String(stats.asDriver.cancelledTrips)}</Text>
                <Text style={styles.statLabel}>Annulations</Text>
              </View>
            </View>

            {/* Top 10 Routes */}
            {stats.asDriver.citiesStats?.length > 0 && (
              <View style={styles.routesCard}>
                <Text style={styles.routesTitle}>📍 Top 10 des Routes</Text>
                {stats.asDriver.citiesStats.map((route: any, index: number) => (
                  <View key={index} style={styles.routeItem}>
                    <View style={styles.routeRank}>
                      <Text style={styles.rankNumber}>{String(index + 1)}</Text>
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeName}>{String(route.route)}</Text>
                      <Text style={styles.routeCount}>{String(route.count)} trajets</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* En tant que Passager */}
        {stats?.asPassenger && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚗 Statistiques Passager</Text>

            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="receipt-outline" size={32} color="#2196F3" />
                <Text style={styles.statValue}>{String(stats.asPassenger.totalBookings)}</Text>
                <Text style={styles.statLabel}>Total réservations</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="checkmark-done-outline" size={32} color="#4CAF50" />
                <Text style={styles.statValue}>{String(stats.asPassenger.completedBookings)}</Text>
                <Text style={styles.statLabel}>Réservations complétées</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
                <Ionicons name="close-outline" size={32} color="#F44336" />
                <Text style={styles.statValue}>{String(stats.asPassenger.cancelledBookings)}</Text>
                <Text style={styles.statLabel}>Annulations</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="cash-outline" size={32} color="#FF9800" />
                <Text style={styles.statValue}>{String(stats.asPassenger.totalSpent)} DA</Text>
                <Text style={styles.statLabel}>Total dépensé</Text>
              </View>
            </View>
          </View>
        )}

        {/* Résumé Global */}
        {stats?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Résumé Global</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total annulations</Text>
                <Text style={styles.summaryValue}>{String(stats.summary.totalCancellations)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taux d'annulation</Text>
                <Text style={[styles.summaryValue, { color: stats.summary.cancellationRate > 20 ? Colors.error : Colors.success }]}>
                  {String(stats.summary.cancellationRate)}%
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.card,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.light,
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  routesCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  routesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  routeRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  routeCount: {
    fontSize: 12,
    color: Colors.text.light,
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
});

