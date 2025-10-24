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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adminService, Payment } from '../services/admin.service';
import { Colors } from '../constants/colors';

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function AdminPayments() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await adminService.getAllPendingPayments();
      setPayments(data);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de charger les paiements');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleMarkAsPaid = (payment: Payment) => {
    setSelectedPayment(payment);
    setTransactionId('');
    setModalVisible(true);
  };

  const confirmPayment = async () => {
    if (!selectedPayment) return;

    if (!transactionId.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer l\'ID de transaction');
      return;
    }

    try {
      await adminService.updatePaymentStatus(selectedPayment._id, 'paid', transactionId);
      setModalVisible(false);
      Alert.alert('Succès', 'Paiement marqué comme payé');
      loadPayments();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de mettre à jour le paiement');
    }
  };

  const handleCancelPayment = (payment: Payment) => {
    Alert.alert(
      'Annuler le paiement',
      'Êtes-vous sûr de vouloir annuler ce paiement ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await adminService.updatePaymentStatus(payment._id, 'cancelled');
              Alert.alert('Succès', 'Paiement annulé');
              loadPayments();
            } catch (error: any) {
              Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'annuler le paiement');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>
              {String(item.driver.firstName[0])}{String(item.driver.lastName[0])}
            </Text>
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>
              {String(item.driver.firstName)} {String(item.driver.lastName)}
            </Text>
            <Text style={styles.driverContact}>{String(item.driver.email)}</Text>
            <Text style={styles.driverContact}>{String(item.driver.phoneNumber)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.text.light} />
          <Text style={styles.detailText}>
            {String(MONTHS[item.month - 1])} {String(item.year)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color={Colors.text.light} />
          <Text style={styles.detailText}>
            Commission: {String(item.commissionAmount.toFixed(2))} DA
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="wallet-outline" size={16} color={Colors.text.light} />
          <Text style={styles.detailText}>
            Montant total: {String(item.amount.toFixed(2))} DA
          </Text>
        </View>
      </View>

      <View style={styles.paymentActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.paidButton]}
          onPress={() => handleMarkAsPaid(item)}
        >
          <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
          <Text style={styles.actionButtonText}>Marquer payé</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleCancelPayment(item)}
        >
          <Ionicons name="close-circle" size={20} color={Colors.text.white} />
          <Text style={styles.actionButtonText}>Annuler</Text>
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
        <Text style={styles.headerTitle}>Paiements en attente</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cash-outline" size={64} color={Colors.text.light} />
            <Text style={styles.emptyText}>Aucun paiement en attente</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer le paiement</Text>
            <Text style={styles.modalSubtitle}>
              {String(selectedPayment?.driver.firstName)} {String(selectedPayment?.driver.lastName)}
            </Text>
            <Text style={styles.modalAmount}>
              {String(selectedPayment?.amount.toFixed(2))} DA
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="ID de transaction..."
              placeholderTextColor={Colors.text.light}
              value={transactionId}
              onChangeText={setTransactionId}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={confirmPayment}
              >
                <Text style={styles.modalConfirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  listContent: {
    padding: 16,
  },
  paymentCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentHeader: {
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  driverContact: {
    fontSize: 14,
    color: Colors.text.light,
  },
  paymentDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  paidButton: {
    backgroundColor: Colors.success,
  },
  cancelButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    color: Colors.text.white,
    fontWeight: '600',
    fontSize: 14,
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
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
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
  modalCancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelButtonText: {
    color: Colors.text.primary,
    fontWeight: '600',
  },
  modalConfirmButton: {
    backgroundColor: Colors.success,
  },
  modalConfirmButtonText: {
    color: Colors.text.white,
    fontWeight: '600',
  },
});

