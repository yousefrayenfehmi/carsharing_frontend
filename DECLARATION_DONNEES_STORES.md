# 📊 Déclaration des Données et Permissions - FITARIKI

Ce document explique comment déclarer correctement les données collectées et les permissions utilisées sur **Play Store** et **App Store**.

---

## 🔐 Permissions Configurées dans l'Application

### ✅ Android (app.json)
```json
"permissions": [
  "ACCESS_COARSE_LOCATION",      // Localisation approximative
  "ACCESS_FINE_LOCATION",         // Localisation précise
  "RECEIVE_BOOT_COMPLETED",       // Démarrage automatique
  "VIBRATE",                      // Vibrations
  "INTERNET",                     // Accès Internet
  "ACCESS_NETWORK_STATE",         // État du réseau
  "READ_EXTERNAL_STORAGE",        // Lecture stockage (photos)
  "WRITE_EXTERNAL_STORAGE",       // Écriture stockage
  "CAMERA"                        // Caméra
]
```

### ✅ iOS (app.json - infoPlist)
```json
"NSLocationWhenInUseUsageDescription": "Localisation pendant l'utilisation"
"NSLocationAlwaysUsageDescription": "Localisation en arrière-plan"
"NSPhotoLibraryUsageDescription": "Accès à la bibliothèque photos"
"NSCameraUsageDescription": "Accès à la caméra"
"NSPhotoLibraryAddUsageDescription": "Enregistrer des photos"
"NSUserTrackingUsageDescription": "Suivi pour améliorer l'expérience"
```

---

## 🤖 PLAY STORE - Section "Data Safety" (Sécurité des données)

### 📍 Comment accéder :
1. Allez sur https://play.google.com/console
2. Sélectionnez votre app **FITARIKI**
3. Menu de gauche → **"Politique"** → **"Sécurité des données"**
4. Cliquez sur **"Commencer"**

---

### 📋 Étape 1 : Collecte et partage de données

**Question : Votre application collecte-t-elle ou partage-t-elle des données utilisateur ?**
- ✅ **Oui** (cochez cette option)

---

### 📋 Étape 2 : Types de données collectées

Déclarez les types de données suivants :

#### 🆔 **Informations personnelles**

**1. Nom**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

**2. Adresse e-mail**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application, Communication
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

**3. Numéro de téléphone**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application, Communication
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

**4. Adresse**
- ✅ Collecté (Wilaya/Ville)
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

#### 📸 **Photos et vidéos**

**Photo de profil**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Facultatif
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

#### 📍 **Localisation**

**Localisation approximative**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application (recherche de trajets)
- **Partage** : Partagé avec des prestataires de services (Google Maps)
- **Facultatif/Obligatoire** : Facultatif
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

**Localisation précise**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Partagé avec des prestataires de services (Google Maps)
- **Facultatif/Obligatoire** : Facultatif
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

#### 💬 **Communications**

**Autres communications utilisateur**
- ✅ Collecté (messages entre utilisateurs, négociations)
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

#### 📊 **Activité dans l'application**

**Interactions avec l'application**
- ✅ Collecté (réservations, trajets, recherches)
- **Objectif** : Fonctionnalité de l'application, Analyses
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

**Historique de recherche dans l'application**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

#### 🔧 **Informations sur l'application et performances**

**Journaux d'incidents**
- ✅ Collecté
- **Objectif** : Analyses, Résolution de bugs
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Non

**Autres données sur les performances de l'application**
- ✅ Collecté
- **Objectif** : Analyses
- **Partage** : Non partagé avec des tiers
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Non

#### 📱 **Informations sur l'appareil ou autres identifiants**

**Identifiants de l'appareil ou autres identifiants**
- ✅ Collecté
- **Objectif** : Fonctionnalité de l'application (notifications push)
- **Partage** : Partagé avec des prestataires de services (Expo Notifications)
- **Facultatif/Obligatoire** : Obligatoire
- **Chiffrement en transit** : Oui
- **Suppression possible** : Oui

---

### 📋 Étape 3 : Pratiques de sécurité

**Question : Les données sont-elles chiffrées en transit ?**
- ✅ **Oui** (HTTPS)

**Question : Les utilisateurs peuvent-ils demander la suppression de leurs données ?**
- ✅ **Oui** (via les paramètres de l'app ou en contactant le support)

**Question : Avez-vous validé les pratiques de sécurité de votre application selon les normes mondiales ?**
- ❌ Non (sauf si vous avez une certification)

---

### 📋 Étape 4 : Finalisation

**Texte de la déclaration** (copier-coller dans le formulaire) :

```
FITARIKI collecte les données suivantes pour assurer le fonctionnement du service de covoiturage :

DONNÉES COLLECTÉES :
- Informations personnelles (nom, email, téléphone, wilaya)
- Photo de profil (facultatif)
- Localisation (pour suggérer des trajets à proximité)
- Historique des trajets et réservations
- Messages entre utilisateurs
- Données de performance de l'application

UTILISATION DES DONNÉES :
- Fournir le service de covoiturage
- Faciliter la communication entre conducteurs et passagers
- Améliorer l'expérience utilisateur
- Assurer la sécurité et prévenir les abus

PARTAGE DES DONNÉES :
- Google Maps (pour la cartographie)
- Expo Notifications (pour les notifications push)
- Aucune vente de données à des tiers

SÉCURITÉ :
- Toutes les données sont chiffrées en transit (HTTPS)
- Accès sécurisé par mot de passe
- Les utilisateurs peuvent supprimer leur compte et leurs données à tout moment

Pour plus d'informations, consultez notre politique de confidentialité.
```

---

## 🍎 APP STORE - Section "Privacy Labels" (Étiquettes de confidentialité)

### 📍 Comment accéder :
1. Allez sur https://appstoreconnect.apple.com
2. Sélectionnez votre app **FITARIKI**
3. Allez dans **"Confidentialité de l'app"**
4. Cliquez sur **"Commencer"**

---

### 📋 Types de données à déclarer

#### **1. Informations de contact**

**Nom**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

**E-mail**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app, Communications

**Numéro de téléphone**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

**Adresse physique**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

#### **2. Localisation**

**Localisation de précision**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

**Localisation approximative**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

#### **3. Informations utilisateur**

**Photo de profil**
- ❌ NON utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

#### **4. Contenu utilisateur**

**Photos ou vidéos**
- ❌ NON utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

**Historique de recherche**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

#### **5. Identifiants**

**Identifiant utilisateur**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app

**Identifiant d'appareil**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Fonctionnalités de l'app, Notifications push

#### **6. Données d'utilisation**

**Données sur les produits consultés**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Analyses

**Autres données d'utilisation**
- ✅ Utilisé pour le suivi
- ✅ Lié à l'identité de l'utilisateur
- **Objectif** : Analyses

#### **7. Diagnostics**

**Données de performances**
- ❌ NON utilisé pour le suivi
- ❌ NON lié à l'identité de l'utilisateur
- **Objectif** : Analyses

**Données sur les incidents**
- ❌ NON utilisé pour le suivi
- ❌ NON lié à l'identité de l'utilisateur
- **Objectif** : Analyses

---

## 🍪 Gestion des Cookies et Données Locales

### AsyncStorage (React Native)

Votre app utilise **AsyncStorage** pour stocker :
- Token d'authentification
- Préférences utilisateur
- Cache temporaire

**Déclaration :**
- Ce n'est **pas un cookie** au sens web classique
- C'est du **stockage local** sur l'appareil
- **Non partagé** avec des tiers
- **Supprimé** lors de la déinstallation de l'app

---

## 📝 Texte pour la Politique de Confidentialité

Ajoutez cette section dans votre politique de confidentialité :

```markdown
## Cookies et Technologies de Suivi

FITARIKI utilise des technologies de stockage local pour améliorer votre expérience :

### Stockage Local
Nous utilisons AsyncStorage (stockage local sécurisé) pour :
- Maintenir votre session connectée
- Sauvegarder vos préférences
- Améliorer les performances de l'application

### Données Stockées Localement
- Token d'authentification (pour rester connecté)
- Préférences linguistiques
- Cache temporaire des trajets récents
- Historique de recherche (pour des suggestions pertinentes)

### Contrôle des Données
Vous pouvez :
- Vous déconnecter pour supprimer le token
- Désinstaller l'app pour supprimer toutes les données locales
- Demander la suppression de votre compte

### Cookies Web (si applicable)
Si vous utilisez notre site web, nous utilisons :
- Cookies essentiels (connexion, panier)
- Cookies analytiques (avec votre consentement)
- Aucun cookie publicitaire

Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
```

---

## ✅ Checklist Finale

### Play Store (Data Safety)
- [ ] Toutes les données collectées déclarées
- [ ] Objectifs de collecte précisés
- [ ] Partage avec des tiers déclaré
- [ ] Chiffrement en transit confirmé
- [ ] Suppression des données possible
- [ ] Texte de déclaration rédigé

### App Store (Privacy Labels)
- [ ] Informations de contact déclarées
- [ ] Localisation déclarée
- [ ] Photo de profil déclarée
- [ ] Identifiants déclarés
- [ ] Données d'utilisation déclarées
- [ ] Diagnostics déclarés

### Politique de Confidentialité
- [ ] Section sur les cookies ajoutée
- [ ] Stockage local expliqué
- [ ] Contrôle utilisateur détaillé
- [ ] URL publiée en ligne

---

## 🚨 IMPORTANT

### ⚠️ Soyez Transparent
- Déclarez **TOUTES** les données que vous collectez
- Ne cachez rien, les stores vérifient
- Mieux vaut trop déclarer que pas assez

### ⚠️ Mettez à Jour
- Chaque fois que vous ajoutez une nouvelle fonctionnalité
- Si vous collectez de nouvelles données
- Mettez à jour les déclarations dans les stores

### ⚠️ Testez Avant de Soumettre
- Assurez-vous que toutes les permissions fonctionnent
- Vérifiez que l'app explique pourquoi elle demande chaque permission
- Testez la suppression des données

---

## 📚 Ressources

**Play Store :**
- Guide Data Safety : https://support.google.com/googleplay/android-developer/answer/10787469
- Exemples : https://support.google.com/googleplay/android-developer/answer/11416267

**App Store :**
- Privacy Labels : https://developer.apple.com/app-store/app-privacy-details/
- Guidelines : https://developer.apple.com/app-store/review/guidelines/#privacy

---

**Vos permissions sont maintenant configurées et prêtes pour les stores ! 🔐✅**


