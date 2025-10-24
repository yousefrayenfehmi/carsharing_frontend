# 📱 Commandes pour Créer APK

## Première fois uniquement :

```bash
npm install -g eas-cli
eas login
```

## À chaque fois que vous voulez un APK :

```bash
cd covoiturage-app
eas build -p android --profile preview
```

**C'est tout !**

Attendez 15-20 minutes, vous recevrez un lien pour télécharger l'APK.

---

## Autres commandes utiles :

```bash
# Voir l'historique des builds
eas build:list

# Build de production
eas build -p android --profile production

# Annuler un build
eas build:cancel
```

