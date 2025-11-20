# 🍎 Guide : Publier FITARIKI sur l'App Store (iOS)

## 📋 Vue d'ensemble

Ce guide vous explique comment publier votre application FITARIKI sur l'App Store d'Apple.

**Durée estimée** : 2-3 heures (sans compter le temps de révision Apple)

**Coûts** :
- Compte Apple Developer : **99 USD/an** (obligatoire)
- EAS Build : **Gratuit** (avec limitations) ou **Payant** (plans disponibles)

---

## 🎯 ÉTAPE 1 : Prérequis

### 1.1 Compte Apple Developer

1. Allez sur : https://developer.apple.com
2. Cliquez sur **Enroll** (S'inscrire)
3. **Frais** : 99 USD/an
4. Remplissez vos informations et payez
5. ⏱️ **Délai** : 24-48h pour l'approbation

### 1.2 Vérifier la Configuration Actuelle

Votre configuration dans `app.json` :
- ✅ **Nom** : FITARIKI
- ✅ **Bundle ID** : `com.fitariki.covoiturage`
- ✅ **Version** : 1.0.0
- ✅ **Build Number** : 1

Votre configuration dans `eas.json` :
- ✅ **Apple ID** : admin@lowxy.fr
- ✅ **ASC App ID** : 6754519037
- ✅ **Apple Team ID** : 5KGLPRWSFB

✅ **Tout est déjà configuré !**

---

## 🔨 ÉTAPE 2 : Préparer l'Application

### 2.1 Vérifier l'URL de l'API

Assurez-vous que l'URL du backend est correcte dans `config.ts` :
```typescript
export const PRODUCTION_API_URL = ENV_API_URL ?? 'http://37.59.126.29:3000/api';
```

✅ **Déjà configuré !**

### 2.2 Mettre à jour la Version (si nécessaire)

Si vous avez déjà publié une version, incrémentez :

**Dans `app.json`** :
```json
{
  "expo": {
    "version": "1.0.1",  // Incrémentez la version
    "ios": {
      "buildNumber": "2"  // Incrémentez le build number
    }
  }
}
```

### 2.3 Préparer les Assets

Assurez-vous d'avoir :
- ✅ Icône : `./assets/images/fitriqi.png` (1024x1024px)
- ⚠️ Screenshots iOS (requis pour App Store) :
  - iPhone 6.7" (iPhone 14 Pro Max) : 1290x2796px
  - iPhone 6.5" (iPhone 11 Pro Max) : 1242x2688px
  - iPhone 5.5" (iPhone 8 Plus) : 1242x2208px
  - iPad Pro 12.9" : 2048x2732px
- ⚠️ Description de l'application
- ⚠️ Politique de confidentialité (URL requise)

---

## 🚀 ÉTAPE 3 : Installer EAS CLI

### 3.1 Installation Globale

```bash
npm install -g eas-cli
```

### 3.2 Vérifier l'Installation

```bash
eas --version
```

---

## 🔐 ÉTAPE 4 : Se Connecter à EAS

### 4.1 Connexion

```bash
cd covoiturage-app
eas login
```

Entrez vos identifiants Expo. Si vous n'avez pas de compte :
1. Allez sur : https://expo.dev
2. Créez un compte gratuit
3. Revenez et exécutez `eas login`

### 4.2 Vérifier la Connexion

```bash
eas whoami
```

---

## 📱 ÉTAPE 5 : Créer l'Application sur App Store Connect

### 5.1 Accéder à App Store Connect

1. Allez sur : https://appstoreconnect.apple.com
2. Connectez-vous avec votre Apple ID (celui du compte développeur)
3. Cliquez sur **Mes Apps**

### 5.2 Créer une Nouvelle Application

1. Cliquez sur le bouton **+** (en haut à gauche)
2. Remplissez les informations :
   - **Nom** : FITARIKI
   - **Langue principale** : Français
   - **Bundle ID** : `com.fitariki.covoiturage`
   - **SKU** : `fitariki-ios-001` (identifiant unique)
   - **Type d'application** : Application
3. Cliquez sur **Créer**

### 5.3 Noter l'ASC App ID

Une fois créée, notez l'**ASC App ID** (ex: 6754519037) - vous l'avez déjà dans `eas.json` ✅

---

## 🏗️ ÉTAPE 6 : Générer le Build iOS

### 6.1 Option A : Build avec Upload Automatique (Recommandé)

```bash
cd covoiturage-app
eas build --platform ios --profile production --auto-submit
```

Cette commande va :
1. Générer le build iOS (20-30 minutes)
2. Uploader automatiquement sur App Store Connect
3. Vous demander vos identifiants Apple si nécessaire

### 6.2 Option B : Build Manuel

```bash
cd covoiturage-app
eas build --platform ios --profile production
```

Puis, une fois le build terminé :

```bash
eas submit --platform ios --latest
```

### 6.3 Suivre le Progrès

Pendant le build, vous pouvez :
- Voir les logs en temps réel dans le terminal
- Aller sur https://expo.dev pour voir le statut
- Vous recevrez un email à la fin

⏱️ **Durée** : 20-30 minutes

---

## 📝 ÉTAPE 7 : Configurer les Métadonnées sur App Store Connect

### 7.1 Informations de l'Application

Allez sur App Store Connect > FITARIKI > **Informations de l'application**

Remplissez :

**Nom** : FITARIKI

**Sous-titre** (30 caractères max) :
```
Covoiturage en Algérie
```

**Catégorie principale** : Transport

**Catégorie secondaire** : Voyage

**URL de la politique de confidentialité** :
```
https://votre-site.com/privacy-policy
```
⚠️ **Important** : Cette URL doit être accessible et contenir votre politique de confidentialité.

**URL de support** :
```
https://votre-site.com/support
```

### 7.2 Description

**Description courte** (170 caractères max) :
```
Partagez vos trajets en Algérie. Économique, écologique et convivial ! Trouvez ou proposez un covoiturage facilement.
```

**Description complète** :
```
FITARIKI - Votre plateforme de covoiturage en Algérie

🚗 TROUVEZ UN TRAJET
Recherchez des trajets disponibles entre les villes algériennes. Filtrez par date, prix et nombre de places disponibles.

👥 PROPOSEZ UN TRAJET
Partagez votre trajet et remplissez votre voiture. Gagnez de l'argent tout en aidant d'autres personnes à voyager.

💰 PRIX NÉGOCIABLES
Négociez le prix directement avec le conducteur pour trouver un arrangement qui convient à tous.

⭐ SYSTÈME DE NOTATION
Notez et commentez vos expériences pour une communauté de confiance.

🔔 NOTIFICATIONS EN TEMPS RÉEL
Recevez des notifications instantanées pour vos réservations et négociations.

📍 GÉOLOCALISATION
Trouvez des trajets à proximité grâce à la géolocalisation.

FITARIKI - Voyagez ensemble, voyagez mieux !
```

### 7.3 Mots-clés

**Mots-clés** (100 caractères max, séparés par des virgules) :
```
covoiturage,Algérie,transport,voyage,partage,trajet,économie,écologie
```

### 7.4 Captures d'Écran

**Obligatoires** :
- iPhone 6.7" (iPhone 14 Pro Max) : Minimum 1, maximum 10
- iPhone 6.5" (iPhone 11 Pro Max) : Minimum 1, maximum 10
- iPhone 5.5" (iPhone 8 Plus) : Minimum 1, maximum 10

**Optionnelles** :
- iPad Pro 12.9" : Maximum 10

**Conseils** :
- Montrez les fonctionnalités principales
- Utilisez des captures d'écran réelles de l'app
- Format PNG ou JPEG
- Pas de bordures ou de cadres

### 7.5 Aperçu de l'Application (Optionnel mais Recommandé)

Vous pouvez ajouter une vidéo de démonstration (30 secondes max) montrant l'application en action.

---

## ✅ ÉTAPE 8 : Préparer la Soumission

### 8.1 Informations de Tarification

1. Allez dans **Tarification et disponibilité**
2. Sélectionnez **Gratuit**
3. Choisissez les pays où l'app sera disponible (par défaut : tous)

### 8.2 Informations d'Âge

1. Allez dans **Informations d'âge**
2. Répondez aux questions sur le contenu
3. Généralement pour une app de covoiturage : **4+** ou **12+**

### 8.3 Informations de Build

1. Allez dans **Version iOS**
2. Sélectionnez le build que vous avez uploadé
3. Si aucun build n'apparaît, attendez quelques minutes (Apple doit le traiter)

---

## 🚀 ÉTAPE 9 : Soumettre pour Révision

### 9.1 Vérification Finale

Avant de soumettre, vérifiez :

- [ ] Toutes les métadonnées sont remplies
- [ ] Les captures d'écran sont uploadées
- [ ] La politique de confidentialité est accessible
- [ ] Le build est sélectionné
- [ ] Les informations de contact sont correctes

### 9.2 Soumettre

1. Cliquez sur **Soumettre pour révision** (en haut à droite)
2. Répondez aux questions de conformité
3. Confirmez la soumission

---

## ⏱️ ÉTAPE 10 : Attendre la Révision

### 10.1 Délais

- **Première révision** : 24-48 heures
- **Révisions suivantes** : 24-48 heures

### 10.2 Statuts Possibles

- **En attente de révision** : Votre app est en file d'attente
- **En révision** : Apple examine votre app
- **En attente de publication** : Approuvée, en attente de publication
- **Rejetée** : Des corrections sont nécessaires
- **Prête à vendre** : Disponible sur l'App Store ! 🎉

### 10.3 Notifications

Vous recevrez un email à chaque changement de statut.

---

## 🔄 ÉTAPE 11 : Mettre à Jour l'Application

Quand vous voulez publier une nouvelle version :

### 11.1 Mettre à jour la Version

**Dans `app.json`** :
```json
{
  "expo": {
    "version": "1.0.1",  // Nouvelle version
    "ios": {
      "buildNumber": "2"  // Nouveau build number
    }
  }
}
```

### 11.2 Générer un Nouveau Build

```bash
eas build --platform ios --profile production --auto-submit
```

### 11.3 Soumettre la Mise à Jour

1. Allez sur App Store Connect
2. Créez une nouvelle version
3. Sélectionnez le nouveau build
4. Ajoutez les notes de version
5. Soumettez pour révision

---

## 🛠️ Commandes Utiles

```bash
# Se connecter à EAS
eas login

# Vérifier la connexion
eas whoami

# Générer un build iOS de production
eas build --platform ios --profile production

# Générer un build avec upload automatique
eas build --platform ios --profile production --auto-submit

# Soumettre manuellement
eas submit --platform ios --latest

# Voir l'historique des builds
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]

# Voir les soumissions
eas submit:list
```

---

## 🆘 Problèmes Courants

### Erreur : Bundle ID déjà utilisé

**Solution** : Changez le Bundle ID dans `app.json` :
```json
"ios": {
  "bundleIdentifier": "com.fitariki.covoiturage.v2"
}
```

### Build échoue

**Solution** :
```bash
# Nettoyer et rebuilder
rm -rf node_modules
npm install
eas build --platform ios --profile production --clear-cache
```

### Build uploadé mais pas visible sur App Store Connect

**Solution** :
- Attendez 5-10 minutes (Apple doit traiter le build)
- Vérifiez que le Bundle ID correspond
- Vérifiez les emails d'erreur d'Apple

### Erreur : Certificats expirés

**Solution** :
```bash
# EAS va régénérer automatiquement les certificats
eas build --platform ios --profile production
```

### App rejetée : Politique de confidentialité manquante

**Solution** :
1. Créez une page de politique de confidentialité sur votre site
2. Ajoutez l'URL dans App Store Connect > Informations de l'application

### App rejetée : Captures d'écran manquantes

**Solution** :
- Prenez des captures d'écran réelles de l'app
- Utilisez les bonnes dimensions (voir section 7.4)
- Uploadez au moins 1 capture pour chaque taille requise

---

## 📋 Checklist Complète

### Avant le Build

- [ ] Compte Apple Developer actif (99 USD/an payé)
- [ ] Application créée sur App Store Connect
- [ ] Bundle ID configuré dans `app.json`
- [ ] Version et build number incrémentés
- [ ] URL de l'API configurée correctement
- [ ] EAS CLI installé et connecté

### Avant la Soumission

- [ ] Build généré et uploadé
- [ ] Métadonnées complètes (nom, description, etc.)
- [ ] Captures d'écran uploadées (minimum requis)
- [ ] Politique de confidentialité accessible en ligne
- [ ] Informations de contact correctes
- [ ] Catégories sélectionnées
- [ ] Mots-clés définis
- [ ] Informations d'âge complétées
- [ ] Build sélectionné dans la version

### Après la Soumission

- [ ] Email de confirmation reçu
- [ ] Statut "En attente de révision" visible
- [ ] Surveiller les emails d'Apple
- [ ] Prêt à répondre aux questions d'Apple si nécessaire

---

## 📞 Support

### Ressources

- **App Store Connect** : https://appstoreconnect.apple.com
- **Apple Developer** : https://developer.apple.com
- **EAS Documentation** : https://docs.expo.dev/build/introduction/
- **App Store Review Guidelines** : https://developer.apple.com/app-store/review/guidelines/

### Contact

- **EAS Support** : support@expo.dev
- **Apple Developer Support** : Via App Store Connect

---

## 🎉 Félicitations !

Une fois votre application approuvée, elle sera disponible sur l'App Store dans les 24 heures !

**Lien de l'App Store** (après publication) :
```
https://apps.apple.com/app/fitariki/id[APP_ID]
```

---

## 📝 Notes Importantes

1. **Première publication** : Peut prendre plus de temps (Apple vérifie plus strictement)
2. **Mises à jour** : Généralement plus rapides (24-48h)
3. **Rejets** : Ne paniquez pas, corrigez et resoumettez
4. **TestFlight** : Vous pouvez tester votre app avec TestFlight avant la publication publique

---

**Bon courage pour votre publication ! 🚀**


