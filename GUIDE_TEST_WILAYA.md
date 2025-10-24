# Guide de Test - Sélection de Wilaya

## 🚀 Comment Tester

### 1. Démarrer l'Application

```bash
# Backend (dans un terminal)
cd backend
npm run dev

# Frontend (dans un autre terminal)
cd covoiturage-app
npm start
```

### 2. Tester l'Inscription

1. Ouvrir l'application mobile (Expo Go)
2. Aller sur l'écran d'inscription
3. Cliquer sur **"Continuer avec une adresse email"**
4. Remplir **Prénom** et **Nom**
5. Cliquer sur le champ **"Sélectionnez votre wilaya"**
   - Un modal s'ouvre avec les 58 wilayas
   - Rechercher votre wilaya (ex: "Alger" ou "الجزائر")
   - Sélectionner une wilaya
   - Le modal se ferme et affiche "16 - Alger"
6. Remplir **Email** et **Mot de passe** (min 8 caractères)
7. Le bouton **"S'inscrire"** s'active uniquement si tous les champs sont remplis
8. Cliquer sur **"S'inscrire"**
9. ✅ Vous êtes connecté et redirigé vers le dashboard

### 3. Tester le Profil

1. Aller sur l'onglet **"Profil"** (en bas)
2. Dans la section **"Informations personnelles"**, vérifier que la **wilaya** est affichée
3. Cliquer sur **"Modifier le profil"**
4. Dans le modal, cliquer sur le champ **"Wilaya"**
5. Changer la wilaya
6. Cliquer sur **"Enregistrer"**
7. ✅ La wilaya est mise à jour dans le profil

### 4. Recherche dans le WilayaPicker

#### En Français
- Taper "Al" → Affiche Alger, Laghouat, etc.
- Taper "Oran" → Affiche Oran
- Taper "Tizi" → Affiche Tizi Ouzou

#### En Arabe
- Taper "الجزائر" → Affiche Alger
- Taper "وهران" → Affiche Oran
- Taper "قسنطينة" → Affiche Constantine

#### Par Code
- Taper "16" → Affiche Alger
- Taper "31" → Affiche Oran

## ✅ Points de Vérification

### Inscription
- [ ] Le bouton "S'inscrire" est désactivé sans wilaya
- [ ] La wilaya sélectionnée s'affiche dans le formulaire
- [ ] La recherche fonctionne en français et en arabe
- [ ] L'inscription réussit et la wilaya est sauvegardée

### Profil
- [ ] La wilaya est affichée dans "Informations personnelles"
- [ ] Le modal d'édition affiche la wilaya actuelle
- [ ] La wilaya peut être modifiée
- [ ] Les modifications sont sauvegardées

### WilayaPicker
- [ ] Le modal s'ouvre avec animation
- [ ] La barre de recherche fonctionne
- [ ] Le compteur de résultats est correct
- [ ] La wilaya sélectionnée est indiquée (checkmark)
- [ ] Le modal se ferme après sélection

## 🗂️ Fichiers Modifiés

Voici les fichiers qui ont été modifiés :

### Frontend (6 fichiers)
1. `covoiturage-app/constants/algerian-wilayas.ts` *(créé)*
2. `covoiturage-app/components/wilaya-picker.tsx` *(créé)*
3. `covoiturage-app/app/email-signup.tsx`
4. `covoiturage-app/app/(tabs)/profile.tsx`
5. `covoiturage-app/services/auth-service.ts`
6. `covoiturage-app/types/auth.ts`

### Backend (4 fichiers)
1. `backend/src/models/User.ts`
2. `backend/src/types/index.ts`
3. `backend/src/controllers/auth.controller.ts`
4. `backend/src/validators/auth.validator.ts`

## 📋 Liste des 58 Wilayas

Les 58 wilayas d'Algérie sont disponibles :
- **01 à 48** : Wilayas historiques (Alger, Oran, Constantine, etc.)
- **49 à 58** : Nouvelles wilayas (Timimoun, Touggourt, Djanet, etc.)

Voir `LISTE_WILAYAS.md` pour la liste complète.

## 📚 Documentation Complète

Pour plus de détails :
- **`AJOUT_SELECTION_WILAYA.md`** : Documentation technique complète
- **`RECAPITULATIF_WILAYA_COMPLET.md`** : Récapitulatif de toutes les modifications
- **`LISTE_WILAYAS.md`** : Référence rapide des 58 wilayas

## 🐛 Problèmes Connus

Aucun problème connu. Tous les fichiers ont été testés et validés sans erreur de linter.

## 🎉 Résultat

✅ **La sélection de wilaya est maintenant intégrée dans l'inscription et le profil !**

---

*Bon test ! 🚀*

