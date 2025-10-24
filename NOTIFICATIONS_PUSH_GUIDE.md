# 📱 Guide Complet : Notifications Push

## 🎯 Qu'est-ce qui a été implémenté ?

Un système complet de notifications push a été créé pour que **les conducteurs reçoivent des notifications en temps réel** quand :

1. ✅ Un client **réserve** leur trajet
2. ✅ Un client fait une **offre de prix** pour leur trajet
3. ✅ Un client fait une **contre-offre** dans une négociation

Les passagers reçoivent aussi des notifications quand :
- ✅ Leur réservation est **confirmée** ou **refusée**
- ✅ Leur négociation est **acceptée**
- ✅ Ils reçoivent une **contre-offre**

---

## 🚀 Démarrage Rapide

### Étape 1 : Déployer le Backend

Le backend doit être déployé sur **Render** ou accessible depuis votre téléphone.

```bash
cd backend
npm install
npm run build
npm start
```

### Étape 2 : Démarrer l'Application Mobile

```bash
cd covoiturage-app
npm install
npx expo start
```

### Étape 3 : Tester sur un Appareil Physique

⚠️ **IMPORTANT** : Les notifications push fonctionnent **UNIQUEMENT sur un appareil physique** (Android ou iOS). L'émulateur ne peut pas recevoir de notifications push.

1. Ouvrez **Expo Go** sur votre téléphone
2. Scannez le QR code
3. Acceptez les **permissions pour les notifications** quand demandé

---

## 📝 Scénario de Test

### Préparation

Vous avez besoin de **2 comptes** :
- **Compte Conducteur** : Créera un trajet
- **Compte Passager** : Réservera ou fera une offre

### Test 1 : Réservation Directe

1. **Conducteur** :
   - Connectez-vous
   - Créez un trajet avec **prix fixe** (ex: 500 DA)
   - **Fermez ou minimisez l'application**

2. **Passager** :
   - Connectez-vous avec un autre compte
   - Recherchez le trajet du conducteur
   - Cliquez sur **"Réserver maintenant"**
   - Choisissez le nombre de places
   - Confirmez

3. **✅ Résultat Attendu** :
   ```
   📱 Le conducteur reçoit une notification :
   
   🎉 Nouvelle réservation !
   [Nom] a réservé 1 place(s) pour 
   Alger → Oran - 500 DA
   ```

### Test 2 : Offre de Négociation

1. **Conducteur** :
   - Créez un trajet avec **prix négociable** (ex: 600 DA)
   - **Fermez ou minimisez l'application**

2. **Passager** :
   - Recherchez le trajet
   - Cliquez sur **"Faire une offre"**
   - Proposez un prix (ex: 500 DA)
   - Ajoutez un message (optionnel)
   - Envoyez

3. **✅ Résultat Attendu** :
   ```
   📱 Le conducteur reçoit une notification :
   
   💰 Nouvelle offre de prix
   [Nom] propose 500 DA pour 
   Alger → Oran
   ```

### Test 3 : Contre-Offre

1. **Conducteur** :
   - Ouvrez l'application
   - Allez dans l'onglet **"Négociations"**
   - Cliquez sur la négociation
   - Faites une contre-offre (ex: 550 DA)
   - Envoyez

2. **✅ Résultat Attendu** :
   ```
   📱 Le passager reçoit une notification :
   
   🔄 Nouvelle contre-offre
   [Nom conducteur] propose 550 DA pour 
   Alger → Oran
   ```

---

## 🔍 Vérification

### Dans les Logs du Frontend

Quand l'application démarre, vous devriez voir :

```
✅ Permission accordée pour les notifications
📱 Push token obtenu: ExponentPushToken[xxxxxxxxxxxxxx]
✅ Push token enregistré sur le serveur
✅ Canaux de notifications Android configurés
✅ Notifications push initialisées avec le token: ExponentPushToken[...]
```

### Dans les Logs du Backend

Quand une notification est envoyée :

```
📱 Nouveau token enregistré pour l'utilisateur [userId]
✅ Notification envoyée avec succès à l'utilisateur [userId]
📱 Notification envoyée au conducteur [driverId]
```

---

## ❌ Problèmes Courants

### Problème 1 : Pas de notification reçue

**Causes possibles :**
- ❌ Vous testez sur l'**émulateur** → Utilisez un appareil physique
- ❌ Les **permissions** sont refusées → Réinstallez l'app et acceptez
- ❌ Le **backend n'est pas accessible** → Vérifiez l'URL dans `config.ts`
- ❌ Le token n'est pas enregistré → Vérifiez les logs

**Solution :**
```bash
# Dans covoiturage-app/config.ts
export const USE_PRODUCTION = true; # Pour utiliser le backend Render
```

### Problème 2 : Erreur "Project ID non trouvé"

Le Project ID est déjà configuré dans `app.json`. Si l'erreur persiste :

```json
// Vérifiez dans covoiturage-app/app.json
"extra": {
  "eas": {
    "projectId": "6d6546c5-fae9-436f-9370-5145b035358d"
  }
}
```

### Problème 3 : Permission refusée

Si vous avez refusé la permission par erreur :

1. **Android** :
   - Paramètres → Apps → Expo Go → Autorisations → Notifications → **Autoriser**

2. Ou réinstallez l'application :
   ```bash
   # Désinstaller Expo Go
   # Réinstaller depuis Play Store
   # Relancer l'app
   ```

---

## 🎨 Personnalisation

### Modifier les Messages de Notification

Les messages sont définis dans `backend/src/services/notification.service.ts` :

```typescript
// Exemple : Notification de nouvelle réservation
export const notifyDriverNewBooking = async (
  driverId: string,
  passengerName: string,
  tripDetails: string,
  seats: number,
  price: number
) => {
  const title = '🎉 Nouvelle réservation !';
  const body = `${passengerName} a réservé ${seats} place(s) pour ${tripDetails} - ${price} DA`;
  // ...
};
```

### Ajouter un Nouveau Type de Notification

1. **Backend** - Créer la fonction dans `notification.service.ts` :

```typescript
export const notifyTripStartingSoon = async (
  userId: string,
  tripDetails: string,
  minutesUntilStart: number
) => {
  const title = '⏰ Départ imminent !';
  const body = `Votre trajet ${tripDetails} démarre dans ${minutesUntilStart} minutes`;
  
  await sendPushNotification(userId, title, body, {
    type: 'trip_reminder',
    minutesUntilStart,
  });
};
```

2. **Frontend** - Gérer l'action dans `use-push-notifications.ts` :

```typescript
switch (data.type) {
  case 'trip_reminder':
    console.log('➡️ Navigation vers les détails du trajet...');
    // TODO: Naviguer vers l'écran approprié
    break;
  // ...
}
```

---

## 📊 Statistiques

Le système envoie actuellement **6 types de notifications** :

| Type | Émoji | Destinataire | Déclencheur |
|------|-------|--------------|-------------|
| Nouvelle réservation | 🎉 | Conducteur | Passager réserve |
| Nouvelle offre | 💰 | Conducteur | Passager fait une offre |
| Contre-offre | 🔄 | Conducteur/Passager | Contre-proposition |
| Réservation confirmée | ✅ | Passager | Conducteur accepte |
| Réservation refusée | ❌ | Passager | Conducteur refuse |
| Négociation acceptée | 🎉 | Les deux | Acceptation |

---

## 🔐 Sécurité

- ✅ Les tokens sont stockés de manière sécurisée dans MongoDB
- ✅ Les tokens invalides sont automatiquement supprimés
- ✅ Les tokens sont supprimés à la déconnexion
- ✅ Seuls les utilisateurs authentifiés peuvent enregistrer des tokens
- ✅ Un utilisateur peut avoir plusieurs tokens (plusieurs appareils)

---

## 🧪 Test Manuel avec l'Outil Expo

Vous pouvez tester manuellement les notifications :

1. Récupérez votre token depuis les logs :
   ```
   📱 Push token obtenu: ExponentPushToken[xxxxxxxxxxxxxx]
   ```

2. Allez sur : https://expo.dev/notifications

3. Collez votre token et envoyez une notification de test

4. Vous devriez la recevoir instantanément !

---

## 📱 Compatibilité

- ✅ **Android** : Fonctionne parfaitement (testé)
- ✅ **iOS** : Fonctionne avec un compte Apple Developer
- ⚠️ **Émulateur** : Ne fonctionne PAS (limitation Expo)

---

## 🎉 C'est Tout !

Le système est **prêt à l'emploi**. Les conducteurs recevront maintenant des notifications instantanées quand des passagers s'intéressent à leurs trajets.

### Checklist Finale

- [x] Backend compilé sans erreurs
- [x] Frontend installé avec les dépendances
- [x] Permissions configurées dans app.json
- [x] Service de notifications créé
- [x] Hooks React créés
- [x] Routes API créées
- [x] Controllers modifiés
- [x] Documentation complète

**🚀 Lancez l'app et testez !**

