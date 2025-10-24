# Interface de calcul de commission - Frontend

## Vue d'ensemble

L'écran de publication de trajet affiche maintenant en temps réel le calcul de la commission de 16% et le prix final que le client paiera.

## Modifications apportées

### Fichier modifié : `covoiturage-app/app/(tabs)/publish.tsx`

### 1. Ajout des fonctions de calcul

```typescript
// Constante de commission
const APP_COMMISSION_RATE = 0.16;

// Calculer le prix client (prix conducteur + commission)
const calculateClientPrice = (driverPrice: number): number => {
  return driverPrice / (1 - APP_COMMISSION_RATE);
};

// Calculer la commission
const calculateCommission = (clientPrice: number): number => {
  return clientPrice * APP_COMMISSION_RATE;
};

// Prix calculés en temps réel
const driverPrice = parseFloat(price) || 0;
const clientPrice = driverPrice > 0 ? calculateClientPrice(driverPrice) : 0;
const commission = driverPrice > 0 ? calculateCommission(clientPrice) : 0;
```

### 2. Modification du label du champ de prix

Le label du champ de prix a été changé de **"Prix par passager"** à **"Prix que vous recevez"** pour clarifier que le conducteur entre le montant qu'il souhaite recevoir.

### 3. Ajout de la carte d'information de commission

Une nouvelle section s'affiche automatiquement dès que le conducteur entre un prix :

```typescript
{driverPrice > 0 && (
  <View style={styles.commissionCard}>
    <View style={styles.commissionHeader}>
      <Ionicons name="information-circle" size={20} color={Colors.primary} />
      <Text style={styles.commissionTitle}>Détail des frais</Text>
    </View>
    
    <View style={styles.commissionDetails}>
      <View style={styles.commissionRow}>
        <Text style={styles.commissionLabel}>Prix affiché aux clients :</Text>
        <Text style={styles.commissionValue}>{clientPrice.toFixed(2)} DA</Text>
      </View>
      <View style={styles.commissionRow}>
        <Text style={styles.commissionLabel}>Commission app (16%) :</Text>
        <Text style={styles.commissionValueSecondary}>-{commission.toFixed(2)} DA</Text>
      </View>
      <View style={[styles.commissionRow, styles.commissionRowTotal]}>
        <Text style={styles.commissionLabelTotal}>Vous recevez :</Text>
        <Text style={styles.commissionValueTotal}>{driverPrice.toFixed(2)} DA</Text>
      </View>
    </View>

    <View style={styles.commissionNote}>
      <Text style={styles.commissionNoteText}>
        💡 Le client paiera {clientPrice.toFixed(2)} DA et vous recevrez exactement {driverPrice.toFixed(2)} DA par passager.
      </Text>
    </View>
  </View>
)}
```

## Interface utilisateur

### Affichage de la carte de commission

La carte affiche :

1. **Prix affiché aux clients** : Le prix final que le client verra et paiera
2. **Commission app (16%)** : Le montant prélevé par l'application
3. **Vous recevez** : Le montant que le conducteur recevra (en surbrillance)
4. **Note explicative** : Un message clair avec emoji expliquant le fonctionnement

### Design

- **Carte élégante** : Fond blanc avec bordure légère de couleur primaire
- **Hiérarchie visuelle** : Le montant que le conducteur reçoit est mis en évidence
- **Calcul en temps réel** : Les montants se mettent à jour automatiquement quand le conducteur tape le prix
- **Note informative** : Fond gris clair avec message explicatif

## Exemple d'utilisation

### Scénario 1 : Prix de 500 DA

Conducteur entre : **500 DA**

La carte affiche :
```
📊 Détail des frais

Prix affiché aux clients :     595.24 DA
Commission app (16%) :          -95.24 DA
─────────────────────────────────────────
Vous recevez :                  500.00 DA

💡 Le client paiera 595.24 DA et vous recevrez 
   exactement 500.00 DA par passager.
```

### Scénario 2 : Prix de 1000 DA

Conducteur entre : **1000 DA**

La carte affiche :
```
📊 Détail des frais

Prix affiché aux clients :     1190.48 DA
Commission app (16%) :         -190.48 DA
─────────────────────────────────────────
Vous recevez :                 1000.00 DA

💡 Le client paiera 1190.48 DA et vous recevrez 
   exactement 1000.00 DA par passager.
```

## Styles ajoutés

Nouveaux styles pour la carte de commission :

- `commissionCard` : Conteneur principal de la carte
- `commissionHeader` : En-tête avec icône et titre
- `commissionTitle` : Titre de la carte
- `commissionDetails` : Container pour les lignes de détails
- `commissionRow` : Ligne de détail (prix, commission, total)
- `commissionRowTotal` : Ligne du total (séparée par une bordure)
- `commissionLabel` : Label des lignes
- `commissionLabelTotal` : Label du total (en gras)
- `commissionValue` : Valeur normale
- `commissionValueSecondary` : Valeur secondaire (commission)
- `commissionValueTotal` : Valeur totale (plus grande, couleur primaire)
- `commissionNote` : Container de la note explicative
- `commissionNoteText` : Texte de la note

## Avantages

1. **Transparence totale** : Le conducteur sait exactement ce qu'il recevra
2. **Clarté** : Affichage en temps réel du calcul
3. **Confiance** : Pas de surprises sur le montant final
4. **Professionnalisme** : Interface claire et bien organisée
5. **UX optimale** : Le conducteur comprend immédiatement le système de commission

## Compatibilité

✅ Fonctionne sur iOS et Android
✅ Calcul en temps réel sans ralentissement
✅ Design responsive
✅ Styles cohérents avec le reste de l'application

