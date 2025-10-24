# Système de Négociation de Prix

## Vue d'ensemble

Le système de négociation permet aux passagers de proposer un prix alternatif pour les trajets dont le prix est défini comme "négociable" par le conducteur. Le conducteur et le passager peuvent échanger des contre-propositions jusqu'à ce qu'un accord soit trouvé.

## Architecture

### Backend

#### 1. Modèle de données (`backend/src/models/Negotiation.ts`)

```typescript
{
  trip: ObjectId,              // Référence au trajet
  passenger: ObjectId,          // Référence au passager
  driver: ObjectId,             // Référence au conducteur
  originalPrice: Number,        // Prix original du trajet
  currentOffer: Number,         // Dernière offre proposée
  lastOfferBy: 'passenger' | 'driver',  // Qui a fait la dernière offre
  status: 'pending' | 'accepted' | 'rejected' | 'expired',
  messages: [{
    sender: ObjectId,
    senderType: 'passenger' | 'driver',
    message: String,
    priceOffer: Number,
    createdAt: Date
  }]
}
```

**Index importants :**
- Index unique sur `(trip, passenger)` : Un passager ne peut avoir qu'une négociation par trajet
- Index sur `trip`, `passenger`, `driver` pour les recherches

#### 2. API Endpoints

##### POST `/api/negotiations`
Créer une nouvelle négociation (passager uniquement)
```json
{
  "tripId": "string",
  "proposedPrice": number,
  "message": "string (optionnel)"
}
```

##### POST `/api/negotiations/:id/counter`
Faire une contre-proposition
```json
{
  "counterPrice": number,
  "message": "string (optionnel)"
}
```

##### POST `/api/negotiations/:id/accept`
Accepter la dernière offre
```json
{
  "message": "string (optionnel)"
}
```

##### POST `/api/negotiations/:id/reject`
Rejeter la négociation
```json
{
  "message": "string (optionnel)"
}
```

##### GET `/api/negotiations/trip/:tripId`
Récupérer toutes les négociations d'un trajet (conducteur uniquement)

##### GET `/api/negotiations/my?status=pending|accepted|rejected|expired`
Récupérer les négociations de l'utilisateur connecté

##### GET `/api/negotiations/:id`
Récupérer les détails d'une négociation spécifique

#### 3. Validations

- Le trajet doit avoir `priceType: 'negotiable'`
- Le passager ne peut pas négocier son propre trajet
- Une seule négociation active par passager et par trajet
- Seul celui qui n'a pas fait la dernière offre peut accepter
- Les actions sont possibles uniquement sur les négociations avec `status: 'pending'`

### Frontend

#### 1. Service (`covoiturage-app/services/negotiation-service.ts`)

Service singleton qui gère toutes les interactions avec l'API de négociation.

#### 2. Hook personnalisé (`covoiturage-app/hooks/use-negotiations.ts`)

Hook React qui encapsule la logique de négociation avec gestion des états de chargement et d'erreur.

```typescript
const {
  loading,
  error,
  createNegotiation,
  counterOffer,
  acceptNegotiation,
  rejectNegotiation,
  getTripNegotiations,
  getMyNegotiations,
  getNegotiationById,
} = useNegotiations();
```

#### 3. Composants

##### Page de recherche (`covoiturage-app/app/(tabs)/index.tsx`)
- Affiche un badge "Négociable" sur les trajets négociables
- Permet de proposer un prix directement depuis les résultats de recherche
- Envoie la proposition au backend

##### Page des négociations (`covoiturage-app/app/negotiations.tsx`)
- Liste toutes les négociations de l'utilisateur
- Filtres par statut : En cours / Acceptées / Rejetées
- Actions disponibles :
  - Faire une contre-proposition
  - Accepter une offre
  - Rejeter une négociation
- Affichage de l'historique des messages

##### Page de profil (`covoiturage-app/app/(tabs)/profile.tsx`)
- Bouton "Mes négociations" pour accéder rapidement à la page de négociations

## Flux utilisateur

### Côté Passager

1. **Recherche de trajets**
   - Le passager recherche un trajet
   - Voit un badge "Négociable" sur certains trajets

2. **Proposition initiale**
   - Clique sur "Négocier le prix"
   - Saisit un prix proposé
   - Envoie la proposition au conducteur

3. **En attente de réponse**
   - La négociation apparaît dans "Mes négociations" avec statut "En cours"
   - Le passager peut voir la proposition qu'il a envoyée

4. **Réponse du conducteur**
   - Si contre-proposition : Le passager peut accepter ou faire une nouvelle contre-proposition
   - Si acceptée : La négociation passe en statut "Acceptée"
   - Si rejetée : La négociation passe en statut "Rejetée"

### Côté Conducteur

1. **Réception de propositions**
   - Le conducteur voit les négociations dans "Mes négociations"
   - Peut voir le prix proposé et le message du passager

2. **Options disponibles**
   - **Accepter** : Accepter le prix proposé
   - **Refuser** : Rejeter la négociation
   - **Contre-proposition** : Proposer un autre prix

3. **Accord final**
   - Une fois acceptée, le prix convenu est celui de la dernière offre
   - Les deux parties peuvent voir le prix final dans la négociation acceptée

## Règles métier

1. **Unicité** : Un passager ne peut avoir qu'une négociation active par trajet
2. **Tour par tour** : Seul celui qui n'a pas fait la dernière offre peut accepter
3. **Statut du trajet** : Seuls les trajets actifs avec `priceType: 'negotiable'` peuvent être négociés
4. **Historique** : Tous les messages et propositions sont conservés
5. **Finalité** : Une fois acceptée ou rejetée, la négociation ne peut plus être modifiée

## Améliorations futures possibles

1. **Notifications en temps réel**
   - WebSockets ou notifications push pour informer immédiatement des nouvelles offres

2. **Expiration automatique**
   - Définir un délai d'expiration pour les négociations (ex: 24h)

3. **Réservation automatique**
   - Une fois la négociation acceptée, créer automatiquement une réservation au prix convenu

4. **Statistiques**
   - Taux d'acceptation des négociations
   - Prix moyen négocié vs prix initial

5. **Limitations**
   - Limiter le nombre de contre-propositions
   - Définir un prix minimum/maximum acceptable

6. **Intégration avec le système de réservation**
   - Lier la négociation acceptée à une réservation
   - Appliquer le prix négocié lors de la réservation

## Tests recommandés

### Backend
```bash
cd backend
npm test
```

- Création d'une négociation
- Impossibilité de négocier son propre trajet
- Une seule négociation active par passager/trajet
- Contre-propositions valides
- Acceptation uniquement par la partie opposée
- Rejet de négociation

### Frontend
- Navigation vers la page de négociations
- Création d'une proposition depuis la recherche
- Affichage des négociations par statut
- Actions de contre-proposition, acceptation, rejet
- Gestion des états de chargement et d'erreur

## Sécurité

- ✅ Authentification requise pour toutes les routes
- ✅ Vérification de l'appartenance (passager ou conducteur)
- ✅ Validation des prix (nombres positifs)
- ✅ Validation des messages (longueur maximale)
- ✅ Protection contre les modifications de négociations terminées

## Base de données

Pour créer l'index nécessaire sur MongoDB :

```javascript
db.negotiations.createIndex({ trip: 1, passenger: 1 }, { unique: true });
db.negotiations.createIndex({ trip: 1 });
db.negotiations.createIndex({ passenger: 1 });
db.negotiations.createIndex({ driver: 1 });
```

Ces index sont créés automatiquement au démarrage grâce au schéma Mongoose.


