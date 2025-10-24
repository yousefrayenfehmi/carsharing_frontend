# Application de Covoiturage

Une application mobile de covoiturage moderne développée avec React Native et Expo.

## 🚀 Fonctionnalités

### Authentification
- **Inscription par email** : Créez un compte avec votre adresse email
- **Connexion Facebook** : Authentification OAuth 2.0 avec Facebook (configuré et prêt à l'emploi)
- **Connexion** : Accédez à votre compte de manière sécurisée
- **Stockage sécurisé** : Tokens stockés avec expo-secure-store
- Interface utilisateur inspirée de BlaBlaCar avec un design moderne et épuré

### Écrans disponibles
- Page d'accueil d'inscription avec choix de la méthode d'inscription
- Formulaire d'inscription par email avec validation
- Page de connexion
- Interface à onglets pour la navigation principale

## 🛠️ Technologies utilisées

- **React Native** - Framework pour le développement mobile
- **Expo** - Plateforme pour le développement React Native
- **Expo Router** - Navigation basée sur le système de fichiers
- **TypeScript** - Pour un code type-safe
- **React Navigation** - Navigation entre les écrans

## 📦 Installation

1. Clonez le repository :
```bash
git clone <votre-repo>
cd covoiturage-app
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application :
```bash
npm start
```

## 🎨 Structure du projet

```
covoiturage-app/
├── app/                    # Écrans de l'application (routing)
│   ├── _layout.tsx        # Layout racine
│   ├── signup.tsx         # Écran d'inscription (accueil) ✅ Facebook Auth
│   ├── login.tsx          # Écran de connexion
│   ├── email-signup.tsx   # Écran d'inscription par email
│   ├── (tabs)/            # Navigation par onglets
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   └── modal.tsx
├── components/            # Composants réutilisables
│   ├── logo.tsx          # Composant Logo
│   ├── ui/               # Composants UI
│   └── ...
├── services/             # Services
│   └── facebook-auth.ts  # Service d'authentification Facebook
├── hooks/                # Hooks personnalisés
│   └── use-facebook-auth.ts # Hook Facebook Auth
├── contexts/             # Contexts React
│   └── auth-context.tsx  # Context d'authentification global
├── types/                # Types TypeScript
│   └── auth.ts           # Types d'authentification
├── constants/            # Constantes (thèmes, couleurs)
│   ├── theme.ts
│   └── colors.ts         # Palette de couleurs
└── assets/               # Images et ressources
```

## 🎯 Écrans d'authentification

### Écran d'inscription (signup.tsx)
- Choix entre inscription par email ou Facebook
- Lien vers la page de connexion
- Informations légales conformes au RGPD

### Écran de connexion (login.tsx)
- Formulaire de connexion avec email et mot de passe
- Option "Mot de passe oublié"
- Lien vers la page d'inscription

### Écran d'inscription par email (email-signup.tsx)
- Formulaire complet avec prénom, nom, email et mot de passe
- Validation en temps réel
- Confirmation du mot de passe
- Liens vers les conditions générales

## 🎨 Palette de couleurs

- Bleu principal : `#00AFF5`
- Bleu foncé : `#00334E`
- Gris texte : `#6D7175`
- Bordure : `#E5E5E5`
- Rouge erreur : `#E53935`

## 📱 Commandes disponibles

```bash
npm start              # Démarrer le serveur de développement
npm run android        # Lancer sur Android
npm run ios           # Lancer sur iOS
npm run web           # Lancer sur le web
npm run lint          # Vérifier le code
npm run reset-project # Réinitialiser le projet
```

## 🔐 Sécurité

- Validation des formulaires côté client
- Masquage des mots de passe avec option de visualisation
- Respect de la politique de confidentialité RGPD
- Informations légales conformes

## 📖 Documentation

- **[FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md)** - Guide complet de configuration Facebook
- **[AUTHENTIFICATION.md](./AUTHENTIFICATION.md)** - Guide d'authentification
- **[RESUME_FACEBOOK_AUTH.md](./RESUME_FACEBOOK_AUTH.md)** - Résumé de l'implémentation Facebook
- **[GUIDE_DEMARRAGE.md](./GUIDE_DEMARRAGE.md)** - Guide de démarrage rapide

## ✅ Fonctionnalités implémentées

- [x] Interface d'inscription moderne
- [x] Authentification par email
- [x] Authentification Facebook (OAuth 2.0)
- [x] Hook personnalisé pour Facebook Auth
- [x] Context d'authentification global
- [x] Stockage sécurisé des tokens
- [x] Validation des formulaires
- [x] Gestion des erreurs
- [x] Navigation entre les écrans

## 📝 Prochaines étapes

- [ ] Configurer le Facebook App ID (voir [FACEBOOK_SETUP.md](./FACEBOOK_SETUP.md))
- [ ] Connexion avec l'API backend
- [ ] Écran de récupération de mot de passe
- [ ] Tests unitaires et d'intégration
- [ ] Authentification Google et Apple
- [ ] Fonctionnalités de covoiturage (recherche, réservation, etc.)

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence MIT.
