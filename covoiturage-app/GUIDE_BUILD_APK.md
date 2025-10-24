# 📱 Guide : Créer un APK depuis React Native

## 🎯 Vue d'Ensemble

Votre application React Native (Expo) peut être transformée en fichier APK de 2 façons :

1. **EAS Build (Expo)** - Recommandé ✅ - Build dans le cloud
2. **Build Local** - Plus complexe - Build sur votre machine

---

## 🚀 Méthode 1 : EAS Build (RECOMMANDÉE)

### Avantages
✅ Simple et rapide  
✅ Pas besoin d'Android Studio  
✅ Build dans le cloud  
✅ Compatible avec toutes les machines  

### Prérequis

1. **Compte Expo** (gratuit)
2. **Installation EAS CLI**

---

### Étape 1 : Installer EAS CLI

```bash
npm install -g eas-cli
```

### Étape 2 : Se Connecter à Expo

```bash
eas login
```

Entrez vos identifiants Expo (créez un compte sur https://expo.dev si nécessaire)

### Étape 3 : Configurer le Projet

```bash
cd covoiturage-app

# Initialiser EAS
eas build:configure
```

Cela crée un fichier `eas.json` avec la configuration.

### Étape 4 : Créer l'APK

```bash
# APK de développement (pour tests)
eas build --platform android --profile preview

# APK de production
eas build --platform android --profile production
```

### Étape 5 : Télécharger l'APK

Une fois le build terminé (environ 10-20 minutes) :
- Vous recevrez un lien par email
- Ou allez sur https://expo.dev/accounts/[votre-compte]/projects/covoiturage-app/builds
- Téléchargez l'APK

### Étape 6 : Installer sur Android

Envoyez l'APK sur votre téléphone et installez-le !

---

## ⚙️ Méthode 2 : Build Local avec Android Studio

### Prérequis

1. **Android Studio** installé
2. **JDK 17** installé
3. **Android SDK** configuré
4. **Beaucoup de patience** 😅

---

### Étape 1 : Éjecter de Expo (si nécessaire)

```bash
cd covoiturage-app
npx expo prebuild
```

⚠️ **Attention** : Cette action est irréversible !

### Étape 2 : Configurer Android Studio

1. Installez Android Studio : https://developer.android.com/studio
2. Installez Android SDK via SDK Manager
3. Configurez les variables d'environnement :

**Windows :**
```bash
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools"
```

**Linux/Mac :**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Étape 3 : Générer une Clé de Signature

```bash
cd android/app

# Windows
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Linux/Mac
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Entrez un mot de passe et gardez-le précieusement ! 🔐

### Étape 4 : Configurer Gradle

Éditez `android/app/build.gradle` :

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'votre_mot_de_passe'
            keyAlias 'my-key-alias'
            keyPassword 'votre_mot_de_passe'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Étape 5 : Construire l'APK

```bash
cd android

# Windows
.\gradlew assembleRelease

# Linux/Mac
./gradlew assembleRelease
```

### Étape 6 : Récupérer l'APK

L'APK sera dans :
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Configuration Recommandée : eas.json

Créez ou modifiez `covoiturage-app/eas.json` :

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📋 Checklist Avant Build

### Configuration de l'App

- [ ] `app.json` configuré correctement
- [ ] `package` unique (ex: `com.votreentreprise.covoiturage`)
- [ ] `version` définie (ex: `1.0.0`)
- [ ] `versionCode` défini (ex: `1`)
- [ ] Icône de l'app ajoutée
- [ ] Splash screen configuré
- [ ] Permissions Android déclarées

### Contenu app.json Important

```json
{
  "expo": {
    "name": "Covoiturage",
    "slug": "covoiturage-app",
    "version": "1.0.0",
    "android": {
      "package": "com.votreentreprise.covoiturage",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "NOTIFICATIONS"
      ]
    }
  }
}
```

---

## 🚨 Erreurs Courantes

### Erreur : "Unauthorized access"

**Solution :**
```bash
eas login
eas build:configure
```

### Erreur : "Android SDK not found"

**Solution :** Installez Android Studio et configurez ANDROID_HOME

### Erreur : Build échoue

**Solution :** Vérifiez les logs et assurez-vous que :
- Toutes les dépendances sont installées
- `package.json` est valide
- Pas de fichiers corrompus

### APK trop gros (>100 MB)

**Solution :** Activez le bundle AAB au lieu d'APK :

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

---

## 📦 Types de Builds

| Type | Fichier | Utilisation |
|------|---------|-------------|
| **APK** | `.apk` | Installation directe, test |
| **AAB** | `.aab` | Google Play Store uniquement |
| **Development** | `.apk` | Debug avec Expo Dev Tools |

---

## 🌐 Déploiement sur Google Play Store

### Étape 1 : Créer un AAB (pas APK)

```bash
eas build --platform android --profile production
```

Assurez-vous que `buildType` est `app-bundle` dans `eas.json`

### Étape 2 : Compte Google Play Console

1. Créez un compte développeur : https://play.google.com/console
2. Coût unique : 25$ USD
3. Créez une nouvelle application

### Étape 3 : Uploader le AAB

1. Allez dans "Production" → "Releases"
2. Créez une nouvelle release
3. Uploadez le fichier `.aab`
4. Remplissez les informations requises
5. Soumettez pour review

---

## 🔧 Optimisations APK

### Réduire la Taille

```json
// Dans app.json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true
    }
  }
}
```

### Optimiser les Images

```bash
# Installer les outils
npm install -g imageoptim-cli

# Optimiser
imageoptim --directory ./assets
```

---

## 🧪 Tester l'APK

### Sur Appareil Physique

1. Activez "Sources inconnues" dans Paramètres
2. Transférez l'APK via USB ou email
3. Installez et testez

### Sur Émulateur Android Studio

1. Ouvrez Android Studio
2. AVD Manager → Créer un émulateur
3. Glissez-déposez l'APK sur l'émulateur

---

## 📝 Commandes Utiles

```bash
# Build APK de preview (rapide)
eas build -p android --profile preview

# Build APK de production
eas build -p android --profile production

# Voir l'historique des builds
eas build:list

# Annuler un build en cours
eas build:cancel

# Voir les logs détaillés
eas build:view [build-id]

# Soumettre au Play Store
eas submit -p android
```

---

## 💡 Conseils Pro

1. **Utilisez EAS Build** - C'est plus simple
2. **Testez d'abord en preview** - Avant la production
3. **Gardez vos clés en sécurité** - Backup important
4. **Incrémentez versionCode** - À chaque nouvelle version
5. **Testez sur plusieurs appareils** - Avant publication

---

## 🎯 Workflow Recommandé

```bash
# 1. Développement
npm run dev

# 2. Test sur Expo Go
npx expo start

# 3. Build preview pour tests
eas build -p android --profile preview

# 4. Test de l'APK
# Installer et tester sur téléphone

# 5. Build production
eas build -p android --profile production

# 6. Déploiement
eas submit -p android
```

---

## 📊 Temps Estimés

| Étape | Durée |
|-------|-------|
| Configuration initiale | 15-30 min |
| Premier build EAS | 15-20 min |
| Builds suivants | 10-15 min |
| Build local | 30-60 min |
| Review Google Play | 1-7 jours |

---

## 🆘 Aide et Ressources

- **Documentation Expo** : https://docs.expo.dev/build/setup/
- **EAS Build** : https://expo.dev/eas
- **Forum Expo** : https://forums.expo.dev
- **Stack Overflow** : Tag `expo` ou `react-native`

---

## ✅ Résumé : Méthode la Plus Simple

```bash
# 1. Installer EAS
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Configurer
cd covoiturage-app
eas build:configure

# 4. Construire
eas build -p android --profile preview

# 5. Télécharger et installer l'APK
```

**C'est tout ! Votre APK est prêt ! 🎉**

---

Fait avec ❤️ pour votre projet de covoiturage 🚗


