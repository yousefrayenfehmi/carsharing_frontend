# 🎫 Gestion des Places - Retrait Après Confirmation

## 🎯 Objectif

Modifier le système de réservation pour que les **places soient retirées du trajet uniquement après que le conducteur accepte la réservation**, et non pas immédiatement à la création de la réservation.

## ❌ Problème Avant

### Ancien Comportement

```
1. Passager crée une réservation (statut: pending)
       ↓
2. Places retirées immédiatement du trajet ❌
       ↓
3. Conducteur voit la réservation
       ↓
4. Conducteur accepte la réservation (statut: confirmed)
       ↓
5. Aucune action sur les places (déjà retirées)
```

**Problème** : Si le conducteur refuse la réservation, les places étaient déjà retirées du trajet, les rendant indisponibles alors qu'elles ne sont pas réservées.

### Exemple Concret

**Trajet initial** : 4 places disponibles

1. Passager A réserve 2 places → Statut "pending"
   - Places disponibles : **4 - 2 = 2** ❌ (déjà retirées !)
   
2. Passager B veut réserver 2 places → **Succès** (il reste 2 places)

3. Conducteur **refuse** la réservation de A
   - Places disponibles : **2 + 2 = 4** (remises)
   - Mais Passager B a déjà réservé !

4. **Conflit** : Passager B a réservé 2 places, mais le trajet affiche 4 places disponibles

## ✅ Solution Implémentée

### Nouveau Comportement

```
1. Passager crée une réservation (statut: pending)
       ↓
2. Places RESTENT disponibles ✅
       ↓
3. Conducteur voit la réservation
       ↓
4. Conducteur accepte la réservation (statut: confirmed)
       ↓
5. Places retirées du trajet ✅
       ↓
6. Passager ajouté à la liste des passagers
```

**Avantage** : Les places ne sont réservées que lorsque le conducteur confirme.

### Exemple Concret Amélioré

**Trajet initial** : 4 places disponibles

1. Passager A réserve 2 places → Statut "pending"
   - Places disponibles : **4** ✅ (pas encore retirées)
   
2. Passager B réserve 2 places → Statut "pending"
   - Places disponibles : **4** ✅ (pas encore retirées)

3. Conducteur **accepte** la réservation de A
   - Places disponibles : **4 - 2 = 2** ✅
   - Statut A : "confirmed"

4. Conducteur **refuse** la réservation de B
   - Places disponibles : **2** ✅ (inchangé)
   - Statut B : "cancelled"

5. **Résultat** : Cohérence parfaite ! 2 places prises, 2 places disponibles

## 🔧 Modifications Techniques

### 1. Fonction `createBooking` (Ligne 80-95)

**Avant** ❌ :
```typescript
// Créer la réservation
const booking = await Booking.create({
  trip: tripId,
  passenger: req.user?.id,
  driver: trip.driver,
  seats,
  totalPrice,
  appCommission,
  driverAmount,
  message,
  status: 'pending',
});

// Mettre à jour le nombre de places disponibles et ajouter le passager
trip.availableSeats -= seats;  // ❌ Retiré immédiatement !
trip.passengers.push(req.user?.id as any);
await trip.save();

// Mettre à jour le compteur de trajets du passager
await User.findByIdAndUpdate(req.user?.id, {
  $inc: { tripsAsPassenger: 1 },  // ❌ Incrémenté immédiatement !
});
```

**Après** ✅ :
```typescript
// Créer la réservation
const booking = await Booking.create({
  trip: tripId,
  passenger: req.user?.id,
  driver: trip.driver,
  seats,
  totalPrice,
  appCommission,
  driverAmount,
  message,
  status: 'pending',
});

// NE PAS retirer les places maintenant - elles seront retirées à la confirmation
// Les places restent disponibles tant que le conducteur n'a pas accepté  ✅
```

### 2. Fonction `confirmBooking` (Ligne 158-220)

**Avant** ❌ :
```typescript
// Vérifier que la réservation est en attente
if (booking.status !== 'pending') {
  throw ApiError.badRequest('Cette réservation ne peut pas être confirmée');
}

// Confirmer la réservation
const updatedBooking = await Booking.findByIdAndUpdate(
  booking._id,
  {
    status: 'confirmed',
    confirmedAt: new Date(),
    appCommission: booking.appCommission || 0,
    driverAmount: booking.driverAmount || 0,
  },
  { new: true }
);

// ❌ Pas de retrait de places !
```

**Après** ✅ :
```typescript
// Vérifier que la réservation est en attente
if (booking.status !== 'pending') {
  throw ApiError.badRequest('Cette réservation ne peut pas être confirmée');
}

// Récupérer le trajet pour mettre à jour les places disponibles
const trip = await Trip.findById((booking.trip as any)._id || booking.trip);
if (!trip) {
  throw ApiError.notFound('Trajet non trouvé');
}

// Vérifier qu'il y a assez de places disponibles
if (trip.availableSeats < booking.seats) {
  throw ApiError.badRequest(
    `Plus assez de places disponibles. Places restantes: ${trip.availableSeats}, Places demandées: ${booking.seats}`
  );
}

// Confirmer la réservation
const updatedBooking = await Booking.findByIdAndUpdate(
  booking._id,
  {
    status: 'confirmed',
    confirmedAt: new Date(),
    appCommission: booking.appCommission || 0,
    driverAmount: booking.driverAmount || 0,
  },
  { new: true }
);

// Retirer les places du trajet et ajouter le passager  ✅
trip.availableSeats -= booking.seats;
if (!trip.passengers.includes(booking.passenger)) {
  trip.passengers.push(booking.passenger);
}
await trip.save();

// Mettre à jour le compteur de trajets du passager (uniquement à la confirmation)  ✅
await User.findByIdAndUpdate(booking.passenger, {
  $inc: { tripsAsPassenger: 1 },
});
```

### 3. Fonction `updateBookingStatus` (Ligne 303-389)

**Avant** ❌ :
```typescript
if (status === 'confirmed') {
  // Seul le conducteur peut confirmer
  if (!isDriver) {
    throw ApiError.forbidden('Seul le conducteur peut confirmer une réservation');
  }
  booking.status = 'confirmed';  // ❌ Pas de retrait de places !
} else if (status === 'cancelled') {
  // ...
  booking.status = 'cancelled';
  
  // Remettre les places disponibles  ❌ Toujours remises !
  const trip = await Trip.findById(booking.trip);
  if (trip) {
    trip.availableSeats += booking.seats;
    trip.passengers = trip.passengers.filter(
      (p) => p.toString() !== booking.passenger.toString()
    );
    await trip.save();
  }
}
```

**Après** ✅ :
```typescript
if (status === 'confirmed') {
  // Seul le conducteur peut confirmer
  if (!isDriver) {
    throw ApiError.forbidden('Seul le conducteur peut confirmer une réservation');
  }
  
  // Vérifier que la réservation est en attente
  if (booking.status !== 'pending') {
    throw ApiError.badRequest('Cette réservation ne peut pas être confirmée');
  }

  // Récupérer le trajet pour retirer les places  ✅
  const trip = await Trip.findById(booking.trip);
  if (trip) {
    // Vérifier qu'il y a assez de places disponibles
    if (trip.availableSeats < booking.seats) {
      throw ApiError.badRequest(
        `Plus assez de places disponibles. Places restantes: ${trip.availableSeats}, Places demandées: ${booking.seats}`
      );
    }

    // Retirer les places et ajouter le passager  ✅
    trip.availableSeats -= booking.seats;
    if (!trip.passengers.includes(booking.passenger)) {
      trip.passengers.push(booking.passenger);
    }
    await trip.save();
  }

  booking.status = 'confirmed';
  booking.confirmedAt = new Date();

  // Mettre à jour le compteur de trajets du passager  ✅
  await User.findByIdAndUpdate(booking.passenger, {
    $inc: { tripsAsPassenger: 1 },
  });
} else if (status === 'cancelled') {
  // ...
  const previousStatus = booking.status;
  booking.status = 'cancelled';
  
  // Remettre les places disponibles SEULEMENT si la réservation était confirmée  ✅
  if (previousStatus === 'confirmed') {
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      trip.availableSeats += booking.seats;
      trip.passengers = trip.passengers.filter(
        (p) => p.toString() !== booking.passenger.toString()
      );
      await trip.save();
    }

    // Décrémenter le compteur de trajets du passager  ✅
    await User.findByIdAndUpdate(booking.passenger, {
      $inc: { tripsAsPassenger: -1 },
    });
  }
  // Si la réservation était "pending", les places n'ont jamais été retirées, donc rien à remettre  ✅
}
```

## 📊 Comparaison des États

| Action | Avant | Après |
|--------|-------|-------|
| **Créer réservation (pending)** | Places retirées ❌ | Places disponibles ✅ |
| **Conducteur confirme** | Aucune action ❌ | Places retirées ✅ |
| **Conducteur refuse (pending)** | Places remises ❌ | Aucune action (jamais retirées) ✅ |
| **Annuler réservation (confirmed)** | Places remises ✅ | Places remises ✅ |
| **Compteur passager (création)** | Incrémenté ❌ | Non incrémenté ✅ |
| **Compteur passager (confirmation)** | Aucune action ❌ | Incrémenté ✅ |
| **Compteur passager (annulation)** | Aucune action ❌ | Décrémenté (si confirmed) ✅ |

## 🔄 Flux de Réservation

### Scénario 1 : Réservation Acceptée

```
1. Passager crée une réservation
   - Statut: pending
   - Places disponibles: INCHANGÉES
   - Compteur passager: INCHANGÉ

2. Conducteur accepte
   - Statut: confirmed
   - Places disponibles: DIMINUÉES
   - Passager ajouté à la liste
   - Compteur passager: INCRÉMENTÉ

3. Trajet confirmé ✅
```

### Scénario 2 : Réservation Refusée

```
1. Passager crée une réservation
   - Statut: pending
   - Places disponibles: INCHANGÉES
   - Compteur passager: INCHANGÉ

2. Conducteur refuse
   - Statut: cancelled
   - Places disponibles: INCHANGÉES (jamais retirées)
   - Compteur passager: INCHANGÉ

3. Places toujours disponibles pour d'autres ✅
```

### Scénario 3 : Annulation Après Confirmation

```
1. Passager crée une réservation
   - Statut: pending
   - Places disponibles: INCHANGÉES

2. Conducteur accepte
   - Statut: confirmed
   - Places disponibles: DIMINUÉES
   - Compteur passager: INCRÉMENTÉ

3. Passager annule
   - Statut: cancelled
   - Places disponibles: AUGMENTÉES (remises)
   - Passager retiré de la liste
   - Compteur passager: DÉCRÉMENTÉ

4. Places à nouveau disponibles ✅
```

## 🧪 Tests à Effectuer

### Test 1 : Réservation Simple

1. **Setup** : Trajet avec 4 places disponibles
2. **Action** : Passager réserve 2 places
3. **Vérification** : Places disponibles = 4 (pas encore retirées)
4. **Action** : Conducteur accepte
5. **Vérification** : Places disponibles = 2 (retirées)
6. **Résultat attendu** : ✅ Places retirées après confirmation

### Test 2 : Réservation Refusée

1. **Setup** : Trajet avec 4 places disponibles
2. **Action** : Passager réserve 2 places
3. **Vérification** : Places disponibles = 4
4. **Action** : Conducteur refuse
5. **Vérification** : Places disponibles = 4 (inchangé)
6. **Résultat attendu** : ✅ Places toujours disponibles

### Test 3 : Réservations Multiples

1. **Setup** : Trajet avec 4 places disponibles
2. **Action** : Passager A réserve 2 places (pending)
3. **Vérification** : Places disponibles = 4
4. **Action** : Passager B réserve 2 places (pending)
5. **Vérification** : Places disponibles = 4
6. **Action** : Conducteur accepte A
7. **Vérification** : Places disponibles = 2
8. **Action** : Conducteur accepte B
9. **Vérification** : Places disponibles = 0
10. **Résultat attendu** : ✅ Gestion cohérente des places

### Test 4 : Annulation Après Confirmation

1. **Setup** : Trajet avec 4 places disponibles
2. **Action** : Passager réserve 2 places
3. **Action** : Conducteur accepte
4. **Vérification** : Places disponibles = 2
5. **Action** : Passager annule
6. **Vérification** : Places disponibles = 4 (remises)
7. **Résultat attendu** : ✅ Places remises après annulation

### Test 5 : Annulation Avant Confirmation

1. **Setup** : Trajet avec 4 places disponibles
2. **Action** : Passager réserve 2 places (pending)
3. **Vérification** : Places disponibles = 4
4. **Action** : Passager annule (avant acceptation du conducteur)
5. **Vérification** : Places disponibles = 4 (inchangé)
6. **Résultat attendu** : ✅ Pas de remise de places (jamais retirées)

### Test 6 : Tentative de Double Confirmation

1. **Setup** : Trajet avec 2 places disponibles
2. **Action** : Passager A réserve 2 places (pending)
3. **Action** : Passager B réserve 2 places (pending)
4. **Action** : Conducteur accepte A
5. **Vérification** : Places disponibles = 0
6. **Action** : Conducteur tente d'accepter B
7. **Résultat attendu** : ❌ Erreur "Plus assez de places disponibles"

## 📈 Avantages de la Solution

### 1. Cohérence des Données

✅ Les places disponibles reflètent toujours l'état réel du trajet  
✅ Pas de places "fantômes" retirées mais non confirmées  
✅ Le compteur de trajets du passager est exact

### 2. Meilleure Expérience Utilisateur

✅ Les conducteurs peuvent voir toutes les demandes avant de s'engager  
✅ Pas de blocage de places pour des réservations non confirmées  
✅ Les passagers peuvent voir les places réellement disponibles

### 3. Gestion des Conflits

✅ Évite les situations où le conducteur refuse mais les places sont déjà prises  
✅ Permet au conducteur de choisir entre plusieurs demandes  
✅ Empêche les surréservations

## ⚠️ Considérations

### 1. Surréservation Potentielle

**Problème** : Plusieurs passagers peuvent demander plus de places que disponibles

**Solution** : Lors de la confirmation, vérifier qu'il reste assez de places :
```typescript
if (trip.availableSeats < booking.seats) {
  throw ApiError.badRequest(
    `Plus assez de places disponibles. Places restantes: ${trip.availableSeats}, Places demandées: ${booking.seats}`
  );
}
```

### 2. Interface Conducteur

**Recommandation** : L'interface conducteur devrait montrer :
- Places actuellement disponibles
- Places en attente de confirmation (somme des réservations pending)

**Exemple** :
```
Trajet : Alger → Oran
Places disponibles : 4
Réservations en attente :
  - Passager A : 2 places
  - Passager B : 2 places
  - Passager C : 1 place
Total demandé : 5 places (plus que disponible !)
```

### 3. Timeout des Réservations Pending

**Amélioration future** : Ajouter un timeout pour les réservations non confirmées
```typescript
// Exemple : Annuler automatiquement après 24h
const expirationTime = new Date(booking.createdAt);
expirationTime.setHours(expirationTime.getHours() + 24);

if (new Date() > expirationTime && booking.status === 'pending') {
  booking.status = 'expired';
  await booking.save();
}
```

## 📁 Fichiers Modifiés

- ✅ `backend/src/controllers/booking.controller.ts`
  - `createBooking()` : Ne retire plus les places à la création
  - `confirmBooking()` : Retire les places à la confirmation
  - `updateBookingStatus()` : Gère les places selon le statut

## ✅ Checklist de Vérification

- [x] ✅ `createBooking` ne retire plus les places
- [x] ✅ `confirmBooking` retire les places à la confirmation
- [x] ✅ `updateBookingStatus` retire les places lors de la confirmation
- [x] ✅ `updateBookingStatus` remet les places uniquement si confirmé
- [x] ✅ Compteur `tripsAsPassenger` incrémenté à la confirmation
- [x] ✅ Compteur `tripsAsPassenger` décrémenté à l'annulation (si confirmé)
- [x] ✅ Vérification des places disponibles avant confirmation
- [x] ✅ Aucune erreur de compilation
- [x] ✅ Aucune erreur de linting
- [ ] ⏳ Tests manuels à effectuer

## 🚀 Déploiement

### 1. Redémarrer le Backend

```bash
cd backend
npm run dev
```

### 2. Tester le Flux

1. Créer un trajet avec 4 places
2. Créer une réservation (passager)
3. Vérifier que les places restent à 4
4. Accepter la réservation (conducteur)
5. Vérifier que les places passent à 2
6. Annuler la réservation
7. Vérifier que les places repassent à 4

---

**🎉 Système de Gestion des Places Optimisé ! ✅**


