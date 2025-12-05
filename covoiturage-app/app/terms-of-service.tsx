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

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conditions Générales d'Utilisation</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>FITARIKI</Text>
        <Text style={styles.updateDate}>Dernière mise à jour : Novembre 2024</Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptation des Conditions</Text>
          <Text style={styles.paragraph}>
            En utilisant l'application FITARIKI ("l'Application", "le Service"), vous acceptez d'être 
            lié par ces Conditions Générales d'Utilisation ("CGU"). Si vous n'acceptez pas ces conditions, 
            veuillez ne pas utiliser notre service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description du Service</Text>
          <Text style={styles.paragraph}>
            FITARIKI est une plateforme de covoiturage qui met en relation des conducteurs et des passagers 
            souhaitant partager un trajet en Algérie. L'Application permet de :
          </Text>
          <Text style={styles.listItem}>• Proposer des trajets en tant que conducteur</Text>
          <Text style={styles.listItem}>• Rechercher et réserver des places en tant que passager</Text>
          <Text style={styles.listItem}>• Communiquer entre utilisateurs</Text>
          <Text style={styles.listItem}>• Évaluer et noter les trajets effectués</Text>
          <Text style={styles.listItem}>• Gérer les paiements et commissions</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Conditions d'Inscription</Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              🔞 Vous devez avoir au moins 18 ans pour utiliser FITARIKI.
            </Text>
          </View>

          <Text style={styles.paragraph}>Pour créer un compte, vous devez :</Text>
          <Text style={styles.listItem}>• Être majeur(e) et capable juridiquement</Text>
          <Text style={styles.listItem}>• Fournir des informations exactes et à jour</Text>
          <Text style={styles.listItem}>• Maintenir la confidentialité de votre mot de passe</Text>
          <Text style={styles.listItem}>• Ne créer qu'un seul compte par personne</Text>
          <Text style={styles.listItem}>• Accepter de recevoir des notifications liées au service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Obligations des Conducteurs</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>🚗 En tant que conducteur, vous devez :</Text>
            <Text style={styles.listItem}>• Posséder un permis de conduire valide</Text>
            <Text style={styles.listItem}>• Être assuré conformément à la loi algérienne</Text>
            <Text style={styles.listItem}>• Maintenir votre véhicule en bon état</Text>
            <Text style={styles.listItem}>• Respecter le Code de la route</Text>
            <Text style={styles.listItem}>• Fournir des informations exactes sur vos trajets</Text>
            <Text style={styles.listItem}>• Confirmer ou refuser les réservations rapidement</Text>
            <Text style={styles.listItem}>• Informer les passagers en cas de changement</Text>
            <Text style={styles.listItem}>• Ne pas annuler un trajet sans raison valable</Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Les conducteurs sont responsables de la sécurité de leurs passagers pendant le trajet.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Obligations des Passagers</Text>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>👥 En tant que passager, vous devez :</Text>
            <Text style={styles.listItem}>• Être ponctuel au point de rendez-vous</Text>
            <Text style={styles.listItem}>• Respecter le conducteur et les autres passagers</Text>
            <Text style={styles.listItem}>• Payer le montant convenu</Text>
            <Text style={styles.listItem}>• Ne pas annuler au dernier moment sans raison</Text>
            <Text style={styles.listItem}>• Respecter les règles du véhicule (non-fumeur, etc.)</Text>
            <Text style={styles.listItem}>• Signaler tout problème immédiatement</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Tarification et Paiements</Text>
          
          <Text style={styles.subSectionTitle}>💰 Prix des trajets</Text>
          <Text style={styles.paragraph}>
            Les conducteurs fixent librement le prix de leurs trajets. Les prix doivent être raisonnables 
            et couvrir uniquement les frais de carburant et d'entretien. FITARIKI n'est pas un service 
            de transport commercial.
          </Text>

          <Text style={styles.subSectionTitle}>💳 Commission de service</Text>
          <Text style={styles.paragraph}>
            FITARIKI prélève une commission sur chaque réservation pour maintenir et améliorer le service. 
            Le taux de commission est affiché lors de la publication d'un trajet et peut varier selon 
            les promotions en cours.
          </Text>

          <Text style={styles.subSectionTitle}>💵 Modalités de paiement</Text>
          <Text style={styles.listItem}>• Le paiement se fait entre passagers et conducteurs</Text>
          <Text style={styles.listItem}>• Les modes de paiement sont à convenir entre utilisateurs</Text>
          <Text style={styles.listItem}>• FITARIKI n'est pas responsable des litiges de paiement</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Réservations et Annulations</Text>
          
          <Text style={styles.subSectionTitle}>📅 Réservations</Text>
          <Text style={styles.listItem}>• Les réservations peuvent être directes ou nécessiter une confirmation</Text>
          <Text style={styles.listItem}>• Une fois confirmée, la réservation est considérée comme ferme</Text>
          <Text style={styles.listItem}>• Les places sont limitées et attribuées selon l'ordre de réservation</Text>

          <Text style={styles.subSectionTitle}>❌ Annulations</Text>
          <View style={styles.infoBox}>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Par le conducteur :</Text> Possible jusqu'à 24h avant le départ. 
              Les annulations répétées peuvent entraîner des sanctions.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Par le passager :</Text> Possible jusqu'à 24h avant le départ. 
              Annulations tardives peuvent affecter votre note.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Les annulations abusives peuvent entraîner la suspension du compte.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Système de Notation et Avis</Text>
          <Text style={styles.paragraph}>
            Après chaque trajet, conducteurs et passagers peuvent s'évaluer mutuellement :
          </Text>
          <Text style={styles.listItem}>• Les notes vont de 1 à 5 étoiles</Text>
          <Text style={styles.listItem}>• Les avis doivent être honnêtes et respectueux</Text>
          <Text style={styles.listItem}>• Les commentaires offensants sont interdits</Text>
          <Text style={styles.listItem}>• Les notes influencent la réputation des utilisateurs</Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Les faux avis ou avis malveillants peuvent entraîner la suppression du compte.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Comportements Interdits</Text>
          
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>🚫 Les comportements suivants sont strictement interdits :</Text>
          </View>

          <Text style={styles.listItem}>• Harcèlement ou comportement inapproprié</Text>
          <Text style={styles.listItem}>• Discrimination de toute nature</Text>
          <Text style={styles.listItem}>• Fraude ou tentative de fraude</Text>
          <Text style={styles.listItem}>• Utilisation commerciale non autorisée</Text>
          <Text style={styles.listItem}>• Création de faux comptes</Text>
          <Text style={styles.listItem}>• Partage d'informations fausses ou trompeuses</Text>
          <Text style={styles.listItem}>• Transport de marchandises illégales</Text>
          <Text style={styles.listItem}>• Conduite sous influence d'alcool ou drogue</Text>
          <Text style={styles.listItem}>• Tentative de contourner la commission</Text>

          <Text style={styles.paragraph}>
            Tout manquement peut entraîner la suspension immédiate du compte et des poursuites légales.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Responsabilités</Text>
          
          <Text style={styles.subSectionTitle}>🔸 Responsabilité de FITARIKI</Text>
          <Text style={styles.paragraph}>
            FITARIKI est une plateforme intermédiaire qui facilite la mise en relation. Nous ne sommes 
            pas responsables de :
          </Text>
          <Text style={styles.listItem}>• La conduite ou le comportement des utilisateurs</Text>
          <Text style={styles.listItem}>• Les accidents ou incidents pendant les trajets</Text>
          <Text style={styles.listItem}>• Les litiges entre utilisateurs</Text>
          <Text style={styles.listItem}>• Les pertes ou vols d'objets personnels</Text>
          <Text style={styles.listItem}>• Les retards ou annulations de trajets</Text>

          <Text style={styles.subSectionTitle}>🔸 Responsabilité des utilisateurs</Text>
          <Text style={styles.paragraph}>
            Chaque utilisateur est responsable de ses actes. Les conducteurs sont notamment responsables 
            de la sécurité de leurs passagers conformément à la législation algérienne.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Protection des Données</Text>
          <Text style={styles.paragraph}>
            Vos données personnelles sont protégées conformément à notre Politique de Confidentialité. 
            Nous nous engageons à respecter votre vie privée et à sécuriser vos informations.
          </Text>
          <Text style={styles.paragraph}>
            Pour plus de détails, consultez notre Politique de Confidentialité.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Propriété Intellectuelle</Text>
          <Text style={styles.paragraph}>
            Tous les contenus de l'Application (logo, design, textes, code) sont protégés par les 
            droits de propriété intellectuelle. Toute reproduction non autorisée est interdite.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Suspension et Résiliation</Text>
          <Text style={styles.paragraph}>
            FITARIKI se réserve le droit de suspendre ou de résilier votre compte en cas de :
          </Text>
          <Text style={styles.listItem}>• Violation des présentes CGU</Text>
          <Text style={styles.listItem}>• Comportement inapproprié ou dangereux</Text>
          <Text style={styles.listItem}>• Fraude ou tentative de fraude</Text>
          <Text style={styles.listItem}>• Abus répétés (annulations, faux avis, etc.)</Text>
          <Text style={styles.listItem}>• Inactivité prolongée</Text>

          <Text style={styles.paragraph}>
            Vous pouvez également supprimer votre compte à tout moment depuis les paramètres de l'application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Modifications des CGU</Text>
          <Text style={styles.paragraph}>
            Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications importantes 
            vous seront notifiées par l'Application. L'utilisation continue du service après notification 
            constitue une acceptation des nouvelles conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Loi Applicable et Juridiction</Text>
          <Text style={styles.paragraph}>
            Ces CGU sont régies par la loi algérienne. Tout litige sera soumis à la juridiction exclusive 
            des tribunaux algériens compétents.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Contact et Support</Text>
          <Text style={styles.paragraph}>
            Pour toute question concernant ces conditions ou pour signaler un problème :
          </Text>
          <Text style={styles.contactItem}>📧 Email : Contact@fitriki.com</Text>
          <Text style={styles.contactItem}>📱 Téléphone : +33 7 66 11 65 69</Text>
          <Text style={styles.contactItem}>🇩🇿 Algérie / 🇫🇷 France</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الملخص بالعربية</Text>
          <Text style={styles.arabicTitle}>شروط الاستخدام العامة - فطريقي</Text>
          
          <Text style={styles.subSectionTitle}>📋 النقاط الأساسية:</Text>
          <Text style={styles.listItem}>• يجب أن تكون 18 سنة أو أكثر للاستخدام</Text>
          <Text style={styles.listItem}>• السائقون يحددون أسعارهم بحرية</Text>
          <Text style={styles.listItem}>• فطريقي تأخذ عمولة على كل حجز</Text>
          <Text style={styles.listItem}>• يمكن الإلغاء قبل 24 ساعة من الرحلة</Text>
          <Text style={styles.listItem}>• السلوك غير اللائق ممنوع ويؤدي للإيقاف</Text>

          <Text style={styles.subSectionTitle}>🚗 التزامات السائق:</Text>
          <Text style={styles.listItem}>• رخصة قيادة وتأمين ساريان</Text>
          <Text style={styles.listItem}>• سيارة في حالة جيدة</Text>
          <Text style={styles.listItem}>• احترام قواعد المرور</Text>

          <Text style={styles.subSectionTitle}>👥 التزامات الراكب:</Text>
          <Text style={styles.listItem}>• الالتزام بالمواعيد</Text>
          <Text style={styles.listItem}>• دفع المبلغ المتفق عليه</Text>
          <Text style={styles.listItem}>• احترام السائق والركاب الآخرين</Text>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              استخدامك للتطبيق يعني موافقتك على هذه الشروط
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Acceptation Finale</Text>
          <View style={styles.infoBox}>
            <Text style={styles.paragraph}>
              En utilisant FITARIKI, vous reconnaissez avoir lu, compris et accepté l'intégralité 
              de ces Conditions Générales d'Utilisation.
            </Text>
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
  bold: {
    fontWeight: '700',
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

