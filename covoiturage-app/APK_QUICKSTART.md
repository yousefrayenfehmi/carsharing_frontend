# 🚀 Créer un APK en 5 Minutes

## ⚡ Méthode Ultra-Rapide (EAS Build)

### Étape 1 : Installation (1 minute)

```bash
npm install -g eas-cli
```

### Étape 2 : Connexion (1 minute)

```bash
eas login
```

Créez un compte gratuit sur https://expo.dev si nécessaire.

### Étape 3 : Configuration (1 minute)

```bash
cd covoiturage-app
eas build:configure
```

Répondez "Yes" aux questions.

### Étape 4 : Build (1 minute de votre temps + 15 min de build)

```bash
# APK de test
eas build -p android --profile preview

# Ou APK de production
eas build -p android --profile production
```

### Étape 5 : Télécharger

- Attendez l'email avec le lien
- Ou allez sur https://expo.dev → Votre projet → Builds
- Téléchargez l'APK

---

## 📱 Installer sur Android

1. Envoyez l'APK sur votre téléphone
2. Ouvrez-le
3. Autorisez "Sources inconnues" si demandé
4. Installez !

---

## 🎯 C'est Tout !

Votre application est prête à être installée sur n'importe quel Android ! 🎉

---

## 📚 Pour Plus de Détails

Consultez `GUIDE_BUILD_APK.md` pour :
- Build local
- Publication sur Google Play
- Optimisations
- Dépannage


