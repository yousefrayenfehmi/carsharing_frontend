# 📋 Affichage des Réservations sur les Trajets

## 🎯 **Fonctionnalité Créée**

### **Objectif :**
Afficher directement les réservations de chaque trajet dans l'écran "Mes Trajets" du conducteur, permettant une vue d'ensemble complète et des actions rapides.

### **Fonctionnalités Ajoutées :**
- ✅ **Affichage intégré** : Réservations directement sur chaque carte de trajet
- ✅ **Compteur de réservations** : Nombre de réservations affiché sur le bouton
- ✅ **Actions rapides** : Confirmation des réservations en attente
- ✅ **Statuts visuels** : Badges colorés pour chaque statut de réservation
- ✅ **Informations détaillées** : Nom du passager, places, prix

## 🔧 **Backend - API Utilisée**

### **Endpoint Existant**
```typescript
// Dans booking-service.ts
async getTripBookings(tripId: string): Promise<Booking[]> {
  const response = await api.get(`/bookings/trip/${tripId}`);
  return response.data.data;
}
```

### **Endpoint de Confirmation**
```typescript
// Dans booking-service.ts
async confirmBookingNew(id: string): Promise<Booking> {
  const response = await api.put(`/bookings/${id}/confirm`);
  return response.data.data;
}
```

## 📱 **Frontend - Interface**

### **1. Hook useBookings Mis à Jour**
```typescript
// Dans use-bookings.ts
const getTripBookings = async (tripId: string) => {
  try {
    setLoading(true);
    setError(null);
    const tripBookings = await bookingService.getTripBookings(tripId);
    setBookings(tripBookings);
    return tripBookings;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Erreur lors de la récupération des réservations du trajet';
    setError(message);
    throw new Error(message);
  } finally {
    setLoading(false);
  }
};
```

### **2. Écran Trips Modifié**
```typescript
// Dans trips.tsx
const { getTripBookings, confirmBookingNew } = useBookings();
const [tripBookings, setTripBookings] = useState<{ [key: string]: any[] }>({});

const loadTrips = async () => {
  try {
    const data = await getMyTrips();
    setTrips(data);
    
    // Charger les réservations pour chaque trajet
    const bookings: { [key: string]: any[] } = {};
    for (const trip of data) {
      try {
        const tripBookings = await getTripBookings(trip._id);
        bookings[trip._id] = tripBookings;
      } catch (error) {
        bookings[trip._id] = [];
      }
    }
    setTripBookings(bookings);
  } catch (error: any) {
    Alert.alert('Erreur', error.message);
  }
};
```

## 🎨 **Interface Utilisateur**

### **Section des Réservations**
```typescript
{/* Affichage des réservations */}
{(tripBookings[trip._id] || []).length > 0 && (
  <View style={styles.bookingsSection}>
    <Text style={styles.bookingsSectionTitle}>
      Réservations ({tripBookings[trip._id].length})
    </Text>
    {tripBookings[trip._id].map((booking: any) => (
      <View key={booking._id} style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>
              {booking.passenger?.firstName} {booking.passenger?.lastName}
            </Text>
            <Text style={styles.bookingDetails}>
              {booking.seats} place{booking.seats > 1 ? 's' : ''} • {booking.totalPrice} DA
            </Text>
          </View>
          <View style={[
            styles.bookingStatusBadge,
            { backgroundColor: getBookingStatusColor(booking.status) }
          ]}>
            <Text style={styles.bookingStatusText}>
              {getBookingStatusText(booking.status)}
            </Text>
          </View>
        </View>
        
        {booking.status === 'pending' && (
          <TouchableOpacity
            style={styles.confirmBookingButton}
            onPress={() => handleConfirmBooking(booking._id, trip._id)}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primary} />
            <Text style={styles.confirmBookingButtonText}>Confirmer</Text>
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
)}
```

### **Bouton avec Compteur**
```typescript
<TouchableOpacity
  style={styles.bookingsButton}
  onPress={() => router.push('/trip-bookings')}
>
  <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
  <Text style={styles.bookingsButtonText}>
    Réservations
    {(tripBookings[trip._id] || []).length > 0 && ` (${(tripBookings[trip._id] || []).length})`}
  </Text>
</TouchableOpacity>
```

## 🎨 **Styles Ajoutés**

### **Section des Réservations**
```typescript
bookingsSection: {
  marginTop: 16,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: Colors.border.light,
},
bookingsSectionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: Colors.text.primary,
  marginBottom: 12,
},
```

### **Carte de Réservation**
```typescript
bookingCard: {
  backgroundColor: Colors.background.light,
  borderRadius: 8,
  padding: 12,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: Colors.border.light,
},
bookingHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 8,
},
```

### **Bouton de Confirmation**
```typescript
confirmBookingButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primary,
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 6,
  gap: 6,
},
```

## 🔄 **Fonctions Utilitaires**

### **Statuts des Réservations**
```typescript
const getBookingStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmée';
    case 'completed':
      return 'Terminée';
    case 'cancelled':
      return 'Annulée';
    default:
      return 'Inconnu';
  }
};

const getBookingStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FF9800'; // Orange
    case 'confirmed':
      return '#4CAF50'; // Vert
    case 'completed':
      return '#2196F3'; // Bleu
    case 'cancelled':
      return '#F44336'; // Rouge
    default:
      return '#757575'; // Gris
  }
};
```

### **Confirmation des Réservations**
```typescript
const handleConfirmBooking = async (bookingId: string, tripId: string) => {
  Alert.alert(
    'Confirmer la réservation',
    'Êtes-vous sûr de vouloir confirmer cette réservation ?',
    [
      {
        text: 'Non',
        style: 'cancel',
      },
      {
        text: 'Oui, confirmer',
        onPress: async () => {
          try {
            await confirmBookingNew(bookingId);
            Alert.alert('Succès', 'La réservation a été confirmée avec succès');
            loadTrips(); // Recharger pour mettre à jour
          } catch (error: any) {
            Alert.alert('Erreur', error.message);
          }
        },
      },
    ]
  );
};
```

## 🚀 **Avantages**

### **Pour le Conducteur**
- ✅ **Vue d'ensemble** : Toutes les réservations visibles directement
- ✅ **Actions rapides** : Confirmation en un clic
- ✅ **Informations complètes** : Passager, places, prix, statut
- ✅ **Navigation fluide** : Pas besoin d'écran séparé

### **Pour l'Application**
- ✅ **Performance** : Chargement optimisé des données
- ✅ **UX améliorée** : Interface plus intuitive
- ✅ **Efficacité** : Moins de navigation entre écrans
- ✅ **Visibilité** : Compteurs et statuts clairs

## 📋 **Fichiers Modifiés**

### **1. `covoiturage-app/hooks/use-bookings.ts`**
- ✅ Ajout de `getTripBookings` dans le hook
- ✅ Export de la fonction dans le retour

### **2. `covoiturage-app/app/(tabs)/trips.tsx`**
- ✅ Import du hook `useBookings`
- ✅ État `tripBookings` pour stocker les réservations
- ✅ Chargement des réservations dans `loadTrips`
- ✅ Affichage des réservations dans chaque carte
- ✅ Fonctions utilitaires pour les statuts
- ✅ Styles pour l'affichage des réservations

## 🎯 **Résultat**

### **Interface Complète :**
- ✅ **Cartes de trajets** : Avec réservations intégrées
- ✅ **Compteurs** : Nombre de réservations visible
- ✅ **Actions** : Confirmation directe des réservations en attente
- ✅ **Statuts** : Badges colorés pour chaque statut
- ✅ **Informations** : Détails complets du passager

### **Flux d'Utilisation :**
1. **Conducteur** ouvre "Mes Trajets"
2. **Voit** toutes ses réservations directement sur chaque trajet
3. **Confirme** les réservations en attente en un clic
4. **Surveille** les statuts en temps réel

---

**🎉 Les réservations sont maintenant affichées directement sur chaque trajet avec des actions rapides !** 🚗✨

