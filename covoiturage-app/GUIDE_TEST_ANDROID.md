# 📱 Guide : Tester l'Application Android

## 🎯 Objectif

Générer un APK pour tester l'application FITARIKI sur un appareil Android.

---

## 🚀 MÉTHODE 1 : Utiliser le Script Windows (RECOMMANDÉ)

### Étape 1 : Ouvrir le Terminal

1. Ouvrez le terminal dans le dossier `covoiturage-app`
2. Ou utilisez Git Bash / PowerShell

### Étape 2 : Exécuter le Script

```bash
cd covoiturage-app
build-android.bat
```

### Étape 3 : Choisir le Type de Build

Le script vous demandera de choisir :
- **Option 1** : Preview (test rapide - APK) ✅ **RECOMMANDÉ POUR TESTER**
- Option 2 : Production (final - APK)
- Option 3 : Production AAB (pour Play Store)

**Choisissez l'option 1** pour tester.

### Étape 4 : Attendre le Build

- ⏱️ **Durée** : 15-20 minutes
- Vous verrez la progression dans le terminal
- Vous recevrez un email à la fin

### Étape 5 : Télécharger l'APK

Une fois terminé :
1. Vous recevrez un **email avec le lien**
2. OU allez sur : https://expo.dev
3. Connectez-vous avec votre compte Expo
4. Allez dans **Builds**
5. Téléchargez le fichier `.apk`

---

## 🛠️ MÉTHODE 2 : Commande Manuelle

### Étape 1 : Installer EAS CLI (si pas déjà fait)

```bash
npm install -g eas-cli
```

### Étape 2 : Se Connecter à Expo

```bash
cd covoiturage-app
eas login
```

Si vous n'avez pas de compte :
1. Allez sur : https://expo.dev
2. Créez un compte gratuit
3. Revenez et exécutez `eas login`

### Étape 3 : Vérifier la Connexion

```bash
eas whoami
```

### Étape 4 : Générer l'APK de Test

```bash
# APK de test (Preview)
eas build --platform android --profile preview
```

**Ou pour un APK de production** :
```bash
eas build --platform android --profile production
```

### Étape 5 : Suivre le Progrès

- Le build se fait dans le cloud
- Vous verrez un lien dans le terminal
- Vous pouvez suivre la progression sur https://expo.dev

### Étape 6 : Télécharger l'APK

Une fois terminé :
1. Email avec le lien de téléchargement
2. OU allez sur https://expo.dev > Builds
3. Téléchargez le fichier `.apk`

---

## 📲 Installer l'APK sur Android

### Option A : Via USB (Recommandé)

1. **Activer le mode développeur** sur votre téléphone :
   - Allez dans **Paramètres** > **À propos du téléphone**
   - Tapez 7 fois sur **Numéro de build**
   - Retournez dans **Paramètres** > **Options développeur**
   - Activez **Débogage USB**

2. **Connecter le téléphone** :
   - Branchez votre téléphone en USB
   - Autorisez le débogage USB sur le téléphone

3. **Installer l'APK** :
   ```bash
   adb install chemin/vers/fichier.apk
   ```

### Option B : Via Email/Cloud

1. **Envoyer l'APK** :
   - Envoyez-vous l'APK par email
   - OU uploadez sur Google Drive / Dropbox
   - OU utilisez un service de transfert de fichiers

2. **Télécharger sur le téléphone** :
   - Ouvrez l'email ou le lien cloud sur votre téléphone
   - Téléchargez l'APK

3. **Installer** :
   - Ouvrez le fichier téléchargé
   - Android vous demandera l'autorisation
   - Autorisez l'installation depuis des sources inconnues si nécessaire
   - Cliquez sur **Installer**

### Option C : Via QR Code (EAS)

Si vous utilisez EAS Build, vous pouvez :
1. Scanner le QR code affiché dans le terminal
2. Télécharger directement sur votre téléphone

---

## ✅ Vérifier que l'Application Fonctionne

### Tests à Effectuer

1. **Lancement** :
   - [ ] L'application se lance correctement
   - [ ] L'écran de démarrage s'affiche
   - [ ] Pas d'erreurs au démarrage

2. **Connexion API** :
   - [ ] L'application se connecte au backend
   - [ ] L'URL de l'API est correcte : `http://37.59.126.29:3000/api`
   - [ ] Les requêtes fonctionnent

3. **Fonctionnalités** :
   - [ ] Connexion/Inscription
   - [ ] Recherche de trajets
   - [ ] Publication de trajets
   - [ ] Réservation
   - [ ] Profil utilisateur

4. **Permissions** :
   - [ ] Localisation (si nécessaire)
   - [ ] Caméra (pour photo de profil)
   - [ ] Stockage (pour images)

---

## 🔧 Résolution de Problèmes

### Problème : "EAS CLI not found"

**Solution** :
```bash
npm install -g eas-cli
```

### Problème : "Not logged in"

**Solution** :
```bash
eas login
```

### Problème : "Build failed"

**Solutions** :
1. Vérifiez les logs dans le terminal
2. Vérifiez que l'API backend est accessible
3. Vérifiez la configuration dans `app.json`
4. Essayez avec `--clear-cache` :
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

### Problème : "Cannot install APK"

**Solutions** :
1. Activez **Sources inconnues** dans les paramètres Android
2. Vérifiez que l'APK n'est pas corrompu (retéléchargez)
3. Vérifiez l'espace de stockage disponible

### Problème : "App crashes on startup"

**Solutions** :
1. Vérifiez les logs avec `adb logcat`
2. Vérifiez que l'API backend est accessible
3. Vérifiez la configuration de l'URL API dans `config.ts`

---

## 📋 Checklist Avant de Tester

- [ ] EAS CLI installé
- [ ] Connecté à Expo (`eas login`)
- [ ] API backend accessible (`http://37.59.126.29:3000/api`)
- [ ] Configuration correcte dans `app.json`
- [ ] Téléphone Android prêt (mode développeur activé si nécessaire)

---

## 🎯 Commandes Rapides

```bash
# Se connecter
eas login

# Générer APK de test
eas build --platform android --profile preview

# Générer APK de production
eas build --platform android --profile production

# Voir l'historique des builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]
```

---

## 📱 Tester avec Expo Go (Alternative Rapide)

Si vous voulez tester rapidement sans générer d'APK :

```bash
cd covoiturage-app
npm start
```

Puis :
1. Installez **Expo Go** depuis le Play Store
2. Scannez le QR code affiché dans le terminal
3. L'app se lance dans Expo Go

**Note** : Cette méthode est pour le développement. Pour un test réel, utilisez l'APK.

---

## 🚀 Prochaines Étapes

Une fois que vous avez testé et que tout fonctionne :

1. **Corriger les bugs** si nécessaire
2. **Générer un APK de production** pour distribution
3. **Générer un AAB** pour le Play Store

---

**Bon test ! 🎉**

