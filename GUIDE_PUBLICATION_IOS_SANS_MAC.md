# 📱 Guide de Publication iOS SANS Mac

## ✅ Vous pouvez publier sur l'App Store depuis Windows !

Grâce à **EAS Build** (service cloud d'Expo), vous n'avez pas besoin de Mac pour publier votre application FITARIKI sur l'App Store.

---

## 🎯 Prérequis

### 1. Compte Apple Developer (OBLIGATOIRE)
- **Coût** : 99 USD/an
- **Inscription** : https://developer.apple.com/programs/enroll/
- Utilisez votre Apple ID personnel
- Processus d'approbation : 24-48h

### 2. Compte Expo (GRATUIT)
- Créer sur : https://expo.dev/signup
- Version gratuite suffisante pour commencer

### 3. Installation sur votre PC Windows
```bash
# Installer EAS CLI globalement
npm install -g eas-cli

# Vérifier l'installation
eas --version
```

---

## 📋 Étape 1 : Configuration Apple Developer

### A. Créer un App ID (Bundle Identifier)

1. Allez sur : https://developer.apple.com/account/
2. Cliquez sur **"Certificates, IDs & Profiles"**
3. Allez dans **"Identifiers"** → Cliquez sur **"+"**
4. Sélectionnez **"App IDs"** → Continue
5. Sélectionnez **"App"** → Continue
6. Remplissez :
   - **Description** : FITARIKI Covoiturage
   - **Bundle ID** : `com.fitariki.covoiturage` (même que dans app.json)
   - **Capabilities** : Cochez
     - Push Notifications
     - Location Services
     - Maps
7. Cliquez sur **"Continue"** puis **"Register"**

### B. Créer l'App sur App Store Connect

1. Allez sur : https://appstoreconnect.apple.com
2. Cliquez sur **"Mes Apps"** → **"+"** → **"Nouvelle App"**
3. Remplissez :
   - **Plateformes** : iOS
   - **Nom** : FITARIKI
   - **Langue principale** : Français (France)
   - **Bundle ID** : Sélectionnez `com.fitariki.covoiturage`
   - **SKU** : `FITARIKI001` (identifiant unique interne)
   - **Accès utilisateur** : Accès complet
4. Cliquez sur **"Créer"**
5. **Notez l'App ID** (numéro à 10 chiffres) dans l'URL ou dans Informations générales

---

## 📋 Étape 2 : Préparation des Fichiers

### A. Modifier eas.json

Le fichier a déjà été configuré. Vous devez juste mettre à jour la section `submit` :

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "votre-email-apple@example.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABCD123456"
    }
  }
}
```

**Comment trouver ces informations :**

1. **appleId** : L'email de votre compte Apple Developer
2. **ascAppId** : Le numéro à 10 chiffres de votre app dans App Store Connect (voir URL)
3. **appleTeamId** : 
   - Allez sur https://developer.apple.com/account/
   - Cliquez sur "Membership" dans la sidebar
   - Cherchez "Team ID" (format : 10 caractères alphanumériques)

### B. Vérifier app.json

Le bundle identifier a été mis à jour : `com.fitariki.covoiturage`

**⚠️ IMPORTANT** : Ajoutez votre Google Maps API Key pour iOS :
```json
"ios": {
  "config": {
    "googleMapsApiKey": "VOTRE_CLE_GOOGLE_MAPS_IOS"
  }
}
```

### C. Préparer les Assets

**Icône d'application** (OBLIGATOIRE) :
- Fichier : `./assets/images/fitriqi.png`
- Taille : 1024x1024 pixels
- Format : PNG sans transparence
- Vérifiez que votre icône actuelle respecte ces critères

**Captures d'écran** (à préparer) :
- iPhone 6.7" : 1290 x 2796 pixels (3 minimum)
- iPhone 6.5" : 1284 x 2778 pixels
- Utilisez un émulateur ou des outils en ligne

---

## 📋 Étape 3 : Premier Build iOS (depuis Windows)

### A. Se connecter à Expo

```bash
cd covoiturage-app
eas login
```
Entrez vos identifiants Expo.

### B. Créer le Build

```bash
# Build de preview (pour tester avec TestFlight)
eas build --platform ios --profile preview-ios

# OU directement pour production
eas build --platform ios --profile production-ios
```

**Ce qui va se passer :**
1. EAS va vous demander vos identifiants Apple
2. Il va automatiquement :
   - Créer les certificats de distribution
   - Créer les profils de provisioning
   - Builder votre app dans le cloud
   - Vous donner un lien pour télécharger le .ipa

⏱️ **Temps estimé** : 10-20 minutes

### C. Troubleshooting du premier build

**Erreur "Missing Push Notification key"** :
```bash
# EAS va vous guider pour créer la clé
eas credentials
```

**Erreur d'authentification Apple** :
- Utilisez l'authentification à deux facteurs
- Créez un mot de passe spécifique à l'app si demandé :
  - https://appleid.apple.com/account/manage
  - Section "Sécurité" → "Mots de passe spécifiques aux apps"

---

## 📋 Étape 4 : Upload sur App Store Connect

### Option A : Upload Automatique (RECOMMANDÉ)

```bash
# Build + Upload en une commande
eas build --platform ios --profile production-ios --auto-submit
```

### Option B : Upload Manuel

```bash
# 1. Créer le build
eas build --platform ios --profile production-ios

# 2. Attendre que le build soit terminé
# 3. Soumettre le build
eas submit --platform ios --latest
```

Vous devrez entrer :
- Votre Apple ID
- Mot de passe spécifique à l'app (si 2FA activé)

⏱️ **Après l'upload** : 10-30 minutes pour que le build apparaisse dans App Store Connect

---

## 📋 Étape 5 : Finalisation dans App Store Connect

### A. Métadonnées de l'App

1. Allez sur : https://appstoreconnect.apple.com
2. Sélectionnez votre app **FITARIKI**
3. Allez dans l'onglet **"Informations sur l'App"**
4. Remplissez :

**Nom** : FITARIKI

**Sous-titre** (30 caractères max) :
```
Covoiturage en Algérie
```

**Description** (max 4000 caractères) :
```
FITARIKI est l'application de covoiturage #1 en Algérie. 
Partagez vos trajets, économisez de l'argent et voyagez en toute sécurité.

🚗 POURQUOI FITARIKI ?
• Trajets entre toutes les wilayas d'Algérie
• Paiement sécurisé avec commission équitable
• Système de notation et avis vérifiés
• Notifications en temps réel
• Géolocalisation précise des points de départ

👥 POUR LES PASSAGERS
• Recherchez des trajets disponibles
• Réservez instantanément ou négociez le prix
• Suivez vos réservations en temps réel
• Notez votre expérience

🚙 POUR LES CONDUCTEURS
• Proposez vos trajets facilement
• Gérez vos réservations
• Confirmez ou refusez les demandes
• Gagnez de l'argent en partageant vos trajets

🔒 SÉCURITÉ
• Profils vérifiés
• Système de notation
• Support client réactif
• Protection de vos données

Rejoignez la communauté FITARIKI et voyagez malin ! 🇩🇿
```

**Mots-clés** (100 caractères max, séparés par virgules) :
```
covoiturage,algerie,trajet,voyage,transport,partage,economie
```

**URL de support** (OBLIGATOIRE) :
```
https://votre-site.com/support
```
Ou créez une page GitHub : `https://github.com/votre-username/fitariki`

**URL marketing** (optionnel) :
```
https://votre-site.com
```

**Politique de confidentialité** (OBLIGATOIRE) :
```
https://votre-site.com/privacy
```
⚠️ Vous DEVEZ créer une page de politique de confidentialité

### B. Informations de Prix et Disponibilité

1. **Prix** : Gratuit
2. **Disponibilité** : Algérie (et autres pays si souhaité)

### C. Informations de Version

1. Allez dans **"iOS App"** → Version **"1.0"**
2. Sélectionnez le **build** que vous avez uploadé
3. Remplissez :

**Nouveautés de cette version** (max 4000 caractères) :
```
🎉 Première version de FITARIKI !

✨ Fonctionnalités principales :
• Recherche de trajets dans toute l'Algérie
• Proposition de trajets pour conducteurs
• Réservation instantanée ou négociation
• Notifications push en temps réel
• Profil utilisateur avec photo
• Système de notation
• Géolocalisation précise
• Support de l'arabe et du français

Voyagez en toute confiance avec FITARIKI ! 🚗🇩🇿
```

### D. Captures d'Écran (OBLIGATOIRE)

Upload **3 minimum** (10 maximum) pour :
- **iPhone 6.7"** (1290 x 2796 px) : OBLIGATOIRE
- iPhone 6.5" (1284 x 2778 px) : Recommandé

**Astuces** :
- Utilisez un simulateur iOS
- Ou des outils en ligne comme Mockup Generator
- Montrez les écrans principaux : accueil, recherche, profil, réservation

### E. Classification du Contenu

Répondez au questionnaire :
- Votre app ne contient probablement pas de contenu sensible
- Classification probable : **4+** ou **12+**

### F. Informations de Contact

- **Prénom/Nom** : Vos coordonnées
- **Téléphone** : Format international (+213...)
- **Email** : Votre email de contact

---

## 📋 Étape 6 : Soumettre pour Révision

1. Vérifiez que tout est rempli (coches vertes)
2. Cliquez sur **"Ajouter pour révision"**
3. Choisissez :
   - **Mise en ligne automatique** : L'app sera publiée dès approbation
   - **Mise en ligne manuelle** : Vous décidez quand publier
4. Cliquez sur **"Soumettre pour révision"**

⏱️ **Délai de révision** : 24-48 heures en moyenne

---

## 📊 Statuts Possibles

### 🟡 En attente de révision
L'équipe Apple n'a pas encore commencé.

### 🔵 En révision
Apple teste votre app (peut durer quelques heures).

### 🟢 Prête pour la vente
**Félicitations !** Votre app est sur l'App Store 🎉

### 🔴 Rejetée
Apple a trouvé un problème. Lisez le message, corrigez, et resoumettez.

**Raisons courantes de rejet** :
- Métadonnées manquantes ou incorrectes
- Captures d'écran pas conformes
- Politique de confidentialité manquante
- Fonctionnalité cassée ou bug
- Contenu inapproprié
- Permissions non justifiées

---

## 🔄 Mises à Jour Futures

### Pour publier une nouvelle version :

```bash
# 1. Modifier la version dans app.json
# version: "1.0.0" → "1.0.1"
# buildNumber: "1" → "2"

# 2. Build
eas build --platform ios --profile production-ios --auto-submit

# 3. Dans App Store Connect
# - Créer une nouvelle version
# - Sélectionner le nouveau build
# - Mettre à jour "Nouveautés"
# - Soumettre pour révision
```

---

## 💰 Coûts

| Service | Coût |
|---------|------|
| **Apple Developer** | 99 USD/an (OBLIGATOIRE) |
| **EAS Build** | Gratuit : 30 builds/mois<br>Production : 29-99$/mois pour plus |
| **Total minimum** | 99 USD/an |

---

## 🚀 Commandes Rapides Récap

```bash
# Configuration initiale (une fois)
npm install -g eas-cli
eas login

# Build et publication
cd covoiturage-app
eas build --platform ios --profile production-ios --auto-submit

# Vérifier les builds
eas build:list --platform ios

# Voir les logs
eas build:view [BUILD_ID]
```

---

## 🆘 Support et Ressources

- **Documentation Expo** : https://docs.expo.dev/submit/ios/
- **Apple Guidelines** : https://developer.apple.com/app-store/review/guidelines/
- **App Store Connect** : https://appstoreconnect.apple.com
- **TestFlight** : Pour tester avant publication

---

## ⚠️ Points Importants

1. ✅ **Vous N'AVEZ PAS besoin de Mac** - Tout se fait depuis Windows
2. ✅ **EAS Build fait tout le travail** - Certificats, provisioning, build
3. ⚠️ **Google Maps API Key** - N'oubliez pas de l'ajouter pour iOS
4. ⚠️ **Politique de confidentialité** - OBLIGATOIRE pour Apple
5. ⚠️ **Captures d'écran** - Minimum 3, format précis
6. 💡 **TestFlight d'abord** - Testez avec `preview-ios` avant `production-ios`

---

## 🎯 Checklist Finale Avant Soumission

### Configuration Technique
- [ ] Compte Apple Developer actif (99$/an payé)
- [ ] App ID créé sur developer.apple.com
- [ ] App créée sur App Store Connect
- [ ] Google Maps API Key iOS ajouté dans app.json
- [ ] eas.json configuré avec appleId, ascAppId, appleTeamId
- [ ] Icône 1024x1024px sans transparence
- [ ] Build iOS réussi avec EAS

### Métadonnées App Store Connect
- [ ] Nom : FITARIKI
- [ ] Description complète
- [ ] Mots-clés pertinents
- [ ] Captures d'écran (3 min)
- [ ] URL de support
- [ ] Politique de confidentialité (URL)
- [ ] Notes de version
- [ ] Classification de contenu
- [ ] Informations de contact
- [ ] Build sélectionné pour la version

### Légal et Contenu
- [ ] Politique de confidentialité publiée en ligne
- [ ] Conditions d'utilisation (si nécessaire)
- [ ] Mentions légales
- [ ] Tests sur simulateur iOS

---

**Prêt à publier FITARIKI sur l'App Store ! 🚀🍎**


