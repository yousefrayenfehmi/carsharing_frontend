import { Logo } from '@/components/logo';
import { Toast } from '@/components/toast';
import { WilayaPicker } from '@/components/wilaya-picker';
import { Wilaya } from '@/constants/algerian-wilayas';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function EmailSignupScreen() {
  const { signup, isLoading } = useAuth();
  const { toast, showError, hideToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [wilaya, setWilaya] = useState<Wilaya | null>(null);
  const [showWilayaPicker, setShowWilayaPicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    console.log('email', email);
    console.log('password', password);
    console.log('firstName', firstName);
    console.log('lastName', lastName);
    console.log('wilaya', wilaya?.name);
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        wilaya: wilaya?.name,
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    }
  };

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    firstName &&
    lastName &&
    wilaya &&
    password === confirmPassword &&
    password.length >= 8;

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
        <Text style={styles.title}>Créez votre compte</Text>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre prénom"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Wilaya</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowWilayaPicker(true)}
            >
              <Text style={[styles.pickerText, !wilaya && styles.pickerPlaceholder]}>
                {wilaya ? `${wilaya.code} - ${wilaya.name}` : 'Sélectionnez votre wilaya'}
              </Text>
              <Ionicons name="chevron-down" size={24} color="#6D7175" />
            </TouchableOpacity>
          </View>

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
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Minimum 8 caractères"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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
            {password && password.length < 8 && (
              <Text style={styles.errorText}>Le mot de passe doit contenir au moins 8 caractères</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirmez votre mot de passe"
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
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#6D7175"
                />
              </TouchableOpacity>
            </View>
            {confirmPassword && password !== confirmPassword && (
              <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
            )}
          </View>

          {/* Bouton d'inscription */}
          <TouchableOpacity
            style={[styles.submitButton, (!isFormValid || isLoading) && styles.submitButtonDisabled]}
            disabled={!isFormValid || isLoading}
            onPress={handleSignup}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>S&apos;inscrire</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Lien de connexion */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà membre ? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Connexion</Text>
          </TouchableOpacity>
        </View>

        {/* Texte légal */}
        <View style={styles.legalContainer}>
          <Text style={styles.legalText}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.legalLink}>Conditions générales</Text> et notre{' '}
            <Text style={styles.legalLink}>Politique de confidentialité</Text>.
          </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de sélection de wilaya */}
      <WilayaPicker
        visible={showWilayaPicker}
        onClose={() => setShowWilayaPicker(false)}
        onSelect={(selectedWilaya) => setWilaya(selectedWilaya)}
        selectedWilaya={wilaya?.name}
      />
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
  errorText: {
    fontSize: 12,
    color: '#E53935',
    marginTop: 6,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  loginText: {
    fontSize: 15,
    color: '#6D7175',
  },
  loginLink: {
    fontSize: 15,
    color: '#00AFF5',
    fontWeight: '600',
  },
  legalContainer: {
    marginTop: 8,
  },
  legalText: {
    fontSize: 12,
    color: '#6D7175',
    lineHeight: 18,
    textAlign: 'center',
  },
  legalLink: {
    color: '#00AFF5',
    textDecorationLine: 'underline',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  pickerPlaceholder: {
    color: '#999',
  },
});

