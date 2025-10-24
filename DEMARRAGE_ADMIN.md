# 🚀 Démarrage Rapide - Système Admin

## Étapes pour commencer

### 1️⃣ Créer le Super Admin (Backend)

```bash
cd backend
node scripts/create-super-admin.js
```

**Résultat attendu :**
```
✅ Connecté à MongoDB
✅ Super Admin créé avec succès !
📧 Email: admin@covoiturage.dz
🔐 Mot de passe: Admin@123456
⚠️  CHANGEZ CE MOT DE PASSE après la première connexion !
```

### 2️⃣ Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### 3️⃣ Démarrer le Frontend

```bash
cd covoiturage-app
npx expo start
```

### 4️⃣ Accéder au Panel Admin

1. Dans l'application, accédez à `/admin-login`
2. Connectez-vous avec :
   - **Email** : `admin@covoiturage.dz`
   - **Mot de passe** : `Admin@123456`

### 5️⃣ Premières Actions

Une fois connecté :

1. **Changez votre mot de passe** immédiatement
   - Menu → "Changer le mot de passe"

2. **Créez des administrateurs**
   - Menu → "Gestion des admins"
   - Cliquez sur le bouton "+"
   - Remplissez le formulaire

3. **Configurez la commission**
   - Menu → "Paramètres de commission"
   - Ajustez le taux selon vos besoins

4. **Générez les paiements mensuels**
   - Menu → "Gestion des paiements"
   - Utilisez l'endpoint pour générer les paiements

---

## 📱 Navigation dans l'App

### Pour accéder au panel admin :

**Ajoutez un bouton dans votre écran principal ou menu :**

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Dans votre composant
<TouchableOpacity onPress={() => router.push('/admin-login')}>
  <Text>Administration</Text>
</TouchableOpacity>
```

---

## 🔑 Identifiants de Test

### Super Admin
- Email: `admin@covoiturage.dz`
- Mot de passe: `Admin@123456`

**⚠️ À CHANGER IMMÉDIATEMENT EN PRODUCTION !**

---

## 🛠️ Test des Fonctionnalités

### Test 1 : Gestion des Admins
1. Connectez-vous en Super Admin
2. Allez dans "Gestion des admins"
3. Créez un admin de test :
   - Prénom: Test
   - Nom: Admin
   - Email: test@admin.dz
   - Mot de passe: Test123456
   - Rôle: Administrateur

### Test 2 : Gestion des Utilisateurs
1. Allez dans "Gestion des utilisateurs"
2. Recherchez un utilisateur
3. Testez le blocage/déblocage

### Test 3 : Commission
1. Allez dans "Paramètres de commission"
2. Modifiez le taux (ex: 18%)
3. Vérifiez les calculs d'exemple

### Test 4 : Paiements
1. Générez les paiements mensuels via Postman :
```bash
POST http://localhost:5000/api/admin/payments/generate-monthly
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "month": 10,
  "year": 2024
}
```

2. Consultez-les dans "Gestion des paiements"
3. Marquez-en un comme payé

---

## 🧪 Test avec Postman

### 1. Connexion Admin

```http
POST http://localhost:5000/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@covoiturage.dz",
  "password": "Admin@123456"
}
```

**Récupérez le `accessToken` de la réponse.**

### 2. Obtenir tous les utilisateurs

```http
GET http://localhost:5000/api/admin/users
Authorization: Bearer <votre_token>
```

### 3. Bloquer un utilisateur

```http
PUT http://localhost:5000/api/admin/users/<userId>/block
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "isBlocked": true,
  "blockReason": "Non-paiement"
}
```

### 4. Voir la commission

```http
GET http://localhost:5000/api/admin/commission
Authorization: Bearer <votre_token>
```

### 5. Modifier la commission (Super Admin)

```http
PUT http://localhost:5000/api/admin/commission
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "rate": 0.18
}
```

---

## ❗ Problèmes Courants

### Le Super Admin n'est pas créé
- Vérifiez que MongoDB est démarré
- Vérifiez la connexion dans `.env`

### Erreur "Token invalide"
- Reconnectez-vous
- Vérifiez que vous utilisez le bon token

### L'écran admin ne s'affiche pas
- Vérifiez que vous avez bien ajouté tous les fichiers
- Vérifiez l'import dans `_layout.tsx`

### Impossible de créer un admin
- Vérifiez que vous êtes connecté en Super Admin
- L'email doit être unique

---

## 📚 Documentation Complète

Pour plus de détails, consultez `SYSTEME_ADMIN_COMPLET.md`

---

## ✅ Checklist de Production

Avant de déployer en production :

- [ ] Changer le mot de passe du Super Admin
- [ ] Utiliser des emails professionnels
- [ ] Configurer les variables d'environnement
- [ ] Activer HTTPS
- [ ] Configurer les limites de requêtes
- [ ] Mettre en place les sauvegardes
- [ ] Tester toutes les fonctionnalités
- [ ] Former les administrateurs
- [ ] Documenter les procédures internes

---

**Prêt à administrer votre plateforme ! 🎉**

