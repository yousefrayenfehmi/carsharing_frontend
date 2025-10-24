# Guide de Démarrage Rapide 🚀

## Installation et lancement

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer l'application
```bash
npm start
```

Vous pouvez ensuite :
- Appuyer sur `i` pour ouvrir sur iOS Simulator
- Appuyer sur `a` pour ouvrir sur Android Emulator
- Scanner le QR code avec l'app Expo Go sur votre téléphone

## Structure des écrans d'authentification

### 📱 Écran principal d'inscription (`/signup`)
- **Point d'entrée** de l'application
- Deux options d'inscription :
  - ✉️ Email
  - 📘 Facebook (à implémenter)
- Lien vers la connexion pour les utilisateurs existants

### 🔐 Écran de connexion (`/login`)
- Formulaire avec email et mot de passe
- Option "Mot de passe oublié"
- Bouton retour vers l'écran d'inscription
- Validation en temps réel

### ✍️ Écran d'inscription par email (`/email-signup`)
- Formulaire complet :
  - Prénom
  - Nom
  - Email
  - Mot de passe (min. 8 caractères)
  - Confirmation du mot de passe
- Validation en temps réel
- Messages d'erreur clairs
- Bouton désactivé si le formulaire est invalide

## Navigation entre les écrans

```
┌─────────────────┐
│    /signup      │ ◄── Point d'entrée (anchor)
│  (Inscription)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ /login  │ │ /email-signup│
└─────────┘ └──────────────┘
    │            │
    └────┬───────┘
         ▼
    ┌──────────┐
    │ /(tabs)  │
    │  (App)   │
    └──────────┘
```

## Personnalisation

### Couleurs
Toutes les couleurs sont centralisées dans `constants/colors.ts` :
```typescript
import { Colors } from '@/constants/colors';

// Utilisation
backgroundColor: Colors.primary
```

### Logo
Le logo est un composant réutilisable dans `components/logo.tsx` :
```typescript
import { Logo } from '@/components/logo';

<Logo size={60} /> // Taille personnalisable
```

## Prochaines étapes de développement

### 1. Backend et API
- [ ] Connecter à une API d'authentification
- [ ] Gérer les tokens JWT
- [ ] Implémenter le refresh token
- [ ] Stocker les credentials de manière sécurisée (SecureStore)

### 2. Validation et sécurité
- [ ] Ajouter une librairie de validation (Zod, Yup)
- [ ] Implémenter la vérification d'email
- [ ] Ajouter la récupération de mot de passe
- [ ] Implémenter la 2FA (authentification à deux facteurs)

### 3. Authentification sociale
- [ ] Intégrer Facebook Login
- [ ] Intégrer Google Sign-In
- [ ] Intégrer Apple Sign-In (pour iOS)

### 4. Gestion d'état
- [ ] Implémenter un gestionnaire d'état global (Zustand/Redux)
- [ ] Créer un contexte d'authentification
- [ ] Gérer la persistance de session

### 5. UI/UX
- [ ] Ajouter des animations (react-native-reanimated)
- [ ] Implémenter un loader pendant les requêtes
- [ ] Ajouter des toasts pour les notifications
- [ ] Mode sombre

## Exemple d'intégration avec une API

```typescript
// services/auth.ts
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch('https://votre-api.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Erreur de connexion');
  }
  
  return response.json();
}
```

## Commandes utiles

```bash
# Développement
npm start                 # Démarrer Expo
npm run android          # Lancer sur Android
npm run ios             # Lancer sur iOS

# Qualité du code
npm run lint            # Vérifier le code
npm run type-check      # Vérifier les types TypeScript

# Reset
npm run reset-project   # Réinitialiser le projet
```

## Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## Support

Pour toute question ou problème, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Bon développement ! 🎉**

