# 📱 Guide Complet : Construire FITARIKI en APK et iOS

**Date** : 25 octobre 2025  
**API Backend** : http://37.59.126.29/api  
**Version** : 1.0.0

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Initiale](#configuration-initiale)
3. [Build Android (APK)](#build-android-apk)
4. [Build iOS](#build-ios)
5. [Publication](#publication)
6. [Dépannage](#dépannage)

---

## 🎯 Prérequis

### Outils Nécessaires

#### Pour Android ET iOS :
- ✅ **Node.js** (v16+) - Déjà installé
- ✅ **npm ou yarn** - Déjà installé
- ✅ **Compte Expo** - Gratuit sur https://expo.dev
- ✅ **EAS CLI** - À installer (voir ci-dessous)

#### Pour Android UNIQUEMENT :
- ✅ Aucun autre outil nécessaire !
- ℹ️ EAS Build fait tout dans le cloud

#### Pour iOS UNIQUEMENT :
- ⚠️ **Compte Apple Developer** - 99 USD/an (OBLIGATOIRE)
- ℹ️ **PAS besoin de Mac** - EAS Build depuis Windows !

---

## 🔧 Configuration Initiale

### 1. Installer EAS CLI

```bash
npm install -g eas-cli
```

**Vérification :**
```bash
eas --version
```

### 2. Se Connecter à Expo

```bash
eas login
```

**Créer un compte** : https://expo.dev/signup (gratuit)

### 3. Vérifier la Configuration

```bash
cd covoiturage-app
eas whoami
```

Devrait afficher votre nom d'utilisateur Expo.

---

## 📱 Build Android (APK)

### Option 1 : Build Rapide de Test

**Pour tester rapidement sur votre téléphone :**

```bash
cd covoiturage-app
eas build --platform android --profile preview
```

**Résultat** : Un fichier `.apk` (~50-80 MB) téléchargeable

⏱️ **Temps** : 15-20 minutes

### Option 2 : Build de Production

**Pour distribution ou publication :**

```bash
cd covoiturage-app
eas build --platform android --profile production
```

**Résultat** : Un fichier `.apk` optimisé

### Option 3 : Build pour Google Play Store

**Pour publier sur le Google Play Store :**

```bash
cd covoiturage-app
eas build --platform android --profile production-aab
```

**Résultat** : Un fichier `.aab` (Android App Bundle)

---

### 📥 Récupérer l'APK

#### Méthode 1 : Email
Vous recevrez un email avec le lien de téléchargement

#### Méthode 2 : Dashboard Expo
1. Allez sur https://expo.dev
2. Cliquez sur **"Projects"**
3. Sélectionnez votre projet
4. Allez dans **"Builds"**
5. Téléchargez l'APK/AAB

#### Méthode 3 : CLI
```bash
eas build:list --platform android
```

---

### 📲 Installer l'APK sur Android

#### Option A : Via Câble USB
1. Activez **"Mode développeur"** sur votre téléphone
2. Activez **"Débogage USB"**
3. Connectez le téléphone
4. Transférez l'APK
5. Ouvrez le fichier APK sur le téléphone
6. Autorisez l'installation depuis **"Sources inconnues"**

#### Option B : Via Google Drive / Cloud
1. Uploadez l'APK sur Google Drive
2. Téléchargez-le depuis votre téléphone
3. Installez-le

#### Option C : Via QR Code
Le dashboard Expo génère un QR code pour télécharger directement

---

## 🍎 Build iOS

### Prérequis iOS

#### 1. Compte Apple Developer

**Coût** : 99 USD/an (OBLIGATOIRE pour publier sur l'App Store)

**Inscription** : https://developer.apple.com/programs/enroll/

**Ce que vous obtenez** :
- Possibilité de publier sur l'App Store
- Certificats de distribution
- Profils de provisioning
- TestFlight pour les tests

#### 2. Créer un App ID

1. Allez sur : https://developer.apple.com/account/
2. **"Certificates, IDs & Profiles"** → **"Identifiers"** → **"+"**
3. Sélectionnez **"App IDs"** → Continue
4. **Description** : FITARIKI Covoiturage
5. **Bundle ID** : `com.fitariki.covoiturage`
6. **Capabilities** :
   - ✅ Push Notifications
   - ✅ Location Services
   - ✅ Maps
7. **Register**

#### 3. Créer l'App sur App Store Connect

1. Allez sur : https://appstoreconnect.apple.com
2. **"Mes Apps"** → **"+"** → **"Nouvelle App"**
3. Remplissez :
   - **Nom** : FITARIKI
   - **Langue** : Français (France)
   - **Bundle ID** : com.fitariki.covoiturage
   - **SKU** : FITARIKI001
4. **Créer**
5. **Notez l'App ID** (10 chiffres)

#### 4. Configurer eas.json pour iOS

Éditez `covoiturage-app/eas.json` :

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "votre-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      }
    }
  }
}
```

**Où trouver ces infos :**
- **appleId** : Email Apple Developer
- **ascAppId** : Numéro à 10 chiffres de l'app (dans l'URL App Store Connect)
- **appleTeamId** : https://developer.apple.com/account/ → "Membership" → "Team ID"

---

### 🔨 Construire l'App iOS

#### Option 1 : Build de Test (TestFlight)

**Pour tester avant publication :**

```bash
cd covoiturage-app
eas build --platform ios --profile preview
```

**Ce qui se passe** :
1. EAS demande vos identifiants Apple
2. Crée automatiquement les certificats
3. Build l'app dans le cloud (15-25 min)
4. Vous donne un lien pour télécharger le `.ipa`

#### Option 2 : Build de Production

**Pour publication sur l'App Store :**

```bash
cd covoiturage-app
eas build --platform ios --profile production
```

#### Option 3 : Build + Upload Automatique

**Build ET upload en une commande :**

```bash
cd covoiturage-app
eas build --platform ios --profile production --auto-submit
```

---

### 🚀 Upload Manuel sur App Store

Si vous n'avez pas utilisé `--auto-submit` :

```bash
# Soumettre le dernier build
eas submit --platform ios --latest

# Ou soumettre un build spécifique
eas submit --platform ios --id [BUILD_ID]
```

**Authentification** :
- Email Apple
- Mot de passe spécifique à l'app (si 2FA activé)
  - Créez-le sur : https://appleid.apple.com → "Mots de passe spécifiques"

⏱️ **Délai** : 10-30 min pour que le build apparaisse dans App Store Connect

---

### 📝 Finaliser dans App Store Connect

#### 1. Métadonnées

Allez sur https://appstoreconnect.apple.com → Votre app

**Nom** : FITARIKI

**Sous-titre** (30 char max) :
```
Covoiturage en Algérie
```

**Description** (4000 char max) :
```
FITARIKI est l'application de covoiturage #1 en Algérie. 
Partagez vos trajets, économisez de l'argent et voyagez en toute sécurité.

🚗 POURQUOI FITARIKI ?
• Trajets entre toutes les wilayas d'Algérie
• Paiement sécurisé avec commission équitable
• Système de notation et avis vérifiés
• Notifications en temps réel
• Géolocalisation précise

👥 POUR LES PASSAGERS
• Recherchez des trajets disponibles
• Réservez instantanément ou négociez le prix
• Suivez vos réservations en temps réel
• Notez votre expérience

🚙 POUR LES CONDUCTEURS
• Proposez vos trajets facilement
• Gérez vos réservations
• Gagnez de l'argent

Rejoignez FITARIKI et voyagez malin ! 🇩🇿
```

**Mots-clés** (100 char max) :
```
covoiturage,algerie,trajet,voyage,transport,partage,economie
```

**URLs OBLIGATOIRES** :
- **Support** : https://votre-site.com/support
- **Confidentialité** : https://votre-site.com/privacy
- **Marketing** : https://votre-site.com (optionnel)

⚠️ **Vous DEVEZ créer ces pages web**

#### 2. Captures d'Écran (OBLIGATOIRE)

**Format requis** :
- **iPhone 6.7"** : 1290 x 2796 pixels (3 minimum)
- **iPhone 6.5"** : 1284 x 2778 pixels (recommandé)

**Comment les créer** :
- Utilisez un simulateur iOS
- Prenez des captures des écrans principaux
- Ou utilisez des outils en ligne (Mockup Generator)

**Écrans à montrer** :
1. Page d'accueil / Recherche
2. Liste des trajets
3. Détails d'un trajet
4. Profil utilisateur
5. Réservations

#### 3. Nouveautés de Version

```
🎉 Première version de FITARIKI !

✨ Fonctionnalités :
• Recherche de trajets en Algérie
• Réservation instantanée
• Notifications en temps réel
• Système de notation
• Géolocalisation précise
• Support arabe/français

Voyagez en toute confiance ! 🚗🇩🇿
```

#### 4. Sélectionner le Build

1. Allez dans **"iOS App"** → Version **"1.0"**
2. Cliquez sur **"Build"**
3. Sélectionnez le build uploadé

#### 5. Soumettre pour Révision

1. Vérifiez que tout est complété
2. **"Ajouter pour révision"**
3. Choisissez **"Mise en ligne automatique"** ou **"Manuelle"**
4. **"Soumettre pour révision"**

⏱️ **Délai de révision** : 24-48 heures

---

## 📊 Comparaison Android vs iOS

| Critère | Android (APK) | iOS |
|---------|---------------|-----|
| **Coût** | Gratuit | 99 USD/an |
| **Temps de build** | 15-20 min | 15-25 min |
| **Besoin de Mac** | Non | Non (avec EAS) |
| **Révision Apple** | Non | Oui (24-48h) |
| **Installation test** | Directe (APK) | TestFlight |
| **Distribution** | APK direct ou Play Store | App Store uniquement |
| **Complexité** | ⭐⭐ Facile | ⭐⭐⭐⭐ Moyen |

---

## 🔄 Build Simultané Android + iOS

**Pour construire les deux en même temps :**

```bash
cd covoiturage-app

# Option 1 : Build de test
eas build --platform all --profile preview

# Option 2 : Build de production
eas build --platform all --profile production
```

---

## 📋 Checklist Avant Build

### Android
- [x] Configuration EAS (`eas.json`) ✅
- [x] Package name dans `app.json` ✅
- [x] Icône de l'app ✅
- [x] Permissions Android ✅
- [ ] Compte Expo créé
- [ ] EAS CLI installé
- [ ] Connexion Expo (`eas login`)

### iOS
- [x] Bundle ID dans `app.json` ✅
- [x] Icône 1024x1024px ✅
- [x] Configuration EAS pour iOS ✅
- [ ] Compte Apple Developer (99$/an)
- [ ] App ID créé
- [ ] App créée sur App Store Connect
- [ ] Captures d'écran préparées
- [ ] Page de confidentialité publiée

---

## 🚀 Commandes Essentielles

### Installation & Connexion
```bash
# Installer EAS CLI
npm install -g eas-cli

# Connexion
eas login

# Vérifier connexion
eas whoami
```

### Builds
```bash
# Android - Test rapide
eas build -p android --profile preview

# Android - Production
eas build -p android --profile production

# Android - Google Play Store
eas build -p android --profile production-aab

# iOS - Test (TestFlight)
eas build -p ios --profile preview

# iOS - Production
eas build -p ios --profile production

# iOS - Production + Upload auto
eas build -p ios --profile production --auto-submit

# Android + iOS ensemble
eas build -p all --profile production
```

### Gestion des Builds
```bash
# Liste des builds
eas build:list

# Liste Android uniquement
eas build:list -p android

# Liste iOS uniquement
eas build:list -p ios

# Voir un build spécifique
eas build:view [BUILD_ID]

# Annuler un build en cours
eas build:cancel

# Voir les logs en temps réel
eas build:view --json
```

### Soumission
```bash
# Soumettre sur Google Play
eas submit -p android --latest

# Soumettre sur App Store
eas submit -p ios --latest

# Soumettre un build spécifique
eas submit -p android --id [BUILD_ID]
```

### Informations
```bash
# Voir la configuration EAS
cat eas.json

# Voir la configuration de l'app
cat app.json

# Vérifier l'API configurée
cat .env
```

---

## 🆘 Dépannage

### Erreur : "Command not found: eas"

**Solution** :
```bash
npm install -g eas-cli
```

### Erreur : "Not logged in"

**Solution** :
```bash
eas login
```

### Erreur : "Build failed"

**Solutions** :
1. Consultez les logs : `eas build:view [BUILD_ID]`
2. Vérifiez la configuration dans `app.json` et `eas.json`
3. Vérifiez que toutes les dépendances sont installées
4. Essayez de relancer le build

### Erreur : "Invalid credentials" (iOS)

**Solutions** :
1. Utilisez l'authentification à deux facteurs
2. Créez un mot de passe spécifique à l'app :
   - https://appleid.apple.com → "Mots de passe spécifiques"
3. Vérifiez vos identifiants Apple Developer

### Erreur : "Bundle identifier mismatch"

**Solution** :
Vérifiez que le `bundleIdentifier` dans `app.json` correspond à celui créé sur Apple Developer

### Erreur : "Missing Push Notification key" (iOS)

**Solution** :
```bash
eas credentials
```
Suivez les instructions pour créer la clé

### Build très lent

**Normal** : Le premier build prend plus de temps (20-30 min)
Les builds suivants sont plus rapides (10-15 min)

### APK ne s'installe pas

**Solutions** :
1. Activez **"Sources inconnues"** dans les paramètres Android
2. Vérifiez que l'APK n'est pas corrompu
3. Réessayez de télécharger l'APK

---

## 💰 Coûts

| Service | Coût | Notes |
|---------|------|-------|
| **EAS Build (Expo)** | Gratuit | 30 builds/mois |
| **Expo Production** | 29-99$/mois | Pour plus de builds |
| **Apple Developer** | 99$/an | OBLIGATOIRE pour iOS |
| **Google Play Console** | 25$ (une fois) | Pour publier sur Play Store |

**Pour commencer** : Gratuit (Android) ou 99$/an (iOS)

---

## 📚 Ressources

### Documentation
- **EAS Build** : https://docs.expo.dev/build/introduction/
- **EAS Submit** : https://docs.expo.dev/submit/introduction/
- **App Store Guidelines** : https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies** : https://play.google.com/about/developer-content-policy/

### Dashboards
- **Expo Dashboard** : https://expo.dev
- **App Store Connect** : https://appstoreconnect.apple.com
- **Google Play Console** : https://play.google.com/console
- **Apple Developer** : https://developer.apple.com/account/

---

## 🎯 Prochaines Étapes Recommandées

### 1. Tester en Local (1 min)

```bash
cd covoiturage-app
npm start
```

Testez sur Expo Go pour vérifier que tout fonctionne

### 2. Build Android de Test (20 min)

```bash
eas build -p android --profile preview
```

Installez l'APK sur votre téléphone Android

### 3. Tester l'APK (30 min)

Testez toutes les fonctionnalités :
- ✅ Connexion / Inscription
- ✅ Recherche de trajets
- ✅ Réservations
- ✅ Notifications
- ✅ Profil

### 4. Build iOS (si compte Apple)

```bash
eas build -p ios --profile preview
```

Testez via TestFlight

### 5. Build de Production

Une fois les tests OK :

```bash
# Android
eas build -p android --profile production

# iOS
eas build -p ios --profile production --auto-submit
```

### 6. Publication

#### Google Play Store
1. Build AAB : `eas build -p android --profile production-aab`
2. Créez un compte Play Console (25$ une fois)
3. Suivez l'assistant de publication

#### Apple App Store
1. Complétez les métadonnées dans App Store Connect
2. Uploadez les captures d'écran
3. Soumettez pour révision

---

## ✅ Résumé Ultra-Rapide

### Android (APK) en 5 Commandes

```bash
# 1. Installer EAS
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Aller dans le projet
cd covoiturage-app

# 4. Build
eas build -p android --profile preview

# 5. Télécharger l'APK depuis l'email ou expo.dev
```

### iOS en 6 Étapes

```bash
# 1-3. Comme Android
npm install -g eas-cli
eas login
cd covoiturage-app

# 4. Configurer Apple (compte 99$/an requis)
# - Créer App ID sur developer.apple.com
# - Créer App sur appstoreconnect.apple.com

# 5. Build
eas build -p ios --profile production --auto-submit

# 6. Finaliser dans App Store Connect
# - Métadonnées
# - Captures d'écran
# - Soumettre pour révision
```

---

## 🎉 Félicitations !

Vous avez maintenant toutes les informations pour :

✅ Construire un APK Android  
✅ Construire une app iOS  
✅ Publier sur Google Play Store  
✅ Publier sur l'App Store  
✅ Gérer vos builds avec EAS  

**API configurée** : http://37.59.126.29/api  
**Prêt à déployer** : Oui ! 🚀

---

**Besoin d'aide ?** Consultez la documentation ou les logs de build sur https://expo.dev

**Bon build ! 📱✨**





