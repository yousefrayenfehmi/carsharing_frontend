import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Modal,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAlert } from '@/contexts/alert-context';
import { Ionicons } from '@expo/vector-icons';
import { adminService, Admin } from '../services/admin.service';
import { Colors } from '../constants/colors';
import { GooglePlacesInput } from '../components/google-places-input';

export default function AdminAdmins() {
  const router = useRouter();
  const { showError, showSuccess, showConfirm } = useAlert();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    city: string;
    wilaya?: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationDisplay, setLocationDisplay] = useState('');

  // Champs pour créer un admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin'>('admin');

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAdmins();
      setAdmins(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de charger les admins');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Pour les admins (non super_admin), la wilaya est optionnelle mais recommandée
    if (role === 'admin' && !selectedLocation) {
      Alert.alert(
        'Confirmation',
        'Voulez-vous créer cet administrateur sans wilaya assignée ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: () => createAdminWithData() }
        ]
      );
      return;
    }

    await createAdminWithData();
  };

  const createAdminWithData = async () => {
    try {
      await adminService.createAdmin({ 
        email, 
        password, 
        firstName, 
        lastName, 
        role,
        wilaya: selectedLocation?.wilaya || selectedLocation?.city
      });
      setCreateModalVisible(false);
      Alert.alert('Succès', 'Administrateur créé avec succès');
      loadAdmins();
      // Réinitialiser les champs
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole('admin');
      setSelectedWilaya(null);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de créer l\'administrateur');
    }
  };

  const handleBlockAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    if (admin.isBlocked) {
      // Débloquer directement
      Alert.alert(
        'Débloquer l\'admin',
        `Êtes-vous sûr de vouloir débloquer ${admin.firstName} ${admin.lastName} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Débloquer',
            onPress: async () => {
              try {
                await adminService.toggleBlockAdmin(admin._id, false);
                Alert.alert('Succès', 'Administrateur débloqué');
                loadAdmins();
              } catch (error: any) {
                Alert.alert('Erreur', error.response?.data?.message || 'Impossible de débloquer l\'administrateur');
              }
            },
          },
        ]
      );
    } else {
      // Demander la raison du blocage
      setBlockReason('');
      setBlockModalVisible(true);
    }
  };

  const confirmBlockAdmin = async () => {
    if (!selectedAdmin) return;

    if (!blockReason.trim()) {
      Alert.alert('Erreur', 'Veuillez indiquer une raison du blocage');
      return;
    }

    try {
      await adminService.toggleBlockAdmin(selectedAdmin._id, true, blockReason);
      setBlockModalVisible(false);
      Alert.alert('Succès', 'Administrateur bloqué');
      loadAdmins();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de bloquer l\'administrateur');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAdmins();
  };

  const getRoleDisplay = (roleValue: string) => {
    switch (roleValue) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrateur';
      default:
        return roleValue;
    }
  };

  const renderAdminItem = ({ item }: { item: Admin }) => (
    <View style={styles.adminCard}>
      <View style={styles.adminHeader}>
        <View style={styles.adminAvatar}>
          <Text style={styles.adminAvatarText}>
            {String(item.firstName[0])}{String(item.lastName[0])}
          </Text>
        </View>
        <View style={styles.adminInfo}>
          <Text style={styles.adminName}>{String(item.firstName)} {String(item.lastName)}</Text>
          <Text style={styles.adminEmail}>{String(item.email)}</Text>
          <View style={styles.adminTags}>
            <View style={[styles.tag, item.role === 'super_admin' ? styles.superAdminTag : styles.adminTag]}>
              <Text style={[styles.tagText, item.role === 'super_admin' && styles.superAdminTagText]}>
                {String(getRoleDisplay(item.role))}
              </Text>
            </View>
            {item.isBlocked && (
              <View style={[styles.tag, styles.blockedTag]}>
                <Text style={styles.blockedTagText}>Bloqué</Text>
              </View>
            )}
          </View>
          {item.zone?.wilaya && (
            <View style={styles.wilayaDisplay}>
              <Ionicons name="location-outline" size={14} color={Colors.text.light} />
              <Text style={styles.wilayaDisplayText}>{String(item.zone.wilaya)}</Text>
            </View>
          )}
        </View>
      </View>

      {item.isBlocked && item.blockReason && (
        <View style={styles.blockReasonContainer}>
          <Text style={styles.blockReasonLabel}>Raison du blocage:</Text>
          <Text style={styles.blockReasonText}>{String(item.blockReason)}</Text>
        </View>
      )}

      {item.lastLogin && (
        <Text style={styles.lastLogin}>
          Dernière connexion: {String(new Date(item.lastLogin).toLocaleDateString('fr-FR'))}
        </Text>
      )}

      {item.role !== 'super_admin' && (
        <TouchableOpacity
          style={[styles.blockButton, item.isBlocked && styles.unblockButton]}
          onPress={() => handleBlockAdmin(item)}
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
      )}
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
        <Text style={styles.headerTitle}>Administrateurs</Text>
        <TouchableOpacity onPress={() => setCreateModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={admins}
        renderItem={renderAdminItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Modal pour créer un admin */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Créer un administrateur</Text>

              <ScrollView 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                contentContainerStyle={styles.scrollContent}
              >
              <TextInput
                style={styles.modalInput}
                placeholder="Prénom"
                placeholderTextColor={Colors.text.light}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Nom"
                placeholderTextColor={Colors.text.light}
                value={lastName}
                onChangeText={setLastName}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                placeholderTextColor={Colors.text.light}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.text.light}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.wilayaInputWrapper}>
                <Text style={styles.wilayaLabel}>
                  Wilaya de gestion {role === 'admin' ? '(Optionnel)' : ''}
                </Text>
                <GooglePlacesInput
                  value={locationDisplay}
                  onPlaceSelect={(place) => {
                    setSelectedLocation(place);
                    setLocationDisplay(place.wilaya || place.city);
                  }}
                  label=""
                  placeholder="Ex: Alger, Oran..."
                  icon="location"
                  searchType="cities"
                  useModal={false}
                />
              </View>

              <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleButton, styles.roleButtonActive]}
                disabled
              >
                <Text style={[styles.roleButtonText, styles.roleButtonTextActive]}>
                  Administrateur
                </Text>
              </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateAdmin}
              >
                <Text style={styles.confirmButtonText}>Créer</Text>
              </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Modal pour bloquer un admin */}
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
              <Text style={styles.modalTitle}>Bloquer l'administrateur</Text>
              <Text style={styles.modalSubtitle}>
                {String(selectedAdmin?.firstName)} {String(selectedAdmin?.lastName)}
              </Text>

              <TextInput
                style={[styles.modalInput, styles.textArea]}
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
                  onPress={confirmBlockAdmin}
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
  addButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  adminCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adminHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  adminAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  adminInfo: {
    flex: 1,
    marginLeft: 12,
  },
  adminName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: Colors.text.light,
    marginBottom: 8,
  },
  adminTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  superAdminTag: {
    backgroundColor: '#FFE5E5',
  },
  adminTag: {
    backgroundColor: Colors.primaryLight,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  superAdminTagText: {
    color: Colors.error,
  },
  blockedTag: {
    backgroundColor: '#FFF4E6',
  },
  blockedTagText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
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
  lastLogin: {
    fontSize: 12,
    color: Colors.text.light,
    marginBottom: 12,
  },
  blockButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingTop: 28,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.text.light,
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#E8EAED',
    marginBottom: 14,
    minHeight: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8EAED',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  roleButtonText: {
    fontSize: 15,
    color: '#5F6368',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  roleButtonTextActive: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: '#E8EAED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButtonText: {
    color: '#5F6368',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  confirmButton: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  wilayaContainer: {
    marginBottom: 16,
  },
  wilayaInputWrapper: {
    marginBottom: 16,
  },
  wilayaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 8,
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  wilayaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F7FF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#C7E0FF',
    minHeight: 54,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  wilayaButtonText: {
    fontSize: 15,
    color: '#1A1A2E',
    flex: 1,
    fontWeight: '500',
  },
  wilayaPlaceholder: {
    color: '#9AA0A6',
    fontStyle: 'italic',
  },
  wilayaDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  wilayaDisplayText: {
    fontSize: 12,
    color: Colors.text.light,
  },
});

