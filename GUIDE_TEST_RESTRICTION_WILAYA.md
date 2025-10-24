# Guide de Test - Restriction des Admins par Wilaya

## 🎯 Objectif

Tester que les admins ne peuvent voir et gérer que les utilisateurs de leur wilaya assignée.

## 🚀 Configuration de Test

### Étape 1 : Créer des Utilisateurs de Test

Créer des utilisateurs dans différentes wilayas :

```
Utilisateur 1 :
- Nom : Ahmed Benali
- Email : ahmed.alger@test.com
- Wilaya : Alger

Utilisateur 2 :
- Nom : Fatima Zerrouky
- Email : fatima.alger@test.com
- Wilaya : Alger

Utilisateur 3 :
- Nom : Karim Boudiaf
- Email : karim.oran@test.com
- Wilaya : Oran

Utilisateur 4 :
- Nom : Samira Lahlou
- Email : samira.constantine@test.com
- Wilaya : Constantine
```

### Étape 2 : Créer des Admins de Test

Via le panel Super Admin :

```
Admin 1 (Admin Alger) :
- Email : admin.alger@test.com
- Password : Test1234!
- Rôle : Administrateur
- Wilaya : Alger

Admin 2 (Admin Oran) :
- Email : admin.oran@test.com
- Password : Test1234!
- Rôle : Administrateur
- Wilaya : Oran

Admin 3 (Admin sans wilaya) :
- Email : admin.global@test.com
- Password : Test1234!
- Rôle : Administrateur
- Wilaya : (Aucune)
```

## 🧪 Tests à Effectuer

### Test 1 : Admin Alger - Liste des Utilisateurs

**But** : Vérifier que l'admin Alger ne voit que les utilisateurs d'Alger

1. Se connecter avec `admin.alger@test.com`
2. Aller sur le panel admin → Utilisateurs
3. **Résultat attendu** :
   - ✅ Voit Ahmed Benali (Alger)
   - ✅ Voit Fatima Zerrouky (Alger)
   - ❌ Ne voit PAS Karim Boudiaf (Oran)
   - ❌ Ne voit PAS Samira Lahlou (Constantine)
4. **Message** : "Utilisateurs de la wilaya Alger"

### Test 2 : Admin Alger - Blocage Utilisateur de Sa Wilaya

**But** : Vérifier que l'admin peut bloquer un utilisateur de sa wilaya

1. Connecté en tant que `admin.alger@test.com`
2. Sélectionner Ahmed Benali (Alger)
3. Cliquer sur "Bloquer"
4. Entrer une raison : "Test de blocage"
5. **Résultat attendu** :
   - ✅ Blocage réussi
   - ✅ Message : "Utilisateur bloqué avec succès"
   - ✅ Ahmed Benali apparaît comme bloqué

### Test 3 : Admin Alger - Tentative de Blocage Hors Wilaya

**But** : Vérifier que l'admin ne peut PAS bloquer un utilisateur d'une autre wilaya

**Méthode** : Test via API (Postman ou cURL)

```bash
# Récupérer l'ID de Karim Boudiaf (Oran)
# Supposons ID = 64f1234567890abcdef12345

# Essayer de bloquer avec le token de admin.alger@test.com
curl -X PUT http://localhost:3000/api/admin/users/64f1234567890abcdef12345/block \
  -H "Authorization: Bearer {TOKEN_ADMIN_ALGER}" \
  -H "Content-Type: application/json" \
  -d '{"isBlocked": true, "blockReason": "Test"}'
```

**Résultat attendu** :
```json
{
  "success": false,
  "message": "Vous ne pouvez gérer que les utilisateurs de votre wilaya (Alger)"
}
```
**Code HTTP** : `403 Forbidden`

### Test 4 : Admin Alger - Statistiques Utilisateur de Sa Wilaya

**But** : Vérifier que l'admin peut voir les stats d'un utilisateur de sa wilaya

1. Connecté en tant que `admin.alger@test.com`
2. Sélectionner Fatima Zerrouky (Alger)
3. Cliquer sur "Voir statistiques"
4. **Résultat attendu** :
   - ✅ Statistiques affichées
   - ✅ Détails du profil visibles
   - ✅ Trajets et réservations affichés

### Test 5 : Admin Alger - Tentative de Voir Stats Hors Wilaya

**But** : Vérifier que l'admin ne peut PAS voir les stats d'un utilisateur hors wilaya

**Méthode** : Test via API

```bash
# ID de Samira Lahlou (Constantine)
# Supposons ID = 64f9876543210fedcba09876

curl http://localhost:3000/api/admin/users/64f9876543210fedcba09876/stats \
  -H "Authorization: Bearer {TOKEN_ADMIN_ALGER}"
```

**Résultat attendu** :
```json
{
  "success": false,
  "message": "Vous ne pouvez consulter que les utilisateurs de votre wilaya (Alger)"
}
```
**Code HTTP** : `403 Forbidden`

### Test 6 : Admin Oran - Liste des Utilisateurs

**But** : Vérifier que l'admin Oran ne voit que les utilisateurs d'Oran

1. Se connecter avec `admin.oran@test.com`
2. Aller sur le panel admin → Utilisateurs
3. **Résultat attendu** :
   - ✅ Voit Karim Boudiaf (Oran)
   - ❌ Ne voit PAS Ahmed Benali (Alger)
   - ❌ Ne voit PAS Fatima Zerrouky (Alger)
   - ❌ Ne voit PAS Samira Lahlou (Constantine)
4. **Message** : "Utilisateurs de la wilaya Oran"

### Test 7 : Admin sans Wilaya - Liste des Utilisateurs

**But** : Vérifier que l'admin sans wilaya voit TOUS les utilisateurs

1. Se connecter avec `admin.global@test.com`
2. Aller sur le panel admin → Utilisateurs
3. **Résultat attendu** :
   - ✅ Voit Ahmed Benali (Alger)
   - ✅ Voit Fatima Zerrouky (Alger)
   - ✅ Voit Karim Boudiaf (Oran)
   - ✅ Voit Samira Lahlou (Constantine)
4. **Message** : "Tous les utilisateurs"

### Test 8 : Admin sans Wilaya - Blocage Tous Utilisateurs

**But** : Vérifier que l'admin sans wilaya peut bloquer N'IMPORTE QUEL utilisateur

1. Connecté en tant que `admin.global@test.com`
2. Essayer de bloquer Ahmed Benali (Alger)
   - ✅ Succès
3. Essayer de bloquer Karim Boudiaf (Oran)
   - ✅ Succès
4. Essayer de bloquer Samira Lahlou (Constantine)
   - ✅ Succès

### Test 9 : Super Admin - Accès Global

**But** : Vérifier que le Super Admin a toujours accès à tout

1. Se connecter en tant que Super Admin
2. Aller sur le panel admin → Utilisateurs
3. **Résultat attendu** :
   - ✅ Voit TOUS les utilisateurs (toutes wilayas)
4. Bloquer/Débloquer n'importe quel utilisateur
   - ✅ Toujours succès
5. Voir stats de n'importe quel utilisateur
   - ✅ Toujours succès

## 📊 Tableau de Vérification

| Test | Admin | Action | Utilisateur Cible | Attendu | Résultat |
|------|-------|--------|-------------------|---------|----------|
| 1 | Alger | Liste | - | Voit uniquement Alger | ☐ |
| 2 | Alger | Bloquer | Ahmed (Alger) | Succès | ☐ |
| 3 | Alger | Bloquer | Karim (Oran) | Erreur 403 | ☐ |
| 4 | Alger | Stats | Fatima (Alger) | Succès | ☐ |
| 5 | Alger | Stats | Samira (Constantine) | Erreur 403 | ☐ |
| 6 | Oran | Liste | - | Voit uniquement Oran | ☐ |
| 7 | Sans wilaya | Liste | - | Voit tous | ☐ |
| 8 | Sans wilaya | Bloquer | Tous | Succès pour tous | ☐ |
| 9 | Super Admin | Tout | Tous | Succès pour tout | ☐ |

## 🔍 Vérifications Détaillées

### Vérification 1 : Base de Données

Après création des admins, vérifier dans MongoDB :

```javascript
// Admin avec wilaya
db.admins.findOne({ email: "admin.alger@test.com" })
{
  "_id": "...",
  "email": "admin.alger@test.com",
  "role": "admin",
  "zone": {
    "wilaya": "Alger",
    "cities": []
  }
}

// Admin sans wilaya
db.admins.findOne({ email: "admin.global@test.com" })
{
  "_id": "...",
  "email": "admin.global@test.com",
  "role": "admin",
  "zone": undefined  // Pas de zone
}
```

### Vérification 2 : Logs Backend

Activer les logs pour voir les filtres appliqués :

```typescript
// Dans admin.controller.ts
console.log('Admin Role:', adminRole);
console.log('Admin Zone:', adminZone);
console.log('Filter:', filter);
```

**Logs attendus pour Admin Alger** :
```
Admin Role: admin
Admin Zone: { wilaya: 'Alger', cities: [] }
Filter: { wilaya: 'Alger' }
```

**Logs attendus pour Super Admin** :
```
Admin Role: super_admin
Admin Zone: undefined
Filter: {}
```

### Vérification 3 : Réponses API

#### GET /api/admin/users (Admin Alger)

**Requête** :
```bash
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer {TOKEN_ADMIN_ALGER}"
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Utilisateurs de la wilaya Alger",
  "data": [
    {
      "_id": "...",
      "firstName": "Ahmed",
      "lastName": "Benali",
      "email": "ahmed.alger@test.com",
      "wilaya": "Alger"
    },
    {
      "_id": "...",
      "firstName": "Fatima",
      "lastName": "Zerrouky",
      "email": "fatima.alger@test.com",
      "wilaya": "Alger"
    }
  ]
}
```

#### PUT /api/admin/users/:id/block (Tentative hors wilaya)

**Requête** :
```bash
curl -X PUT http://localhost:3000/api/admin/users/{ID_KARIM}/block \
  -H "Authorization: Bearer {TOKEN_ADMIN_ALGER}" \
  -H "Content-Type: application/json" \
  -d '{"isBlocked": true, "blockReason": "Test"}'
```

**Réponse attendue** :
```json
{
  "success": false,
  "message": "Vous ne pouvez gérer que les utilisateurs de votre wilaya (Alger)"
}
```
**HTTP Status** : `403`

## 🐛 Problèmes Potentiels et Solutions

### Problème 1 : Admin voit tous les utilisateurs au lieu de sa wilaya

**Diagnostic** :
1. Vérifier que l'admin a bien une wilaya assignée
2. Vérifier les logs backend
3. Vérifier que le middleware ajoute bien `zone` dans `req.admin`

**Solution** :
```typescript
// Vérifier dans admin-auth.ts
req.admin = {
  id: (admin._id as any).toString(),
  role: admin.role,
  permissions: [],
  zone: admin.zone,  // ← Doit être présent
};
```

### Problème 2 : Erreur "Cannot read property 'wilaya' of undefined"

**Diagnostic** :
- L'admin n'a pas de zone définie
- Le filtre essaie d'accéder à `adminZone.wilaya` alors que `adminZone` est undefined

**Solution** :
```typescript
// Toujours vérifier avant d'accéder
if (adminRole !== 'super_admin' && adminZone?.wilaya) {
  // Safe d'utiliser adminZone.wilaya ici
}
```

### Problème 3 : Admin peut bloquer utilisateurs d'autres wilayas

**Diagnostic** :
- La vérification n'est pas effectuée
- Le middleware admin n'est pas appliqué

**Solution** :
- Vérifier que la route utilise bien `protectAdmin`
- Vérifier que la logique de vérification est présente dans `toggleBlockUser`

## ✅ Checklist Finale

Avant de valider, vérifier :

- [ ] **Base de données** : Admins ont bien leur wilaya (ou pas)
- [ ] **Utilisateurs** : Ont tous une wilaya définie
- [ ] **Middleware** : req.admin contient la zone
- [ ] **Filtrage** : GET /users filtre correctement
- [ ] **Blocage** : PUT /users/:id/block vérifie la wilaya
- [ ] **Stats** : GET /users/:id/stats vérifie la wilaya
- [ ] **Super Admin** : Toujours accès global
- [ ] **Admin sans wilaya** : Accès global
- [ ] **Messages d'erreur** : Clairs et explicites
- [ ] **Codes HTTP** : 403 pour interdictions
- [ ] **Logs** : Informatifs et corrects

## 📝 Rapport de Test

Après avoir effectué tous les tests, compléter :

```
Date des tests : _______________
Testeur : _______________

Résultats :
- Tests réussis : _____ / 9
- Tests échoués : _____
- Bugs trouvés : _____

Détails des problèmes :
_________________________________
_________________________________
_________________________________

Validation finale : ☐ OUI  ☐ NON
```

## 🎉 Validation

Si tous les tests passent :
- ✅ Le système de restriction par wilaya est **opérationnel**
- ✅ Les permissions sont **correctement appliquées**
- ✅ La sécurité est **garantie**
- ✅ Le système est **prêt pour la production**

---

**Bonne chance pour les tests !** 🚀

