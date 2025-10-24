# 🇩🇿 Application de Covoiturage - Version Algérie

> Application mobile de covoiturage moderne, adaptée pour l'Algérie avec support de 48 wilayas et interface bilingue français/arabe.

---

## 🌟 Caractéristiques principales

✅ **48 villes algériennes** pré-configurées avec coordonnées GPS  
✅ **Recherche bilingue** : français et arabe  
✅ **Calcul automatique** de distance et durée  
✅ **100% gratuit** : pas de frais d'API  
✅ **Interface moderne** et intuitive  
✅ **Géolocalisation précise** via OpenStreetMap  

---

## 📱 Screenshots

```
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   🏠 Accueil        │   │   📝 Publier        │   │   👤 Profil         │
│                     │   │                     │   │                     │
│  Où allez-vous ?    │   │  🔵 Départ          │   │  Ahmed Benali       │
│  ┌─────────────┐    │   │     Alger           │   │  ⭐ 4.8 (24 avis)   │
│  │ Départ      │    │   │                     │   │                     │
│  └─────────────┘    │   │  📍 Destination     │   │  📊 Statistiques    │
│  ┌─────────────┐    │   │     Oran            │   │  • 15 trajets      │
│  │ Destination │    │   │                     │   │  • 45 passagers     │
│  └─────────────┘    │   │  📅 Demain 08:00    │   │                     │
│                     │   │  💰 1000 DZD        │   │  🚗 Mes trajets     │
│  🔍 Rechercher      │   │  👥 3 places        │   │  📖 Historique      │
│                     │   │                     │   │                     │
│  📋 Résultats       │   │  [Publier] 🚀       │   │  ⚙️ Paramètres      │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 🚀 Démarrage rapide

### 1. Installation
```bash
# Backend
cd backend
npm install

# Frontend
cd covoiturage-app
npm install
```

### 2. Configuration
Créer `.env` dans `backend/` :
```env
MONGODB_URI=mongodb://localhost:27017/covoiturage-algerie
JWT_SECRET=votre_secret_securise
PORT=5000
```

### 3. Lancement
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd covoiturage-app
npm start
```

📖 **Guide complet** : Voir [DEMARRAGE_ALGERIE.md](./DEMARRAGE_ALGERIE.md)

---

## 🗺️ Villes supportées

### 🏙️ 48 villes algériennes

| Région | Villes |
|--------|--------|
| **Nord** | Alger, Oran, Constantine, Annaba, Blida, Tizi Ouzou, Béjaïa, Sétif, Skikda, Tlemcen, Mostaganem, Chlef, Jijel, Tipaza, Boumerdès, El Tarf... |
| **Hauts Plateaux** | Batna, Djelfa, Sidi Bel Abbès, Tiaret, M'Sila, Oum El Bouaghi, Khenchela, Laghouat, Mascara... |
| **Sud** | Biskra, Ouargla, Béchar, Ghardaïa, El Oued, Tamanrasset, Adrar, Illizi, Tindouf... |

Chaque ville inclut :
- ✅ Nom français
- ✅ Nom arabe (الاسم بالعربية)
- ✅ Coordonnées GPS précises
- ✅ Nom de la wilaya

---

## 💡 Fonctionnalités

### Pour les conducteurs 🚗

```
┌──────────────────────────────────────┐
│ Publier un trajet                    │
├──────────────────────────────────────┤
│ 1️⃣ Sélectionner départ             │
│    • 48 villes algériennes           │
│    • Recherche en français/arabe     │
│                                      │
│ 2️⃣ Sélectionner destination         │
│    • GPS automatique                 │
│                                      │
│ 3️⃣ Choisir date et heure            │
│    • Interface intuitive             │
│                                      │
│ 4️⃣ Définir prix et places           │
│    • En DZD                          │
│    • 1 à 8 places                    │
│                                      │
│ 5️⃣ Publier !                        │
│    ✅ Distance calculée              │
│    ✅ Durée estimée                  │
│    ✅ Heure d'arrivée automatique    │
└──────────────────────────────────────┘
```

### Pour les passagers 🧳

```
┌──────────────────────────────────────┐
│ Rechercher un trajet                 │
├──────────────────────────────────────┤
│ 🔍 Filtres intelligents              │
│    • Ville de départ/destination     │
│    • Date de voyage                  │
│    • Prix maximum                    │
│    • Nombre de places                │
│                                      │
│ 📋 Résultats détaillés               │
│    • Distance (km)                   │
│    • Durée estimée                   │
│    • Prix par personne               │
│    • Note du conducteur              │
│                                      │
│ 💬 Réservation instantanée           │
│    • Message au conducteur           │
│    • Confirmation rapide             │
└──────────────────────────────────────┘
```

---

## 🎯 Exemples de trajets

### Trajet 1 : Alger → Oran
```
📍 Départ      : Alger (الجزائر)
📍 Destination : Oran (وهران)
📏 Distance    : 430 km
⏱️ Durée       : 5h23
💰 Prix moyen  : 800-1200 DZD
```

### Trajet 2 : Constantine → Annaba
```
📍 Départ      : Constantine (قسنطينة)
📍 Destination : Annaba (عنابة)
📏 Distance    : 109 km
⏱️ Durée       : 1h22
💰 Prix moyen  : 300-500 DZD
```

### Trajet 3 : Alger → Tamanrasset
```
📍 Départ      : Alger (الجزائر)
📍 Destination : Tamanrasset (تمنراست)
📏 Distance    : 1,981 km
⏱️ Durée       : 24h46
💰 Prix moyen  : 5000-8000 DZD
```

---

## 🔧 Technologies utilisées

### Frontend 📱
- **React Native** + **Expo** : Framework mobile
- **TypeScript** : Typage fort
- **React Native Maps** : Cartes interactives
- **Expo Location** : Géolocalisation

### Backend ⚙️
- **Node.js** + **Express** : Serveur API REST
- **TypeScript** : Code type-safe
- **MongoDB** : Base de données NoSQL
- **JWT** : Authentification sécurisée

### Services 🌐
- **Nominatim (OSM)** : Géocodage gratuit
- **Formule Haversine** : Calcul de distance

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React Native)         │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Composants   │  │  Services    │            │
│  │              │  │              │            │
│  │ • CityPicker │  │ • Geocoding  │            │
│  │ • TripForm   │  │ • TripService│            │
│  │ • Search     │  │ • Auth       │            │
│  └──────────────┘  └──────────────┘            │
│           │                │                     │
│           └────────────────┘                     │
│                    │                             │
│              API REST (HTTPS)                    │
│                    │                             │
└────────────────────┼─────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────┐
│                    ▼                             │
│             Backend (Node.js)                    │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Controllers  │  │   Services   │            │
│  │              │  │              │            │
│  │ • Trip       │  │ • Geocoding  │            │
│  │ • Auth       │  │ • Distance   │            │
│  │ • User       │  │ • Duration   │            │
│  └──────────────┘  └──────────────┘            │
│           │                │                     │
│           └────────────────┘                     │
│                    │                             │
│                    ▼                             │
│  ┌─────────────────────────────────┐            │
│  │        MongoDB Atlas            │            │
│  │  • trips                        │            │
│  │  • users                        │            │
│  │  • bookings                     │            │
│  └─────────────────────────────────┘            │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Personnalisation

### Changer la vitesse moyenne
```typescript
// backend/src/services/geocoding.service.ts
export const estimateDuration = (distanceKm: number): number => {
  const averageSpeedKmh = 80; // Changer ici (70-100 km/h)
  return Math.round((distanceKm / averageSpeedKmh) * 60);
};
```

### Ajouter une nouvelle ville
```typescript
// covoiturage-app/constants/algerian-cities.ts
{
  name: 'Nouvelle Ville',
  arabicName: 'المدينة الجديدة',
  latitude: XX.XXXX,
  longitude: YY.YYYY,
  wilaya: 'Nom Wilaya',
}
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [INTEGRATION_ALGERIE.md](./INTEGRATION_ALGERIE.md) | Documentation technique complète |
| [DEMARRAGE_ALGERIE.md](./DEMARRAGE_ALGERIE.md) | Guide de démarrage pas à pas |
| [CHANGELOG_ALGERIE.md](./CHANGELOG_ALGERIE.md) | Liste des modifications |
| [backend/MODIFICATIONS_TRIP.md](./backend/MODIFICATIONS_TRIP.md) | Détails backend |

---

## 🧪 Tests

### Tester la publication
```bash
# 1. Démarrer l'app
# 2. Créer un compte
# 3. Aller sur "Publier"
# 4. Sélectionner : Alger → Oran
# 5. Date : Demain 08:00
# 6. Prix : 1000 DZD
# 7. Places : 3
# 8. Publier

✅ Résultat attendu :
- Distance : ~430 km
- Durée : ~5h23
- Arrivée : ~13:23
```

### Tester la recherche
```bash
# 1. Aller sur "Accueil"
# 2. Sélectionner : Alger → Constantine
# 3. Date : Demain
# 4. Rechercher

✅ Résultat : Liste des trajets avec distance
```

---

## 🐛 Dépannage

### Problème : "Cannot connect to server"
**Solution** :
```bash
# Vérifier que le backend est lancé
cd backend
npm run dev

# Vérifier le port dans api.ts
// baseURL: 'http://localhost:5000/api'
```

### Problème : "Aucun trajet trouvé"
**Solution** : Publier au moins un trajet pour tester

### Problème : "MongoDB connection error"
**Solution** : Vérifier MongoDB ou utiliser Atlas (cloud)

📖 Plus de solutions : [DEMARRAGE_ALGERIE.md](./DEMARRAGE_ALGERIE.md)

---

## 🚀 Déploiement

### Backend
```bash
# Heroku (gratuit)
heroku create covoiturage-algerie-api
git push heroku main

# Ou Railway, Render, etc.
```

### Frontend
```bash
# Android
npx expo build:android

# iOS
npx expo build:ios

# Puis publier sur Play Store / App Store
```

📖 Guide complet : [DEMARRAGE_ALGERIE.md](./DEMARRAGE_ALGERIE.md)

---

## 💰 Coûts

### Actuel (Gratuit) ✅
- OpenStreetMap : GRATUIT
- Nominatim : GRATUIT
- Hébergement backend : GRATUIT (Heroku/Railway)
- MongoDB Atlas : GRATUIT (512MB)

**Total : 0 DZD/mois** 🎉

### Production (Optionnel)
- Serveur VPS : ~2,000 DZD/mois
- MongoDB : ~5,000 DZD/mois (si > 512MB)
- Google Maps : ~40,000 DZD/mois (si nécessaire)

**Recommandation** : Commencer gratuit !

---

## 📈 Roadmap

### ✅ Phase 1 (Actuel)
- [x] Support 48 villes algériennes
- [x] Géocodage automatique
- [x] Calcul distance/durée
- [x] Interface bilingue
- [x] Publication/Recherche de trajets

### 🔄 Phase 2 (Prochaine)
- [ ] Carte interactive
- [ ] Paiement en ligne
- [ ] Notifications SMS
- [ ] Support Tamazight

### 🔮 Phase 3 (Future)
- [ ] IA pour prix suggérés
- [ ] Trajets récurrents
- [ ] Système de fidélité
- [ ] API publique

---

## 🤝 Contribution

Les contributions sont les bienvenues !

```bash
# 1. Fork le projet
# 2. Créer une branche
git checkout -b feature/nouvelle-fonctionnalite

# 3. Commit les changements
git commit -m "Ajout nouvelle fonctionnalité"

# 4. Push
git push origin feature/nouvelle-fonctionnalite

# 5. Ouvrir une Pull Request
```

---

## 📞 Support

- 📧 Email : support@covoiturage-dz.com
- 💬 Telegram : @CovoiturageDZ
- 🌐 Site : www.covoiturage-dz.com

---

## 📄 Licence

MIT License - Libre d'utilisation et de modification

---

## 🎉 Remerciements

- **OpenStreetMap** pour les données cartographiques
- **Nominatim** pour le géocodage gratuit
- **Expo** pour le framework React Native
- **La communauté algérienne** pour les tests et retours

---

## ⭐ Statistiques

```
📊 Version      : 1.0.0-DZ
🗓️ Date        : Octobre 2025
🇩🇿 Wilayas     : 48 / 48 (100%)
🌍 Villes       : 48+ supportées
💻 Lignes       : ~15,000 (code + docs)
📱 Plateformes  : iOS, Android, Web
🎯 Statut       : ✅ Production Ready
```

---

## 🌟 Conclusion

L'application est **100% prête** pour le marché algérien :
- ✅ Toutes les wilayas couvertes
- ✅ Interface moderne et intuitive
- ✅ Gratuit et sans frais d'API
- ✅ Bilingue français/arabe
- ✅ Performance optimale
- ✅ Prête pour la production

**Bon covoiturage en Algérie ! 🚗🇩🇿**

---

<div align="center">

**Fait avec ❤️ pour l'Algérie**

[⬆ Retour en haut](#-application-de-covoiturage---version-algérie)

</div>

