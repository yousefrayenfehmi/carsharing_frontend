# 📱 Guide : Télécharger le Build iOS

## 🎯 Après le Build

Une fois que la commande `eas build --platform ios --profile production --clear-cache` est terminée, voici comment trouver et télécharger votre build.

---

## 📍 MÉTHODE 1 : Via le Terminal (Recommandé)

### Pendant le Build

Le terminal affichera un lien direct vers votre build :

```
Build details: https://expo.dev/accounts/[votre-compte]/projects/covoiturage-app/builds/[BUILD_ID]
```

**Copiez ce lien** et ouvrez-le dans votre navigateur.

### Après le Build

Si vous avez fermé le terminal, utilisez :

```bash
eas build:list --platform ios --limit 5
```

Cela affichera les 5 derniers builds iOS avec leurs liens.

---

## 📍 MÉTHODE 2 : Via le Site Expo (Recommandé)

### Étape 1 : Aller sur Expo.dev

1. Allez sur : https://expo.dev
2. **Connectez-vous** avec votre compte Expo

### Étape 2 : Accéder à Votre Projet

1. Cliquez sur **Projects** dans le menu
2. Cliquez sur **covoiturage-app** (ou le nom de votre projet)
3. Allez dans l'onglet **Builds**

### Étape 3 : Trouver Votre Build

Vous verrez une liste de tous vos builds. Le plus récent est en haut.

**Informations affichées** :
- 📱 **Platform** : iOS
- 🔢 **Build Number** : 3 (celui que vous avez configuré)
- 📦 **Version** : 1.0.0
- 📅 **Date** : Date et heure du build
- ✅ **Status** : Finished (terminé) ou In Progress (en cours)

### Étape 4 : Télécharger

1. Cliquez sur le build que vous voulez
2. Vous verrez les détails du build
3. Cliquez sur **Download** pour télécharger le fichier `.ipa`

---

## 📍 MÉTHODE 3 : Via Email

### Email Automatique

Expo envoie automatiquement un email à la fin du build avec :
- ✅ Lien direct vers le build
- ✅ Lien de téléchargement
- ✅ Instructions

**Vérifiez votre boîte email** (y compris les spams).

---

## 📥 Télécharger le Fichier .ipa

### Option A : Téléchargement Direct

1. Sur la page du build, cliquez sur **Download**
2. Le fichier `.ipa` se télécharge
3. **Taille** : Environ 50-100 Mo

### Option B : Lien Direct

Le lien de téléchargement direct ressemble à :
```
https://expo.dev/artifacts/eas/[BUILD_ID].ipa
```

---

## 📱 Installer sur iOS

### Option 1 : TestFlight (Recommandé)

Si vous avez utilisé `--auto-submit`, le build est automatiquement uploadé sur App Store Connect.

1. Allez sur : https://appstoreconnect.apple.com
2. Sélectionnez votre app **FITARIKI**
3. Allez dans **TestFlight**
4. Le build apparaîtra dans quelques minutes
5. Ajoutez des testeurs et testez

### Option 2 : Installation Directe (Développement)

Pour installer directement sur votre iPhone :

1. **Téléchargez le fichier `.ipa`**
2. **Installez Xcode** (sur Mac uniquement)
3. **Connectez votre iPhone** en USB
4. **Ouvrez Xcode** > Window > Devices and Simulators
5. **Sélectionnez votre iPhone**
6. **Glissez le fichier `.ipa`** dans la section "Installed Apps"

### Option 3 : Via EAS Submit

```bash
eas submit --platform ios --latest
```

Cela uploadera automatiquement le dernier build sur App Store Connect.

---

## 🔍 Vérifier les Informations du Build

### Dans Expo.dev

Sur la page du build, vous verrez :

- **Build ID** : Identifiant unique
- **Version** : 1.0.0
- **Build Number** : 3
- **Bundle ID** : com.fitariki.covoiturage
- **Status** : Finished / In Progress / Failed
- **Date** : Date et heure
- **Durée** : Temps de build

### Via Commande

```bash
# Voir les détails d'un build spécifique
eas build:view [BUILD_ID]

# Voir l'historique
eas build:list --platform ios
```

---

## 📋 Checklist

- [ ] Build terminé (status: Finished)
- [ ] Email reçu avec le lien
- [ ] Build trouvé sur https://expo.dev
- [ ] Fichier `.ipa` téléchargé
- [ ] Build uploadé sur App Store Connect (si auto-submit)
- [ ] Version et build number corrects (1.0.0 - 3)

---

## 🎯 Commandes Utiles

```bash
# Voir l'historique des builds iOS
eas build:list --platform ios

# Voir les détails du dernier build
eas build:list --platform ios --limit 1

# Voir les détails d'un build spécifique
eas build:view [BUILD_ID]

# Soumettre le dernier build sur App Store Connect
eas submit --platform ios --latest

# Voir les soumissions
eas submit:list --platform ios
```

---

## 📱 Informations de Votre Build Actuel

D'après votre configuration :

- **Version** : 1.0.0
- **Build Number** : 3
- **Bundle ID** : com.fitariki.covoiturage
- **Platform** : iOS

Ces informations apparaîtront sur la page du build dans Expo.dev.

---

## 🆘 Si Vous Ne Trouvez Pas le Build

### Vérification 1 : Vérifier le Compte

```bash
eas whoami
```

Assurez-vous d'être connecté avec le bon compte.

### Vérification 2 : Vérifier le Projet

```bash
eas build:list --platform ios
```

Cela liste tous vos builds iOS.

### Vérification 3 : Vérifier l'Email

Vérifiez votre boîte email (y compris les spams) pour le lien du build.

---

**Une fois le build terminé, allez sur https://expo.dev et vous le trouverez facilement ! 🚀**

