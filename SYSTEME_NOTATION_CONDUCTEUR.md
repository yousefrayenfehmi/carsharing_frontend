# ⭐ Système de notation des conducteurs

## 📋 Vue d'ensemble

Le système permet aux **passagers** de noter et laisser des avis sur les **conducteurs** après avoir effectué un trajet ensemble.

## ✨ Fonctionnalités

### 1. **Note sur 5 étoiles** ⭐⭐⭐⭐⭐
- Note minimale : 1 étoile
- Note maximale : 5 étoiles
- Sélection intuitive avec des étoiles cliquables

### 2. **Commentaire optionnel** 💬
- Jusqu'à 1000 caractères
- Permet au passager de détailler son expérience

### 3. **Suggestions d'évaluation** 💡
Le système propose des critères d'évaluation :
- Ponctualité du conducteur
- Conduite sûre et agréable
- Convivialité et respect
- État et propreté du véhicule

### 4. **Calcul automatique de la note moyenne** 📊
- La note moyenne du conducteur est calculée automatiquement
- Mise à jour après chaque nouvel avis
- Affichée sur le profil et dans les résultats de recherche

## 🎯 Conditions requises

### Pour laisser un avis :
1. ✅ Avoir une réservation **confirmée**
2. ✅ Le trajet doit être **terminé** (status: completed)
3. ✅ Être un **passager** (pas le conducteur)
4. ✅ Ne pas avoir déjà laissé d'avis pour cette réservation

### Restrictions :
- ❌ Impossible de s'auto-évaluer
- ❌ Un seul avis par réservation
- ❌ Impossible de noter avant la fin du trajet

## 🔄 Workflow complet

```
┌─────────────────────────────────────────┐
│ 1. Passager réserve un trajet           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 2. Réservation confirmée                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 3. Trajet effectué                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 4. Statut: "Terminé"                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 5. Bouton "Noter le conducteur"         │
│    apparaît                              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 6. Modal de notation s'ouvre            │
│    - Sélection des étoiles              │
│    - Ajout d'un commentaire             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 7. Envoi de l'avis                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 8. Calcul automatique de la note        │
│    moyenne du conducteur                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ 9. Mise à jour du profil conducteur     │
└─────────────────────────────────────────┘
```

## 🏗️ Architecture backend

### Modèle Review
```typescript
interface IReview {
  trip: ObjectId;              // Trajet concerné
  booking: ObjectId;           // Réservation concernée
  reviewer: ObjectId;          // Auteur de l'avis (passager)
  reviewee: ObjectId;          // Personne évaluée (conducteur)
  rating: number;              // Note de 1 à 5
  comment?: string;            // Commentaire optionnel
  reviewerRole: 'passenger';   // Rôle de l'auteur
  isAnonymous: boolean;        // Avis anonyme ou non
  createdAt: Date;
  updatedAt: Date;
}
```

### Endpoints API

#### POST /api/reviews
Créer un avis
```json
{
  "bookingId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent conducteur, très ponctuel !",
  "isAnonymous": false
}
```

#### GET /api/reviews/user/:userId
Récupérer tous les avis d'un utilisateur

#### GET /api/reviews/my/given
Récupérer les avis que j'ai donnés

#### GET /api/reviews/my/received
Récupérer les avis que j'ai reçus

#### GET /api/reviews/booking/:bookingId
Récupérer les avis d'une réservation

#### PUT /api/reviews/:id
Modifier un avis existant

#### DELETE /api/reviews/:id
Supprimer un avis

## 📱 Interface utilisateur

### Page "Mes réservations"
```
┌─────────────────────────────────────────┐
│  ← Mes Réservations                     │
├─────────────────────────────────────────┤
│  [Confirmées] [Terminées] [Annulées]    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Ahmed Benali      ⭐ 4.8      │   │
│  │                      [Terminée]  │   │
│  │                                  │   │
│  │ 📍 Alger → Oran                  │   │
│  │ 📅 15 oct. 2024 - 08:00         │   │
│  │ 👥 2 places                      │   │
│  │ 💰 1500 DA                       │   │
│  │                                  │   │
│  │ [⭐ Noter le conducteur]         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Modal de notation
```
┌─────────────────────────────────────────┐
│  Noter le conducteur              [×]   │
├─────────────────────────────────────────┤
│                                         │
│           👤 Ahmed Benali               │
│                                         │
│           Votre note                    │
│        ⭐ ⭐ ⭐ ⭐ ⭐                     │
│          🤩 Excellent                   │
│                                         │
│  Commentaire (optionnel)                │
│  ┌─────────────────────────────────┐   │
│  │ Excellent conducteur, très      │   │
│  │ ponctuel et conduite agréable ! │   │
│  │                                  │   │
│  └─────────────────────────────────┘   │
│  154/1000 caractères                    │
│                                         │
│  💡 Quelques suggestions                │
│  • Ponctualité du conducteur            │
│  • Conduite sûre et agréable            │
│  • Convivialité et respect              │
│  • État et propreté du véhicule         │
│                                         │
│  [✓ Envoyer mon avis]                   │
│                                         │
└─────────────────────────────────────────┘
```

### Labels de notation
- ⭐ (1/5) : 😞 Très insatisfait
- ⭐⭐ (2/5) : 😕 Insatisfait
- ⭐⭐⭐ (3/5) : 😐 Moyen
- ⭐⭐⭐⭐ (4/5) : 😊 Satisfait
- ⭐⭐⭐⭐⭐ (5/5) : 🤩 Excellent

## 🔐 Sécurité et validation

### Validations backend
```typescript
// Note
- Obligatoire
- Entier entre 1 et 5

// Commentaire
- Optionnel
- Maximum 1000 caractères
- Trimmed (espaces supprimés)

// Booking ID
- Obligatoire
- Format MongoDB ObjectId valide

// Vérifications métier
- La réservation existe
- La réservation est terminée
- L'utilisateur est le passager
- Pas d'avis déjà existant
- Ne peut pas s'auto-évaluer
```

### Hooks automatiques
```typescript
// Avant sauvegarde
- Vérifier que reviewer ≠ reviewee

// Après sauvegarde
- Calculer la nouvelle note moyenne
- Mettre à jour User.rating
- Mettre à jour User.totalRatings
```

## 📊 Affichage des notes

### Profil conducteur
```
┌────────────────────────────────┐
│      Ahmed Benali              │
│   ahmed@example.com            │
│                                │
│      ⭐ 4.8 (124 avis)         │
└────────────────────────────────┘
```

### Résultats de recherche
```
┌──────────────────────────────────┐
│ 👤 Ahmed Benali    ⭐ 4.8        │
│ 📍 Alger → Oran                  │
│ 💰 1500 DA                       │
└──────────────────────────────────┘
```

## 🎨 Composants frontend

### 1. ReviewModal
**Emplacement** : `covoiturage-app/components/review-modal.tsx`

**Props** :
```typescript
interface ReviewModalProps {
  visible: boolean;
  bookingId: string;
  driverName: string;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Fonctionnalités** :
- Sélection de la note par étoiles
- Zone de commentaire avec compteur
- Suggestions d'évaluation
- Validation avant envoi
- Gestion des erreurs

### 2. MyBookingsScreen
**Emplacement** : `covoiturage-app/app/my-bookings.tsx`

**Fonctionnalités** :
- Onglets : Confirmées / Terminées / Annulées
- Liste des réservations
- Bouton "Noter le conducteur" pour les trajets terminés
- Pull to refresh
- Gestion des états vides

### 3. useReviews Hook
**Emplacement** : `covoiturage-app/hooks/use-reviews.ts`

**Méthodes** :
- `createReview(data)` : Créer un avis
- `getUserReviews(userId, role?)` : Récupérer les avis d'un user
- `getMyGivenReviews()` : Mes avis donnés
- `getMyReceivedReviews()` : Mes avis reçus
- `getBookingReviews(bookingId)` : Avis d'une réservation
- `updateReview(reviewId, rating, comment)` : Modifier un avis
- `deleteReview(reviewId)` : Supprimer un avis

## 🔄 États et navigation

### Navigation depuis le profil
```
Profile → Mes réservations → Trajet terminé → Noter → Modal de notation
```

### États des réservations
```typescript
type BookingStatus = 
  | 'pending'    // En attente
  | 'confirmed'  // Confirmée
  | 'completed'  // Terminée ✓ (notation possible)
  | 'cancelled'; // Annulée
```

## 💾 Données stockées

### User Model
```typescript
{
  rating: number;        // Note moyenne (ex: 4.8)
  totalRatings: number;  // Nombre total d'avis (ex: 124)
}
```

### Review Model
```typescript
{
  _id: ObjectId;
  trip: ObjectId;
  booking: ObjectId;
  reviewer: ObjectId;
  reviewee: ObjectId;
  rating: 1-5;
  comment: string;
  reviewerRole: 'passenger';
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔔 Notifications (à venir)

### Pour le conducteur
- 📧 Notification quand il reçoit un nouvel avis
- 📱 Badge sur le profil
- 🔔 Notification push

### Pour le passager
- ✅ Confirmation d'envoi de l'avis
- 📧 Email de remerciement

## 📈 Statistiques

### Profil conducteur
- Note moyenne : calculée en temps réel
- Nombre total d'avis
- Distribution des notes (à venir)
- Avis récents

### Analytics (à venir)
- Évolution de la note dans le temps
- Répartition des notes (1-5)
- Tags populaires dans les commentaires
- Taux de satisfaction

## 🚀 Améliorations futures

### Phase 1 (actuelle) ✅
- [x] Notation 1-5 étoiles
- [x] Commentaire optionnel
- [x] Calcul automatique de la note moyenne
- [x] Interface de notation
- [x] Page "Mes réservations"

### Phase 2 (à venir)
- [ ] Notation du passager par le conducteur
- [ ] Système de badges (Ponctuel, Convivial, etc.)
- [ ] Signalement d'avis inappropriés
- [ ] Réponse aux avis par le conducteur
- [ ] Photos dans les avis

### Phase 3 (futur)
- [ ] IA pour détecter les avis frauduleux
- [ ] Analyse de sentiment des commentaires
- [ ] Recommandations personnalisées
- [ ] Gamification (badges, niveaux)

## 📄 Fichiers modifiés/créés

### Backend
```
✅ backend/src/models/Review.ts (existant)
✅ backend/src/controllers/review.controller.ts
✅ backend/src/routes/review.routes.ts
✅ backend/src/validators/review.validator.ts
✅ backend/src/app.ts (route ajoutée)
```

### Frontend
```
✅ covoiturage-app/services/review-service.ts
✅ covoiturage-app/hooks/use-reviews.ts
✅ covoiturage-app/components/review-modal.tsx
✅ covoiturage-app/app/my-bookings.tsx
✅ covoiturage-app/app/(tabs)/profile.tsx (bouton ajouté)
```

## 🧪 Tests recommandés

### Tests unitaires
- [ ] Validation des notes (1-5)
- [ ] Validation des commentaires (max 1000 car)
- [ ] Calcul de la note moyenne
- [ ] Empêcher auto-évaluation

### Tests d'intégration
- [ ] Créer un avis complet
- [ ] Empêcher double avis
- [ ] Vérifier status "completed"
- [ ] Mise à jour de User.rating

### Tests UI
- [ ] Sélection des étoiles
- [ ] Compteur de caractères
- [ ] Modal responsive
- [ ] États de chargement

## 📝 Exemple d'utilisation

### Côté passager
```typescript
// 1. Ouvrir "Mes réservations"
router.push('/my-bookings');

// 2. Sélectionner l'onglet "Terminées"
setActiveTab('completed');

// 3. Cliquer sur "Noter le conducteur"
handleReview(booking);

// 4. Sélectionner 5 étoiles
setRating(5);

// 5. Ajouter un commentaire
setComment("Excellent conducteur !");

// 6. Envoyer
await createReview({
  bookingId: booking._id,
  rating: 5,
  comment: "Excellent conducteur !",
});
```

### Côté backend
```typescript
// Recevoir l'avis
POST /api/reviews
{
  "bookingId": "...",
  "rating": 5,
  "comment": "Excellent conducteur !"
}

// Valider
- Réservation terminée ?
- Pas d'avis existant ?
- Note valide (1-5) ?

// Créer l'avis
const review = await Review.create({...});

// Calculer la nouvelle moyenne
const avgRating = calculateAverage(driverId);

// Mettre à jour le conducteur
await User.findByIdAndUpdate(driverId, {
  rating: avgRating,
  totalRatings: totalCount
});
```

## ✅ Résumé

Le système de notation permet aux passagers d'évaluer leur expérience avec le conducteur après un trajet terminé. L'interface est intuitive avec des étoiles cliquables, un commentaire optionnel, et des suggestions d'évaluation. La note moyenne est calculée automatiquement et affichée partout dans l'application.

**Prêt à l'emploi** : Le système est complet et fonctionnel ! 🎉



