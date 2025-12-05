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

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Politique de Confidentialité</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>FITARIKI</Text>
        <Text style={styles.updateDate}>Dernière mise à jour : Novembre 2024</Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Bienvenue sur FITARIKI ("nous", "notre", "l'Application"). Nous respectons votre vie privée 
            et nous nous engageons à protéger vos données personnelles. Cette politique de confidentialité 
            vous informe sur la manière dont nous collectons, utilisons et protégeons vos informations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Informations que Nous Collectons</Text>
          
          <Text style={styles.subSectionTitle}>2.1 Informations fournies par l'utilisateur</Text>
          <Text style={styles.listItem}>• Nom et prénom</Text>
          <Text style={styles.listItem}>• Adresse e-mail</Text>
          <Text style={styles.listItem}>• Numéro de téléphone</Text>
          <Text style={styles.listItem}>• Photo de profil (optionnelle)</Text>
          <Text style={styles.listItem}>• Informations de wilaya (localisation administrative)</Text>

          <Text style={styles.subSectionTitle}>2.2 Informations collectées automatiquement</Text>
          <Text style={styles.listItem}>• Données de localisation : Pour afficher les trajets à proximité</Text>
          <Text style={styles.listItem}>• Informations sur l'appareil : Modèle, système d'exploitation</Text>
          <Text style={styles.listItem}>• Données d'utilisation : Pages consultées, fonctionnalités utilisées</Text>

          <Text style={styles.subSectionTitle}>2.3 Informations liées aux trajets</Text>
          <Text style={styles.listItem}>• Trajets proposés : Points de départ, destination, prix, places</Text>
          <Text style={styles.listItem}>• Réservations : Historique de vos trajets</Text>
          <Text style={styles.listItem}>• Avis et notations : Commentaires et notes des utilisateurs</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Utilisation de Vos Informations</Text>
          <Text style={styles.paragraph}>Nous utilisons vos données pour :</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✅ Fournir le service</Text>
            <Text style={styles.listItem}>• Créer et gérer votre compte</Text>
            <Text style={styles.listItem}>• Permettre la réservation et la proposition de trajets</Text>
            <Text style={styles.listItem}>• Faciliter la communication entre utilisateurs</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✅ Améliorer l'expérience</Text>
            <Text style={styles.listItem}>• Personnaliser les résultats de recherche</Text>
            <Text style={styles.listItem}>• Suggérer des trajets pertinents</Text>
            <Text style={styles.listItem}>• Optimiser les performances de l'application</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✅ Sécurité et conformité</Text>
            <Text style={styles.listItem}>• Prévenir la fraude et les abus</Text>
            <Text style={styles.listItem}>• Assurer la sécurité des utilisateurs</Text>
            <Text style={styles.listItem}>• Respecter les obligations légales</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>✅ Communication</Text>
            <Text style={styles.listItem}>• Envoyer des notifications de réservation</Text>
            <Text style={styles.listItem}>• Informer des mises à jour importantes</Text>
            <Text style={styles.listItem}>• Répondre à vos demandes de support</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Partage de Vos Informations</Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>Nous NE vendons PAS vos données personnelles.</Text>
          </View>

          <Text style={styles.paragraph}>Nous partageons vos informations uniquement dans les cas suivants :</Text>

          <Text style={styles.subSectionTitle}>🔹 Avec d'autres utilisateurs</Text>
          <Text style={styles.listItem}>• Votre nom, photo et note sont visibles lors de trajets partagés</Text>
          <Text style={styles.listItem}>• Les conducteurs voient les profils des passagers</Text>
          <Text style={styles.listItem}>• Les passagers voient les profils des conducteurs</Text>

          <Text style={styles.subSectionTitle}>🔹 Prestataires de services</Text>
          <Text style={styles.listItem}>• Services d'hébergement (serveurs)</Text>
          <Text style={styles.listItem}>• Services de cartographie (Google Maps)</Text>
          <Text style={styles.listItem}>• Services de notifications push</Text>

          <Text style={styles.subSectionTitle}>🔹 Obligations légales</Text>
          <Text style={styles.listItem}>• Si requis par la loi</Text>
          <Text style={styles.listItem}>• Pour protéger nos droits légaux</Text>
          <Text style={styles.listItem}>• En cas d'urgence pour assurer la sécurité</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Localisation et Données Géographiques</Text>
          
          <Text style={styles.subSectionTitle}>🗺️ Pourquoi nous utilisons votre localisation</Text>
          <Text style={styles.listItem}>• Afficher les trajets à proximité</Text>
          <Text style={styles.listItem}>• Faciliter la saisie des adresses</Text>
          <Text style={styles.listItem}>• Améliorer la précision des recherches</Text>

          <Text style={styles.subSectionTitle}>🔐 Contrôle de la localisation</Text>
          <Text style={styles.paragraph}>
            Vous pouvez activer/désactiver la localisation dans les paramètres de votre appareil. 
            L'utilisation de l'app sans localisation est possible mais limitée.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Photos et Contenus</Text>
          
          <Text style={styles.subSectionTitle}>📸 Photo de profil</Text>
          <Text style={styles.listItem}>• Optionnelle mais recommandée</Text>
          <Text style={styles.listItem}>• Stockée de manière sécurisée</Text>
          <Text style={styles.listItem}>• Visible par les autres utilisateurs</Text>

          <Text style={styles.paragraph}>
            Vous gardez tous les droits sur vos photos. En les téléchargeant, vous nous accordez 
            une licence pour les afficher dans le cadre du service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Sécurité de Vos Données</Text>
          
          <Text style={styles.paragraph}>🔒 Nous mettons en œuvre des mesures de sécurité :</Text>
          <Text style={styles.listItem}>• Chiffrement des données en transit (HTTPS)</Text>
          <Text style={styles.listItem}>• Authentification sécurisée</Text>
          <Text style={styles.listItem}>• Accès restreint aux données</Text>
          <Text style={styles.listItem}>• Surveillance des activités suspectes</Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Aucun système n'est 100% sécurisé. Protégez votre mot de passe et signalez 
              toute activité suspecte.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Conservation des Données</Text>
          <Text style={styles.paragraph}>Nous conservons vos données :</Text>
          <Text style={styles.listItem}>• Compte actif : Tant que vous utilisez l'application</Text>
          <Text style={styles.listItem}>• Après suppression : 30 jours maximum (sauf obligations légales)</Text>
          <Text style={styles.listItem}>• Données de transaction : Conformément aux obligations légales (5 ans)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Vos Droits</Text>
          <Text style={styles.paragraph}>
            Conformément aux lois sur la protection des données, vous avez le droit de :
          </Text>
          <Text style={styles.listItem}>✅ Accéder à vos données personnelles</Text>
          <Text style={styles.listItem}>✅ Rectifier vos informations</Text>
          <Text style={styles.listItem}>✅ Supprimer votre compte et vos données</Text>
          <Text style={styles.listItem}>✅ Exporter vos données</Text>
          <Text style={styles.listItem}>✅ Vous opposer à certains traitements</Text>
          <Text style={styles.listItem}>✅ Retirer votre consentement</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Notifications Push</Text>
          <Text style={styles.paragraph}>📲 Nous utilisons les notifications pour :</Text>
          <Text style={styles.listItem}>• Confirmer les réservations</Text>
          <Text style={styles.listItem}>• Alerter des nouvelles demandes de trajet</Text>
          <Text style={styles.listItem}>• Informer des messages importants</Text>
          <Text style={styles.paragraph}>
            Vous pouvez désactiver les notifications dans les paramètres de votre appareil.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Mineurs</Text>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              🚫 FITARIKI est réservé aux personnes de 18 ans et plus.
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Nous ne collectons pas sciemment de données d'enfants de moins de 18 ans. 
            Si vous pensez qu'un mineur utilise notre service, contactez-nous immédiatement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Modifications de Cette Politique</Text>
          <Text style={styles.paragraph}>
            Nous pouvons mettre à jour cette politique de confidentialité. Les modifications 
            importantes vous seront notifiées par notification dans l'application ou par email.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Contact</Text>
          <Text style={styles.paragraph}>Pour toute question concernant cette politique :</Text>
          <Text style={styles.contactItem}>📧 Email : Contact@fitriki.com</Text>
          <Text style={styles.contactItem}>📱 Téléphone : +33 7 66 11 65 69</Text>
          <Text style={styles.contactItem}>🇩🇿 Algérie / 🇫🇷 France</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Consentement</Text>
          <Text style={styles.paragraph}>
            En utilisant FITARIKI, vous reconnaissez avoir lu et compris cette politique de 
            confidentialité et vous acceptez la collecte et l'utilisation de vos informations 
            telles que décrites ci-dessus.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الملخص بالعربية</Text>
          <Text style={styles.arabicTitle}>سياسة الخصوصية - فطريقي</Text>
          
          <Text style={styles.paragraph}>نحن نحترم خصوصيتك ونحمي بياناتك الشخصية.</Text>

          <Text style={styles.subSectionTitle}>المعلومات التي نجمعها:</Text>
          <Text style={styles.listItem}>• الاسم والبريد الإلكتروني ورقم الهاتف</Text>
          <Text style={styles.listItem}>• الموقع الجغرافي (لإظهار الرحلات القريبة)</Text>
          <Text style={styles.listItem}>• صورة الملف الشخصي (اختيارية)</Text>
          <Text style={styles.listItem}>• سجل الرحلات والحجوزات</Text>

          <Text style={styles.subSectionTitle}>كيف نستخدم معلوماتك:</Text>
          <Text style={styles.listItem}>• لتوفير خدمة المشاركة في الرحلات</Text>
          <Text style={styles.listItem}>• لتحسين تجربة المستخدم</Text>
          <Text style={styles.listItem}>• لضمان الأمان ومنع الاحتيال</Text>

          <Text style={styles.subSectionTitle}>حقوقك:</Text>
          <Text style={styles.listItem}>• الوصول إلى بياناتك</Text>
          <Text style={styles.listItem}>• تصحيح معلوماتك</Text>
          <Text style={styles.listItem}>• حذف حسابك</Text>
          <Text style={styles.listItem}>• تصدير بياناتك</Text>

          <Text style={styles.subSectionTitle}>للاتصال:</Text>
          <Text style={styles.listItem}>📧 Contact@fitriki.com</Text>
          <Text style={styles.listItem}>📱 +33 7 66 11 65 69</Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>نحن لا نبيع بياناتك الشخصية أبدا.</Text>
          </View>
        </View>

        <Text style={styles.footer}>FITARIKI - Covoiturage en Algérie 🇩🇿</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00334E',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00AFF5',
    textAlign: 'center',
    marginBottom: 8,
  },
  updateDate: {
    fontSize: 14,
    color: '#6D7175',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00334E',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00334E',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    paddingLeft: 8,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#00AFF5',
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00334E',
    marginBottom: 8,
  },
  warningBox: {
    backgroundColor: '#FFF4E5',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
  },
  warningText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  contactItem: {
    fontSize: 15,
    color: '#00AFF5',
    lineHeight: 24,
    fontWeight: '600',
  },
  arabicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00334E',
    marginBottom: 12,
    textAlign: 'right',
  },
  footer: {
    fontSize: 16,
    color: '#00AFF5',
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 24,
  },
});

