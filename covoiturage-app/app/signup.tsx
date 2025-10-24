import { Logo } from '@/components/logo';
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignupScreen() {
  const { toast, hideToast } = useToast();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo />
        </View>

        {/* Titre */}
        <Text style={styles.title}>Comment souhaitez-vous vous inscrire ?</Text>

        {/* Bouton Email */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('/email-signup')}
        >
          <Text style={styles.optionText}>Continuer avec une adresse email</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

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
            <Text style={styles.legalLink}>Politique de confidentialité</Text>. Les informations
            collectées par COMUTO SA sont traitées dans le but de créer de votre compte, gérer
            votre réservation, l&apos;utilisation et l&apos;amélioration de nos services et pour assurer la
            sécurité de notre plateforme. Vous avez des droits concernant vos données personnelles
            et vous pouvez les exercer en contactant BlaBlaCar par le biais de notre{' '}
            <Text style={styles.legalLink}>Formulaire de contact</Text>. Vous pouvez en apprendre
            davantage sur vos droits et la manière dont nous traitons vos données personnelles dans
            notre <Text style={styles.legalLink}>Politique de confidentialité</Text>.
          </Text>
          <Text style={styles.legalText}>
            {'\n'}Vous pouvez modifier vos{' '}
            <Text style={styles.legalLink}>Paramètres des cookies</Text> à tout moment.
          </Text>
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
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00334E',
    marginBottom: 32,
    lineHeight: 36,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  optionButtonDisabled: {
    opacity: 0.6,
  },
  facebookIconContainer: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
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
  },
  legalLink: {
    color: '#00AFF5',
    textDecorationLine: 'underline',
  },
});

