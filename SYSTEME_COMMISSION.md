# Système de Commission (16%)

## Vue d'ensemble

L'application prélève une commission de **16% sur chaque place réservée**. Le système est conçu pour que le conducteur reçoive exactement le montant qu'il a défini lors de la publication du trajet.

## Fonctionnement

### 1. Publication d'un trajet (Conducteur)

Lorsqu'un conducteur publie un trajet :
- Il définit le **prix qu'il souhaite recevoir** par place (ex: 500 DA)
- Ce prix est stocké dans le champ `price` du trajet
- Le système calcule automatiquement le **prix client** (avec commission incluse)

### 2. Affichage du prix (Client/Passager)

Le prix affiché aux clients est calculé automatiquement :
```
Prix client = Prix conducteur / (1 - 0.16)
Prix client = Prix conducteur / 0.84
```

**Exemple :**
- Conducteur souhaite recevoir : **500 DA**
- Prix affiché au client : **595.24 DA**

### 3. Réservation d'une place

Lors d'une réservation :
- Le client paie le **prix client** (595.24 DA dans l'exemple)
- L'application calcule :
  - **Commission (16%)** : 95.24 DA
  - **Montant conducteur** : 500 DA

Ces informations sont enregistrées dans la base de données :
```javascript
{
  totalPrice: 595.24,      // Prix payé par le client
  appCommission: 95.24,    // Commission de l'application (16%)
  driverAmount: 500.00     // Montant reçu par le conducteur
}
```

## Exemples de calculs

### Exemple 1 : 1 place réservée

- **Prix conducteur** : 500 DA
- **Prix client** : 595.24 DA
- **Commission (16%)** : 95.24 DA
- **Le conducteur reçoit** : 500 DA ✅

### Exemple 2 : 3 places réservées

- **Prix conducteur par place** : 500 DA
- **Prix client par place** : 595.24 DA
- **Prix total** : 595.24 × 3 = 1,785.71 DA
- **Commission (16%)** : 285.71 DA
- **Le conducteur reçoit** : 1,500 DA ✅

### Exemple 3 : Prix négociable

Lors d'une négociation :
1. Le conducteur et le passager négocient un prix (ex: 450 DA)
2. Ce prix représente ce que le conducteur veut recevoir
3. Le système calcule le prix final pour le client :
   - **Prix négocié (conducteur)** : 450 DA
   - **Prix client** : 535.71 DA
   - **Commission (16%)** : 85.71 DA
   - **Le conducteur reçoit** : 450 DA ✅

## Implémentation technique

### Fichier de constantes (`backend/src/config/constants.ts`)

```typescript
// Taux de commission de l'application (16%)
export const APP_COMMISSION_RATE = 0.16;

// Calcule le prix client à partir du prix conducteur
export const calculateClientPrice = (driverPrice: number): number => {
  return driverPrice / (1 - APP_COMMISSION_RATE);
};

// Calcule la commission
export const calculateCommission = (clientPrice: number): number => {
  return clientPrice * APP_COMMISSION_RATE;
};

// Calcule le montant que le conducteur reçoit
export const calculateDriverAmount = (clientPrice: number): number => {
  return clientPrice - calculateCommission(clientPrice);
};
```

### Modèle Trip

Le modèle `Trip` possède :
- `price` : Prix que le conducteur souhaite recevoir
- `clientPrice` : Champ virtuel calculé automatiquement (prix + commission)

### Modèle Booking

Le modèle `Booking` enregistre :
- `totalPrice` : Prix total payé par le client
- `appCommission` : Commission de l'application (16%)
- `driverAmount` : Montant que le conducteur recevra

## Avantages du système

1. **Transparence** : Le conducteur sait exactement combien il recevra
2. **Simplicité** : Le conducteur n'a pas à calculer manuellement la commission
3. **Traçabilité** : Tous les montants sont enregistrés dans la base de données
4. **Flexibilité** : Fonctionne pour les prix fixes et les prix négociables

## Modification du taux de commission

Pour modifier le taux de commission, il suffit de changer la constante dans `backend/src/config/constants.ts` :

```typescript
export const APP_COMMISSION_RATE = 0.20; // Pour 20% de commission
```

Tous les calculs s'adapteront automatiquement.

