# 🔐 Guide des Permissions - FITARIKI

## ✅ État Actuel des Permissions

### Permissions Déclarées : ✅ TOUTES CONFIGURÉES

**Android** : 9 permissions  
**iOS** : 6 descriptions de permissions

**Les permissions sont bien configurées dans `app.json` !**

---

## 📱 Comment Utiliser les Permissions dans Votre Code

J'ai créé un fichier utilitaire : **`covoiturage-app/utils/permissions.ts`**

### 🔧 Fonctions Disponibles

#### 1. **Demander la localisation**
```typescript
import { requestLocationPermission, getCurrentLocation } from '../utils/permissions';

// Dans votre composant
const handleGetLocation = async () => {
  const hasPermission = await requestLocationPermission();
  
  if (hasPermission) {
    const location = await getCurrentLocation();
    if (location) {
      console.log('Position:', location.latitude, location.longitude);
      // Utiliser la localisation
    }
  }
};
```

#### 2. **Prendre une photo avec la caméra**
```typescript
import { takePhoto } from '../utils/permissions';

const handleTakePhoto = async () => {
  const photoUri = await takePhoto();
  
  if (photoUri) {
    console.log('Photo prise:', photoUri);
    // Uploader la photo vers votre serveur
  }
};
```

#### 3. **Choisir une photo de la galerie**
```typescript
import { pickImage } from '../utils/permissions';

const handlePickImage = async () => {
  const imageUri = await pickImage();
  
  if (imageUri) {
    console.log('Image sélectionnée:', imageUri);
    // Uploader l'image vers votre serveur
  }
};
```

---

## 🎯 Exemples d'Intégration

### Exemple 1 : Écran de Recherche de Trajets

```typescript
// app/search/index.tsx
import { useState, useEffect } from 'react';
import { getCurrentLocation } from '@/utils/permissions';

export default function SearchScreen() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadUserLocation();
  }, []);

  const loadUserLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
      // Rechercher les trajets à proximité
    }
  };

  return (
    // Votre UI
  );
}
```

### Exemple 2 : Écran de Profil avec Photo

```typescript
// app/profile/edit.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { takePhoto, pickImage } from '@/utils/permissions';

export default function EditProfileScreen() {
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoChoice = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: async () => {
            const photo = await takePhoto();
            if (photo) setProfilePhoto(photo);
          }
        },
        {
          text: 'Choisir de la galerie',
          onPress: async () => {
            const photo = await pickImage();
            if (photo) setProfilePhoto(photo);
          }
        },
        {
          text: 'Annuler',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    // Votre UI avec bouton pour changer la photo
  );
}
```

### Exemple 3 : Demander Permissions au Démarrage

```typescript
// app/_layout.tsx ou app/index.tsx
import { useEffect } from 'react';
import { requestAllPermissions } from '@/utils/permissions';

export default function RootLayout() {
  useEffect(() => {
    // Demander les permissions importantes au premier lancement
    requestAllPermissions();
  }, []);

  return (
    // Votre layout
  );
}
```

---

## ⚙️ Configuration Requise

### 1. **Google Maps API Keys** (OBLIGATOIRE)

Vous devez ajouter vos clés API dans `app.json` :

```json
"ios": {
  "config": {
    "googleMapsApiKey": "VOTRE_CLE_IOS_ICI"
  }
},
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "VOTRE_CLE_ANDROID_ICI"
    }
  }
}
```

**Obtenir les clés :**
1. https://console.cloud.google.com/
2. Créer un projet
3. Activer "Maps SDK for Android" et "Maps SDK for iOS"
4. Créer 2 API Keys avec restrictions

### 2. **google-services.json** (Android)

Vérifiez que ce fichier existe : `covoiturage-app/google-services.json`

Si absent, téléchargez-le depuis Firebase Console.

---

## 🧪 Tester les Permissions

### Commande de Test
```bash
cd covoiturage-app

# Android
npm run android

# iOS (nécessite Mac ou EAS)
npm run ios
```

### Vérifier les Permissions en Debug

Ajoutez dans votre code :
```typescript
import { checkAllPermissions } from '@/utils/permissions';

// Dans votre composant
useEffect(() => {
  checkAllPermissions(); // Affiche l'état dans la console
}, []);
```

---

## 📊 Tableau Récapitulatif

| Permission | Android | iOS | Quand demander |
|------------|---------|-----|----------------|
| **Localisation** | ✅ | ✅ | À l'ouverture de la recherche |
| **Caméra** | ✅ | ✅ | Quand l'utilisateur veut prendre une photo |
| **Photos** | ✅ | ✅ | Quand l'utilisateur veut choisir une photo |
| **Internet** | ✅ | ✅ | Automatique (pas besoin de demander) |
| **Notifications** | ✅ | ✅ | Au premier lancement ou dans les paramètres |

---

## ⚠️ Bonnes Pratiques

### ✅ À FAIRE

1. **Demander au bon moment**
   - Localisation : Quand l'utilisateur cherche un trajet
   - Caméra : Quand l'utilisateur clique sur "Prendre une photo"
   - Photos : Quand l'utilisateur clique sur "Choisir une photo"

2. **Expliquer pourquoi**
   - Les messages dans `app.json` sont affichés automatiquement
   - Ajoutez des explications supplémentaires dans votre UI

3. **Gérer le refus**
   - Proposer d'ouvrir les paramètres
   - Permettre d'utiliser l'app sans certaines permissions

### ❌ À NE PAS FAIRE

1. **Ne pas demander toutes les permissions au démarrage**
   - C'est intrusif et effraie les utilisateurs
   - Demandez uniquement la localisation si nécessaire

2. **Ne pas forcer l'utilisateur**
   - Si l'utilisateur refuse, respectez son choix
   - Proposez des alternatives quand c'est possible

3. **Ne pas redemander sans arrêt**
   - Si l'utilisateur refuse, n'insistez pas
   - Expliquez comment activer manuellement dans les paramètres

---

## 🔍 Vérification Finale Avant Publication

### Checklist Permissions

- [ ] Toutes les permissions déclarées dans `app.json`
- [ ] Google Maps API Keys ajoutées
- [ ] `google-services.json` présent
- [ ] Permissions demandées dans le code (avec `utils/permissions.ts`)
- [ ] Messages explicatifs clairs
- [ ] Gestion du refus utilisateur
- [ ] Tests sur appareil réel Android
- [ ] Tests sur appareil réel iOS (ou simulateur)

### Test Manuel

1. **Désinstaller l'app** (pour reset les permissions)
2. **Réinstaller**
3. **Tester chaque fonctionnalité** qui demande une permission :
   - ✅ Message clair affiché
   - ✅ Accepter → Fonctionnalité marche
   - ✅ Refuser → Message approprié + Alternative proposée

---

## 🚀 Prochaines Étapes

### 1. Ajouter les API Keys
```bash
# Ouvrez app.json et ajoutez vos clés Google Maps
```

### 2. Intégrer les Permissions dans Vos Écrans
```typescript
// Importez les fonctions de utils/permissions.ts
// Utilisez-les avant d'accéder aux fonctionnalités sensibles
```

### 3. Tester sur Appareil Réel
```bash
# Android
eas build --platform android --profile preview

# iOS
eas build --platform ios --profile preview-ios
```

### 4. Déclarer dans les Stores
- Suivez `DECLARATION_DONNEES_STORES.md`
- Remplissez les sections "Data Safety" et "Privacy Labels"

---

## 📚 Ressources

- **Expo Location** : https://docs.expo.dev/versions/latest/sdk/location/
- **Expo ImagePicker** : https://docs.expo.dev/versions/latest/sdk/imagepicker/
- **Android Permissions** : https://developer.android.com/guide/topics/permissions/overview
- **iOS Permissions** : https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy

---

## 🆘 Problèmes Courants

### Permission refusée sur Android
```bash
# Vérifiez dans AndroidManifest.xml (généré automatiquement)
# Si problème, reconstruisez l'app :
eas build --platform android --clear-cache
```

### Permission refusée sur iOS
```bash
# Vérifiez que les NSxxxUsageDescription sont bien dans app.json
# Reconstruisez :
eas build --platform ios --clear-cache
```

### Google Maps ne fonctionne pas
```bash
# Vérifiez que les API Keys sont bien ajoutées
# Vérifiez que les APIs sont activées dans Google Cloud Console
# Vérifiez les restrictions de clés (package/bundle ID)
```

---

## ✅ Résumé

**Permissions dans app.json** : ✅ CONFIGURÉES  
**Utilitaire permissions.ts** : ✅ CRÉÉ  
**Documentation** : ✅ COMPLÈTE  

**Actions requises** :
1. ⚠️ Ajouter Google Maps API Keys dans `app.json`
2. ✅ Utiliser les fonctions de `utils/permissions.ts` dans votre code
3. ✅ Tester sur appareil réel avant de publier

**Vos permissions sont prêtes pour Play Store et App Store ! 🎉**



