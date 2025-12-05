import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adminService, User } from '../services/admin.service';
import { Colors } from '../constants/colors';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(query)
    );
    setFilteredUsers(filtered);
  };

  const handleBlockUser = async (user: User) => {
    setSelectedUser(user);
    if (user.isBlocked) {
      // Débloquer directement
      try {
        await adminService.toggleBlockUser(user._id, false);
        Alert.alert('Succès', 'Utilisateur débloqué');
        loadUsers();
      } catch (error: any) {
        Alert.alert('Erreur', error.response?.data?.message || 'Impossible de débloquer l\'utilisateur');
      }
    } else {
      // Demander la raison du blocage
      setBlockReason('');
      setBlockModalVisible(true);
    }
  };

  const confirmBlockUser = async () => {
    if (!selectedUser) return;

    if (!blockReason.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer une raison du blocage');
      return;
    }

    try {
      await adminService.toggleBlockUser(selectedUser._id, true, blockReason);
      setBlockModalVisible(false);
      Alert.alert('Succès', 'Utilisateur bloqué');
      loadUsers();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de bloquer l\'utilisateur');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {String(item.firstName[0])}{String(item.lastName[0])}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{String(item.firstName)} {String(item.lastName)}</Text>
          <Text style={styles.userEmail}>{String(item.email)}</Text>
          <Text style={styles.userPhone}>{String(item.phoneNumber)}</Text>
          <View style={styles.userTags}>
            <View style={[styles.tag, styles.roleTag]}>
              <Text style={styles.tagText}>
                {String(item.role === 'driver' ? 'Conducteur' : item.role === 'client' ? 'Client' : 'Client & Conducteur')}
              </Text>
            </View>
            {item.isBlocked && (
              <View style={[styles.tag, styles.blockedTag]}>
                <Text style={styles.blockedTagText}>Bloqué</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.userStats}>
        <View style={styles.stat}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={styles.statText}>{String(item.rating.toFixed(1))}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="car" size={16} color={Colors.primary} />
          <Text style={styles.statText}>{String(item.totalTrips)} trajets</Text>
        </View>
      </View>

      {item.isBlocked && item.blockReason && (
        <View style={styles.blockReasonContainer}>
          <Text style={styles.blockReasonLabel}>Raison du blocage:</Text>
          <Text style={styles.blockReasonText}>{String(item.blockReason)}</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => router.push({
            pathname: '/admin-user-stats',
            params: {
              userId: item._id,
              userName: `${item.firstName} ${item.lastName}`
            }
          })}
        >
          <Ionicons name="stats-chart-outline" size={20} color={Colors.primary} />
          <Text style={styles.statsButtonText}>Statistiques</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.blockButton, item.isBlocked && styles.unblockButton]}
          onPress={() => handleBlockUser(item)}
        >
          <Ionicons
            name={item.isBlocked ? 'lock-open-outline' : 'lock-closed-outline'}
            size={20}
            color={Colors.text.white}
          />
          <Text style={styles.blockButtonText}>
            {String(item.isBlocked ? 'Débloquer' : 'Bloquer')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Utilisateurs</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un utilisateur..."
          placeholderTextColor={Colors.text.light}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
          </View>
        }
      />

      <Modal
        visible={blockModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bloquer l'utilisateur</Text>
              <Text style={styles.modalSubtitle}>
                {String(selectedUser?.firstName)} {String(selectedUser?.lastName)}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Raison du blocage..."
                placeholderTextColor={Colors.text.light}
                value={blockReason}
                onChangeText={setBlockReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setBlockModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmBlockUser}
                >
                  <Text style={styles.confirmButtonText}>Bloquer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  listContent: {
    padding: 16,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.light,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.text.light,
    marginBottom: 8,
  },
  userTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleTag: {
    backgroundColor: Colors.primaryLight,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  blockedTag: {
    backgroundColor: '#FFE5E5',
  },
  blockedTagText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
  },
  userStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  blockReasonContainer: {
    backgroundColor: '#FFF4E6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  blockReasonLabel: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
    marginBottom: 4,
  },
  blockReasonText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statsButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  blockButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  unblockButton: {
    backgroundColor: Colors.success,
  },
  blockButtonText: {
    color: Colors.text.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.light,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.text.light,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: Colors.error,
  },
  confirmButtonText: {
    color: Colors.text.white,
    fontWeight: '600',
  },
});

