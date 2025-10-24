# Guide de test de l'intégration API

## Prérequis

Avant de tester l'intégration, assurez-vous que:

1. ✅ Le backend est démarré et accessible
2. ✅ Les dépendances frontend sont installées
3. ✅ L'URL de l'API est correctement configurée

---

## 1. Configuration de l'URL de l'API

### Pour un émulateur Android/iOS

Éditez `covoiturage-app/services/api.ts`:

```typescript
const API_URL = __DEV__
  ? 'http://localhost:5000/api'  // ✅ OK pour émulateur iOS
  : 'https://votre-api.com/api';
```

**Note pour Android:** Utilisez `http://10.0.2.2:5000/api` au lieu de `localhost`

### Pour un appareil physique

Trouvez votre IP locale:

**Windows:**
```bash
ipconfig
# Cherchez "Adresse IPv4" (ex: 192.168.1.10)
```

**macOS/Linux:**
```bash
ifconfig
# Cherchez "inet" (ex: 192.168.1.10)
```

Puis modifiez `api.ts`:

```typescript
const API_URL = __DEV__
  ? 'http://192.168.1.10:5000/api'  // Remplacez par votre IP
  : 'https://votre-api.com/api';
```

**Important:** Votre appareil doit être sur le même réseau WiFi que votre ordinateur.

---

## 2. Démarrer le backend

```bash
cd backend
npm run dev
```

Vérifiez que le serveur démarre bien sur `http://localhost:5000`

---

## 3. Démarrer l'application

```bash
cd covoiturage-app
npm start
```

Puis choisissez:
- Appuyez sur `a` pour Android
- Appuyez sur `i` pour iOS
- Scannez le QR code pour Expo Go (appareil physique)

---

## 4. Tests de l'authentification

### Test 1: Inscription par email

1. **Ouvrir l'application**
2. **Appuyer sur "S'inscrire"** (écran d'accueil)
3. **Choisir "Continuer avec une adresse email"**
4. **Remplir le formulaire:**
   - Prénom: Jean
   - Nom: Dupont
   - Email: jean.dupont@example.com
   - Mot de passe: motdepasse123
   - Confirmer le mot de passe: motdepasse123
5. **Appuyer sur "S'inscrire"**

**Résultat attendu:**
- ✅ L'utilisateur est créé dans la base de données
- ✅ Redirection vers l'écran principal (onglets)
- ✅ L'utilisateur est connecté
- ✅ Le profil affiche "Jean Dupont"

**En cas d'erreur:**
- Vérifiez les logs du backend
- Vérifiez que l'URL de l'API est correcte
- Vérifiez votre connexion réseau

---

### Test 2: Déconnexion

1. **Aller dans l'onglet "Profil"**
2. **Descendre en bas de la page**
3. **Appuyer sur "Se déconnecter"**
4. **Confirmer la déconnexion**

**Résultat attendu:**
- ✅ Redirection vers l'écran de connexion
- ✅ L'utilisateur n'est plus connecté
- ✅ L'onglet "Profil" affiche "Vous n'êtes pas connecté"

---

### Test 3: Connexion

1. **Sur l'écran de connexion**
2. **Remplir le formulaire:**
   - Email: jean.dupont@example.com
   - Mot de passe: motdepasse123
3. **Appuyer sur "Se connecter"**

**Résultat attendu:**
- ✅ L'utilisateur est connecté
- ✅ Redirection vers l'écran principal
- ✅ Le profil affiche les bonnes informations

---

### Test 4: Connexion avec Facebook (optionnel)

**Prérequis:** Configuration Facebook complète (voir `FACEBOOK_SETUP.md`)

1. **Appuyer sur "S'inscrire"**
2. **Choisir "Continuer avec Facebook"**
3. **S'authentifier avec Facebook**

**Résultat attendu:**
- ✅ L'utilisateur est créé/connecté via Facebook
- ✅ Redirection vers l'écran principal

---

## 5. Tests de publication de trajet

### Test 5: Publier un trajet (connecté)

1. **Être connecté**
2. **Aller dans l'onglet "Publier"**
3. **Remplir le formulaire:**
   - Départ: Paris
   - Destination: Lyon
   - Date: Demain
   - Heure: 10:00
   - Prix: 25
   - Places: 3
   - Description: Trajet tranquille, musique relaxante
4. **Appuyer sur "Publier le trajet"**

**Résultat attendu:**
- ✅ Message "Trajet publié !"
- ✅ Le trajet est créé dans la base de données
- ✅ Le formulaire est réinitialisé

**Vérification backend:**
```bash
# Dans MongoDB ou via un client REST
GET http://localhost:5000/api/trips
# Vous devriez voir le trajet créé
```

---

### Test 6: Publier un trajet (non connecté)

1. **Se déconnecter si connecté**
2. **Aller dans l'onglet "Publier"**
3. **Remplir un peu le formulaire**
4. **Appuyer sur "Publier le trajet"**

**Résultat attendu:**
- ✅ Message "Connexion requise"
- ✅ Option "Se connecter" proposée
- ✅ Redirection vers la connexion si accepté

---

## 6. Tests de recherche de trajets

### Test 7: Rechercher des trajets

1. **Aller dans l'onglet "Accueil"**
2. **Remplir le formulaire de recherche:**
   - Départ: Paris
   - Destination: Lyon
   - Date: Demain (ou la date du trajet publié)
   - Passagers: 2
3. **Appuyer sur "Rechercher"**

**Résultat attendu:**
- ✅ Indicateur de chargement affiché
- ✅ Message "X trajet(s) trouvé(s)" si des résultats
- ✅ Message "Aucun résultat" si pas de correspondance

**Note:** Pour avoir des résultats, assurez-vous qu'un trajet correspondant existe (créé au Test 5)

---

### Test 8: Recherche sans résultats

1. **Remplir le formulaire de recherche:**
   - Départ: Paris
   - Destination: Tokyo
   - Date: Aujourd'hui
   - Passagers: 1
2. **Appuyer sur "Rechercher"**

**Résultat attendu:**
- ✅ Message "Aucun trajet ne correspond à votre recherche"

---

## 7. Tests du profil

### Test 9: Modifier le profil

1. **Être connecté**
2. **Aller dans l'onglet "Profil"**
3. **Appuyer sur "Modifier le profil"**
4. **Modifier les informations:**
   - Prénom: Jean-Michel
   - Nom: Dupont-Martin
   - Téléphone: 0612345678
5. **Appuyer sur "Enregistrer"**

**Résultat attendu:**
- ✅ Message "Votre profil a été mis à jour"
- ✅ Les nouvelles informations sont affichées
- ✅ Les modifications sont sauvegardées dans la base de données

**Vérification:**
- Se déconnecter et se reconnecter
- Les informations modifiées doivent être conservées

---

## 8. Tests d'erreurs

### Test 10: Erreur de connexion (mauvais mot de passe)

1. **Sur l'écran de connexion**
2. **Remplir:**
   - Email: jean.dupont@example.com
   - Mot de passe: mauvais_mot_de_passe
3. **Appuyer sur "Se connecter"**

**Résultat attendu:**
- ✅ Message d'erreur "Email ou mot de passe incorrect"
- ✅ L'utilisateur reste sur l'écran de connexion

---

### Test 11: Erreur réseau (backend arrêté)

1. **Arrêter le backend** (Ctrl+C dans le terminal du backend)
2. **Essayer de se connecter ou de publier un trajet**

**Résultat attendu:**
- ✅ Message d'erreur réseau
- ✅ L'application ne plante pas

**N'oubliez pas de redémarrer le backend après ce test!**

---

### Test 12: Validation du formulaire d'inscription

1. **Aller sur l'écran d'inscription**
2. **Essayer de s'inscrire avec:**
   - Mot de passe trop court (< 8 caractères)
   - Mots de passe non correspondants

**Résultat attendu:**
- ✅ Messages d'erreur affichés en rouge
- ✅ Bouton "S'inscrire" désactivé si le formulaire n'est pas valide

---

## 9. Vérifications dans la base de données

### Vérifier les utilisateurs créés

```javascript
// Dans MongoDB Compass ou mongosh
use covoiturage;
db.users.find().pretty();
```

Vous devriez voir l'utilisateur "Jean Dupont" créé.

---

### Vérifier les trajets créés

```javascript
db.trips.find().pretty();
```

Vous devriez voir le trajet Paris-Lyon créé.

---

## 10. Checklist complète

- [ ] Backend démarré et accessible
- [ ] URL de l'API correctement configurée
- [ ] Application frontend démarrée
- [ ] Inscription par email fonctionne
- [ ] Connexion par email fonctionne
- [ ] Déconnexion fonctionne
- [ ] Publication de trajet (connecté) fonctionne
- [ ] Alerte si publication non connecté
- [ ] Recherche de trajets fonctionne
- [ ] Modification du profil fonctionne
- [ ] Gestion des erreurs fonctionne
- [ ] Indicateurs de chargement s'affichent
- [ ] Validation des formulaires fonctionne

---

## Problèmes courants

### Problème: "Network Error" ou "Request failed"

**Solutions:**
1. Vérifier que le backend est démarré
2. Vérifier l'URL de l'API dans `services/api.ts`
3. Pour Android émulateur, utiliser `10.0.2.2` au lieu de `localhost`
4. Pour appareil physique, utiliser l'IP locale et être sur le même réseau

### Problème: "Cannot read property 'firstName' of undefined"

**Solution:**
- L'utilisateur n'est pas correctement chargé
- Vérifier le token dans SecureStore
- Se déconnecter et se reconnecter

### Problème: Token expiré

**Solution:**
- Le rafraîchissement automatique devrait fonctionner
- Sinon, se déconnecter et se reconnecter

### Problème: L'application plante au démarrage

**Solutions:**
1. Vider le cache: `npx expo start -c`
2. Réinstaller les dépendances: `rm -rf node_modules && npm install`
3. Vérifier les logs pour l'erreur exacte

---

## Outils de débogage

### Logs React Native

```bash
# Terminal où tourne l'app
# Les logs s'affichent automatiquement
```

### React Native Debugger (optionnel)

```bash
npx react-devtools
```

### Logs du backend

```bash
# Dans le terminal du backend
# Tous les appels API sont loggés
```

### Inspecter les requêtes réseau

Dans votre code, ajoutez temporairement:

```typescript
api.interceptors.request.use((config) => {
  console.log('📤 API Request:', config.method?.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.config?.url, error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## Conclusion

Si tous les tests passent, votre intégration frontend-backend est fonctionnelle ! 🎉

Vous pouvez maintenant:
1. Développer de nouvelles fonctionnalités (réservations, avis, chat, etc.)
2. Améliorer l'UI/UX
3. Ajouter des notifications push
4. Préparer le déploiement en production

Bon développement ! 🚀

