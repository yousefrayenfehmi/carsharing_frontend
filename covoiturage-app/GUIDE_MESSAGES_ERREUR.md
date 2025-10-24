# 🎨 Guide du Système de Messages d'Erreur

## Vue d'ensemble

Le système de messages d'erreur a été complètement revu pour offrir une expérience utilisateur moderne et conviviale. Les messages sont maintenant **visuels**, **clairs** et **adaptés aux utilisateurs finaux** (pas aux développeurs).

## ✨ Fonctionnalités

### 1. Composant Toast Stylé

Un composant de notification moderne avec :
- ✅ **4 types de messages** : success, error, warning, info
- ✅ **Animations fluides** : entrée/sortie avec spring animation
- ✅ **Auto-fermeture** : disparaît automatiquement après 4 secondes
- ✅ **Fermeture manuelle** : bouton pour fermer immédiatement
- ✅ **Design moderne** : icônes colorées, ombres, bordures arrondies
- ✅ **Responsive** : s'adapte à toutes les tailles d'écran

### 2. Messages Conviviaux

Les messages techniques sont traduits en français simple :
- ❌ "Token expired" → ✅ "Votre session a expiré. Veuillez vous reconnecter."
- ❌ "Network Error" → ✅ "Problème de connexion. Vérifiez votre réseau."
- ❌ "User not found" → ✅ "Compte introuvable."

## 📦 Composants Créés

### `/components/toast.tsx`
Composant de notification visuelle avec animations

### `/hooks/use-toast.ts`
Hook React pour gérer l'état du toast avec méthodes utilitaires :
```typescript
const { toast, showSuccess, showError, showWarning, showInfo, hideToast } = useToast();
```

### `/utils/error-messages.ts`
Dictionnaire de traduction des erreurs + fonction utilitaire :
```typescript
getUserFriendlyErrorMessage(error) // Traduit automatiquement l'erreur
```

## 🎯 Utilisation

### 1. Dans un composant React Native

```typescript
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';

export default function MyScreen() {
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();

  const handleAction = async () => {
    try {
      await someApiCall();
      showSuccess('Action réussie !');
    } catch (error) {
      const message = getUserFriendlyErrorMessage(error);
      showError(message);
    }
  };

  return (
    <SafeAreaView>
      {/* Votre contenu */}
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}
```

### 2. Types de messages

```typescript
// Succès (vert)
showSuccess('Trajet publié avec succès !');

// Erreur (rouge)
showError('Email ou mot de passe incorrect');

// Avertissement (orange)
showWarning('Veuillez remplir tous les champs');

// Information (bleu)
showInfo('Vérifiez votre email pour confirmer');
```

## 🔧 Backend : Messages Conviviaux

### Middleware d'Erreurs (`/middlewares/error.middleware.ts`)

Les erreurs backend sont automatiquement traduites :

```typescript
// Erreur de validation MongoDB
'ValidationError' → 'Certaines informations sont incorrectes. Veuillez vérifier les champs.'

// Email déjà utilisé
code: 11000 (email) → 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.'

// JWT expiré
'TokenExpiredError' → 'Votre session a expiré. Veuillez vous reconnecter.'

// ID invalide
'CastError' → 'Les informations fournies sont invalides. Veuillez réessayer.'
```

### Messages ApiError (`/utils/ApiError.ts`)

Les méthodes statiques ont maintenant des messages par défaut conviviaux :

```typescript
ApiError.unauthorized() 
// "Vous devez vous connecter pour continuer."

ApiError.forbidden() 
// "Vous n'avez pas la permission d'effectuer cette action."

ApiError.notFound() 
// "La ressource demandée est introuvable."

ApiError.internal() 
// "Une erreur est survenue. Nos équipes ont été notifiées."
```

## 📱 Écrans Mis à Jour

Les écrans suivants utilisent maintenant le nouveau système :

- ✅ `/login.tsx`
- ✅ `/signup.tsx`
- ✅ `/email-signup.tsx`
- ✅ `/forgot-password.tsx`
- ✅ `/reset-password.tsx`

## 🎨 Style du Toast

Le composant Toast s'affiche :
- **En haut de l'écran** (top: 50px)
- **Avec un z-index élevé** (9999)
- **Avec des ombres** pour le relief
- **Avec des bordures arrondies** (12px)
- **Avec des couleurs adaptées** selon le type

### Couleurs

- 🟢 Success: `#10B981` (vert)
- 🔴 Error: `#EF4444` (rouge)
- 🟠 Warning: `#F59E0B` (orange)
- 🔵 Info: `#3B82F6` (bleu)

## 🔄 Migration des Alert.alert

Pour migrer un composant existant :

### Avant :
```typescript
import { Alert } from 'react-native';

Alert.alert('Erreur', 'Email invalide');
```

### Après :
```typescript
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';

const { toast, showError, hideToast } = useToast();

showError('Email invalide');

// Dans le JSX
<Toast
  visible={toast.visible}
  message={toast.message}
  type={toast.type}
  onHide={hideToast}
/>
```

## 💡 Bonnes Pratiques

1. **Toujours traduire les erreurs** avec `getUserFriendlyErrorMessage()`
2. **Utiliser le bon type** : success/error/warning/info
3. **Messages courts et clairs** : max 2 lignes
4. **Pas de jargon technique** : "session expirée" au lieu de "token expired"
5. **Actionnable** : indiquer quoi faire ("Veuillez vous reconnecter")

## 🚀 Prochaines Étapes

Pour ajouter plus de messages conviviaux :

1. Ajouter des entrées dans `/utils/error-messages.ts`
2. Mettre à jour les messages backend dans les controllers
3. Remplacer les `Alert.alert` restants par le système Toast

## 📝 Exemple Complet

```typescript
// Page de connexion avec gestion d'erreur complète
import { Toast } from '@/components/toast';
import { useToast } from '@/hooks/use-toast';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';

export default function LoginScreen() {
  const { login } = useAuth();
  const { toast, showError, showSuccess, hideToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validation simple
    if (!email || !password) {
      showWarning('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login({ email, password });
      showSuccess('Connexion réussie !');
      router.replace('/(tabs)');
    } catch (error) {
      const message = getUserFriendlyErrorMessage(error);
      showError(message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Formulaire de connexion */}
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </SafeAreaView>
  );
}
```

---

**Résultat** : Une expérience utilisateur moderne avec des messages clairs, visuels et conviviaux ! 🎉

