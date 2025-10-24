# 🚫 Système d'Annulation avec Géolocalisation

## Vue d'ensemble

Un système anti-fraude intelligent qui utilise la géolocalisation pour gérer les annulations de courses. Le système applique des règles strictes pour protéger les conducteurs et les passagers.

## 🎯 Objectifs

1. **Éviter les fraudes** : Empêcher les annulations abusives
2. **Protéger les conducteurs** : Compensation si déplacement pour rien
3. **Équité** : Règles claires pour tous
4. **Traçabilité** : Enregistrement des positions GPS

## 📋 Règles d'annulation

### 🚶 Annulation par le passager

#### ✅ Autorisée si :
- Le passager **N'EST PAS** à proximité du point de rendez-vous (> 500m)

#### 💰 Frais d'annulation :
- **Sans frais** : Si réservation non confirmée (pending)
- **200 DA** : Si réservation confirmée (conducteur en route)

#### ❌ Refusée si :
- Le passager est déjà au point de rendez-vous (< 500m)
- Message : *"Vous ne pouvez pas annuler maintenant. Vous êtes déjà au point de rendez-vous. Contactez le conducteur directement."*

### 🚗 Annulation par le conducteur

#### ✅ Autorisée si :
- Le conducteur **EST** au point de rendez-vous (< 500m)
- ET le passager **N'EST PAS** là (absent)

#### 💰 Frais d'annulation :
- **200 DA** : Appliqués au passager (conducteur déplacé pour rien)

#### ❌ Refusée si :
- Le conducteur n'est pas au point de rendez-vous
- Message : *"Vous devez être au point de rendez-vous pour annuler (vous êtes à X km). Le passager doit annuler ou vous devez le contacter."*

## 🛠️ Implémentation technique

### Backend

#### 1. Modèle Booking mis à jour

```typescript
export interface IBooking extends Document {
  // ... champs existants ...
  
  cancellationFee?: number; // Frais d'annulation (200 DA si applicable)
  
  driverLocationAtCancellation?: {
    latitude: number;
    longitude: number;
  };
  
  passengerLocationAtCancellation?: {
    latitude: number;
    longitude: number;
  };
}
```

#### 2. Constantes

```typescript
const CANCELLATION_FEE = 200; // 200 DA
const PROXIMITY_RADIUS = 500; // 500 mètres
```

#### 3. API Route

```
POST /api/bookings/:id/cancel-with-location
```

**Request Body :**
```json
{
  "currentLatitude": 36.7538,
  "currentLongitude": 3.0588,
  "cancellationReason": "Imprévu"
}
```

**Response Success :**
```json
{
  "success": true,
  "data": {
    "booking": { ... },
    "cancellationFee": 200,
    "message": "Réservation annulée. Des frais de 200 DA s'appliquent."
  },
  "message": "Réservation annulée avec succès"
}
```

**Response Error :**
```json
{
  "success": false,
  "message": "Vous ne pouvez pas annuler maintenant. Vous êtes déjà au point de rendez-vous."
}
```

## 📊 Logique de décision

### Diagramme de flux - Passager annule

```
┌─────────────────────────┐
│ Passager demande        │
│ annulation avec GPS     │
└──────────┬──────────────┘
           │
           ▼
    ┌──────────────┐
    │ Calcul de la │
    │  distance au │
    │  point RDV   │
    └──────┬───────┘
           │
     ┌─────▼──────┐
     │ Distance ? │
     └─────┬──────┘
           │
    ┌──────▼──────────────────────┐
    │ < 500m (Sur place)          │
    │ ❌ REFUSÉ                    │
    │ "Contactez le conducteur"   │
    └─────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ > 500m (Loin)               │
    │ ✅ AUTORISÉ                  │
    └──────┬──────────────────────┘
           │
     ┌─────▼──────┐
     │ Statut ?   │
     └─────┬──────┘
           │
    ┌──────▼──────────┐  ┌──────────────┐
    │ Pending         │  │ Confirmed    │
    │ 0 DA            │  │ 200 DA       │
    └─────────────────┘  └──────────────┘
```

### Diagramme de flux - Conducteur annule

```
┌─────────────────────────┐
│ Conducteur demande      │
│ annulation avec GPS     │
└──────────┬──────────────┘
           │
           ▼
    ┌──────────────┐
    │ Calcul de la │
    │  distance au │
    │  point RDV   │
    └──────┬───────┘
           │
     ┌─────▼──────┐
     │ Distance ? │
     └─────┬──────┘
           │
    ┌──────▼──────────────────────┐
    │ > 500m (Pas sur place)      │
    │ ❌ REFUSÉ                    │
    │ "Vous devez être au RDV"    │
    └─────────────────────────────┘
           │
    ┌──────▼──────────────────────┐
    │ < 500m (Sur place)          │
    │ ✅ AUTORISÉ                  │
    │ Frais: 200 DA au passager   │
    └─────────────────────────────┘
```

## 🔐 Sécurité et anti-fraude

### Mesures de protection

1. **Géolocalisation obligatoire** : Impossible d'annuler sans fournir sa position
2. **Traçabilité GPS** : Les positions sont enregistrées en base de données
3. **Distance vérifiée** : Calcul précis avec la formule Haversine
4. **Horodatage** : Date et heure d'annulation enregistrées
5. **Identification** : Qui a annulé (passager ou conducteur)

### Données enregistrées

```typescript
{
  status: 'cancelled',
  cancelledBy: ObjectId,
  cancelledAt: Date,
  cancellationReason: String,
  cancellationFee: 200,
  driverLocationAtCancellation: {
    latitude: 36.7538,
    longitude: 3.0588
  },
  passengerLocationAtCancellation: {
    latitude: 36.7520,
    longitude: 3.0590
  }
}
```

## 💰 Gestion des frais

### Frais de 200 DA appliqués dans ces cas :

1. ✅ Passager annule après confirmation du conducteur
2. ✅ Conducteur annule (passager absent au RDV)

### Pas de frais dans ces cas :

1. ✅ Passager annule avant confirmation (pending)
2. ✅ Annulation mutuellement acceptée

### Traitement des frais

Les frais sont **enregistrés** dans le booking :
```typescript
booking.cancellationFee = 200; // DA
```

> **Note** : L'implémentation du paiement réel des frais peut être ajoutée ultérieurement via un système de portefeuille ou de paiement en ligne.

## 📍 Calcul de distance

### Formule Haversine

```typescript
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
};
```

### Rayon de proximité

```typescript
const PROXIMITY_RADIUS = 500; // 500 mètres = 0.5 km
```

Un utilisateur est considéré "sur place" s'il est à moins de 500m du point de rendez-vous.

## 🔍 Exemples de scénarios

### Scénario 1 : Passager annule à temps ✅

**Situation** :
- Passager à Hydra (36.7600, 3.0400)
- Point RDV à Grande Poste (36.7538, 3.0588)
- Distance : 2.3 km
- Statut : pending

**Résultat** :
- ✅ Annulation autorisée
- 💰 Frais : 0 DA
- 📝 Message : "Réservation annulée sans frais."

### Scénario 2 : Passager annule trop tard ❌

**Situation** :
- Passager à Grande Poste (36.7540, 3.0590)
- Point RDV à Grande Poste (36.7538, 3.0588)
- Distance : 250 m
- Statut : confirmed

**Résultat** :
- ❌ Annulation refusée
- 📝 Message : "Vous ne pouvez pas annuler maintenant. Vous êtes déjà au point de rendez-vous."

### Scénario 3 : Passager annule (conducteur confirmé) 💰

**Situation** :
- Passager à Bab El Oued (36.7900, 3.0400)
- Point RDV à Grande Poste (36.7538, 3.0588)
- Distance : 5.8 km
- Statut : confirmed

**Résultat** :
- ✅ Annulation autorisée
- 💰 Frais : 200 DA
- 📝 Message : "Réservation annulée. Des frais de 200 DA s'appliquent."

### Scénario 4 : Conducteur annule (passager absent) 💰

**Situation** :
- Conducteur à Grande Poste (36.7540, 3.0585)
- Point RDV à Grande Poste (36.7538, 3.0588)
- Distance : 300 m
- Passager absent

**Résultat** :
- ✅ Annulation autorisée
- 💰 Frais : 200 DA (au passager)
- 📝 Message : "Réservation annulée. Des frais de 200 DA s'appliquent."

### Scénario 5 : Conducteur essaie d'annuler de loin ❌

**Situation** :
- Conducteur à Bir Mourad Raïs (36.7200, 3.0800)
- Point RDV à Grande Poste (36.7538, 3.0588)
- Distance : 4.5 km

**Résultat** :
- ❌ Annulation refusée
- 📝 Message : "Vous devez être au point de rendez-vous pour annuler (vous êtes à 4.50 km)."

## 🎨 Interface utilisateur (à implémenter)

### Bouton d'annulation

```tsx
<TouchableOpacity onPress={handleCancelWithLocation}>
  <Text>Annuler la réservation</Text>
</TouchableOpacity>
```

### Flux utilisateur

1. **Tap sur "Annuler"**
2. **Demande de permission GPS**
3. **Récupération de la position**
4. **Envoi au backend**
5. **Affichage du résultat** :
   - ✅ Succès (avec/sans frais)
   - ❌ Erreur (trop près, trop loin, etc.)

## 📱 Frontend (à implémenter)

```typescript
const cancelBookingWithLocation = async (bookingId: string) => {
  try {
    // 1. Demander la permission de géolocalisation
    const permission = await Location.requestForegroundPermissionsAsync();
    
    if (!permission.granted) {
      Alert.alert('Permission requise', 'La géolocalisation est nécessaire pour annuler');
      return;
    }
    
    // 2. Récupérer la position actuelle
    const location = await Location.getCurrentPositionAsync({});
    
    // 3. Appeler l'API
    const response = await api.post(`/api/bookings/${bookingId}/cancel-with-location`, {
      currentLatitude: location.coords.latitude,
      currentLongitude: location.coords.longitude,
      cancellationReason: 'Imprévu'
    });
    
    // 4. Afficher le résultat
    const { cancellationFee, message } = response.data.data;
    
    if (cancellationFee > 0) {
      Alert.alert('Annulation avec frais', message);
    } else {
      Alert.alert('Annulation réussie', message);
    }
    
  } catch (error: any) {
    Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'annuler');
  }
};
```

## 📊 Statistiques et rapports

### Données à tracker

- Nombre d'annulations totales
- Annulations avec frais vs sans frais
- Annulations par passagers vs conducteurs
- Taux d'annulations refusées
- Revenus des frais d'annulation

### Dashboard admin (futur)

```
Annulations du mois :
- Total : 45
- Avec frais : 12 (26%)
- Sans frais : 33 (74%)
- Revenus frais : 2,400 DA
- Taux de fraude détecté : 5%
```

## ✅ Avantages du système

### Pour les conducteurs
- ✅ Protection contre les annulations de dernière minute
- ✅ Compensation financière (200 DA) si déplacement inutile
- ✅ Impossibilité pour le passager d'annuler sur place

### Pour les passagers
- ✅ Possibilité d'annuler sans frais (si pending)
- ✅ Règles claires et transparentes
- ✅ Protection contre les conducteurs frauduleux

### Pour l'application
- ✅ Réduction des fraudes
- ✅ Traçabilité complète (GPS + timestamps)
- ✅ Revenus additionnels (frais d'annulation)
- ✅ Système équitable pour tous

## 🔮 Améliorations futures possibles

1. [ ] **Temps d'attente** : Ajouter un délai d'attente avant que le conducteur puisse annuler
2. [ ] **Photos** : Demander une photo du lieu pour preuve
3. [ ] **Notifications** : Alerter l'autre partie en temps réel
4. [ ] **Historique** : Afficher l'historique d'annulations de l'utilisateur
5. [ ] **Blacklist** : Bloquer les utilisateurs avec trop d'annulations abusives
6. [ ] **Remboursement automatique** : Intégration avec système de paiement
7. [ ] **Zone de tolérance variable** : Adapter selon la densité urbaine
8. [ ] **Machine Learning** : Détecter les patterns de fraude

## 📝 TODO Frontend

- [ ] Créer l'interface d'annulation avec demande GPS
- [ ] Implémenter la logique de géolocalisation
- [ ] Afficher les frais avant confirmation
- [ ] Gérer les erreurs de permission GPS
- [ ] Afficher la distance au point de RDV
- [ ] Créer un modal de confirmation
- [ ] Intégrer avec le système de paiement (futur)

## 🎉 Résultat

Un système d'annulation intelligent et équitable qui protège les deux parties contre les fraudes tout en restant flexible et compréhensible ! 🚫📍💰


