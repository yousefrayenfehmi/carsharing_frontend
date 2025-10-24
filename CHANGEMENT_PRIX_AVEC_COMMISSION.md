# 🔄 Changement : Prix sauvegardé avec commission

## Vue d'ensemble

Le système a été modifié pour sauvegarder le **prix client** (avec commission incluse) dans la base de données au lieu du prix conducteur.

## 🔀 Avant vs Après

### ❌ Avant (ancien système)

```javascript
// Le conducteur entre : 500 DA (ce qu'il veut recevoir)
// On sauvegarde : 500 DA
// Champ virtuel calcule : clientPrice = 595.24 DA

{
  price: 500,           // Prix conducteur (sauvegardé)
  clientPrice: 595.24   // Prix client (virtuel)
}
```

### ✅ Après (nouveau système)

```javascript
// Le conducteur entre : 500 DA (ce qu'il veut recevoir)
// On calcule : 595.24 DA (prix client avec commission)
// On sauvegarde : 595.24 DA

{
  price: 595.24,        // Prix client avec commission (sauvegardé)
  driverPrice: 500      // Prix conducteur (virtuel)
}
```

## 📊 Avantages du nouveau système

1. ✅ **Simplicité** : Le prix affiché aux clients est directement celui en base
2. ✅ **Performance** : Pas besoin de calculer à chaque lecture
3. ✅ **Cohérence** : Le prix stocké est le prix réel du trajet
4. ✅ **Recherche** : Plus facile de filtrer par prix client
5. ✅ **Compatibilité** : Les APIs reçoivent directement le bon prix

## 🔧 Modifications effectuées

### 1. Frontend (`covoiturage-app/app/(tabs)/publish.tsx`)

**Calcul avant l'envoi :**
```typescript
// Calculer le prix client (avec commission) à envoyer au backend
const driverWantedPrice = parseFloat(price);
const priceWithCommission = calculateClientPrice(driverWantedPrice);

await createTrip({
  // ...
  price: priceWithCommission, // Prix avec commission (ce que le client paiera)
  // ...
});
```

**Affichage pour le conducteur :**
- Le conducteur entre toujours le prix qu'il veut recevoir
- L'interface calcule et affiche le prix client
- Le prix client est envoyé au backend

### 2. Backend - Modèle Trip (`backend/src/models/Trip.ts`)

**Champ `price` :**
```typescript
price: number; // Prix client (avec commission 16% incluse)
```

**Champ virtuel `driverPrice` :**
```typescript
TripSchema.virtual('driverPrice').get(function() {
  // Le prix stocké est le prix client (avec commission)
  // On calcule le prix conducteur : prix client - commission
  const commission = this.price * APP_COMMISSION_RATE;
  return this.price - commission;
});
```

### 3. Backend - Contrôleur Booking (`backend/src/controllers/booking.controller.ts`)

**Simplification :**
```typescript
// Le prix du trajet contient déjà la commission (prix client)
const clientPricePerSeat = trip.price; // Prix client avec commission incluse
const totalPrice = clientPricePerSeat * seats;

// Calculer la commission de l'application (16% du prix total)
const appCommission = calculateCommission(totalPrice);

// Calculer le montant que le conducteur recevra
const driverAmount = calculateDriverAmount(totalPrice);
```

Avant, on devait utiliser `trip.clientPrice` (virtuel), maintenant on utilise directement `trip.price`.

### 4. Backend - Contrôleur Négociation

**Reste identique :**
Le système de négociation continue de fonctionner comme avant, car le prix négocié représente toujours ce que le conducteur veut recevoir, et on calcule le prix client avec commission pour la réservation.

## 📈 Flux complet

### Publication d'un trajet

```
1. Conducteur entre : 500 DA
   ↓
2. Frontend calcule : 595.24 DA (prix client)
   ↓
3. Frontend envoie : price = 595.24
   ↓
4. Backend sauvegarde : { price: 595.24 }
   ↓
5. Champ virtuel driverPrice : 500 DA
```

### Recherche de trajet

```
1. Client cherche un trajet
   ↓
2. Backend retourne : price = 595.24
   ↓
3. Frontend affiche : 595.24 DA par place
```

### Réservation

```
1. Client réserve 2 places à 595.24 DA
   ↓
2. totalPrice = 595.24 × 2 = 1,190.48 DA
   ↓
3. appCommission = 1,190.48 × 0.16 = 190.48 DA
   ↓
4. driverAmount = 1,190.48 - 190.48 = 1,000 DA
   ↓
5. Sauvegarde dans Booking :
   {
     totalPrice: 1190.48,
     appCommission: 190.48,
     driverAmount: 1000.00
   }
```

## 🔍 Vérification des données

### Dans la base de données MongoDB

```javascript
// Trajet
{
  "_id": "...",
  "driver": "driverId",
  "price": 595.24,           // Prix client avec commission
  "priceType": "fixed",
  "availableSeats": 4,
  // ...
}

// Le champ virtuel driverPrice n'est pas stocké
// mais calculé à la lecture : 595.24 - (595.24 × 0.16) = 500
```

### API Response

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "driver": {...},
    "price": 595.24,
    "driverPrice": 500,      // Champ virtuel calculé
    "priceType": "fixed",
    "availableSeats": 4
  }
}
```

## 🎯 Points importants

### ✅ Ce qui ne change PAS

1. **Interface conducteur** : Le conducteur entre toujours le prix qu'il veut recevoir
2. **Balise de commission** : Continue d'afficher le calcul en temps réel
3. **Système de réservation** : Fonctionne exactement pareil
4. **Négociations** : Continuent de fonctionner normalement

### ✨ Ce qui change

1. **Valeur sauvegardée** : `price` contient maintenant le prix client (avec commission)
2. **Champ virtuel** : `driverPrice` au lieu de `clientPrice`
3. **Calcul frontend** : Le prix est converti avant l'envoi au backend
4. **Lectures en base** : Plus besoin de calculer le prix client à chaque fois

## 📊 Comparaison des valeurs

| Conducteur veut | Ancien `price` | Nouveau `price` | Ancien `clientPrice` | Nouveau `driverPrice` |
|-----------------|----------------|-----------------|----------------------|-----------------------|
| 100 DA          | 100 DA         | 119.05 DA       | 119.05 DA (virtuel)  | 100 DA (virtuel)      |
| 500 DA          | 500 DA         | 595.24 DA       | 595.24 DA (virtuel)  | 500 DA (virtuel)      |
| 1000 DA         | 1000 DA        | 1190.48 DA      | 1190.48 DA (virtuel) | 1000 DA (virtuel)     |
| 1500 DA         | 1500 DA        | 1785.71 DA      | 1785.71 DA (virtuel) | 1500 DA (virtuel)     |

## 🚀 Migration des données existantes

Si vous avez déjà des trajets dans la base de données avec l'ancien système, vous devrez les migrer :

```javascript
// Script de migration (exemple)
db.trips.find().forEach(trip => {
  // Calculer le nouveau prix (prix client avec commission)
  const newPrice = trip.price / (1 - 0.16);
  
  // Mettre à jour
  db.trips.updateOne(
    { _id: trip._id },
    { $set: { price: newPrice } }
  );
});
```

⚠️ **Important** : Effectuez une sauvegarde avant toute migration !

## ✅ Tests à effectuer

1. ✅ Publier un trajet et vérifier le prix en base
2. ✅ Rechercher un trajet et vérifier le prix affiché
3. ✅ Réserver un trajet et vérifier les montants
4. ✅ Négocier un prix et vérifier la réservation créée
5. ✅ Vérifier que le conducteur reçoit le bon montant

## 📝 Résumé

Le système sauvegarde maintenant le **prix client** (avec commission) dans la base de données, ce qui simplifie les requêtes et améliore les performances. Le conducteur entre toujours le prix qu'il souhaite recevoir, mais ce prix est converti en prix client avant d'être sauvegardé.

**Formule clé :**
```
Prix sauvegardé = Prix conducteur ÷ 0.84
Prix conducteur = Prix sauvegardé × 0.84
Commission = Prix sauvegardé × 0.16
```

