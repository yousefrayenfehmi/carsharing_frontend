# Ajout de la Sélection de Wilaya lors de l'Inscription

## 📋 Résumé des Modifications

Ce document décrit l'intégration d'une liste déroulante pour sélectionner la wilaya (état) d'Algérie lors de l'inscription des utilisateurs.

## ✨ Fonctionnalités Ajoutées

### 1. Liste Complète des Wilayas d'Algérie

**Fichier créé** : `covoiturage-app/constants/algerian-wilayas.ts`

- Liste complète des **58 wilayas** d'Algérie
- Chaque wilaya contient :
  - Code numérique (01-58)
  - Nom en français
  - Nom en arabe (arabicName)
- Fonctions utilitaires :
  - `getWilayaByCode(code: string)` - Récupérer une wilaya par son code
  - `getWilayaByName(name: string)` - Récupérer une wilaya par son nom
  - `searchWilaya(query: string)` - Rechercher des wilayas (support français et arabe)

### 2. Composant de Sélection de Wilaya

**Fichier créé** : `covoiturage-app/components/wilaya-picker.tsx`

Un composant modal réutilisable avec les fonctionnalités suivantes :
- **Modal plein écran** avec animation slide
- **Barre de recherche** pour filtrer les wilayas (français ou arabe)
- **Affichage complet** : code, nom français, nom arabe
- **Indicateur de sélection** (checkmark sur la wilaya sélectionnée)
- **Compteur de résultats** de recherche
- **Interface responsive** et moderne

### 3. Intégration dans le Formulaire d'Inscription

**Fichier modifié** : `covoiturage-app/app/email-signup.tsx`

Ajout d'un champ de sélection de wilaya :
- Nouveau state `wilaya` pour stocker la wilaya sélectionnée
- Nouveau state `showWilayaPicker` pour contrôler la visibilité du modal
- Bouton de sélection affichant :
  - Placeholder "Sélectionnez votre wilaya" si aucune sélection
  - "Code - Nom" de la wilaya si sélectionnée (ex: "16 - Alger")
- Validation du formulaire : la wilaya est **obligatoire** pour soumettre l'inscription
- Transmission de la wilaya au backend lors de l'inscription

## 🔧 Modifications Backend

### 1. Modèle User

**Fichier modifié** : `backend/src/models/User.ts`

Ajout du champ `wilaya` dans l'interface IUser et le schéma :
```typescript
wilaya?: string;
```

### 2. Types d'Authentification

**Fichier modifié** : `backend/src/types/index.ts`

Mise à jour des interfaces :
- `SignupCredentials` : ajout du champ `wilaya?: string`
- `UpdateProfileData` : ajout du champ `wilaya?: string`

### 3. Contrôleur d'Authentification

**Fichier modifié** : `backend/src/controllers/auth.controller.ts`

- Fonction `signup` : récupération et sauvegarde du champ wilaya lors de l'inscription

### 4. Validateurs

**Fichier modifié** : `backend/src/validators/auth.validator.ts`

Ajout de la validation pour le champ wilaya :
```typescript
body('wilaya')
  .optional()
  .trim()
  .isLength({ min: 2 })
  .withMessage('Wilaya invalide')
```

## 🎨 Modifications Frontend (Types)

### 1. Service d'Authentification

**Fichier modifié** : `covoiturage-app/services/auth-service.ts`

Mise à jour des interfaces :
- `SignupCredentials` : ajout de `wilaya?: string`
- `User` : ajout de `wilaya?: string`

### 2. Types d'Authentification

**Fichier modifié** : `covoiturage-app/types/auth.ts`

Mise à jour des interfaces :
- `User` : ajout de `wilaya?: string`
- `SignupCredentials` : ajout de `wilaya?: string`
- `UpdateProfileData` : ajout de `wilaya?: string`

## 📱 Expérience Utilisateur

### Flux d'Inscription

1. L'utilisateur accède à l'écran d'inscription par email
2. Il remplit les champs : Prénom, Nom
3. Il clique sur le bouton "Sélectionnez votre wilaya"
4. Un modal s'ouvre avec la liste des 58 wilayas
5. Il peut rechercher sa wilaya en français ou en arabe
6. Il sélectionne sa wilaya
7. Le modal se ferme et la wilaya s'affiche dans le formulaire
8. Il continue avec l'email et le mot de passe
9. Le bouton "S'inscrire" n'est activé que si tous les champs obligatoires sont remplis (y compris la wilaya)

### Interface du Sélecteur

- **Header** : Titre "Sélectionnez votre wilaya" avec bouton de fermeture
- **Barre de recherche** : Recherche instantanée avec icône et bouton de réinitialisation
- **Compteur** : "X wilaya(s) trouvée(s)"
- **Liste** : 
  - Chaque élément affiche : Code (en bleu) + Nom français + Nom arabe
  - Indication visuelle de la sélection (fond clair + icône checkmark)
  - Séparateurs entre les éléments
- **Scroll** : Liste déroulante si nécessaire

## 🎯 Données Structurées

### Exemple de Wilaya

```typescript
{
  code: '16',
  name: 'Alger',
  arabicName: 'الجزائر'
}
```

### Wilayas Incluses

Liste complète des 58 wilayas d'Algérie :
- 01 à 48 : Wilayas historiques
- 49 à 58 : Nouvelles wilayas créées récemment
  - Timimoun, Bordj Badji Mokhtar, Ouled Djellal, Béni Abbès
  - In Salah, In Guezzam, Touggourt, Djanet, El M'Ghair, El Meniaa

## 🔒 Validation

### Frontend
- Le champ wilaya est **obligatoire** pour soumettre le formulaire
- La validation empêche la soumission si la wilaya n'est pas sélectionnée

### Backend
- Validation optionnelle côté backend (le champ peut être vide)
- Si fourni, doit contenir au moins 2 caractères

## 🚀 Utilisation Future

Le champ wilaya peut être utilisé pour :
- **Filtrage géographique** : proposer des trajets dans la même wilaya
- **Statistiques** : analyser la répartition des utilisateurs par wilaya
- **Préférences** : suggérer des trajets populaires dans la wilaya de l'utilisateur
- **Localisation** : améliorer les suggestions d'adresses

## 📝 Notes Techniques

### Composant Réutilisable

Le composant `WilayaPicker` est conçu pour être réutilisable :
```typescript
<WilayaPicker
  visible={showWilayaPicker}
  onClose={() => setShowWilayaPicker(false)}
  onSelect={(selectedWilaya) => setWilaya(selectedWilaya)}
  selectedWilaya={wilaya?.name}
/>
```

### Performance

- Recherche instantanée avec filtrage côté client
- Pas d'appel API pour la liste des wilayas (données statiques)
- Modal avec animation fluide

## ✅ Tests Recommandés

1. **Inscription sans wilaya** : vérifier que le bouton est désactivé
2. **Recherche en français** : taper "Alger" et vérifier les résultats
3. **Recherche en arabe** : taper "الجزائر" et vérifier les résultats
4. **Sélection d'une wilaya** : vérifier que le modal se ferme et que la wilaya s'affiche
5. **Soumission du formulaire** : vérifier que la wilaya est envoyée au backend
6. **Persistance** : vérifier que la wilaya est sauvegardée dans le profil utilisateur

## 🎨 Style et Design

Le composant suit le design system de l'application :
- Couleurs : `Colors.primary`, `Colors.text.primary`, `Colors.text.secondary`
- Typographie cohérente avec le reste de l'application
- Espacements et paddings standards
- Animations natives React Native

## 📦 Fichiers Créés/Modifiés

### Fichiers Créés (2)
1. `covoiturage-app/constants/algerian-wilayas.ts`
2. `covoiturage-app/components/wilaya-picker.tsx`

### Fichiers Modifiés (7)
1. `covoiturage-app/app/email-signup.tsx`
2. `covoiturage-app/services/auth-service.ts`
3. `covoiturage-app/types/auth.ts`
4. `backend/src/models/User.ts`
5. `backend/src/types/index.ts`
6. `backend/src/controllers/auth.controller.ts`
7. `backend/src/validators/auth.validator.ts`

---

**Date de modification** : 15 octobre 2025
**Version** : 1.0.0

