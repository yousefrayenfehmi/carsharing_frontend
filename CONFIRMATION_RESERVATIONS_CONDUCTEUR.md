# 📋 Confirmation des Réservations - Conducteur

## 🎯 **Fonctionnalité Créée**

### **Objectif :**
Permettre au conducteur de voir et confirmer les réservations en attente pour ses trajets.

### **Fonctionnalités Ajoutées :**
- ✅ **Endpoint backend** pour confirmer les réservations
- ✅ **Service frontend** pour appeler l'API
- ✅ **Écran dédié** pour voir les réservations d'un trajet
- ✅ **Bouton de confirmation** pour les réservations en attente
- ✅ **Interface intuitive** avec informations du passager

## 🔧 **Backend - API**

### **1. Nouveau Endpoint**
```typescript
/**
 * @route   PUT /api/bookings/:id/confirm
 * @desc    Confirmer une réservation (conducteur)
 * @access  Private
 */
export const confirmBooking = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('trip')
      .populate('passenger', 'firstName lastName profilePicture phoneNumber');

    if (!booking) {
      throw ApiError.notFound('Réservation non trouvée');
    }

    // Vérifier que l'utilisateur est le conducteur
    if (booking.driver.toString() !== req.user?.id) {
      throw ApiError.forbidden('Seul le conducteur peut confirmer cette réservation');
    }

    // Vérifier que la réservation est en attente
    if (booking.status !== 'pending') {
      throw ApiError.badRequest('Cette réservation ne peut pas être confirmée');
    }

    // Confirmer la réservation
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    await booking.save();

    // ... retour de la réponse
  }
);
```

### **2. Modèle Booking Mis à Jour**
```typescript
export interface IBooking extends Document {
  // ... champs existants ...
  confirmedAt?: Date;
  // ... autres champs ...
}

// Schéma Mongoose
confirmedAt: {
  type: Date,
},
```

### **3. Route Ajoutée**
```typescript
// Confirmer une réservation (conducteur)
router.put('/:id/confirm', authenticate, confirmBooking);
```

## 📱 **Frontend - Interface**

### **1. Service API**
```typescript
// Dans booking-service.ts
async confirmBookingNew(id: string): Promise<Booking> {
  const response = await api.put(`/bookings/${id}/confirm`);
  return response.data.data;
}
```

### **2. Hook useBookings**
```typescript
const confirmBookingNew = async (id: string) => {
  try {
    setLoading(true);
    setError(null);
    const booking = await bookingService.confirmBookingNew(id);
    return booking;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Erreur lors de la confirmation';
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};
```

### **3. Écran Trip Bookings**
```typescript
// Nouvel écran: covoiturage-app/app/trip-bookings.tsx
export default function TripBookingsScreen() {
  const { getTripBookings, loading, confirmBookingNew } = useBookings();
  
  const handleConfirmBooking = async (bookingId: string) => {
    Alert.alert(
      'Confirmer la réservation',
      'Êtes-vous sûr de vouloir confirmer cette réservation ?',
      [
        {
          text: 'Oui, confirmer',
          onPress: async () => {
            try {
              await confirmBookingNew(bookingId);
              Alert.alert('Succès', 'La réservation a été confirmée avec succès');
              loadBookings();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };
}
```

## 🎨 **Interface Utilisateur**

### **Écran des Réservations**
- **Header** : Titre "Réservations du Trajet" avec bouton retour
- **Liste** : Cartes des réservations avec informations détaillées
- **Actions** : Bouton de confirmation pour les réservations en attente

### **Carte de Réservation**
```typescript
<View style={styles.card}>
  {/* Header avec info passager */}
  <View style={styles.cardHeader}>
    <View style={styles.passengerSection}>
      <Image source={{ uri: passenger.profilePicture }} />
      <View style={styles.passengerInfo}>
        <Text>{passenger.firstName} {passenger.lastName}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text>{passenger.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
    <View style={styles.statusBadge}>
      <Text>{booking.status}</Text>
    </View>
  </View>

  {/* Route */}
  <View style={styles.route}>
    <Text>{trip.departure.city}</Text>
    <Text>{trip.destination.city}</Text>
  </View>

  {/* Informations */}
  <View style={styles.bookingInfo}>
    <Text>Date: {trip.departureTime}</Text>
    <Text>Places: {booking.seats}</Text>
    <Text>Prix: {booking.totalPrice} DA</Text>
  </View>

  {/* Actions */}
  {booking.status === 'pending' && (
    <TouchableOpacity style={styles.confirmButton}>
      <Ionicons name="checkmark-circle-outline" size={18} />
      <Text>Confirmer la réservation</Text>
    </TouchableOpacity>
  )}
</View>
```

### **Bouton de Confirmation**
```typescript
confirmButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primary,
  paddingVertical: 12,
  borderRadius: 8,
  gap: 8,
},
confirmButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.text.white,
},
```

## 🔄 **Flux d'Utilisation**

### **Processus de Confirmation**
1. **Conducteur** va dans "Mes Trajets"
2. **Clique** sur "Réservations" pour un trajet
3. **Voit** la liste des réservations avec leurs statuts
4. **Clique** sur "Confirmer la réservation" pour une réservation en attente
5. **Confirme** l'action dans la popup
6. **Voit** la réservation passer au statut "Confirmée"

### **États des Réservations**
- **En attente** : Bouton de confirmation disponible
- **Confirmée** : Information "Réservation confirmée"
- **Terminée** : Aucune action
- **Annulée** : Aucune action

## 🚀 **Avantages**

### **Pour le Conducteur**
- ✅ **Contrôle** : Peut voir toutes les réservations de ses trajets
- ✅ **Flexibilité** : Confirme seulement les réservations souhaitées
- ✅ **Information** : Voit les détails du passager avant confirmation
- ✅ **Organisation** : Interface claire et intuitive

### **Pour l'Application**
- ✅ **Sécurité** : Seul le conducteur peut confirmer ses réservations
- ✅ **Validation** : Vérification des permissions et statuts
- ✅ **Performance** : API optimisée et réactive
- ✅ **UX** : Interface utilisateur intuitive

## 📋 **Fichiers Créés/Modifiés**

### **Backend**
1. **`backend/src/controllers/booking.controller.ts`**
   - ✅ Ajout de la fonction `confirmBooking`
   - ✅ Validation des permissions
   - ✅ Mise à jour du statut et timestamp

2. **`backend/src/models/Booking.ts`**
   - ✅ Ajout du champ `confirmedAt` dans l'interface
   - ✅ Ajout du champ dans le schéma Mongoose

3. **`backend/src/routes/booking.routes.ts`**
   - ✅ Ajout de la route `PUT /:id/confirm`
   - ✅ Import de la fonction `confirmBooking`

### **Frontend**
1. **`covoiturage-app/services/booking-service.ts`**
   - ✅ Ajout de `confirmBookingNew`

2. **`covoiturage-app/hooks/use-bookings.ts`**
   - ✅ Ajout de `confirmBookingNew`
   - ✅ Export dans le retour du hook

3. **`covoiturage-app/app/trip-bookings.tsx`** (Nouveau)
   - ✅ Écran complet pour voir les réservations
   - ✅ Interface avec informations du passager
   - ✅ Bouton de confirmation avec gestion d'état

4. **`covoiturage-app/app/(tabs)/trips.tsx`**
   - ✅ Ajout du bouton "Réservations"
   - ✅ Navigation vers l'écran des réservations

## 🎯 **Résultat**

### **Fonctionnalité Complète :**
- ✅ **Backend** : API de confirmation fonctionnelle
- ✅ **Frontend** : Interface utilisateur complète
- ✅ **Sécurité** : Validation des permissions
- ✅ **UX** : Processus intuitif et fluide

---

**🎉 Le conducteur peut maintenant voir et confirmer les réservations en attente pour ses trajets !** 🚗✨

