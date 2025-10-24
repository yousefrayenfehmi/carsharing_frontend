# 📱 Système de Notifications Push

## 🎯 Vue d'ensemble

Un système complet de notifications push a été implémenté pour informer **les conducteurs** en temps réel lorsqu'un client réserve ou fait une offre pour leur trajet.

---

## ✨ Fonctionnalités Implémentées

### 📢 Notifications pour le Conducteur

1. **Nouvelle réservation** 🎉
   - Notification envoyée immédiatement quand un passager réserve un trajet
   - Affiche le nom du passager, le nombre de places, et le prix

2. **Nouvelle offre de négociation** 💰
   - Notification envoyée quand un passager propose un prix pour un trajet négociable
   - Affiche le nom du passager et le prix proposé

3. **Contre-offre** 🔄
   - Notification envoyée lors d'une contre-proposition dans une négociation
   - Fonctionne dans les deux sens (conducteur ↔ passager)

### 📢 Notifications pour le Passager

1. **Réservation confirmée** ✅
   - Notification quand le conducteur accepte la réservation

2. **Réservation refusée** ❌
   - Notification quand le conducteur refuse la réservation

3. **Négociation acceptée** 🎉
   - Notification quand le conducteur ou le passager accepte le prix négocié

---

## 🏗️ Architecture

### Backend

#### 1. **Modèle `PushToken`** (`backend/src/models/PushToken.ts`)
```typescript
{
  user: ObjectId,           // Référence vers l'utilisateur
  token: string,            // Token Expo Push
  deviceType: 'ios' | 'android' | 'web',
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **Service de Notifications** (`backend/src/services/notification.service.ts`)

Fonctions principales :
- `sendPushNotification()` - Envoi générique de notifications
- `notifyDriverNewBooking()` - Nouvelle réservation pour le conducteur
- `notifyDriverNewNegotiation()` - Nouvelle offre pour le conducteur
- `notifyPassengerBookingConfirmed()` - Confirmation pour le passager
- `notifyPassengerBookingRejected()` - Refus pour le passager
- `notifyCounterOffer()` - Contre-offre dans une négociation
- `notifyNegotiationAccepted()` - Négociation acceptée
- `registerPushToken()` - Enregistrer un token
- `unregisterPushToken()` - Supprimer un token

#### 3. **Controllers Modifiés**

**`booking.controller.ts`**
- `createBooking` → Notifie le conducteur lors d'une nouvelle réservation
- `confirmBooking` → Notifie le passager quand confirmée

**`negotiation.controller.ts`**
- `createNegotiation` → Notifie le conducteur d'une nouvelle offre
- `counterOffer` → Notifie l'autre partie d'une contre-offre
- `acceptNegotiation` → Notifie les deux parties de l'acceptation

#### 4. **Routes API** (`backend/src/routes/push-token.routes.ts`)
```
POST   /api/push-tokens              # Enregistrer un token
DELETE /api/push-tokens/:token       # Supprimer un token
```

### Frontend

#### 1. **Service de Notifications** (`covoiturage-app/services/notification.service.ts`)

Fonctions principales :
- `initializeNotifications()` - Configuration complète au démarrage
- `requestNotificationPermissions()` - Demander les permissions
- `getPushToken()` - Obtenir le token Expo Push
- `registerPushToken()` - Enregistrer le token sur le serveur
- `unregisterPushToken()` - Supprimer le token du serveur
- `setupNotificationChannel()` - Configurer les canaux Android

#### 2. **Hook React** (`covoiturage-app/hooks/use-push-notifications.ts`)

```typescript
const { expoPushToken, notification } = usePushNotifications();
```

- Initialise automatiquement les notifications au démarrage
- Gère les listeners pour les notifications reçues
- Gère les interactions avec les notifications (tap)
- Nettoie les ressources lors de la déconnexion

#### 3. **Intégration dans `_layout.tsx`**

Le hook `usePushNotifications()` est appelé dans le composant racine pour :
- Demander les permissions au démarrage
- Obtenir et enregistrer le token push
- Écouter les notifications en temps réel

---

## 🚀 Installation & Configuration

### 1. Backend

Le backend est déjà configuré ! Les dépendances sont installées :

```bash
cd backend
npm install  # expo-server-sdk est déjà installé
```

### 2. Frontend

Les dépendances sont déjà installées :

```bash
cd covoiturage-app
# expo-notifications, expo-device, expo-constants sont déjà installés
```

### 3. Configuration `app.json`

Le fichier est déjà configuré avec :
- ✅ Project ID EAS
- ✅ Permissions Android (RECEIVE_BOOT_COMPLETED, VIBRATE)
- ✅ Configuration des notifications

---

## 🧪 Comment Tester

### Prérequis

⚠️ **IMPORTANT** : Les notifications push fonctionnent **uniquement sur un appareil physique**. L'émulateur ne peut pas recevoir de vraies notifications push.

### Étape 1 : Démarrer le Backend

```bash
cd backend
npm run dev
```

Le backend doit être déployé sur Render ou accessible depuis votre téléphone.

### Étape 2 : Démarrer le Frontend

```bash
cd covoiturage-app
npx expo start
```

### Étape 3 : Se Connecter

1. Ouvrez l'app sur votre téléphone physique
2. Connectez-vous avec deux comptes différents :
   - **Compte A** : Conducteur (créera un trajet)
   - **Compte B** : Passager (réservera le trajet)

### Étape 4 : Accepter les Permissions

Au premier lancement, l'app demandera :
- ✅ **Permission pour les notifications**

Acceptez pour permettre l'envoi de notifications.

### Étape 5 : Tester les Scénarios

#### Scénario 1 : Réservation Directe

1. **Compte A** (Conducteur) :
   - Créer un trajet avec prix fixe (ex: 500 DA)
   - Fermer ou minimiser l'app

2. **Compte B** (Passager) :
   - Rechercher le trajet
   - Cliquer sur "Réserver maintenant"
   - Confirmer la réservation

3. **Résultat** :
   - 📱 **Le Compte A reçoit une notification** :
   ```
   🎉 Nouvelle réservation !
   [Nom du passager] a réservé 1 place(s) pour [Départ → Destination] - 500 DA
   ```

#### Scénario 2 : Offre de Négociation

1. **Compte A** (Conducteur) :
   - Créer un trajet avec prix négociable (ex: 600 DA)
   - Fermer ou minimiser l'app

2. **Compte B** (Passager) :
   - Rechercher le trajet
   - Cliquer sur "Faire une offre"
   - Proposer un prix (ex: 500 DA)

3. **Résultat** :
   - 📱 **Le Compte A reçoit une notification** :
   ```
   💰 Nouvelle offre de prix
   [Nom du passager] propose 500 DA pour [Départ → Destination]
   ```

#### Scénario 3 : Contre-Offre

1. **Compte A** (Conducteur) :
   - Ouvrir l'app
   - Aller dans "Négociations"
   - Cliquer sur la négociation
   - Faire une contre-offre (ex: 550 DA)

2. **Résultat** :
   - 📱 **Le Compte B reçoit une notification** :
   ```
   🔄 Nouvelle contre-offre
   [Nom du conducteur] propose 550 DA pour [Départ → Destination]
   ```

#### Scénario 4 : Acceptation

1. **Compte B** (Passager) :
   - Ouvrir l'app
   - Aller dans "Négociations"
   - Accepter l'offre de 550 DA

2. **Résultat** :
   - 📱 **Les deux comptes reçoivent une notification** :
   ```
   🎉 Négociation acceptée !
   Votre offre de 550 DA pour [Départ → Destination] a été acceptée !
   ```

---

## 📊 Canaux de Notifications Android

Trois canaux ont été configurés :

1. **`default`** - Notifications générales (Importance : MAX)
2. **`bookings`** - Réservations (Importance : HIGH, Couleur : Vert)
3. **`negotiations`** - Négociations (Importance : HIGH, Couleur : Orange)

---

## 🔍 Débogage

### Vérifier que le Token est Enregistré

1. Dans les logs du frontend, cherchez :
```
✅ Notifications push initialisées avec le token: ExponentPushToken[...]
✅ Push token enregistré sur le serveur
```

2. Dans les logs du backend, cherchez :
```
📱 Nouveau token enregistré pour l'utilisateur [userId]
```

### Vérifier l'Envoi de Notifications

Dans les logs du backend, lors d'une réservation :
```
✅ Notification envoyée avec succès à l'utilisateur [userId]
📱 Notification envoyée au conducteur [driverId]
```

### Problèmes Courants

#### ❌ Notifications non reçues

**Causes possibles :**
1. App testée sur émulateur → **Solution** : Utiliser un appareil physique
2. Permissions refusées → **Solution** : Réinstaller l'app et accepter
3. Token non enregistré → **Solution** : Vérifier les logs frontend/backend
4. App en mode développement → **Solution** : Construire en mode production avec EAS

#### ❌ Erreur "Project ID non trouvé"

**Solution :** Le Project ID est déjà configuré dans `app.json` :
```json
"extra": {
  "eas": {
    "projectId": "6d6546c5-fae9-436f-9370-5145b035358d"
  }
}
```

#### ❌ Erreur "DeviceNotRegistered"

Le token a expiré ou est invalide. Le service le supprime automatiquement de la base de données.

---

## 📱 Test avec Expo Push Notification Tool

Vous pouvez tester manuellement avec l'outil officiel Expo :

1. Obtenir votre Push Token depuis les logs :
```
📱 Push token obtenu: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

2. Aller sur : https://expo.dev/notifications

3. Remplir le formulaire :
   - **Token** : Coller votre token
   - **Title** : Test notification
   - **Body** : Ceci est un test
   - **Data** : `{"type": "test"}`

4. Cliquer sur "Send a Notification"

5. Vous devriez recevoir la notification sur votre téléphone !

---

## 🎯 Types de Notifications Disponibles

| Type | Titre | Destinataire | Déclencheur |
|------|-------|--------------|-------------|
| `new_booking` | 🎉 Nouvelle réservation ! | Conducteur | Passager réserve |
| `new_negotiation` | 💰 Nouvelle offre de prix | Conducteur | Passager fait une offre |
| `counter_offer` | 🔄 Nouvelle contre-offre | Conducteur / Passager | Contre-proposition |
| `booking_confirmed` | ✅ Réservation confirmée ! | Passager | Conducteur accepte |
| `booking_rejected` | ❌ Réservation refusée | Passager | Conducteur refuse |
| `negotiation_accepted` | 🎉 Négociation acceptée ! | Les deux | Acceptation |
| `trip_cancelled` | ⚠️ Trajet annulé | Passagers | Conducteur annule |

---

## 🔐 Sécurité

- ✅ Les tokens sont stockés de manière sécurisée dans MongoDB
- ✅ Un utilisateur peut avoir plusieurs tokens (plusieurs appareils)
- ✅ Les tokens invalides sont automatiquement supprimés
- ✅ Les tokens sont supprimés à la déconnexion
- ✅ Seuls les utilisateurs connectés peuvent enregistrer des tokens

---

## 📈 Améliorations Futures

1. **Navigation automatique** : Quand l'utilisateur clique sur une notification, naviguer automatiquement vers l'écran concerné (réservations, négociations, etc.)

2. **Badge de compteur** : Afficher un badge sur l'icône de l'app avec le nombre de notifications non lues

3. **Historique des notifications** : Créer un écran pour voir toutes les notifications reçues

4. **Notifications planifiées** : Rappeler au conducteur/passager X heures avant le départ

5. **Sons personnalisés** : Différents sons selon le type de notification

6. **Actions rapides** : Boutons d'actions dans les notifications (Accepter/Refuser directement)

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifier que vous testez sur **un appareil physique**
2. Vérifier les logs frontend ET backend
3. Vérifier que les permissions sont accordées
4. Redémarrer l'app après avoir accepté les permissions
5. Vérifier que le backend est accessible depuis le téléphone

---

## ✅ Checklist de Test

- [ ] Backend démarré et accessible
- [ ] Frontend démarré sur appareil physique
- [ ] Permissions notifications acceptées
- [ ] Token enregistré (voir logs)
- [ ] Test : Nouvelle réservation → Notification reçue
- [ ] Test : Nouvelle offre → Notification reçue
- [ ] Test : Contre-offre → Notification reçue
- [ ] Test : Acceptation → Notifications reçues (x2)

---

**🎉 Le système de notifications est prêt à l'emploi !**

Les conducteurs seront maintenant notifiés instantanément quand des passagers s'intéressent à leurs trajets.

