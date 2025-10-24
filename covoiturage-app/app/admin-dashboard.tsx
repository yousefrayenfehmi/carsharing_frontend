import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAlert } from '@/contexts/alert-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { adminService, Admin } from '../services/admin.service';
import { Colors } from '../constants/colors';

export default function AdminDashboard() {
  const router = useRouter();
  const { showError, showConfirm } = useAlert();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commissionRate, setCommissionRate] = useState(0);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const adminDataStr = await SecureStore.getItemAsync('adminData');
      if (adminDataStr) {
        const adminData = JSON.parse(adminDataStr);
        setAdmin(adminData);
        
        // Charger le taux de commission
        const commission = await adminService.getCommissionRate();
        setCommissionRate(commission.rate);
      } else {
        router.replace('/login');
      }
    } catch (error) {
      console.error('Erreur chargement admin:', error);
      showError('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    showConfirm(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      async () => {
        await SecureStore.deleteItemAsync('adminToken');
        await SecureStore.deleteItemAsync('adminRefreshToken');
        await SecureStore.deleteItemAsync('adminData');
        router.replace('/login');
      }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAdminData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.adminName}>{String(admin?.firstName)} {String(admin?.lastName)}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>
              {String(admin?.role === 'super_admin' ? 'Super Admin' : 'Administrateur')}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {admin?.role === 'super_admin' && (
          <View style={styles.infoCard}>
            <Ionicons name="trending-up" size={24} color={Colors.primary} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Taux de commission</Text>
              <Text style={styles.infoCardValue}>{String((commissionRate * 100).toFixed(1))}%</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu principal</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin-users')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="people" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.menuItemText}>Gestion des utilisateurs</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>

          {(admin?.role === 'super_admin' || admin?.role === 'admin') && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/admin-payments')}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FFF4E6' }]}>
                  <Ionicons name="cash" size={24} color="#FF9500" />
                </View>
                <Text style={styles.menuItemText}>Gestion des paiements</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
            </TouchableOpacity>
          )}

          {admin?.role === 'super_admin' && (
            <>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/admin-admins')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#FFE5E5' }]}>
                    <Ionicons name="shield-checkmark" size={24} color={Colors.error} />
                  </View>
                  <Text style={styles.menuItemText}>Gestion des admins</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/admin-commission')}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: '#E5F5FF' }]}>
                    <Ionicons name="settings" size={24} color="#0077CC" />
                  </View>
                  <Text style={styles.menuItemText}>Paramètres de commission</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin-change-password')}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0F0F0' }]}>
                <Ionicons name="key" size={24} color="#666" />
              </View>
              <Text style={styles.menuItemText}>Changer le mot de passe</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.light} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.text.light,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 4,
  },
  roleContainer: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoCardContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    color: Colors.text.light,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
    flex: 1,
  },
});

