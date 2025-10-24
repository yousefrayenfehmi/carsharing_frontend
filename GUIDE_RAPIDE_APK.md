# 🚀 Guide Ultra-Rapide : Créer un APK de Test

## 📱 Méthode la Plus Simple (5-10 minutes)

Votre projet est **déjà configuré** avec EAS Build ! Il suffit de suivre ces 4 étapes :

---

## 1️⃣ Installer EAS CLI (une seule fois)

```bash
npm install -g eas-cli
```

---

## 2️⃣ Se Connecter à Expo

```bash
eas login
```

Si vous n'avez pas de compte :
- Allez sur https://expo.dev
- Créez un compte gratuit
- Revenez et connectez-vous

---

## 3️⃣ Aller dans le Dossier de l'App

```bash
cd covoiturage-app
```

---

## 4️⃣ Construire l'APK de Test

```bash
eas build -p android --profile preview
```

Cette commande va :
- ✅ Uploader votre code dans le cloud Expo
- ✅ Construire l'APK (15-20 minutes)
- ✅ Vous donner un lien de téléchargement

---

## 📥 Télécharger et Installer

### Pendant le Build

Vous verrez :
```
✔ Build started, it may take a few minutes to complete.
You can monitor the build at: https://expo.dev/...
```

### Une fois terminé

Vous recevrez :
- 📧 Un email avec le lien
- 🔗 Un lien dans le terminal

### Installer sur Android

1. Téléchargez l'APK depuis le lien
2. Transférez-le sur votre téléphone
3. Activez "Sources inconnues" dans les paramètres Android
4. Installez l'APK !

---

## 🎯 Commandes Utiles

### Build de Test (rapide)
```bash
cd covoiturage-app
eas build -p android --profile preview
```

### Build de Production
```bash
cd covoiturage-app
eas build -p android --profile production
```

### Voir l'Historique des Builds
```bash
eas build:list
```

### Annuler un Build en Cours
```bash
eas build:cancel
```

---

## 🔍 Vérifier la Configuration

Votre projet est déjà configuré ! Mais si vous voulez vérifier :

### eas.json ✅
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### app.json ✅
- ✅ Package name: `com.covoiturage.app`
- ✅ Version: `1.0.0`
- ✅ Project ID: Configuré
- ✅ Permissions: Configurées

---

## ⚠️ Problèmes Courants

### "Unauthorized access"

**Solution** :
```bash
eas login
```

### "No EAS project configured"

**Solution** :
```bash
eas build:configure
```

### Build échoue

**Solution** :
1. Vérifiez que toutes les dépendances sont installées :
```bash
cd covoiturage-app
npm install
```

2. Vérifiez les logs du build sur expo.dev

3. Assurez-vous que le backend est accessible

---

## 📊 Que Contient l'APK ?

Votre APK de test inclut :
- ✅ Toutes les fonctionnalités de l'app
- ✅ Système de notifications complet
- ✅ Géolocalisation
- ✅ Connexion au backend
- ✅ Toutes les permissions nécessaires

---

## 🧪 Tester l'APK

### Sur un Appareil Physique

1. **Activer les sources inconnues** :
   - Paramètres → Sécurité → Sources inconnues ✅

2. **Transférer l'APK** :
   - Par email
   - Par USB
   - Par Google Drive/Dropbox

3. **Installer** :
   - Ouvrir le fichier APK
   - Cliquer sur "Installer"

4. **Tester** :
   - Créer un compte
   - Créer un trajet
   - Faire une réservation
   - Tester les notifications

### Permissions à Vérifier

Au premier lancement, l'app demandera :
- 📍 **Localisation** → Accepter
- 🔔 **Notifications** → Accepter

---

## 💡 Conseils Pro

### Pour un Test Rapide
```bash
eas build -p android --profile preview
```
- Plus rapide
- Pour tests internes

### Pour une Version Finale
```bash
eas build -p android --profile production
```
- Optimisé
- Prêt pour publication

---

## 📱 Différences avec Expo Go

| Expo Go | APK |
|---------|-----|
| ❌ Ne fonctionne qu'en développement | ✅ App standalone complète |
| ❌ Dépend du serveur de dev | ✅ Fonctionne seule |
| ❌ Fonctionnalités limitées | ✅ Toutes les fonctionnalités |
| ❌ Notifications limitées | ✅ Notifications complètes |

---

## ⏱️ Temps Estimé

| Étape | Durée |
|-------|-------|
| Installation EAS CLI | 2 min |
| Connexion Expo | 1 min |
| Lancement du build | 1 min |
| Build dans le cloud | **15-20 min** |
| Téléchargement APK | 2 min |
| Installation sur tel | 1 min |
| **TOTAL** | **~25 min** |

---

## 🎯 Résumé : 4 Commandes

```bash
# 1. Installer EAS (une fois)
npm install -g eas-cli

# 2. Se connecter
eas login

# 3. Aller dans le projet
cd covoiturage-app

# 4. Construire l'APK
eas build -p android --profile preview
```

**Attendez 15-20 minutes, téléchargez et installez !** 🎉

---

## 🆘 Besoin d'Aide ?

### Documentation
- Guide complet : `GUIDE_BUILD_APK.md`
- Documentation Expo : https://docs.expo.dev/build/setup/

### Support
- Forum Expo : https://forums.expo.dev
- Discord Expo : https://chat.expo.dev

---

## ✅ Checklist Avant de Construire

- [ ] EAS CLI installé
- [ ] Connecté à Expo
- [ ] Dans le dossier `covoiturage-app`
- [ ] Backend en ligne et accessible
- [ ] Connexion Internet stable

---

## 🎉 Après le Build

Une fois l'APK installé :

1. **Tester les fonctionnalités principales** :
   - Inscription/Connexion
   - Création de trajet
   - Recherche de trajet
   - Réservation
   - Négociation
   - Notifications

2. **Vérifier les permissions** :
   - Localisation
   - Notifications

3. **Tester avec 2 téléphones** :
   - Un conducteur
   - Un passager
   - Vérifier les notifications

---

**C'est tout ! Votre APK de test est prêt ! 🚗📱**

