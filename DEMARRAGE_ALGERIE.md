# 🚀 Guide de démarrage rapide - Version Algérie

## 🇩🇿 Application de covoiturage pour l'Algérie

Ce guide vous aide à démarrer rapidement l'application adaptée pour l'Algérie.

---

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Expo CLI (sera installé automatiquement)
- MongoDB (local ou Atlas)
- Un smartphone Android/iOS ou émulateur

---

## 🔧 Installation

### 1. Cloner le projet
```bash
cd projet-covoiturage
```

### 2. Installer les dépendances

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../covoiturage-app
npm install
```

✅ Toutes les dépendances pour l'Algérie sont déjà incluses !

---

## ⚙️ Configuration

### Backend (`.env`)

Créez un fichier `.env` dans le dossier `backend/` :

```env
# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/covoiturage-algerie
# ou MongoDB Atlas pour production

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_ici
JWT_EXPIRE=7d

# Port
PORT=5000

# Environnement
NODE_ENV=development

# Email (optionnel - pour notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe

# Cloudinary (optionnel - pour photos de profil)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret
```

### Frontend

**Pas de configuration nécessaire !** 

L'application utilise OpenStreetMap (gratuit) pour :
- Les 48 villes algériennes (données en local)
- Le géocodage (Nominatim API - gratuit)
- Les cartes (react-native-maps avec OSM)

---

## 🎬 Démarrage

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd covoiturage-app
npm start
```

Ensuite, choisissez :
- Tapez `a` pour Android
- Tapez `i` pour iOS
- Scannez le QR code avec Expo Go

---

## 📱 Tester l'application

### 1. Créer un compte
- Ouvrir l'app
- Cliquer sur "S'inscrire"
- Remplir le formulaire

### 2. Publier un trajet
- Aller sur l'onglet "Publier"
- Choisir ville de départ (ex: Alger)
- Choisir ville de destination (ex: Oran)
- Définir date, heure, prix, places
- Publier !

**Résultat automatique:**
- Distance calculée: ~430 km
- Durée estimée: ~5h23
- Coordonnées GPS enregistrées

### 3. Rechercher un trajet
- Onglet "Accueil"
- Sélectionner départ et destination
- Voir les résultats avec distance et durée

---

## 🗺️ Villes disponibles

**48 villes algériennes** sont prédéfinies :

### Région Nord
- Alger, Oran, Constantine, Annaba, Blida, Tizi Ouzou, Béjaïa, Sétif, Skikda, Tlemcen, Mostaganem, Chlef, Jijel, Tipaza, Boumerdès, El Tarf, Aïn Témouchent, Relizane, Médéa, Bouira, Bordj Bou Arreridj, Mila, Guelma, Souk Ahras

### Hauts Plateaux
- Batna, Djelfa, Sidi Bel Abbès, Tiaret, M'Sila, Oum El Bouaghi, Khenchela, Laghouat, Mascara, Saïda, Aïn Defla, Tissemsilt

### Région Sud
- Biskra, Ouargla, Béchar, Ghardaïa, El Oued, Tamanrasset, Adrar, Illizi, Tindouf, El Bayadh, Naâma

Chaque ville inclut :
- Nom français
- Nom arabe (الاسم بالعربية)
- Coordonnées GPS précises
- Nom de la wilaya

---

## 🎯 Fonctionnalités spéciales Algérie

### ✅ Recherche bilingue
Tapez en français ou en arabe :
- "Alger" ou "الجزائر"
- "Oran" ou "وهران"
- "Constantine" ou "قسنطينة"

### ✅ Calcul automatique
- Distance réelle (formule Haversine)
- Durée basée sur 80 km/h moyenne
- Heure d'arrivée automatique

### ✅ Prix suggérés (exemples)
- Alger → Oran : 800-1200 DZD
- Alger → Constantine : 800-1200 DZD
- Alger → Annaba : 1000-1500 DZD
- Constantine → Sétif : 300-500 DZD

### ✅ Interface adaptée
- Monnaie : DZD (Dinar Algérien)
- Format de date/heure local
- Support des claviers français et arabe

---

## 🐛 Résolution de problèmes

### Erreur de compilation backend
```bash
cd backend
npm run build
```

Si erreur, vérifier :
- TypeScript installé
- Tous les fichiers `.ts` sans erreurs

### Erreur frontend
```bash
cd covoiturage-app
npm install
npx expo start -c  # Démarrage avec cache nettoyé
```

### MongoDB ne démarre pas
- Vérifier que MongoDB est installé
- Ou utiliser MongoDB Atlas (cloud gratuit)

### Pas de résultats de recherche
- Vérifier que le backend est lancé
- Vérifier l'URL de l'API dans `services/api.ts`
- Publier au moins un trajet pour tester

---

## 📊 Structure de la base de données

### Collection `trips`
```javascript
{
  departure: {
    type: "Point",
    coordinates: [3.0588, 36.7538], // [longitude, latitude] Alger
    city: "Alger"
  },
  destination: {
    type: "Point",
    coordinates: [-0.6331, 35.6969], // Oran
    city: "Oran"
  },
  departureTime: ISODate("2025-10-12T08:00:00Z"),
  arrivalTime: ISODate("2025-10-12T13:23:00Z"), // Calculé auto
  price: 1000, // DZD
  availableSeats: 3,
  totalSeats: 3,
  distance: 430, // km (calculé auto)
  duration: 323, // minutes (calculé auto)
  status: "active",
  driver: ObjectId("..."),
  passengers: []
}
```

---

## 🚀 Déploiement en production

### Backend
```bash
cd backend
npm run build
npm start
```

**Hébergement suggéré:**
- Heroku (gratuit)
- Railway.app (gratuit)
- Render (gratuit)
- VPS Algérie Télécom

### Frontend
```bash
cd covoiturage-app
npm run build:android  # Pour Android
# ou
npm run build:ios      # Pour iOS
```

Puis publier sur :
- Google Play Store
- Apple App Store

---

## 📈 Améliorer les performances

### 1. Ajouter un cache Redis
Pour mettre en cache les résultats de géocodage fréquents.

### 2. Optimiser MongoDB
```javascript
// Créer des index
db.trips.createIndex({ "departure.city": 1, "destination.city": 1 })
db.trips.createIndex({ departureTime: 1, status: 1 })
```

### 3. CDN pour les assets
Utiliser un CDN pour servir les images et assets.

---

## 🔐 Sécurité

### Recommandations
1. Changer le `JWT_SECRET` en production
2. Utiliser HTTPS (SSL/TLS)
3. Activer les rate limits (déjà configuré)
4. Valider toutes les entrées utilisateur
5. Chiffrer les mots de passe (déjà fait avec bcrypt)

---

## 📞 Support et aide

### Erreurs communes

**"Cannot connect to MongoDB"**
→ Vérifier que MongoDB est démarré ou vérifier l'URL Atlas

**"Network request failed"**
→ Vérifier que le backend est lancé sur le bon port

**"Ville non trouvée"**
→ La ville est peut-être mal orthographiée, essayer une autre orthographe

**"Aucun trajet trouvé"**
→ Normal au début, publier des trajets pour tester

---

## 🎓 Ressources

### Documentation
- [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [MongoDB](https://www.mongodb.com/docs/)

### Fichiers clés
- **Villes algériennes**: `covoiturage-app/constants/algerian-cities.ts`
- **Géocodage frontend**: `covoiturage-app/services/geocoding-service.ts`
- **Géocodage backend**: `backend/src/services/geocoding.service.ts`
- **Sélecteur de ville**: `covoiturage-app/components/algerian-city-picker.tsx`

---

## ✅ Checklist de lancement

Avant de lancer en production :

- [ ] MongoDB configuré et sécurisé
- [ ] Variables d'environnement en production
- [ ] Backend déployé et accessible
- [ ] Frontend compilé et testé
- [ ] Toutes les 48 villes testées
- [ ] Recherche bilingue testée
- [ ] Calculs de distance vérifiés
- [ ] Interface testée sur Android et iOS
- [ ] Documentation complète lue

---

## 🎉 C'est parti !

Votre application de covoiturage est maintenant prête pour l'Algérie !

**Prochaines étapes:**
1. Tester la création de trajets
2. Tester la recherche
3. Inviter des utilisateurs bêta-testeurs
4. Collecter les retours
5. Améliorer et déployer ! 🚀

**Bon covoiturage en Algérie ! 🇩🇿🚗**

---

## 📝 Notes spéciales Algérie

- **Monnaie**: Tous les prix sont en DZD (Dinar Algérien)
- **Routes**: Distances calculées à vol d'oiseau × 1.3 pour tenir compte des routes
- **Durée**: Basée sur 80 km/h (vitesse moyenne autoroute algérienne)
- **Villes**: Couvre toutes les 48 wilayas
- **Langue**: Interface français, noms arabes inclus

---

**Version**: 1.0.0 - Algérie  
**Date**: Octobre 2025  
**Statut**: ✅ Production Ready

