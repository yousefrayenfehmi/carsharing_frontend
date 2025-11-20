# 📱 Guide : Trouver Votre Build dans App Store Connect

## 🎯 Accéder à App Store Connect

### Étape 1 : Se Connecter

1. Allez sur : **https://appstoreconnect.apple.com**
2. **Connectez-vous** avec votre compte Apple Developer
   - Utilisez le même compte que celui configuré dans `eas.json`

### Étape 2 : Vérifier Votre Compte

Assurez-vous d'être connecté avec le compte qui a :
- ✅ Un abonnement Apple Developer actif (99 USD/an)
- ✅ Les droits d'accès à l'app **FITARIKI**

---

## 📍 Trouver Votre App

### Méthode 1 : Via le Menu Principal

1. Dans App Store Connect, cliquez sur **"Mes Apps"** (My Apps) dans le menu de gauche
2. Vous verrez la liste de toutes vos apps
3. **Cliquez sur "FITARIKI"** (ou le nom de votre app)

### Méthode 2 : Via la Recherche

1. Utilisez la barre de recherche en haut
2. Tapez **"FITARIKI"** ou **"covoiturage"**
3. Cliquez sur votre app dans les résultats

---

## 🔍 Voir les Builds Soumis

### Étape 1 : Aller dans TestFlight

Une fois dans votre app **FITARIKI** :

1. Cliquez sur l'onglet **"TestFlight"** dans le menu horizontal
2. Vous verrez deux sections :
   - **iOS Builds** : Builds iOS soumis
   - **Internal Testing** : Tests internes
   - **External Testing** : Tests externes

### Étape 2 : Voir les Builds iOS

Dans la section **"iOS Builds"** :

- Vous verrez tous les builds soumis avec :
  - 📦 **Version** : 1.0.0
  - 🔢 **Build** : 3 (votre build number)
  - 📅 **Date de soumission**
  - ⏱️ **Statut** : Processing / Ready to Test / Expired

---

## 📊 Statuts des Builds

### Statuts Possibles

1. **Processing** (En traitement)
   - ⏳ Le build est en cours de traitement par Apple
   - ⏱️ Durée : 10-30 minutes
   - ⚠️ Ne peut pas être testé pour le moment

2. **Ready to Test** (Prêt à tester)
   - ✅ Le build est prêt
   - ✅ Peut être ajouté à TestFlight
   - ✅ Peut être testé

3. **Expired** (Expiré)
   - ⏰ Le build a expiré (90 jours)
   - ❌ Ne peut plus être utilisé
   - 🔄 Besoin d'un nouveau build

4. **Missing Compliance** (Conformité manquante)
   - ⚠️ Besoin de répondre aux questions d'exportation
   - 📝 Cliquez sur "Provide Export Compliance Information"

---

## 🧪 Utiliser TestFlight

### Ajouter des Testeurs Internes

1. Dans **TestFlight**, allez dans **"Internal Testing"**
2. Cliquez sur **"+"** pour ajouter un groupe
3. **Nommez le groupe** (ex: "Équipe de développement")
4. **Ajoutez les emails** des testeurs
5. **Sélectionnez le build** (version 1.0.0 - Build 3)
6. **Activez le groupe**

### Ajouter des Testeurs Externes

1. Dans **TestFlight**, allez dans **"External Testing"**
2. Cliquez sur **"+"** pour créer un groupe externe
3. **Nommez le groupe**
4. **Ajoutez les emails** des testeurs externes
5. **Sélectionnez le build**
6. **Soumettez pour révision** (première fois uniquement)

---

## 📱 Installer via TestFlight

### Pour les Testeurs

1. **Installez TestFlight** depuis l'App Store (si pas déjà installé)
2. **Ouvrez l'email d'invitation** TestFlight
3. **Cliquez sur "View in TestFlight"** ou **"Start Testing"**
4. **Acceptez l'invitation**
5. **Téléchargez l'app** depuis TestFlight

### Lien Direct

Les testeurs peuvent aussi utiliser le lien direct :
```
https://testflight.apple.com/join/[CODE_INVITATION]
```

---

## 🚀 Soumettre pour l'App Store

### Étape 1 : Aller dans App Store

1. Dans votre app **FITARIKI**, cliquez sur l'onglet **"App Store"**
2. Cliquez sur **"1.0 Prepare for Submission"** (ou la version active)

### Étape 2 : Sélectionner le Build

1. Dans la section **"Build"**, cliquez sur **"Select a build before you submit your app"**
2. **Sélectionnez le build** : Version 1.0.0 - Build 3
3. Le build apparaîtra dans la section

### Étape 3 : Vérifier les Informations

Assurez-vous que tout est complété :
- ✅ **Screenshots** : Captures d'écran requises
- ✅ **Description** : Description de l'app
- ✅ **Keywords** : Mots-clés
- ✅ **Support URL** : URL de support
- ✅ **Privacy Policy URL** : URL de politique de confidentialité
- ✅ **Build** : Build sélectionné

### Étape 4 : Soumettre

1. Cliquez sur **"Submit for Review"** en haut à droite
2. **Répondez aux questions** de conformité
3. **Confirmez la soumission**

---

## 🔍 Vérifier le Statut de Soumission

### Dans App Store Connect

1. Allez dans **"App Store"** > **"App Information"**
2. Regardez le statut :
   - **Waiting for Review** : En attente de révision
   - **In Review** : En cours de révision
   - **Pending Developer Release** : Approuvé, en attente de publication
   - **Ready for Sale** : Disponible sur l'App Store
   - **Rejected** : Rejeté (voir les raisons)

---

## 📋 Checklist pour Trouver Votre Build

- [ ] Connecté à https://appstoreconnect.apple.com
- [ ] App **FITARIKI** trouvée dans "Mes Apps"
- [ ] Onglet **TestFlight** ouvert
- [ ] Build **1.0.0 (3)** visible dans "iOS Builds"
- [ ] Statut du build vérifié (Processing / Ready to Test)
- [ ] Build ajouté à TestFlight (si nécessaire)
- [ ] Build sélectionné pour soumission App Store (si nécessaire)

---

## 🆘 Problèmes Courants

### Build Non Visible

**Problème** : Le build n'apparaît pas dans App Store Connect

**Solutions** :
1. Vérifiez que le build est terminé dans Expo.dev
2. Vérifiez que `eas submit` a été exécuté avec succès
3. Attendez 5-10 minutes (délai de synchronisation)
4. Vérifiez que vous utilisez le bon compte Apple Developer

### Build en "Processing"

**Problème** : Le build reste en "Processing" pendant longtemps

**Solutions** :
1. Attendez 30-60 minutes (normal pour le premier build)
2. Vérifiez les emails d'Apple pour des erreurs
3. Vérifiez que le build n'a pas échoué dans Expo.dev

### Build "Missing Compliance"

**Problème** : Le build nécessite des informations de conformité

**Solutions** :
1. Cliquez sur **"Provide Export Compliance Information"**
2. Répondez aux questions :
   - **Does your app use encryption?** → Généralement **"No"**
   - Si vous avez configuré `ITSAppUsesNonExemptEncryption: false` dans `app.json`, la réponse est **"No"**

---

## 🔗 Liens Utiles

- **App Store Connect** : https://appstoreconnect.apple.com
- **Apple Developer** : https://developer.apple.com
- **TestFlight** : https://testflight.apple.com
- **Expo.dev** : https://expo.dev

---

## 📱 Informations de Votre App

D'après votre configuration :

- **Nom de l'App** : FITARIKI
- **Bundle ID** : com.fitariki.covoiturage
- **Version** : 1.0.0
- **Build Number** : 3

Ces informations doivent correspondre dans App Store Connect.

---

## 🎯 Résumé Rapide

1. **Allez sur** : https://appstoreconnect.apple.com
2. **Cliquez sur** : "Mes Apps" → "FITARIKI"
3. **Onglet** : "TestFlight"
4. **Section** : "iOS Builds"
5. **Trouvez** : Version 1.0.0 - Build 3

**C'est là que vous trouverez votre build ! 🚀**

