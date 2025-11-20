import { Logo } from '@/components/logo';
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams();
  const emailParam = params.email as string;

  const [email, setEmail] = useState(emailParam || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showError, showSuccess, showWarning, hideToast } = useToast();

  const handleResetPassword = async () => {
    if (!email || !code || !newPassword || !confirmPassword) {
      showWarning('Veuillez remplir tous les champs');
      return;
    }

    if (code.length !== 6) {
      showError('Le code doit contenir 6 chiffres');
      return;
    }

    if (newPassword.length < 6) {
      showError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(email, code, newPassword);
      
      showSuccess('Votre mot de passe a été réinitialisé avec succès !');
      
      // Rediriger après un court délai
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showWarning('Adresse email manquante');
      return;
    }

    try {
      await authService.forgotPassword(email);
      showSuccess('Un nouveau code a été envoyé à votre email');
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header avec bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Titre */}
        <Text style={styles.title}>Réinitialisation</Text>
        <Text style={styles.subtitle}>
          Entrez le code reçu par email et votre nouveau mot de passe.
        </Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Adresse email</Text>
            <TextInput
              style={styles.input}
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading && !emailParam}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Code de vérification</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              editable={!isLoading}
            />
            <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
              <Text style={styles.resendButtonText}>Renvoyer le code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nouveau mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Minimum 6 caractères"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#6D7175"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Répétez votre mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#6D7175"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton de réinitialisation */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!email || !code || !newPassword || !confirmPassword || isLoading) &&
                styles.submitButtonDisabled,
            ]}
            disabled={!email || !code || !newPassword || !confirmPassword || isLoading}
            onPress={handleResetPassword}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Réinitialiser</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Lien de retour */}
        <View style={styles.backToLoginContainer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.backToLoginText}>
              <Ionicons name="arrow-back" size={14} color="#00AFF5" /> Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00334E',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6D7175',
    lineHeight: 24,
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00334E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  resendButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#00AFF5',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#00AFF5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#B3E5F7',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  backToLoginText: {
    fontSize: 15,
    color: '#00AFF5',
    fontWeight: '600',
  },
});

