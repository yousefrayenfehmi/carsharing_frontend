import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { adminService } from '../services/admin.service';
import { Colors } from '../constants/colors';
import { CustomAlert } from '../components/custom-alert';
import { Toast } from '../components/toast';
import { useToast } from '../hooks/use-toast';

export default function AdminChangePassword() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Attention',
        message: 'Veuillez remplir tous les champs',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
      });
      return;
    }

    if (newPassword.length < 8) {
      setAlertConfig({
        visible: true,
        type: 'warning',
        title: 'Mot de passe trop court',
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Erreur',
        message: 'Les mots de passe ne correspondent pas',
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
      });
      return;
    }

    try {
      setLoading(true);
      await adminService.changePassword(oldPassword, newPassword);
      
      // Réinitialiser les champs
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Succès !',
        message: 'Votre mot de passe a été modifié avec succès',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          router.back();
        },
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Impossible de changer le mot de passe';
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Erreur',
        message: errorMessage,
        onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Changer le mot de passe</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.iconContainer}>
          <Ionicons name="key" size={64} color={Colors.primary} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sécurité du compte</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe actuel</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.text.light} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre mot de passe actuel"
                placeholderTextColor={Colors.text.light}
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowOldPassword(!showOldPassword)}
              >
                <Ionicons
                  name={showOldPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.text.light}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.text.light} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nouveau mot de passe"
                placeholderTextColor={Colors.text.light}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.text.light}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirmer le nouveau mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.text.light} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmez votre nouveau mot de passe"
                placeholderTextColor={Colors.text.light}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.text.light}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Exigences du mot de passe:</Text>
            <View style={styles.requirementItem}>
              <Ionicons
                name={newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={newPassword.length >= 8 ? Colors.success : Colors.text.light}
              />
              <Text style={styles.requirementText}>Au moins 8 caractères</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={newPassword === confirmPassword && newPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={newPassword === confirmPassword && newPassword.length > 0 ? Colors.success : Colors.text.light}
              />
              <Text style={styles.requirementText}>Les mots de passe correspondent</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text.white} />
            ) : (
              <>
                <Ionicons name="save" size={20} color={Colors.text.white} />
                <Text style={styles.saveButtonText}>Changer le mot de passe</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#0077CC" />
          <Text style={styles.infoText}>
            Pour votre sécurité, vous serez automatiquement déconnecté après le changement de mot de passe.
          </Text>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="OK"
        onConfirm={alertConfig.onConfirm}
      />

      {/* Toast */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.background.white,
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
  },
  scrollContent: {
    padding: 16,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 24,
  },
  card: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.text.primary,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  passwordRequirements: {
    backgroundColor: Colors.background.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
    color: Colors.text.secondary,
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
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E5F5FF',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#0077CC',
  },
});

