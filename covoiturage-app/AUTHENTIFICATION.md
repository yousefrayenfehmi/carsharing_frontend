# Guide d'authentification 🔐

Ce document explique comment fonctionne l'authentification dans l'application de covoiturage.

## 📱 Méthodes d'authentification disponibles

### 1. Authentification par Email ✉️
- Inscription avec email, prénom, nom et mot de passe
- Validation en temps réel du formulaire
- Confirmation du mot de passe
- Connexion avec email et mot de passe

### 2. Authentification Facebook 📘
- Connexion via OAuth 2.0
- Récupération automatique du profil utilisateur
- Pas besoin de créer un mot de passe

## 🏗️ Architecture

### Structure des fichiers

```
covoiturage-app/
├── app/
│   ├── signup.tsx           # Écran principal d'inscription
│   ├── login.tsx            # Écran de connexion
│   └── email-signup.tsx     # Inscription par email
├── services/
│   └── facebook-auth.ts     # Service d'authentification Facebook
├── hooks/
│   └── use-facebook-auth.ts # Hook React pour Facebook Auth
└── types/
    └── auth.ts              # Types TypeScript pour l'auth
```

### Flux d'authentification

#### Email
```
signup.tsx → email-signup.tsx → (validation) → /(tabs)
```

#### Facebook
```
signup.tsx → Facebook OAuth → Callback → /(tabs)
```

## 🔧 Utilisation

### Hook Facebook Auth

Le hook `useFacebookAuth` simplifie l'authentification Facebook :

```typescript
import { useFacebookAuth } from '@/hooks/use-facebook-auth';

const { signInWithFacebook, isLoading, user, error } = useFacebookAuth(
  // Callback de succès
  (user, token) => {
    console.log('Utilisateur:', user);
    console.log('Token:', token);
    // Rediriger vers l'app
    router.replace('/(tabs)');
  },
  // Callback d'erreur
  (error) => {
    console.error('Erreur:', error);
  }
);

// Utilisation
<Button onPress={signInWithFacebook} disabled={isLoading}>
  {isLoading ? 'Connexion...' : 'Se connecter avec Facebook'}
</Button>
```

### Service Facebook Auth

Le service `facebook-auth.ts` contient les fonctions utilitaires :

```typescript
import { getFacebookUserInfo, FACEBOOK_APP_ID } from '@/services/facebook-auth';

// Récupérer les infos utilisateur
const user = await getFacebookUserInfo(accessToken);
```

## 🔐 Données utilisateur

### Type User (Email)
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
}
```

### Type FacebookUser
```typescript
interface FacebookUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  first_name?: string;
  last_name?: string;
}
```

## 🚀 Intégration avec un Backend

### 1. Inscription par email

```typescript
// app/email-signup.tsx
const handleSignup = async () => {
  try {
    const response = await fetch('https://votre-api.com/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    });

    const data = await response.json();
    
    // Stocker le token
    await SecureStore.setItemAsync('userToken', data.token);
    
    // Naviguer vers l'app
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Erreur inscription:', error);
  }
};
```

### 2. Connexion Facebook

```typescript
// app/signup.tsx
const { signInWithFacebook } = useFacebookAuth(
  async (user, token) => {
    try {
      // Envoyer au backend
      const response = await fetch('https://votre-api.com/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facebookToken: token,
          userId: user.id,
          email: user.email,
          name: user.name,
        }),
      });

      const data = await response.json();
      
      // Stocker le token de votre backend
      await SecureStore.setItemAsync('userToken', data.token);
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur backend:', error);
    }
  }
);
```

## 🔒 Sécurité

### Stockage sécurisé des tokens

Utilisez `expo-secure-store` pour stocker les tokens de manière sécurisée :

```bash
npm install expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store';

// Stocker
await SecureStore.setItemAsync('userToken', token);

// Récupérer
const token = await SecureStore.getItemAsync('userToken');

// Supprimer
await SecureStore.deleteItemAsync('userToken');
```

### Validation côté backend

⚠️ **Important** : Validez toujours les tokens côté serveur !

#### Exemple Node.js/Express

```javascript
// Vérifier le token Facebook
const verifyFacebookToken = async (token) => {
  const response = await fetch(
    `https://graph.facebook.com/debug_token?` +
    `input_token=${token}&` +
    `access_token=${FB_APP_ID}|${FB_APP_SECRET}`
  );
  
  const data = await response.json();
  return data.data.is_valid;
};

// Route d'authentification
app.post('/auth/facebook', async (req, res) => {
  const { facebookToken, userId } = req.body;
  
  // Vérifier le token
  const isValid = await verifyFacebookToken(facebookToken);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Token invalide' });
  }
  
  // Créer ou récupérer l'utilisateur
  const user = await User.findOrCreate({ facebookId: userId });
  
  // Générer votre propre token JWT
  const jwtToken = jwt.sign({ userId: user.id }, JWT_SECRET);
  
  res.json({ token: jwtToken, user });
});
```

## 🎯 Prochaines étapes

### Authentification persistante

Créez un contexte d'authentification pour gérer l'état global :

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        // Récupérer les infos utilisateur
        const response = await fetch('https://votre-api.com/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    await SecureStore.setItemAsync('userToken', token);
    await loadUser();
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protection des routes

```typescript
// app/_layout.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Redirect href="/signup" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

## 📚 Ressources

- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [JWT Best Practices](https://jwt.io/introduction)

## 🐛 Problèmes courants

### "Token expired"
- Implémentez un système de refresh token
- Reconnectez automatiquement l'utilisateur

### "Network request failed"
- Vérifiez la connexion internet
- Ajoutez un système de retry

### "Invalid credentials"
- Vérifiez que les identifiants sont corrects
- Affichez un message d'erreur clair à l'utilisateur

---

**Pour configurer Facebook, consultez [FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md)**

