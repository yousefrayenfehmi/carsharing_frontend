# 🚀 Migration vers l'API OVH - Récapitulatif

**Date** : 25 octobre 2025  
**Ancienne API** : https://covoiturage-backend.onrender.com/api  
**Nouvelle API** : http://37.59.126.29/api

---

## ✅ Modifications Effectuées

### 1. 📝 Fichier `.env` créé
**Chemin** : `covoiturage-app/.env`

Contient la configuration de l'API :
```env
EXPO_PUBLIC_API_URL=http://37.59.126.29/api
EXPO_PUBLIC_USE_PRODUCTION=true
```

✅ Ce fichier est ignoré par Git pour la sécurité

### 2. 📄 Template `.env.example` créé
**Chemin** : `covoiturage-app/.env.example`

Template pour d'autres développeurs avec la structure des variables nécessaires.

### 3. 🔧 Fichier `config.ts` mis à jour
**Chemin** : `covoiturage-app/config.ts`

**Changements** :
- ✅ Lecture des variables d'environnement depuis `.env`
- ✅ Support des variables `EXPO_PUBLIC_*`
- ✅ Valeurs par défaut si `.env` n'existe pas
- ✅ Documentation mise à jour dans les commentaires

**Nouvelles fonctionnalités** :
```typescript
// Lecture automatique depuis .env
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;
export const PRODUCTION_API_URL = ENV_API_URL ?? 'http://37.59.126.29/api';
```

### 4. 🔒 `.gitignore` mis à jour
**Chemin** : `covoiturage-app/.gitignore`

Ajout de `.env` pour éviter de commiter les configurations sensibles.

### 5. 📚 Documentation créée

**Fichiers de documentation** :
- `covoiturage-app/ENV_CONFIG.md` - Guide complet des variables d'environnement
- `CONFIG_API_GUIDE.md` - Guide de configuration rapide de l'API
- `MIGRATION_API_OVH.md` - Ce fichier (récapitulatif)

---

## 🎯 Configuration Actuelle

### Mode Production (Activé)
```
URL API: http://37.59.126.29/api
Mode: PRODUCTION (OVH)
```

L'application mobile se connecte maintenant automatiquement au serveur OVH.

---

## 🚀 Comment Démarrer l'Application

### 1. Redémarrer Expo (Important !)

Les variables d'environnement sont lues au démarrage d'Expo. Si l'application était déjà lancée, vous **devez** la redémarrer :

```bash
# Dans le terminal où Expo tourne, appuyez sur Ctrl+C
# Puis redémarrez :
cd covoiturage-app
npm start
```

### 2. Vérifier les Logs

Au démarrage, vous devriez voir dans la console :
```
🌐 API URL configurée: http://37.59.126.29/api
📡 Mode: PRODUCTION (OVH)
```

### 3. Tester l'Application

Lancez l'application sur votre appareil/émulateur et vérifiez que :
- ✅ La connexion fonctionne
- ✅ Les données sont chargées depuis la nouvelle API
- ✅ Les fonctionnalités principales marchent (login, trajets, réservations, etc.)

---

## 🔄 Changer d'Environnement

### Passer en Développement Local

Éditez `covoiturage-app/.env` :

```env
EXPO_PUBLIC_USE_PRODUCTION=false
EXPO_PUBLIC_USE_LOCAL_IP=true
EXPO_PUBLIC_LOCAL_IP=192.168.1.14  # Votre IP Wi-Fi
```

Puis redémarrez Expo.

### Revenir en Production

Éditez `covoiturage-app/.env` :

```env
EXPO_PUBLIC_USE_PRODUCTION=true
EXPO_PUBLIC_API_URL=http://37.59.126.29/api
```

Puis redémarrez Expo.

---

## 📱 Construction d'APK

Lors de la construction d'un APK avec EAS Build, les variables du fichier `.env` seront automatiquement incluses.

### Pour construire un APK de production :

```bash
cd covoiturage-app

# Assurez-vous que .env contient :
# EXPO_PUBLIC_API_URL=http://37.59.126.29/api
# EXPO_PUBLIC_USE_PRODUCTION=true

# Construire l'APK
eas build --platform android --profile production
```

⚠️ **Important** : Vérifiez toujours que votre `.env` est correctement configuré avant de lancer un build.

---

## 🔍 Vérification de la Configuration

### Commande de Vérification

```bash
cd covoiturage-app
cat .env
```

**Sortie attendue** :
```env
EXPO_PUBLIC_API_URL=http://37.59.126.29/api
EXPO_PUBLIC_USE_PRODUCTION=true
EXPO_PUBLIC_LOCAL_IP=192.168.1.14
EXPO_PUBLIC_BACKEND_PORT=3000
EXPO_PUBLIC_USE_LOCAL_IP=false
```

---

## 🆘 Dépannage

### Problème : L'application utilise encore l'ancienne URL

**Solution** :
1. Vérifiez que le fichier `.env` existe : `ls covoiturage-app/.env`
2. Vérifiez son contenu : `cat covoiturage-app/.env`
3. Redémarrez complètement Expo (Ctrl+C puis `npm start`)

### Problème : Erreur de connexion au backend

**Vérifications** :
1. Le backend est-il démarré sur http://37.59.126.29/ ?
   - Testez dans le navigateur : http://37.59.126.29/
2. Votre appareil a-t-il accès à Internet ?
3. Y a-t-il un pare-feu qui bloque la connexion ?

### Problème : Les variables ne sont pas reconnues

**Solution** :
- Les variables doivent **obligatoirement** commencer par `EXPO_PUBLIC_`
- Vérifiez l'orthographe dans le fichier `.env`
- Redémarrez Expo

---

## 📊 Structure des Fichiers

```
projet-covoiturage/
├── covoiturage-app/
│   ├── .env                    ← Configuration actuelle (ignoré par Git)
│   ├── .env.example            ← Template de configuration
│   ├── .gitignore              ← Mis à jour
│   ├── config.ts               ← Mis à jour pour lire .env
│   ├── ENV_CONFIG.md           ← Documentation complète
│   └── ...
├── CONFIG_API_GUIDE.md         ← Guide rapide
└── MIGRATION_API_OVH.md        ← Ce fichier
```

---

## ✅ Checklist de Migration

- [x] Fichier `.env` créé avec la nouvelle URL
- [x] Fichier `.env.example` créé
- [x] `config.ts` mis à jour pour lire les variables d'environnement
- [x] `.gitignore` mis à jour
- [x] Documentation créée
- [x] Vérification : aucune URL codée en dur restante
- [ ] **TODO : Redémarrer Expo pour appliquer les changements**
- [ ] **TODO : Tester l'application avec la nouvelle API**
- [ ] **TODO : Rebuilder l'APK si nécessaire**

---

## 📚 Ressources

### Documentation Créée
- `covoiturage-app/ENV_CONFIG.md` - Guide des variables d'environnement
- `CONFIG_API_GUIDE.md` - Guide de configuration de l'API

### Documentation Expo
- [Variables d'environnement Expo](https://docs.expo.dev/guides/environment-variables/)
- [Configuration Expo](https://docs.expo.dev/workflow/configuration/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

---

## 🎉 Prochaines Étapes

1. **Redémarrer Expo** pour appliquer la nouvelle configuration
2. **Tester l'application** sur émulateur/appareil
3. **Vérifier toutes les fonctionnalités** (login, trajets, réservations, etc.)
4. **Rebuilder l'APK** si vous voulez déployer la nouvelle version

---

**✨ Migration terminée avec succès !**

L'application est maintenant configurée pour utiliser l'API OVH sur **http://37.59.126.29/api**.

Pour toute question, consultez la documentation ou les fichiers de configuration.





