# 🚀 Démarrage Rapide - 10 minutes

Guide pour démarrer l'application de covoiturage complète (Frontend + Backend) en 10 minutes.

---

## ⚡ Installation Express (5 minutes)

### 1. Cloner et installer

```bash
# Aller dans le dossier du projet
cd projet-covoiturage

# Installer le backend
cd backend
npm install

# Installer le frontend
cd ../covoiturage-app
npm install
```

### 2. Configuration minimale

```bash
# Créer le fichier .env pour le backend
cd ../backend
cp env.example .env
```

**Éditer `backend/.env`** avec ces valeurs minimales :

```env
# MongoDB (OBLIGATOIRE)
MONGODB_URI=mongodb://localhost:27017/covoiturage

# JWT Secrets (OBLIGATOIRE - changez ces valeurs !)
JWT_SECRET=mon_secret_jwt_super_securise_123456
JWT_REFRESH_SECRET=mon_refresh_secret_ultra_securise_789

# Le reste peut rester par défaut pour tester
PORT=3000
NODE_ENV=development
```

---

## 🗄️ MongoDB (2 options)

### Option A : MongoDB Local (Plus rapide)

**Windows**
```bash
# Télécharger : https://www.mongodb.com/try/download/community
# Installer et démarrer le service MongoDB
net start MongoDB
```

**Mac**
```bash
brew services start mongodb-community
```

**Linux**
```bash
sudo systemctl start mongod
```

### Option B : MongoDB Atlas (Cloud - Recommandé pour production)

1. Aller sur https://www.mongodb.com/cloud/atlas
2. Créer un compte gratuit
3. Créer un cluster (M0 - Gratuit)
4. Créer un utilisateur de base de données
5. Whitelist IP : `0.0.0.0/0`
6. Copier la connection string
7. Remplacer dans `.env` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/covoiturage
```

---

## 🚀 Démarrer l'application (2 minutes)

### Terminal 1 : Backend

```bash
cd backend
npm run dev
```

✅ **Backend démarré !**
```
🚗 ====================================== 🚗
   🚀 Serveur démarré avec succès !
   📡 Port: 3000
   📝 API: http://localhost:3000/api
🚗 ====================================== 🚗
```

### Terminal 2 : Frontend

```bash
cd covoiturage-app
npm start
```

Choisir :
- `a` pour Android
- `i` pour iOS
- `w` pour Web

✅ **Frontend démarré !**

---

## ✅ Vérifier que tout fonctionne

### 1. Tester le backend

```bash
# Dans un nouveau terminal
curl http://localhost:3000/health
```

Réponse attendue :
```json
{
  "success": true,
  "message": "API Covoiturage - Serveur opérationnel"
}
```

### 2. Tester l'inscription

Dans l'application mobile :
1. Cliquer sur "S'inscrire"
2. Remplir le formulaire
3. Cliquer sur "Créer un compte"

Si ça fonctionne → **Tout est OK !** ✅

---

## 🔧 Problèmes courants

### Backend ne démarre pas

**Erreur : Cannot connect to MongoDB**

```bash
# Vérifier que MongoDB est démarré
mongosh  # Doit se connecter sans erreur

# Si erreur, démarrer MongoDB
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Frontend ne se connecte pas au backend

**Pour émulateur Android**, vérifier dans `covoiturage-app/services/api.ts` :

```typescript
// Doit être 10.0.2.2 pour Android
const API_URL = 'http://10.0.2.2:3000/api';
```

**Pour appareil physique** :

1. Trouver l'IP de votre ordinateur :
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Modifier `covoiturage-app/services/api.ts` :
   ```typescript
   const API_URL = 'http://192.168.1.X:3000/api';  // Votre IP
   ```

---

## 📱 Test complet de l'application

### 1. Inscription

1. Ouvrir l'app
2. Cliquer sur "S'inscrire"
3. Remplir :
   - Email : `test@example.com`
   - Mot de passe : `password123`
   - Prénom : `Test`
   - Nom : `User`
4. Créer le compte

### 2. Connexion

1. Se déconnecter
2. Cliquer sur "Se connecter"
3. Entrer les mêmes identifiants
4. Connexion réussie !

### 3. Rechercher un trajet

1. Aller sur l'écran d'accueil
2. Entrer :
   - Départ : `Paris`
   - Destination : `Lyon`
3. Rechercher

(Aucun résultat pour l'instant, c'est normal)

### 4. Publier un trajet

1. Aller sur "Publier"
2. Remplir le formulaire
3. Publier

✅ **Tout fonctionne !**

---

## 📚 Prochaines étapes

### Développement

1. **Personnaliser l'interface** - Modifier les composants dans `covoiturage-app/components/`
2. **Ajouter des fonctionnalités** - Utiliser les hooks dans `covoiturage-app/hooks/`
3. **Consulter la documentation** :
   - Backend : `backend/README.md`
   - API : `backend/API.md`
   - Frontend : `covoiturage-app/INTEGRATION_BACKEND.md`

### Tests

```bash
# Backend - Tests unitaires (à implémenter)
cd backend
npm test

# Frontend - Tests E2E (à implémenter)
cd covoiturage-app
npm test
```

### Déploiement

Quand vous êtes prêt :
- **Backend** : Consultez `backend/DEPLOYMENT.md`
- **Frontend** : Utilisez Expo EAS Build

---

## 🎯 Structure des fichiers importants

```
projet-covoiturage/
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── models/          # Modèles MongoDB
│   │   ├── routes/          # Routes API
│   │   └── services/        # Services
│   ├── .env                 # ⚠️ À créer !
│   └── package.json
│
└── covoiturage-app/
    ├── app/                 # Écrans
    ├── services/            # Services API
    ├── hooks/               # Hooks personnalisés
    └── package.json
```

---

## 💡 Commandes utiles

### Backend

```bash
# Développement (avec rechargement auto)
npm run dev

# Production
npm run build
npm start

# Vérifier les erreurs
npm run lint
```

### Frontend

```bash
# Démarrer Expo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Voir les bases de données
show dbs

# Utiliser la base covoiturage
use covoiturage

# Voir les collections
show collections

# Voir les utilisateurs
db.users.find().pretty()
```

---

## 🔍 URLs importantes

### Développement

- **Backend API** : http://localhost:3000/api
- **Backend Health** : http://localhost:3000/health
- **Frontend Expo** : http://localhost:8081

### Documentation

- **Guide complet** : `INTEGRATION_COMPLETE.md`
- **API Reference** : `backend/API.md`
- **Backend** : `backend/README.md`
- **Frontend** : `covoiturage-app/INTEGRATION_BACKEND.md`

---

## 🎉 C'est parti !

Vous êtes maintenant prêt à développer votre application de covoiturage !

**En cas de problème** :
1. Vérifier MongoDB (mongosh)
2. Vérifier le backend (http://localhost:3000/health)
3. Vérifier les logs dans les terminaux
4. Consulter la documentation

**Bon développement ! 🚗💨**

