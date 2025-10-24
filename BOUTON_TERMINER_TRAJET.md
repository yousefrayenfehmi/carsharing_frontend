# ✅ Bouton "Terminer le Trajet" pour le Conducteur

## 🎯 Objectif

Permettre au **conducteur** de marquer son trajet comme **terminé** une fois qu'il a effectué le voyage, en ajoutant un bouton "Terminer" dans l'interface de gestion des trajets.

## ✨ Fonctionnalités Implémentées

### 1. Backend - Endpoint `/api/trips/:id/complete`

**Fichier** : `backend/src/controllers/trip.controller.ts`

```typescript
/**
 * @route   PUT /api/trips/:id/complete
 * @desc    Marquer un trajet comme terminé
 * @access  Private
 */
export const completeTrip = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const trip = await Trip.findById(id);

    if (!trip) {
      throw ApiError.notFound('Trajet non trouvé');
    }

    // Vérifier que l'utilisateur est le conducteur
    if (trip.driver.toString() !== req.user?.id) {
      throw ApiError.forbidden('Vous n\'êtes pas autorisé à terminer ce trajet');
    }

    // Vérifier que le trajet est actif
    if (trip.status !== 'active') {
      throw ApiError.badRequest('Seuls les trajets actifs peuvent être marqués comme terminés');
    }

    // Marquer le trajet comme terminé
    trip.status = 'completed';
    await trip.save();

    // Marquer toutes les réservations confirmées comme terminées
    await Booking.updateMany(
      { trip: trip._id, status: 'confirmed' },
      { status: 'completed' }
    );

    // Incrémenter le compteur de trajets terminés du conducteur
    await User.findByIdAndUpdate(req.user?.id, {
      $inc: { tripsAsDriver: 1 },
    });

    const response: SuccessResponse = {
      success: true,
      data: trip,
      message: 'Trajet marqué comme terminé avec succès',
    };

    res.status(200).json(response);
  }
);
```

**Actions effectuées** :
1. ✅ Vérifie que l'utilisateur est le conducteur
2. ✅ Vérifie que le trajet est actif (non annulé ou déjà terminé)
3. ✅ Change le statut du trajet à `completed`
4. ✅ Marque toutes les réservations `confirmed` comme `completed`
5. ✅ Incrémente le compteur `tripsAsDriver` du conducteur

### 2. Backend - Route

**Fichier** : `backend/src/routes/trip.routes.ts`

```typescript
// Marquer un trajet comme terminé
router.put('/:id/complete', authenticate, completeTrip);
```

### 3. Frontend - Service

**Fichier** : `covoiturage-app/services/trip-service.ts`

```typescript
/**
 * Marquer un trajet comme terminé
 */
async completeTrip(id: string): Promise<Trip> {
  const response = await api.put(`/trips/${id}/complete`);
  return response.data.data;
}
```

### 4. Frontend - Hook

**Fichier** : `covoiturage-app/hooks/use-trips.ts`

```typescript
const completeTrip = async (id: string) => {
  try {
    setLoading(true);
    setError(null);
    const completedTrip = await tripService.completeTrip(id);
    // Mettre à jour la liste des trajets après marquage comme terminé
    const updatedTrips = trips.map(trip => 
      trip._id === id ? { ...trip, status: 'completed' as const } : trip
    );
    setTrips(updatedTrips);
    return completedTrip;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Erreur lors du marquage comme terminé';
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};
```

### 5. Frontend - Interface UI

**Fichier** : `covoiturage-app/app/(tabs)/trips.tsx`

#### A. État et Handler

```typescript
const [completingTrip, setCompletingTrip] = useState<string | null>(null);

const handleCompleteTrip = async (tripId: string) => {
  Alert.alert(
    'Terminer le trajet',
    'Marquer ce trajet comme terminé ? Les réservations confirmées seront également marquées comme terminées.',
    [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Terminer',
        style: 'default',
        onPress: async () => {
          try {
            setCompletingTrip(tripId);
            await completeTrip(tripId);
            Alert.alert('Succès', 'Le trajet a été marqué comme terminé');
            loadTrips(); // Recharger la liste
          } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors du marquage comme terminé');
          } finally {
            setCompletingTrip(null);
          }
        },
      },
    ]
  );
};
```

#### B. Boutons UI

```typescript
{/* Boutons d'action - seulement pour les trajets actifs */}
{trip.status === 'active' && (
  <View style={styles.actionButtonsRow}>
    <TouchableOpacity
      style={[
        styles.completeButton,
        completingTrip === trip._id && styles.completeButtonDisabled
      ]}
      onPress={() => handleCompleteTrip(trip._id)}
      disabled={completingTrip === trip._id}
    >
      {completingTrip === trip._id ? (
        <ActivityIndicator size="small" color={Colors.text.white} />
      ) : (
        <View style={styles.buttonContent}>
          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.text.white} />
          <Text style={styles.completeButtonText}>Terminer</Text>
        </View>
      )}
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.cancelButton,
        cancellingTrip === trip._id && styles.cancelButtonDisabled
      ]}
      onPress={() => handleCancelTrip(trip._id)}
      disabled={cancellingTrip === trip._id}
    >
      {cancellingTrip === trip._id ? (
        <ActivityIndicator size="small" color={Colors.text.white} />
      ) : (
        <View style={styles.buttonContent}>
          <Ionicons name="close-circle-outline" size={18} color={Colors.text.white} />
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
)}
```

#### C. Styles

```typescript
actionButtonsRow: {
  flexDirection: 'row',
  gap: 12,
  marginTop: 12,
},
completeButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4CAF50',
  paddingVertical: 12,
  borderRadius: 8,
},
completeButtonDisabled: {
  backgroundColor: '#A5D6A7',
},
completeButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.text.white,
},
cancelButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FF6B6B',
  paddingVertical: 12,
  borderRadius: 8,
},
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
```

## 🔄 Flux d'Utilisation

### Scénario Complet

```
1. Conducteur publie un trajet
   - Statut: active
   - Places: 4

2. Passagers réservent
   - Passager A: 2 places (pending)
   - Passager B: 1 place (pending)

3. Conducteur accepte les réservations
   - Passager A: confirmed
   - Passager B: confirmed
   - Places disponibles: 1

4. Conducteur effectue le trajet
   - Départ réalisé
   - Voyage effectué
   - Arrivée à destination

5. Conducteur clique sur "Terminer"
   ↓
   Alerte de confirmation
   ↓
   Backend vérifie les permissions
   ↓
   Trajet: status = "completed"
   Réservations: status = "completed"
   Compteur conducteur: +1
   ↓
   Interface mise à jour
   Badge "Terminé" affiché ✅
```

## 📊 Modifications des États

### Trajet

| État | Avant | Après |
|------|-------|-------|
| **status** | `active` | `completed` |
| **availableSeats** | 1 | 1 (inchangé) |

### Réservations Confirmées

| État | Avant | Après |
|------|-------|-------|
| **status** | `confirmed` | `completed` |

### Réservations Pending

| État | Avant | Après |
|------|-------|-------|
| **status** | `pending` | `pending` (inchangé) |

**Note** : Seules les réservations `confirmed` sont marquées comme `completed`. Les réservations `pending` restent inchangées.

### Compteur Conducteur

| Compteur | Avant | Après |
|----------|-------|-------|
| **tripsAsDriver** | 5 | 6 (+1) |

## 🎨 Interface Utilisateur

### Avant (Trajet Actif)

```
┌─────────────────────────────────────┐
│ Alger → Oran                        │
│ Badge: Actif                        │
│                                     │
│ [Voir propositions] [Réservations] │
│                                     │
│ [Annuler le trajet]                │  ← Un seul bouton
└─────────────────────────────────────┘
```

### Après (Trajet Actif)

```
┌─────────────────────────────────────┐
│ Alger → Oran                        │
│ Badge: Actif                        │
│                                     │
│ [Voir propositions] [Réservations] │
│                                     │
│ [Terminer]      [Annuler]          │  ← Deux boutons côte à côte
└─────────────────────────────────────┘
```

### Après Clic sur "Terminer"

```
┌─────────────────────────────────────┐
│ Alger → Oran                        │
│ Badge: Terminé                      │  ← Badge changé
│                                     │
│ [Voir propositions] [Réservations] │
│                                     │
│ (Pas de boutons d'action)          │  ← Boutons cachés
└─────────────────────────────────────┘
```

## 🛡️ Sécurité et Validations

### 1. Vérification de Propriété

```typescript
if (trip.driver.toString() !== req.user?.id) {
  throw ApiError.forbidden('Vous n\'êtes pas autorisé à terminer ce trajet');
}
```

**Protection** : Seul le conducteur propriétaire peut terminer le trajet.

### 2. Vérification de Statut

```typescript
if (trip.status !== 'active') {
  throw ApiError.badRequest('Seuls les trajets actifs peuvent être marqués comme terminés');
}
```

**Protection** : Un trajet déjà terminé ou annulé ne peut pas être marqué comme terminé.

### 3. Confirmation Utilisateur

```typescript
Alert.alert(
  'Terminer le trajet',
  'Marquer ce trajet comme terminé ? Les réservations confirmées seront également marquées comme terminées.',
  [...]
);
```

**Protection** : L'utilisateur doit confirmer l'action pour éviter les clics accidentels.

## 📈 Impact sur les Statistiques

### Compteur `tripsAsDriver`

Le compteur est incrémenté **uniquement** lorsque le trajet est marqué comme terminé :

```typescript
await User.findByIdAndUpdate(req.user?.id, {
  $inc: { tripsAsDriver: 1 },
});
```

**Avantage** : Les statistiques reflètent les trajets **réellement effectués**, pas seulement publiés.

### Dashboard Conducteur

Les statistiques affichées incluent :
- **Total de trajets** : Tous les trajets
- **Trajets actifs** : Trajets en cours
- **Trajets terminés** : Trajets marqués comme terminés ✅
- **Trajets annulés** : Trajets annulés

## 🎯 Cas d'Usage

### Cas 1 : Trajet Normal

1. **Publier** le trajet : Alger → Oran
2. **Accepter** 3 réservations
3. **Effectuer** le voyage
4. **Terminer** le trajet ✅
5. **Résultat** : Trajet et réservations marqués comme terminés

### Cas 2 : Trajet Partiellement Réservé

1. **Publier** le trajet : 4 places
2. **Accepter** 2 réservations (2 places restantes)
3. **Effectuer** le voyage
4. **Terminer** le trajet ✅
5. **Résultat** : Trajet terminé avec 2 places non utilisées

### Cas 3 : Trajet Sans Réservation

1. **Publier** le trajet
2. **Aucune** réservation
3. **Effectuer** le voyage (conducteur seul)
4. **Terminer** le trajet ✅
5. **Résultat** : Trajet terminé, compteur incrémenté

### Cas 4 : Tentative de Terminer un Trajet Annulé

1. **Publier** le trajet
2. **Annuler** le trajet
3. **Tenter** de terminer ❌
4. **Résultat** : Erreur "Seuls les trajets actifs peuvent être marqués comme terminés"

## 📁 Fichiers Modifiés

### Backend (3 fichiers)

1. **`backend/src/controllers/trip.controller.ts`**
   - Ajout de la fonction `completeTrip`
   - Lignes 288-336

2. **`backend/src/routes/trip.routes.ts`**
   - Import de `completeTrip`
   - Ajout de la route `PUT /:id/complete`
   - Lignes 7-8, 48

### Frontend (3 fichiers)

3. **`covoiturage-app/services/trip-service.ts`**
   - Ajout de la méthode `completeTrip`
   - Lignes 115-121

4. **`covoiturage-app/hooks/use-trips.ts`**
   - Ajout de la fonction `completeTrip`
   - Lignes 77-95, 125

5. **`covoiturage-app/app/(tabs)/trips.tsx`**
   - Ajout de l'état `completingTrip`
   - Ajout de la fonction `handleCompleteTrip`
   - Ajout du bouton "Terminer" dans l'UI
   - Ajout des styles
   - Lignes 23, 31, 146-173, 464-500, 823-866

## ✅ Checklist de Vérification

### Backend
- [x] ✅ Endpoint `PUT /api/trips/:id/complete` créé
- [x] ✅ Vérification de propriété (conducteur)
- [x] ✅ Vérification de statut (actif)
- [x] ✅ Mise à jour du trajet
- [x] ✅ Mise à jour des réservations
- [x] ✅ Incrémentation du compteur
- [x] ✅ Aucune erreur de compilation

### Frontend
- [x] ✅ Service `completeTrip` ajouté
- [x] ✅ Hook `completeTrip` ajouté
- [x] ✅ État `completingTrip` ajouté
- [x] ✅ Handler `handleCompleteTrip` ajouté
- [x] ✅ Bouton "Terminer" ajouté
- [x] ✅ Confirmation utilisateur
- [x] ✅ Loading state pendant l'action
- [x] ✅ Styles ajoutés
- [x] ✅ Aucune erreur de linting

### Tests à Effectuer
- [ ] ⏳ Test : Terminer un trajet actif
- [ ] ⏳ Test : Tentative de terminer un trajet annulé
- [ ] ⏳ Test : Tentative par un autre utilisateur
- [ ] ⏳ Test : Vérification du statut des réservations
- [ ] ⏳ Test : Vérification du compteur conducteur
- [ ] ⏳ Test : Interface UI (boutons, styles)

## 🚀 Démarrage

### 1. Redémarrer le Backend

```bash
cd backend
npm run dev
```

### 2. Tester dans l'Application

1. **Connectez-vous** en tant que conducteur
2. **Allez** dans l'onglet "Mes Trajets"
3. **Sélectionnez** un trajet actif
4. **Cliquez** sur "Terminer"
5. **Confirmez** l'action
6. **Vérifiez** : Badge "Terminé" affiché ✅

### 3. Vérifier dans MongoDB

```javascript
// Trajet
db.trips.findOne({ _id: ObjectId("...") })
// { status: "completed", ... }

// Réservations
db.bookings.find({ trip: ObjectId("..."), status: "completed" })

// Compteur conducteur
db.users.findOne({ _id: ObjectId("...") })
// { tripsAsDriver: ... }
```

## 📝 Résumé

### Avant ❌

- Pas de moyen pour le conducteur de marquer le trajet comme terminé
- Les trajets actifs restaient actifs indéfiniment
- Pas de différenciation entre trajets en cours et terminés

### Après ✅

- ✅ **Bouton "Terminer"** visible pour les trajets actifs
- ✅ **Confirmation** avant action
- ✅ **Statut** automatiquement mis à jour (trajet + réservations)
- ✅ **Compteur** incrémenté pour les statistiques
- ✅ **Interface** claire avec deux boutons côte à côte

---

**🎉 Fonctionnalité "Terminer le Trajet" Complète ! ✅**


