# Où le conducteur reçoit-il les propositions de prix ?

## 🎯 Le conducteur a **3 façons** de voir les propositions

### 1️⃣ **Page "Mes Trajets"** (Nouveau !)
📍 **Navigation :** Onglet "Trajets" dans la barre de navigation

**Fonctionnalités :**
- Liste de tous les trajets publiés
- Badge avec le nombre de propositions en attente (ex: "🔔 3")
- Bouton "Voir les propositions (X)" sur chaque trajet négociable
- Accès direct aux négociations de chaque trajet

**Capture d'écran type :**
```
┌─────────────────────────────────────┐
│ Mes Trajets                      [+]│
├─────────────────────────────────────┤
│  📅 15 Oct, 14h30           🔔 2    │
│  ● Alger                            │
│  │                                  │
│  📍 Oran                            │
│  👥 3 places │ 💰 800 DA │ 📊 Négo │
│  [Voir les propositions (2)]        │
│  [Détails →]                        │
└─────────────────────────────────────┘
```

### 2️⃣ **Page "Mes négociations"**
📍 **Navigation :** Profil → Bouton "Mes négociations"

**Fonctionnalités :**
- Liste de TOUTES les négociations (en tant que passager ET conducteur)
- Filtres : En cours / Acceptées / Rejetées
- Voir toutes les propositions reçues sur tous les trajets

**Capture d'écran type :**
```
┌─────────────────────────────────────┐
│ ← Négociations                      │
├─────────────────────────────────────┤
│ [En cours] [Acceptées] [Rejetées]  │
├─────────────────────────────────────┤
│  📍 Alger → Oran          En attente│
│  Prix initial : 800 DA              │
│  Offre actuelle : 600 DA            │
│  Dernière offre par : Passager      │
│  [Voir les options ▼]               │
└─────────────────────────────────────┘
```

### 3️⃣ **Page détaillée d'un trajet** (Nouveau !)
📍 **Navigation :** Mes Trajets → "Voir les propositions"

**Fonctionnalités :**
- Voir toutes les propositions pour UN trajet spécifique
- Informations du passager (nom, photo, note)
- Comparaison prix original vs prix proposé
- Actions rapides : Accepter / Refuser / Contre-proposer

**Capture d'écran type :**
```
┌─────────────────────────────────────┐
│ ← Propositions de prix              │
├─────────────────────────────────────┤
│ En attente (2)                      │
├─────────────────────────────────────┤
│  [Photo] Ahmed Benali    ⭐ 4.8     │
│           En attente                │
│  ┌───────────────────────────────┐ │
│  │ Votre prix   →   Offre        │ │
│  │   800 DA         600 DA       │ │
│  └───────────────────────────────┘ │
│  💬 "Je fais régulièrement ce      │
│      trajet, pouvons-nous négocier?"│
│                                     │
│  [Répondre ▼]                       │
│  ┌─────────────────────────────────┐
│  │ [✓ Accepter 600 DA]            │
│  │ [✗ Refuser]                    │
│  │ ─────────────────────────      │
│  │ Ou proposer un autre prix      │
│  │ [Votre contre-offre] DA        │
│  │ [↻ Envoyer ma contre-offre]    │
│  └─────────────────────────────────┘
└─────────────────────────────────────┘
```

## 📱 Flux complet pour le conducteur

### Étape 1 : Notification visuelle
```
Onglet "Trajets" → Badge rouge avec le nombre de propositions
```

### Étape 2 : Consultation
Le conducteur peut choisir :
- **Option A :** Cliquer sur le badge depuis "Mes Trajets"
- **Option B :** Aller dans "Mes négociations" depuis le profil

### Étape 3 : Actions possibles
Pour chaque proposition, le conducteur peut :
1. **✅ Accepter** le prix proposé
2. **❌ Refuser** la proposition
3. **💬 Contre-proposer** un autre prix

### Étape 4 : Résultat
- **Si accepté :** Prix convenu enregistré, les deux parties sont notifiées
- **Si refusé :** La négociation est fermée
- **Si contre-proposition :** Le passager reçoit la nouvelle offre

## 🔔 Notifications (Futures améliorations)

Actuellement, le conducteur doit **consulter manuellement** les pages.

### Améliorations futures possibles :
- 📧 Email de notification
- 📱 Notification push (mobile)
- 🔴 Badge de notification en temps réel
- 🔊 Son de notification

## 🎨 Interface utilisateur

### Indicateurs visuels :
- **Badge rouge avec chiffre** : Nouvelles propositions
- **Icône 💬** : Négociation en cours
- **Icône ✓ (vert)** : Négociation acceptée
- **Icône ✗ (rouge)** : Négociation refusée

### Couleurs :
- **Jaune** : En attente de réponse
- **Vert** : Acceptée
- **Rouge** : Refusée
- **Gris** : Expirée

## 📊 Statistiques pour le conducteur

Dans chaque trajet, le conducteur peut voir :
- Nombre total de propositions reçues
- Nombre de propositions en attente
- Nombre de propositions acceptées
- Nombre de propositions refusées

## 🔐 Sécurité et confidentialité

- ✅ Seul le conducteur du trajet peut voir les propositions
- ✅ Les passagers ne voient pas les propositions des autres
- ✅ L'historique des négociations est conservé
- ✅ Une seule négociation active par passager/trajet

## 📝 Exemple concret

### Scénario :
1. **Mohamed** publie un trajet Alger → Oran pour 800 DA (négociable)
2. **Ahmed** propose 600 DA
3. **Fatima** propose 700 DA

### Ce que Mohamed voit :

**Dans "Mes Trajets" :**
```
Alger → Oran [Badge: 2 propositions]
```

**En cliquant sur "Voir les propositions" :**
```
Ahmed propose 600 DA   [Répondre]
Fatima propose 700 DA  [Répondre]
```

**Mohamed peut :**
- Accepter la proposition de Fatima (700 DA)
- Refuser celle d'Ahmed
- Contre-proposer 650 DA à Ahmed

## 🚀 Pour tester

1. **Créez 2 comptes** : Compte A (conducteur) et Compte B (passager)
2. **Avec Compte A** : Publiez un trajet négociable
3. **Avec Compte B** : Recherchez et proposez un prix
4. **Revenez au Compte A** : Allez dans "Mes Trajets" → Vous verrez un badge avec "1"

## ❓ Questions fréquentes

**Q : Le conducteur est-il notifié en temps réel ?**
R : Actuellement non, il doit rafraîchir la page. Les notifications push seront ajoutées ultérieurement.

**Q : Peut-il y avoir plusieurs négociations en même temps ?**
R : Oui ! Un trajet peut avoir plusieurs passagers qui négocient simultanément.

**Q : Que se passe-t-il si le conducteur accepte une proposition ?**
R : Le prix convenu est enregistré. Le passager peut ensuite réserver au prix négocié.

**Q : Les propositions expirent-elles ?**
R : Pas actuellement, mais cette fonctionnalité peut être ajoutée (ex: expiration après 24h).


