# 🛡️ Système d'Administration - Documentation Complète

## 📋 Vue d'ensemble

Le système d'administration complet a été implémenté avec succès, permettant une gestion complète de la plateforme de covoiturage. Il comprend trois niveaux d'accès : **Super Admin**, **Administrateur** et **Modérateur**.

---

## 🎯 Rôles et Permissions

### 1. **Super Admin** 👑
Le rôle le plus élevé avec tous les droits :
- ✅ Gestion des administrateurs (création, blocage)
- ✅ Gestion des utilisateurs (blocage/déblocage)
- ✅ Gestion des paiements
- ✅ Modification du taux de commission
- ✅ Génération des paiements mensuels
- ✅ Accès à toutes les statistiques

### 2. **Administrateur** 🔧
Gestion opérationnelle :
- ✅ Gestion des utilisateurs (blocage/déblocage)
- ✅ Gestion des paiements des conducteurs
- ✅ Vérification des transferts
- ✅ Contact avec les conducteurs
- ✅ Vue du taux de commission (lecture seule)

### 3. **Modérateur** 👀
Niveau d'accès limité :
- ✅ Vue du taux de commission
- ✅ Consultation des statistiques de base

---

## 🚀 Installation et Configuration

### Backend

#### 1. Créer le premier Super Admin

Un script a été créé pour initialiser le premier Super Admin :

```bash
cd backend
node scripts/create-super-admin.js
```

**Identifiants par défaut** (⚠️ À CHANGER immédiatement) :
- **Email** : `admin@covoiturage.dz`
- **Mot de passe** : `Admin@123456`

#### 2. Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### Frontend

#### 1. Installer les dépendances

```bash
cd covoiturage-app
npm install
```

#### 2. Démarrer l'application

```bash
npx expo start
```

---

## 📱 Écrans Frontend Créés

### 1. **Connexion Admin** (`/admin-login`)
- Authentification sécurisée avec JWT
- Protection contre les comptes bloqués
- Interface moderne et responsive

### 2. **Dashboard Principal** (`/admin-dashboard`)
- Vue d'ensemble personnalisée selon le rôle
- Affichage du taux de commission actuel
- Menu d'accès rapide aux différentes sections

### 3. **Gestion des Utilisateurs** (`/admin-users`)
- Liste complète des utilisateurs
- Recherche par nom, email ou téléphone
- Blocage/déblocage avec raison
- Statistiques par utilisateur (note, nombre de trajets)

### 4. **Gestion des Paiements** (`/admin-payments`)
- Liste des paiements en attente
- Informations détaillées par conducteur
- Validation des paiements avec ID de transaction
- Annulation de paiements

### 5. **Gestion des Admins** (`/admin-admins`) - Super Admin uniquement
- Création de nouveaux administrateurs
- Choix du rôle (Admin ou Modérateur)
- Blocage/déblocage des administrateurs
- Historique des connexions

### 6. **Paramètres de Commission** (`/admin-commission`) - Super Admin uniquement
- Modification du taux de commission global
- Visualisation des calculs
- Exemples en temps réel
- Alertes de confirmation

### 7. **Changement de Mot de Passe** (`/admin-change-password`)
- Modification sécurisée du mot de passe
- Validation des exigences
- Interface intuitive

---

## 🔐 API Endpoints Backend

### Authentification Admin

```http
POST /api/admin/auth/login
Body: { email, password }
Response: { admin, accessToken, refreshToken }
```

```http
PUT /api/admin/auth/change-password
Headers: { Authorization: Bearer <token> }
Body: { currentPassword, newPassword }
```

### Gestion des Admins (Super Admin)

```http
POST /api/admin/admins
Headers: { Authorization: Bearer <token> }
Body: { email, password, firstName, lastName, role }
```

```http
GET /api/admin/admins
Headers: { Authorization: Bearer <token> }
```

```http
PUT /api/admin/admins/:id/block
Headers: { Authorization: Bearer <token> }
Body: { isBlocked, blockReason }
```

### Gestion des Utilisateurs

```http
GET /api/admin/users
Headers: { Authorization: Bearer <token> }
```

```http
PUT /api/admin/users/:id/block
Headers: { Authorization: Bearer <token> }
Body: { isBlocked, blockReason }
```

### Gestion des Paiements

```http
GET /api/admin/payments/pending
Headers: { Authorization: Bearer <token> }
```

```http
GET /api/admin/payments/drivers/:driverId
Headers: { Authorization: Bearer <token> }
```

```http
PUT /api/admin/payments/:id/status
Headers: { Authorization: Bearer <token> }
Body: { status: "paid" | "cancelled", transactionId }
```

```http
POST /api/admin/payments/generate-monthly
Headers: { Authorization: Bearer <token> }
Body: { month, year }
```

### Gestion de la Commission

```http
GET /api/admin/commission
Headers: { Authorization: Bearer <token> }
```

```http
PUT /api/admin/commission
Headers: { Authorization: Bearer <token> }
Body: { rate }  // Entre 0 et 0.99 (ex: 0.16 pour 16%)
```

---

## 🗄️ Modèles de Données

### Admin Model

```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isBlocked: boolean;
  blockReason?: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment Model

```typescript
{
  driver: ObjectId;
  amount: number;
  period: { month: number; year: number };
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  transactionReference?: string;
  verifiedBy?: ObjectId;  // Admin qui a vérifié
  totalEarnings: number;
  commissionRate: number;
  trips: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔒 Sécurité

### Authentification
- **JWT** avec tokens access et refresh
- Tokens stockés de manière sécurisée dans AsyncStorage
- Expiration automatique des tokens

### Autorisation
- Middleware `protectAdmin` pour vérifier l'authentification
- Middleware `authorizeAdmin` pour vérifier les rôles
- Validation côté backend de toutes les actions

### Protection des comptes
- Système de blocage avec raison
- Historique des connexions
- Changement de mot de passe sécurisé

---

## 💡 Workflow Typique

### Pour un Admin (gestion mensuelle)

1. **Connexion** via `/admin-login`
2. **Accès au dashboard** avec vue d'ensemble
3. **Consultation des paiements en attente** via `/admin-payments`
4. **Contact des conducteurs** pour vérifier les transferts
5. **Validation des paiements** avec ID de transaction
6. **Blocage des comptes** en cas de non-paiement

### Pour un Super Admin

1. **Génération des paiements mensuels** (début de mois)
2. **Création de nouveaux admins** selon les zones
3. **Ajustement du taux de commission** si nécessaire
4. **Surveillance globale** via les statistiques

---

## 📊 Fonctionnalités Clés

### ✅ Gestion Complète des Utilisateurs
- Visualisation de tous les utilisateurs
- Filtrage et recherche avancée
- Blocage temporaire ou permanent
- Historique des actions

### ✅ Système de Paiements
- Génération automatique mensuelle
- Suivi des paiements en attente
- Validation avec preuve de transaction
- Calcul automatique des commissions

### ✅ Contrôle des Commissions
- Modification centralisée du taux
- Application immédiate aux nouveaux trajets
- Conservation des taux historiques
- Calculs en temps réel

### ✅ Hiérarchie Administrative
- Trois niveaux de permissions
- Création et gestion d'admins
- Blocage des comptes administrateurs
- Traçabilité des actions

---

## 🎨 Interface Utilisateur

### Design System
- **Couleurs cohérentes** avec l'application principale
- **Icons Ionicons** pour une meilleure reconnaissance
- **Composants réutilisables** (cartes, boutons, modales)
- **Responsive** et adapté mobile

### UX
- **Navigation intuitive** avec retours visuels
- **Feedback immédiat** sur les actions
- **Confirmations** pour les actions critiques
- **Messages d'erreur** clairs et actionables

---

## 🔄 Prochaines Étapes Recommandées

1. **Tester le système complet**
   - Créer le Super Admin
   - Créer quelques admins de test
   - Tester toutes les fonctionnalités

2. **Personnaliser les identifiants**
   - Changer le mot de passe du Super Admin
   - Utiliser des emails professionnels

3. **Configurer les zones géographiques**
   - Assigner des admins à des wilayas spécifiques
   - Adapter le workflow selon les besoins

4. **Ajouter des notifications**
   - Email lors de la création d'un admin
   - SMS aux conducteurs pour les rappels de paiement

5. **Dashboard avancé**
   - Graphiques et statistiques détaillées
   - Rapports mensuels automatiques
   - Exportation des données

---

## 📝 Notes Importantes

- ⚠️ **Changez immédiatement** le mot de passe par défaut du Super Admin
- 🔐 Les tokens admin sont **séparés** des tokens utilisateurs
- 💾 Les données admin sont **stockées séparément** dans AsyncStorage
- 🚫 Un admin ne peut pas se bloquer lui-même
- 📅 La génération des paiements doit être effectuée **début de chaque mois**

---

## 🐛 Dépannage

### Problème de connexion
- Vérifiez que le backend est démarré
- Vérifiez l'URL de l'API dans `api.service.ts`
- Vérifiez les identifiants

### Erreur de permission
- Vérifiez le rôle de l'admin connecté
- Reconnectez-vous pour rafraîchir le token

### Paiements non affichés
- Générez les paiements mensuels d'abord
- Vérifiez qu'il y a des trajets complétés

---

## 🎉 Félicitations !

Vous disposez maintenant d'un système d'administration complet et professionnel pour gérer votre plateforme de covoiturage. Le système est évolutif et peut être facilement étendu selon vos besoins futurs.

**Bon courage avec votre plateforme ! 🚗💨**

