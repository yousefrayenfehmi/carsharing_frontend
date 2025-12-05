# 🔨 Guide de Build Local Android

## ⚠️ Problème Actuel

Vous avez épuisé votre quota de builds gratuits EAS (limite du plan gratuit). Le prochain reset est dans **7 jours** (1er décembre 2025).

**Solutions disponibles :**
1. ✅ **Build local** (gratuit, illimité) - RECOMMANDÉ
2. 💰 Upgrade vers un plan payant EAS
3. ⏳ Attendre 7 jours pour le reset du quota

---

## 🚀 Solution 1 : Build Local (GRATUIT)

### Étape 1 : Activer l'exécution de scripts PowerShell

**Ouvrez PowerShell en tant qu'administrateur** et exécutez :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Tapez `Y` pour confirmer.

### Étape 2 : Installer Android Studio (si pas déjà fait)

1. Téléchargez Android Studio : https://developer.android.com/studio
2. Installez-le avec les options par défaut
3. Ouvrez Android Studio et installez :
   - Android SDK Platform 34 (ou la version dans votre `app.json`)
   - Android SDK Build-Tools
   - Android Emulator (optionnel)

### Étape 3 : Configurer les variables d'environnement

Ajoutez ces variables d'environnement système :

```
ANDROID_HOME=C:\Users\youss\AppData\Local\Android\Sdk
```

Ajoutez au PATH :
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

### Étape 4 : Préparer le projet

```bash
# Dans Git Bash ou CMD (pas PowerShell si ça ne marche pas)
cd c:\Users\youss\OneDrive\Bureau\projet-covoiturage\covoiturage-app

# Nettoyer et préparer
npx expo prebuild --clean

# Installer expo-dev-client
npm install expo-dev-client
```

### Étape 5 : Construire l'APK

**Option A : Build de développement avec Metro**
```bash
npx expo run:android
```

**Option B : Build APK standalone**
```bash
cd android
./gradlew assembleRelease
# L'APK sera dans : android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Solution 2 : Build Simplifié (Sans Rebuild Complet)

Si vous voulez juste **tester les notifications rapidement** sans rebuild :

### Utiliser Expo Go avec Limitations

Même si Expo Go ne supporte pas les notifications push dans SDK 53+, vous pouvez quand même :

1. **Tester la logique** avec des notifications locales
2. **Vérifier les permissions**
3. **Simuler les scénarios**

```bash
npm start
# Scannez le QR code avec Expo Go
```

Puis dans l'app, naviguez vers `/notification-test` et testez les notifications **locales** (elles fonctionneront même sur Expo Go).

---

## 🔧 Solution 3 : Utiliser votre APK existant

Si vous avez déjà un APK de test installé sur votre appareil :

1. **Modifiez uniquement le code TypeScript** (pas `app.json`)
2. **Rechargez l'app** avec `r` dans le terminal Metro
3. Les changements de code seront appliqués sans rebuild

**MAIS** : Les modifications de `app.json` (plugin notifications) nécessitent un rebuild.

---

## 📋 Commandes à Exécuter (Git Bash ou CMD)

Ouvrez **Git Bash** ou **Invite de commandes** (pas PowerShell) :

```bash
# 1. Aller dans le dossier
cd /c/Users/youss/OneDrive/Bureau/projet-covoiturage/covoiturage-app

# 2. Installer expo-dev-client
npm install expo-dev-client

# 3. Prebuild (génère les dossiers android/ios)
npx expo prebuild --clean

# 4. Build Android
npx expo run:android

# OU si vous avez un appareil connecté en USB avec débogage activé :
npx expo run:android --device
```

---

## 🐛 Dépannage

### Erreur : "SDK location not found"

Créez le fichier `android/local.properties` :
```properties
sdk.dir=C:\\Users\\youss\\AppData\\Local\\Android\\Sdk
```

### Erreur : "Gradle build failed"

```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Erreur : "No devices found"

- Connectez votre téléphone en USB
- Activez le débogage USB sur Android
- Vérifiez avec : `adb devices`

---

## ⚡ Alternative Rapide : Tester Sans Rebuild

Puisque les modifications de `app.json` nécessitent un rebuild, voici comment tester **maintenant** :

### 1. Créer un bouton de test temporaire

Dans `app/(tabs)/profile.tsx` ou n'importe quel écran :

```tsx
import { showLocalNotification } from '@/services/notification.service';

// Ajouter ce bouton temporaire
<TouchableOpacity 
  onPress={() => showLocalNotification('Test', 'Notification de test')}
  style={{ padding: 20, backgroundColor: '#3B82F6', margin: 20, borderRadius: 10 }}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>
    Test Notification Locale
  </Text>
</TouchableOpacity>
```

### 2. Lancer avec Expo Go

```bash
npm start
# Scannez le QR code
```

### 3. Tester

Appuyez sur le bouton → Une notification locale devrait apparaître.

**Note** : Les notifications **push depuis le serveur** ne fonctionneront qu'après le rebuild avec le plugin.

---

## 🎯 Recommandation

**Pour tester MAINTENANT** :
1. Utilisez Expo Go + notifications locales (voir Alternative Rapide ci-dessus)

**Pour tester les VRAIES notifications push** :
1. Attendez 7 jours pour le reset du quota EAS
2. OU faites un build local (suivez les étapes ci-dessus)
3. OU upgradez votre plan EAS

---

## 📞 Besoin d'aide ?

Dites-moi quelle option vous préférez :
- **A** : Je veux faire un build local maintenant (je vous guide étape par étape)
- **B** : Je veux juste tester avec Expo Go et des notifications locales
- **C** : J'attends le reset du quota dans 7 jours
