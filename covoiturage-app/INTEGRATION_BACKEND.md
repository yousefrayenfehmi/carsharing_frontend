# 🔗 Intégration Backend - Guide d'utilisation

Le frontend est maintenant connecté au backend ! Ce guide explique comment utiliser les services API dans votre application.

## 📦 Ce qui a été installé

```bash
npm install axios @react-native-async-storage/async-storage
```

- **axios** - Client HTTP pour les requêtes API
- **@react-native-async-storage/async-storage** - Stockage local pour les tokens

## 🗂️ Structure des services

```
services/
├── api.ts                  # Configuration axios de base
├── auth-service.ts         # Service d'authentification
├── trip-service.ts         # Service de gestion des trajets
├── booking-service.ts      # Service de réservations
└── user-service.ts         # Service utilisateurs

hooks/
├── use-auth.ts            # Hook d'authentification
├── use-trips.ts           # Hook pour les trajets
└── use-bookings.ts        # Hook pour les réservations
```

## 🔧 Configuration

### URL de l'API

L'URL de l'API est configurée automatiquement dans `services/api.ts` :

- **Émulateur Android** : `http://10.0.2.2:3000/api`
- **iOS Simulator / Web** : `http://localhost:3000/api`
- **Production** : `https://votre-api-backend.com/api`

### Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend démarre sur `http://localhost:3000`

## 🎯 Utilisation dans les composants

### 1. Authentification

```typescript
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { login, isLoading, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'test@example.com',
        password: 'password123'
      });
      // Redirection automatique
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <Button 
      onPress={handleLogin} 
      loading={isLoading}
    >
      Se connecter
    </Button>
  );
}
```

### 2. Inscription

```typescript
import { useAuth } from '@/contexts/auth-context';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();

  const handleSignup = async () => {
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        phoneNumber
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  // ...
}
```

### 3. Connexion Facebook

```typescript
import { useAuth } from '@/contexts/auth-context';
import { useFacebookAuth } from '@/hooks/use-facebook-auth';

export default function SignupScreen() {
  const { loginWithFacebook } = useAuth();
  
  const { signInWithFacebook, isLoading } = useFacebookAuth(
    async (user, token) => {
      try {
        // Envoyer au backend
        await loginWithFacebook(token, user.id);
        router.replace('/(tabs)');
      } catch (error: any) {
        Alert.alert('Erreur', error.message);
      }
    }
  );

  return (
    <Button onPress={signInWithFacebook} loading={isLoading}>
      Continuer avec Facebook
    </Button>
  );
}
```

### 4. Rechercher des trajets

```typescript
import { useTrips } from '@/hooks/use-trips';

export default function SearchScreen() {
  const { trips, searchTrips, loading } = useTrips();
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const handleSearch = async () => {
    try {
      await searchTrips({
        departureCity: departure,
        destinationCity: destination,
        date: new Date().toISOString(),
      });
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <View>
      <Input 
        placeholder="Ville de départ" 
        value={departure}
        onChangeText={setDeparture}
      />
      <Input 
        placeholder="Ville de destination"
        value={destination}
        onChangeText={setDestination}
      />
      <Button onPress={handleSearch} loading={loading}>
        Rechercher
      </Button>
      
      <FlatList
        data={trips}
        renderItem={({ item }) => (
          <TripCard trip={item} />
        )}
      />
    </View>
  );
}
```

### 5. Créer un trajet

```typescript
import { useTrips } from '@/hooks/use-trips';

export default function PublishScreen() {
  const { createTrip, loading } = useTrips();

  const handlePublish = async () => {
    try {
      const trip = await createTrip({
        departure: {
          city: 'Paris',
          latitude: 48.8566,
          longitude: 2.3522,
        },
        destination: {
          city: 'Lyon',
          latitude: 45.7640,
          longitude: 4.8357,
        },
        departureTime: new Date('2024-12-25T14:00:00'),
        price: 25,
        availableSeats: 3,
        description: 'Trajet tranquille',
      });
      
      Alert.alert('Succès', 'Trajet publié !');
      router.push(`/trip/${trip._id}`);
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  // ...
}
```

### 6. Réserver un trajet

```typescript
import { useBookings } from '@/hooks/use-bookings';

export default function TripDetailsScreen({ tripId }) {
  const { createBooking, loading } = useBookings();

  const handleBook = async () => {
    try {
      const booking = await createBooking({
        tripId,
        seats: 2,
        message: 'Bonjour, je serai à l\'heure !',
      });
      
      Alert.alert('Succès', 'Réservation créée !');
      router.push('/bookings');
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <Button onPress={handleBook} loading={loading}>
      Réserver
    </Button>
  );
}
```

### 7. Mes réservations

```typescript
import { useBookings } from '@/hooks/use-bookings';
import { useEffect } from 'react';

export default function BookingsScreen() {
  const { bookings, getMyBookings, loading } = useBookings();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      await getMyBookings(); // ou getMyBookings('confirmed')
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <FlatList
      data={bookings}
      renderItem={({ item }) => (
        <BookingCard booking={item} />
      )}
      refreshing={loading}
      onRefresh={loadBookings}
    />
  );
}
```

### 8. Mettre à jour le profil

```typescript
import { userService } from '@/services/user-service';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileEditScreen() {
  const { refreshProfile } = useAuth();

  const handleSave = async () => {
    try {
      await userService.updateProfile({
        firstName: 'Jean',
        lastName: 'Dupont',
        bio: 'Conducteur sympa',
      });
      
      // Rafraîchir le profil dans le contexte
      await refreshProfile();
      
      Alert.alert('Succès', 'Profil mis à jour !');
      router.back();
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    }
  };

  // ...
}
```

## 🔒 Gestion de l'authentification

### Token automatique

Le token JWT est automatiquement ajouté à chaque requête grâce à l'intercepteur axios dans `services/api.ts`.

### Déconnexion automatique

Si le token expire (erreur 401), l'utilisateur est automatiquement déconnecté.

### Vérifier l'authentification

```typescript
import { useAuth } from '@/contexts/auth-context';

export default function ProtectedScreen() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Text>Bonjour {user?.firstName} !</Text>;
}
```

## 🐛 Gestion des erreurs

Toutes les erreurs de l'API suivent ce format :

```typescript
try {
  await authService.login({ email, password });
} catch (error: any) {
  // error.response.data.message contient le message d'erreur
  const message = error.response?.data?.message || 'Une erreur est survenue';
  Alert.alert('Erreur', message);
}
```

## 🔄 Rafraîchir les données

```typescript
const { refreshProfile } = useAuth();
const { searchTrips } = useTrips();

// Rafraîchir le profil
await refreshProfile();

// Rafraîchir la recherche
await searchTrips({ ... });
```

## 📱 Test sur appareil physique

Si vous testez sur un appareil physique, vous devez :

1. **Trouver l'IP de votre ordinateur** :
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Modifier `services/api.ts`** :
   ```typescript
   const API_URL = __DEV__ 
     ? 'http://192.168.1.X:3000/api'  // Remplacer X par votre IP
     : 'https://votre-api.com/api';
   ```

3. **S'assurer que le backend et l'app sont sur le même réseau Wi-Fi**

## ✅ Checklist d'intégration

- [x] Axios et AsyncStorage installés
- [x] Services API créés (auth, trips, bookings, users)
- [x] Hooks personnalisés créés
- [x] Contexte d'authentification mis à jour
- [ ] Backend démarré (`npm run dev`)
- [ ] Tester l'inscription
- [ ] Tester la connexion
- [ ] Tester la recherche de trajets
- [ ] Tester la création de trajet
- [ ] Tester les réservations

## 🚀 Prochaines étapes

1. **Mettre à jour les écrans existants** pour utiliser les nouveaux services
2. **Ajouter la gestion d'erreurs** avec des messages clairs
3. **Implémenter le pull-to-refresh** sur les listes
4. **Ajouter des indicateurs de chargement**
5. **Déployer le backend** en production

## 📚 Ressources

- **Documentation backend** : `backend/README.md`
- **API Reference** : `backend/API.md`
- **Déploiement** : `backend/DEPLOYMENT.md`

---

**Le frontend et le backend sont maintenant connectés !** 🎉

Vous pouvez maintenant développer les fonctionnalités complètes de l'application.

