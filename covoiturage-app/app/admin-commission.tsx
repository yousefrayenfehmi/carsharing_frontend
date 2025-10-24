import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../services/admin.service';
import { Colors } from '../constants/colors';

export default function AdminCommission() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentRate, setCurrentRate] = useState(0);
  const [newRate, setNewRate] = useState('');

  useEffect(() => {
    loadCommissionRate();
  }, []);

  const loadCommissionRate = async () => {
    try {
      const data = await adminService.getCommissionRate();
      setCurrentRate(data.rate);
      setNewRate(String((data.rate * 100).toFixed(1)));
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de charger le taux de commission');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const rateValue = parseFloat(newRate);
    
    if (isNaN(rateValue) || rateValue < 0 || rateValue >= 100) {
      Alert.alert('Erreur', 'Veuillez entrer un taux valide entre 0 et 99%');
      return;
    }

    Alert.alert(
      'Confirmer la modification',
      `Le taux de commission sera modifié de ${String((currentRate * 100).toFixed(1))}% à ${String(rateValue)}%.\n\nCette modification affectera tous les futurs trajets.\n\nConfirmer ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              setSaving(true);
              await adminService.updateCommissionRate(rateValue / 100);
              Alert.alert('Succès', 'Taux de commission mis à jour');
              loadCommissionRate();
            } catch (error: any) {
              Alert.alert('Erreur', error.response?.data?.message || 'Impossible de mettre à jour le taux');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Paramètres de commission</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="trending-up" size={48} color={Colors.primary} />
          </View>
          
          <Text style={styles.currentRateLabel}>Taux de commission actuel</Text>
          <Text style={styles.currentRateValue}>{String((currentRate * 100).toFixed(1))}%</Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#0077CC" />
            <Text style={styles.infoText}>
              Ce taux est appliqué automatiquement sur tous les trajets à prix fixe.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Modifier le taux de commission</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="16.0"
              placeholderTextColor={Colors.text.light}
              value={newRate}
              onChangeText={setNewRate}
              keyboardType="decimal-pad"
            />
            <Text style={styles.inputSuffix}>%</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.text.white} />
            ) : (
              <>
                <Ionicons name="save" size={20} color={Colors.text.white} />
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#FF9500" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Attention</Text>
            <Text style={styles.warningText}>
              La modification du taux de commission affectera tous les nouveaux trajets créés après cette modification. Les trajets existants conserveront leur taux initial.
            </Text>
          </View>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>Exemple de calcul</Text>
          <View style={styles.exampleRow}>
            <Text style={styles.exampleLabel}>Prix du trajet:</Text>
            <Text style={styles.exampleValue}>1000 DA</Text>
          </View>
          <View style={styles.exampleRow}>
            <Text style={styles.exampleLabel}>Commission ({String((currentRate * 100).toFixed(1))}%):</Text>
            <Text style={styles.exampleValue}>{String((1000 * currentRate).toFixed(0))} DA</Text>
          </View>
          <View style={styles.exampleDivider} />
          <View style={styles.exampleRow}>
            <Text style={styles.exampleLabelBold}>Prix client:</Text>
            <Text style={styles.exampleValueBold}>{String((1000 * (1 + currentRate)).toFixed(0))} DA</Text>
          </View>
          <View style={styles.exampleRow}>
            <Text style={styles.exampleLabelBold}>Prix conducteur:</Text>
            <Text style={styles.exampleValueBold}>1000 DA</Text>
          </View>
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  currentRateLabel: {
    fontSize: 16,
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 8,
  },
  currentRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E5F5FF',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0077CC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  inputSuffix: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF4E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#996600',
  },
  exampleBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  exampleValue: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  exampleLabelBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  exampleValueBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  exampleDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
});

