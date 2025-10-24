# Intégration des API avec les Actions - Application Covoiturage

## Vue d'ensemble

Cette documentation détaille comment les API backend sont connectées avec les actions de l'interface utilisateur dans l'application React Native.

## Architecture de l'intégration

```
┌─────────────────┐
│  Composants UI  │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│  Custom Hooks   │   │  Auth Context   │
└────────┬────────┘   └────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    │
            ┌───────▼───────┐
            │  API Services │
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │  Axios Client │
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │  Backend API  │
            └───────────────┘
```

## 1. Authentification

### Connexion par email (`login.tsx`)

**Hook utilisé:** `useAuth()`

**Actions:**
- Connexion avec email et mot de passe
- Gestion du chargement
- Affichage des erreurs
- Navigation après connexion réussie

```typescript
const { login, isLoading } = useAuth();

const handleLogin = async () => {
  try {
    await login({ email, password });
    router.replace('/(tabs)');
  } catch (error: any) {
    Alert.alert('Erreur de connexion', error.message);
  }
};
```

**API appelée:** `POST /api/auth/login`

**Flux:**
1. Utilisateur remplit le formulaire
2. Clique sur "Se connecter"
3. `handleLogin()` est appelé
4. `authService.login()` est invoqué
5. Le token est stocké dans SecureStore
6. L'utilisateur est mis à jour dans le contexte
7. Navigation vers l'écran principal

---

### Inscription par email (`email-signup.tsx`)

**Hook utilisé:** `useAuth()`

**Actions:**
- Inscription avec nom, prénom, email et mot de passe
- Validation du formulaire
- Gestion du chargement
- Affichage des erreurs

```typescript
const { signup, isLoading } = useAuth();

const handleSignup = async () => {
  try {
    await signup({
      email,
      password,
      firstName,
      lastName,
    });
    router.replace('/(tabs)');
  } catch (error: any) {
    Alert.alert('Erreur d\'inscription', error.message);
  }
};
```

**API appelée:** `POST /api/auth/signup`

**Flux:**
1. Utilisateur remplit le formulaire
2. Validation locale (mot de passe, confirmation)
3. Clique sur "S'inscrire"
4. `handleSignup()` est appelé
5. `authService.signup()` est invoqué
6. Compte créé et token reçu
7. Navigation vers l'écran principal

---

### Connexion Facebook (`signup.tsx`)

**Hooks utilisés:** `useAuth()` + `useFacebookAuth()`

**Actions:**
- Authentification via Facebook
- Envoi du token au backend
- Création/connexion du compte

```typescript
const { loginWithFacebook } = useAuth();
const { signInWithFacebook, isLoading } = useFacebookAuth(
  async (user: FacebookUser, token: string) => {
    await loginWithFacebook(token, user.id);
    router.replace('/(tabs)');
  },
  (error: string) => {
    Alert.alert('Erreur Facebook', error);
  }
);
```

**API appelée:** `POST /api/auth/facebook`

**Flux:**
1. Utilisateur clique sur "Continuer avec Facebook"
2. Popup Facebook s'ouvre
3. Authentification Facebook
4. Token Facebook reçu
5. `loginWithFacebook()` envoie le token au backend
6. Backend valide et crée/connecte le compte
7. Token JWT reçu et stocké
8. Navigation vers l'écran principal

---

## 2. Recherche de trajets

### Écran d'accueil (`(tabs)/index.tsx`)

**Hook utilisé:** `useTrips()`

**Actions:**
- Recherche de trajets disponibles
- Affichage des résultats
- Gestion du chargement

```typescript
const { searchTrips, isLoading } = useTrips();
const [searchResults, setSearchResults] = useState<any[]>([]);

const handleSearch = async (params: SearchParams) => {
  try {
    const results = await searchTrips({
      departure: params.departure.city,
      destination: params.destination.city,
      date: params.date.toISOString().split('T')[0],
      passengers: params.passengers,
    });
    
    setSearchResults(results);
    
    if (results.length === 0) {
      Alert.alert('Aucun résultat', 'Aucun trajet ne correspond à votre recherche.');
    }
  } catch (error: any) {
    Alert.alert('Erreur de recherche', error.message);
  }
};
```

**API appelée:** `GET /api/trips/search?departure=...&destination=...&date=...&passengers=...`

**Flux:**
1. Utilisateur remplit le formulaire de recherche
2. Clique sur "Rechercher"
3. `handleSearch()` est appelé
4. `tripService.searchTrips()` est invoqué
5. Résultats reçus du backend
6. Affichage des résultats ou message "Aucun résultat"

---

## 3. Publication de trajets

### Écran de publication (`(tabs)/publish.tsx`)

**Hooks utilisés:** `useAuth()` + `useTrips()`

**Actions:**
- Vérification de l'authentification
- Création d'un nouveau trajet
- Validation du formulaire
- Gestion du chargement

```typescript
const { isAuthenticated } = useAuth();
const { createTrip, isLoading } = useTrips();

const handlePublish = async () => {
  // Vérifier l'authentification
  if (!isAuthenticated) {
    Alert.alert('Connexion requise', 'Vous devez être connecté pour publier un trajet');
    return;
  }

  // Validation
  if (!departure || !destination) {
    Alert.alert('Informations manquantes', '...');
    return;
  }

  try {
    // Combiner date et heure
    const departureDateTime = new Date(departureDate);
    departureDateTime.setHours(departureTime.getHours());
    departureDateTime.setMinutes(departureTime.getMinutes());

    await createTrip({
      departure,
      destination,
      departureTime: departureDateTime.toISOString(),
      availableSeats,
      pricePerSeat: parseFloat(price),
      description: description.trim() || undefined,
    });

    Alert.alert('Trajet publié !', '...');
    
    // Réinitialiser le formulaire
    // ...
  } catch (error: any) {
    Alert.alert('Erreur', error.message);
  }
};
```

**API appelée:** `POST /api/trips` (nécessite authentification)

**Flux:**
1. Utilisateur remplit le formulaire de publication
2. Clique sur "Publier le trajet"
3. Vérification de l'authentification
4. Validation du formulaire
5. `handlePublish()` est appelé
6. `tripService.createTrip()` est invoqué avec le token JWT
7. Trajet créé dans la base de données
8. Confirmation affichée
9. Formulaire réinitialisé

---

## 4. Profil utilisateur

### Écran de profil (`(tabs)/profile.tsx`)

**Hook utilisé:** `useAuth()`

**Actions:**
- Affichage du profil
- Modification du profil
- Déconnexion

```typescript
const { user, isAuthenticated, logout, updateUser } = useAuth();

const handleSaveProfile = async () => {
  if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
    Alert.alert('Erreur', 'Le prénom et le nom sont obligatoires');
    return;
  }

  try {
    await updateUser({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      phoneNumber: editForm.phoneNumber,
    });

    setShowEditModal(false);
    Alert.alert('Succès', 'Votre profil a été mis à jour');
  } catch (error: any) {
    Alert.alert('Erreur', error.message);
  }
};

const handleLogout = () => {
  Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
    { text: 'Annuler', style: 'cancel' },
    {
      text: 'Déconnexion',
      style: 'destructive',
      onPress: async () => {
        await logout();
        router.replace('/login');
      },
    },
  ]);
};
```

**APIs appelées:**
- `PUT /api/users/profile` (mise à jour du profil)
- Déconnexion locale (suppression du token)

**Flux - Mise à jour du profil:**
1. Utilisateur clique sur "Modifier le profil"
2. Modal s'ouvre avec le formulaire pré-rempli
3. Utilisateur modifie les informations
4. Clique sur "Enregistrer"
5. `handleSaveProfile()` est appelé
6. `userService.updateProfile()` est invoqué
7. Profil mis à jour dans la base de données
8. Contexte d'authentification mis à jour
9. Modal fermée et confirmation affichée

**Flux - Déconnexion:**
1. Utilisateur clique sur "Se déconnecter"
2. Confirmation demandée
3. `handleLogout()` est appelé
4. Token supprimé du SecureStore
5. État d'authentification réinitialisé
6. Navigation vers l'écran de connexion

---

## 5. Gestion des tokens JWT

### Stockage sécurisé

Les tokens sont stockés de manière sécurisée avec `expo-secure-store`:

```typescript
// Stockage
await SecureStore.setItemAsync('accessToken', token);
await SecureStore.setItemAsync('refreshToken', refreshToken);

// Récupération
const token = await SecureStore.getItemAsync('accessToken');

// Suppression
await SecureStore.deleteItemAsync('accessToken');
await SecureStore.deleteItemAsync('refreshToken');
```

### Auto-inclusion dans les requêtes

Les tokens sont automatiquement inclus dans toutes les requêtes authentifiées via un intercepteur Axios:

```typescript
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Rafraîchissement automatique

En cas de token expiré (401), un rafraîchissement automatique est tenté:

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (refreshToken) {
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        await SecureStore.setItemAsync('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## 6. Gestion des erreurs

### Affichage des erreurs

Toutes les erreurs API sont capturées et affichées à l'utilisateur via `Alert.alert()`:

```typescript
try {
  await apiCall();
} catch (error: any) {
  Alert.alert(
    'Titre de l\'erreur',
    error.message || 'Message par défaut'
  );
}
```

### Types d'erreurs gérées

1. **Erreurs de validation (400)**: Champs manquants ou invalides
2. **Erreurs d'authentification (401)**: Token invalide ou expiré
3. **Erreurs d'autorisation (403)**: Accès non autorisé
4. **Erreurs de ressource (404)**: Ressource non trouvée
5. **Erreurs serveur (500)**: Erreur interne du serveur
6. **Erreurs réseau**: Pas de connexion internet

---

## 7. États de chargement

Tous les hooks fournissent un état `isLoading` pour afficher des indicateurs de chargement:

```typescript
{isLoading ? (
  <ActivityIndicator size="small" color="#fff" />
) : (
  <Text>Texte du bouton</Text>
)}
```

Ou pour désactiver les boutons pendant le chargement:

```typescript
<TouchableOpacity
  disabled={isLoading}
  onPress={handleAction}
>
  {/* ... */}
</TouchableOpacity>
```

---

## 8. Configuration de l'API

L'URL de l'API est configurée dans `services/api.ts`:

```typescript
const API_URL = __DEV__
  ? 'http://localhost:5000/api'  // Développement
  : 'https://votre-api.com/api';  // Production
```

Pour tester sur un appareil physique en développement, utilisez l'IP locale:

```typescript
const API_URL = __DEV__
  ? 'http://192.168.1.X:5000/api'  // Remplacez X par votre IP
  : 'https://votre-api.com/api';
```

---

## 9. Hooks personnalisés disponibles

### `useAuth()`
- `user`: Utilisateur connecté
- `isAuthenticated`: État de connexion
- `isLoading`: Chargement
- `login()`: Connexion
- `signup()`: Inscription
- `loginWithFacebook()`: Connexion Facebook
- `logout()`: Déconnexion
- `updateUser()`: Mise à jour du profil
- `refreshProfile()`: Rafraîchir les données utilisateur

### `useTrips()`
- `searchTrips()`: Rechercher des trajets
- `createTrip()`: Créer un trajet
- `getUserTrips()`: Obtenir les trajets de l'utilisateur
- `getTripById()`: Obtenir un trajet par ID
- `cancelTrip()`: Annuler un trajet
- `isLoading`: État de chargement
- `error`: Erreur éventuelle

### `useBookings()`
- `createBooking()`: Créer une réservation
- `getUserBookings()`: Obtenir les réservations de l'utilisateur
- `cancelBooking()`: Annuler une réservation
- `updateBookingStatus()`: Mettre à jour le statut
- `createReview()`: Créer un avis
- `isLoading`: État de chargement
- `error`: Erreur éventuelle

---

## 10. Prochaines étapes

### Fonctionnalités à implémenter

1. **Écran de résultats de recherche**
   - Afficher les trajets trouvés
   - Filtres avancés
   - Tri des résultats

2. **Détails d'un trajet**
   - Informations complètes
   - Profil du conducteur
   - Réservation

3. **Gestion des réservations**
   - Liste des réservations
   - Statuts et notifications
   - Annulation

4. **Système d'avis**
   - Notation des trajets
   - Commentaires
   - Historique

5. **Notifications push**
   - Nouvelles réservations
   - Confirmations
   - Rappels

6. **Chat entre utilisateurs**
   - Messages directs
   - Notifications
   - Historique

---

## Conclusion

L'intégration entre le frontend et le backend est maintenant complète pour les fonctionnalités de base:
- ✅ Authentification (email et Facebook)
- ✅ Recherche de trajets
- ✅ Publication de trajets
- ✅ Gestion du profil
- ✅ Gestion automatique des tokens
- ✅ Gestion des erreurs
- ✅ États de chargement

L'architecture mise en place permet d'ajouter facilement de nouvelles fonctionnalités en suivant les mêmes patterns.

