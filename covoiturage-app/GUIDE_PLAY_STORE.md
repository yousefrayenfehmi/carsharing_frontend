# 🚀 Guide : Publier FITARIKI sur Google Play Store

## 📋 Étapes Complètes

---

## 🎯 ÉTAPE 1 : Préparer l'Application

### 1.1 Vérifier app.json

Votre configuration actuelle :
- **Nom** : FITARIKI
- **Package** : `com.covoiturage.app`
- **Version** : 1.0.0
- **Version Code** : 1

✅ Tout est prêt !

### 1.2 Préparer les Assets

Assurez-vous d'avoir :
- ✅ Icône de l'app : `./assets/images/fitriqi.png`
- ✅ Screenshots (minimum 2, recommandé 8)
- ✅ Feature Graphic (1024x500px)
- ✅ Description de l'application

---

## 🔨 ÉTAPE 2 : Générer l'AAB de Production

### 2.1 Se connecter à EAS

```bash
cd covoiturage-app
eas login
```

### 2.2 Générer l'AAB (Android App Bundle)

```bash
# Générer l'AAB de production pour Play Store
eas build --platform android --profile production-aab
```

⏱️ **Durée** : 15-25 minutes

### 2.3 Télécharger l'AAB

Une fois le build terminé :
1. Vous recevrez un **lien par email**
2. Ou visitez : https://expo.dev
3. Allez dans **Builds** > Téléchargez le fichier `.aab`

---

## 📱 ÉTAPE 3 : Créer un Compte Google Play Console

### 3.1 S'inscrire

1. Allez sur : https://play.google.com/console
2. Cliquez sur **S'inscrire**
3. **Frais** : 25 USD (paiement unique à vie)
4. Remplissez vos informations

### 3.2 Accepter les Conditions

- Acceptez l'accord de développeur
- Configurez vos informations fiscales (si nécessaire)

---

## 🎨 ÉTAPE 4 : Créer l'Application sur Play Store

### 4.1 Créer une Nouvelle Application

1. Dans Play Console, cliquez sur **Créer une application**
2. Remplissez :
   - **Nom** : FITARIKI
   - **Langue par défaut** : Français
   - **Type** : Application
   - **Gratuit/Payant** : Gratuit

### 4.2 Configurer la Fiche Play Store

#### Détails de l'Application

```
Titre court : FITARIKI - Covoiturage
Description courte (80 caractères max) :
Partagez vos trajets en Algérie. Économique, écologique et convivial !

Description complète (4000 caractères max) :
🚗 FITARIKI - Votre Application de Covoiturage en Algérie

Découvrez FITARIKI, l'application qui révolutionne le covoiturage en Algérie !

✨ FONCTIONNALITÉS PRINCIPALES :
• 🔍 Recherche de trajets simple et rapide
• 💬 Système de négociation des prix
• ⭐ Notation des conducteurs
• 📍 Géolocalisation précise
• 💰 Prix transparents avec commission
• 🔔 Notifications en temps réel
• 📱 Interface moderne et intuitive

🎯 POURQUOI CHOISIR FITARIKI ?

💰 Économisez sur vos trajets
Partagez les frais de route et réduisez vos dépenses

🌍 Écologique
Moins de voitures = moins de pollution

🤝 Convivial
Rencontrez de nouvelles personnes et partagez votre trajet

🔒 Sécurisé
Système de vérification et notation des utilisateurs

📱 COMMENT ÇA MARCHE ?

Pour les Passagers :
1. Recherchez votre trajet
2. Consultez les offres disponibles
3. Réservez ou négociez le prix
4. Voyagez en toute sérénité

Pour les Conducteurs :
1. Publiez votre trajet
2. Recevez des demandes
3. Acceptez vos passagers
4. Partagez les frais de route

🌟 FONCTIONNALITÉS AVANCÉES :
• Trajets récurrents pour vos déplacements réguliers
• Système de réservation directe
• Gestion des wilayas algériennes
• Profils détaillés des utilisateurs
• Historique complet des trajets

Rejoignez la communauté FITARIKI dès maintenant !
```

#### Catégorie
- **Catégorie** : Voyages et infos locales
- **Sous-catégorie** : Transports

---

### 4.3 Assets Graphiques

#### À Préparer :

1. **Icône de l'Application** (512x512px)
   - Format : PNG
   - Fond transparent ou avec couleur

2. **Feature Graphic** (1024x500px)
   - Image de bannière
   - Obligatoire

3. **Screenshots** (Minimum 2, Maximum 8)
   - Téléphones : 1080x1920px ou 720x1280px
   - Prenez des captures d'écran de :
     - Écran d'accueil
     - Recherche de trajets
     - Détails d'un trajet
     - Profil utilisateur
     - Négociations
     - Notifications

4. **Vidéo YouTube** (Optionnel)
   - URL d'une vidéo de démonstration

---

## 📤 ÉTAPE 5 : Uploader l'AAB

### 5.1 Créer une Version

1. Dans Play Console, allez dans **Production**
2. Cliquez sur **Créer une version**
3. Uploadez votre fichier `.aab`

### 5.2 Notes de Version

```
Première version de FITARIKI !

🎉 Nouveautés :
• Recherche et réservation de trajets
• Système de négociation des prix
• Notifications en temps réel
• Notation des conducteurs
• Gestion complète des trajets
• Profil utilisateur détaillé
• Support des wilayas algériennes
```

---

## 🔐 ÉTAPE 6 : Configuration Avancée

### 6.1 Signature de l'Application

EAS gère automatiquement la signature ! ✅

Si vous voulez gérer votre propre clé :
```bash
# Générer une clé de signature
keytool -genkeypair -v -storetype PKCS12 \
  -keystore fitariki-upload-key.keystore \
  -alias fitariki-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### 6.2 Politique de Confidentialité

⚠️ **OBLIGATOIRE** pour le Play Store

Créez un fichier `privacy-policy.md` :

```markdown
# Politique de Confidentialité - FITARIKI

Dernière mise à jour : [DATE]

## Collecte des données
Nous collectons :
- Informations de profil (nom, email, téléphone)
- Localisation (pour les trajets)
- Historique des trajets

## Utilisation des données
Vos données sont utilisées pour :
- Faciliter le covoiturage
- Améliorer nos services
- Assurer la sécurité

## Partage des données
Nous ne vendons jamais vos données.
Les données sont partagées uniquement avec :
- Les autres utilisateurs (infos de trajet)
- Nos serveurs sécurisés

## Vos droits
Vous pouvez :
- Consulter vos données
- Demander leur suppression
- Modifier vos informations

Contact : support@fitariki.com
```

Hébergez-la sur :
- GitHub Pages
- Firebase Hosting
- Votre propre serveur

### 6.3 Classification du Contenu

Répondez au questionnaire Play Store :
- Violence : Non
- Contenu pour adultes : Non
- Alcool/Tabac/Drogues : Non
- Langage grossier : Non
- Jeu d'argent : Non

**Classification** : PEGI 3 (Tout public)

---

## 📝 ÉTAPE 7 : Tarification et Distribution

### 7.1 Tarification

- ✅ **Application gratuite**
- Achats intégrés : Non (pour l'instant)
- Publicités : Non

### 7.2 Pays de Distribution

Sélectionnez les pays :
- ✅ **Algérie** (prioritaire)
- France
- Maroc
- Tunisie
- Autres pays francophones

---

## 🚀 ÉTAPE 8 : Soumettre pour Validation

### 8.1 Vérifications Finales

✅ Toutes les sections complétées
✅ AAB uploadé
✅ Screenshots ajoutés
✅ Description complète
✅ Politique de confidentialité
✅ Classification du contenu

### 8.2 Lancer la Révision

1. Cliquez sur **Vérifier la version**
2. Corrigez les éventuelles erreurs
3. Cliquez sur **Commencer le déploiement**

⏱️ **Délai de révision** : 1-7 jours (souvent 24-48h)

---

## 📊 ÉTAPE 9 : Après Publication

### 9.1 Suivre les Statistiques

Dans Play Console :
- Nombre d'installations
- Notes et avis
- Rapports de crash
- Engagement des utilisateurs

### 9.2 Répondre aux Avis

Répondez rapidement aux avis pour :
- Améliorer la note
- Fidéliser les utilisateurs
- Identifier les bugs

### 9.3 Mettre à Jour l'Application

Pour publier une mise à jour :

```bash
# 1. Modifier app.json
# Incrémenter version et versionCode
{
  "version": "1.0.1",
  "versionCode": 2
}

# 2. Générer un nouveau AAB
eas build --platform android --profile production-aab

# 3. Uploader dans Play Console
```

---

## 🎯 CHECKLIST COMPLÈTE

### Avant Soumission

- [ ] Compte Play Console créé (25 USD payés)
- [ ] AAB généré avec EAS
- [ ] Icône 512x512px prête
- [ ] Feature Graphic 1024x500px prête
- [ ] Au moins 2 screenshots
- [ ] Description complète
- [ ] Politique de confidentialité en ligne
- [ ] Classification du contenu complétée
- [ ] Prix et distribution configurés

### Après Soumission

- [ ] Application en révision
- [ ] URL Play Store partagée
- [ ] Publicité sur réseaux sociaux
- [ ] Collecte des premiers avis

---

## 🔧 Commandes Utiles

```bash
# Se connecter à EAS
eas login

# Générer AAB de production
eas build --platform android --profile production-aab

# Vérifier le statut du build
eas build:list

# Soumettre directement sur Play Store (après configuration)
eas submit --platform android

# Voir les logs d'un build
eas build:view [BUILD_ID]
```

---

## 🆘 Problèmes Courants

### Erreur : Package Name déjà utilisé

**Solution** : Changez le package dans `app.json`
```json
"android": {
  "package": "com.fitariki.covoiturage"
}
```

### Build échoue

**Solution** :
```bash
# Nettoyer et rebuilder
rm -rf node_modules
npm install
eas build --platform android --profile production-aab --clear-cache
```

### Screenshots refusés

**Solution** : Assurez-vous que les screenshots :
- Sont en résolution correcte
- Montrent l'interface réelle
- N'ont pas de bords transparents
- Sont en format PNG ou JPEG

---

## 📞 Support

### Ressources

- **Play Console** : https://play.google.com/console
- **EAS Documentation** : https://docs.expo.dev/build/introduction/
- **Play Store Policies** : https://play.google.com/about/developer-content-policy/

### Contact

Pour toute question :
- Email EAS Support : support@expo.dev
- Play Store Support : Via Play Console

---

## 🎉 Félicitations !

Une fois votre application approuvée, elle sera disponible sur le Google Play Store !

**Lien Play Store** : 
```
https://play.google.com/store/apps/details?id=com.covoiturage.app
```

Partagez ce lien avec vos utilisateurs ! 🚀

---

## 📈 Prochaines Étapes

1. **Marketing** : Promouvoir l'application
2. **Analytics** : Suivre les téléchargements
3. **Updates** : Publier régulièrement des mises à jour
4. **Support** : Répondre aux utilisateurs
5. **Monétisation** : Intégrer des revenus (optionnel)

Bonne chance avec FITARIKI ! 🎊


