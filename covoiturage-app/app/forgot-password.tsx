import { Logo } from '@/components/logo';
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showError, showSuccess, showWarning, hideToast } = useToast();

  const handleForgotPassword = async () => {
    if (!email) {
      showWarning('Veuillez entrer votre adresse email');
      return;
    }

    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Adresse email invalide');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      
      showSuccess('Un code de réinitialisation a été envoyé à votre email');
      
      // Rediriger après un court délai
      setTimeout(() => {
        router.push({
          pathname: '/reset-password',
          params: { email },
        });
      }, 1500);
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header avec bouton retour */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Titre */}
        <Text style={styles.title}>Mot de passe oublié ?</Text>
        <Text style={styles.subtitle}>
          Entrez votre adresse email et nous vous enverrons un code pour réinitialiser votre mot de passe.
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
              editable={!isLoading}
            />
          </View>

          {/* Bouton d'envoi */}
          <TouchableOpacity
            style={[styles.submitButton, (!email || isLoading) && styles.submitButtonDisabled]}
            disabled={!email || isLoading}
            onPress={handleForgotPassword}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Envoyer le code</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Lien de retour */}
        <View style={styles.backToLoginContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backToLoginText}>
              <Ionicons name="arrow-back" size={14} color="#00AFF5" /> Retour à la connexion
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginBottom: 24,
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
  submitButton: {
    backgroundColor: '#00AFF5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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

