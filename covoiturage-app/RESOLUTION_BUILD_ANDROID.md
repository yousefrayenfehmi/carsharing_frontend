# 🔧 Résolution : Erreur Build Android - Gradle Failed

## ❌ Problème

```
✖ Build failed
🤖 Android build failed:
Gradle build failed with unknown error.
```

## 🔍 Causes Possibles

1. **Fichier `google-services.json` manquant ou invalide**
2. **Problème de configuration Gradle**
3. **Dépendances incompatibles**
4. **Cache corrompu**

---

## ✅ SOLUTION 1 : Retirer Temporairement google-services.json (RECOMMANDÉ POUR TEST)

Si vous n'utilisez pas Firebase immédiatement, vous pouvez retirer cette configuration temporairement.

### Étape 1 : Modifier app.json

Retirez ou commentez la ligne `googleServicesFile` :

```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#FFFFFF",
        "foregroundImage": "./assets/images/fitriqi.png"
      },
      "edgeToEdgeEnabled": false,
      "predictiveBackGestureEnabled": false,
      "package": "com.fitariki.covoiturage",
      "versionCode": 1,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ],
      // "googleServicesFile": "./google-services.json",  // ← Retiré temporairement
      "useNextNotificationsApi": true
    }
  }
}
```

### Étape 2 : Rebuild avec Cache Clear

```bash
cd covoiturage-app
eas build --platform android --profile preview --clear-cache
```

---

## ✅ SOLUTION 2 : Vérifier/Créer google-services.json

Si vous avez besoin de Firebase, vérifiez que le fichier est correct.

### Étape 1 : Vérifier le Fichier

Le fichier `google-services.json` doit :
- ✅ Exister dans `covoiturage-app/google-services.json`
- ✅ Être un JSON valide
- ✅ Contenir les bonnes informations de votre projet Firebase

### Étape 2 : Obtenir le Fichier Correct

1. Allez sur : https://console.firebase.google.com
2. Sélectionnez votre projet (ou créez-en un)
3. Allez dans **Paramètres du projet** (⚙️)
4. Allez dans l'onglet **Vos applications**
5. Si vous avez déjà une app Android, cliquez dessus
6. Sinon, cliquez sur **Ajouter une application** > **Android**
7. Entrez le package : `com.fitariki.covoiturage`
8. Téléchargez `google-services.json`
9. Remplacez le fichier dans `covoiturage-app/`

### Étape 3 : Rebuild

```bash
eas build --platform android --profile preview --clear-cache
```

---

## ✅ SOLUTION 3 : Nettoyer et Rebuild

Parfois, le cache est corrompu.

### Étape 1 : Nettoyer le Cache

```bash
cd covoiturage-app

# Nettoyer le cache npm
rm -rf node_modules
npm install

# Nettoyer le cache EAS
eas build --platform android --profile preview --clear-cache
```

### Étape 2 : Rebuild

```bash
eas build --platform android --profile preview
```

---

## ✅ SOLUTION 4 : Vérifier les Logs Détaillés

Pour voir l'erreur exacte :

1. Allez sur le lien fourni dans l'erreur :
   ```
   https://expo.dev/accounts/abrouk/projects/covoiturage-app/builds/707244b0-3517-45c6-98d0-da5385e934d9#run-gradlew
   ```

2. Regardez la section **"Run gradlew"** pour voir l'erreur exacte

3. Les erreurs communes :
   - `File google-services.json is missing` → Solution 1 ou 2
   - `Invalid google-services.json` → Solution 2
   - `Dependency conflict` → Solution 3
   - `Out of memory` → Contactez le support EAS

---

## 🎯 SOLUTION RAPIDE (Recommandée)

Pour tester rapidement sans Firebase :

1. **Retirez `googleServicesFile` de `app.json`**
2. **Rebuild avec cache clear** :
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

Vous pourrez ajouter Firebase plus tard si nécessaire.

---

## 📝 Modifications à Apporter

### Option A : Retirer google-services.json (Pour Test)

Modifiez `app.json` :

```json
"android": {
  "adaptiveIcon": {
    "backgroundColor": "#FFFFFF",
    "foregroundImage": "./assets/images/fitriqi.png"
  },
  "edgeToEdgeEnabled": false,
  "predictiveBackGestureEnabled": false,
  "package": "com.fitariki.covoiturage",
  "versionCode": 1,
  "permissions": [
    "ACCESS_COARSE_LOCATION",
    "ACCESS_FINE_LOCATION",
    "RECEIVE_BOOT_COMPLETED",
    "VIBRATE",
    "INTERNET",
    "ACCESS_NETWORK_STATE",
    "READ_EXTERNAL_STORAGE",
    "WRITE_EXTERNAL_STORAGE",
    "CAMERA"
  ],
  // "googleServicesFile": "./google-services.json",  // ← Retiré
  "useNextNotificationsApi": true
}
```

### Option B : Créer un google-services.json Valide

Si vous avez un projet Firebase :
1. Téléchargez le fichier depuis Firebase Console
2. Placez-le dans `covoiturage-app/google-services.json`
3. Vérifiez qu'il contient le bon `package_name` : `com.fitariki.covoiturage`

---

## 🔄 Après Correction

Une fois corrigé, relancez le build :

```bash
eas build --platform android --profile preview --clear-cache
```

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

1. **Vérifiez les logs détaillés** sur expo.dev
2. **Contactez le support EAS** : support@expo.dev
3. **Essayez un build de production** :
   ```bash
   eas build --platform android --profile production --clear-cache
   ```

---

## ✅ Checklist

- [ ] Fichier `google-services.json` retiré OU valide
- [ ] `app.json` modifié et sauvegardé
- [ ] Cache nettoyé (`--clear-cache`)
- [ ] Build relancé
- [ ] Logs vérifiés si échec

---

**Essayez la Solution 1 en premier (retirer google-services.json) - c'est la plus rapide ! 🚀**

