# 🔧 Guide de Configuration de l'API

## ✅ Configuration Terminée

L'application a été configurée pour utiliser la nouvelle API backend sur **http://37.59.126.29:3000/**

## 📁 Fichiers Créés/Modifiés

### 1. `covoiturage-app/.env`
Fichier de configuration avec les variables d'environnement :
```env
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
EXPO_PUBLIC_USE_PRODUCTION=true
```

### 2. `covoiturage-app/.env.example`
Fichier template pour d'autres développeurs

### 3. `covoiturage-app/config.ts`
Mis à jour pour lire les variables d'environnement du fichier `.env`

### 4. `covoiturage-app/.gitignore`
Mis à jour pour ignorer le fichier `.env` (sécurité)

### 5. `covoiturage-app/ENV_CONFIG.md`
Documentation complète sur la configuration des variables d'environnement

## 🚀 Démarrage Rapide

### Pour démarrer l'application :

```bash
cd covoiturage-app
npm start
```

⚠️ **Important** : Si l'application était déjà lancée, vous devez la **redémarrer** pour que les nouvelles variables d'environnement soient prises en compte.

## 🔄 Changer l'URL de l'API

### Méthode 1 : Modifier le fichier .env (Recommandé)

Éditez le fichier `covoiturage-app/.env` :

```env
# Pour utiliser l'API de production
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
EXPO_PUBLIC_USE_PRODUCTION=true

# Pour utiliser un backend local
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_USE_PRODUCTION=false
```

Puis redémarrez Expo (Ctrl+C puis `npm start`)

### Méthode 2 : Modifier config.ts

Si vous ne voulez pas utiliser de fichier `.env`, vous pouvez modifier directement les valeurs par défaut dans `covoiturage-app/config.ts`.

## 🌍 Configuration par Environnement

### Production (Serveur OVH)
```env
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
EXPO_PUBLIC_USE_PRODUCTION=true
```

### Développement Local - Émulateur
```env
EXPO_PUBLIC_USE_PRODUCTION=false
EXPO_PUBLIC_USE_LOCAL_IP=false
EXPO_PUBLIC_BACKEND_PORT=3000
```
→ Utilisera `http://10.0.2.2:3000/api`

### Développement Local - Appareil Physique
```env
EXPO_PUBLIC_USE_PRODUCTION=false
EXPO_PUBLIC_USE_LOCAL_IP=true
EXPO_PUBLIC_LOCAL_IP=192.168.1.14  # Votre IP Wi-Fi
EXPO_PUBLIC_BACKEND_PORT=3000
```
→ Utilisera `http://192.168.1.14:3000/api`

## ✅ Vérification

Lorsque vous démarrez l'application, vous devriez voir dans les logs :

```
🌐 API URL configurée: http://37.59.126.29:3000/api
📡 Mode: PRODUCTION (OVH)
```

## 🔒 Sécurité

- ✅ Le fichier `.env` est ignoré par Git
- ✅ Les variables sensibles ne seront pas commitées
- ✅ Chaque développeur peut avoir sa propre configuration locale

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `covoiturage-app/ENV_CONFIG.md` - Guide complet des variables d'environnement
- `covoiturage-app/.env.example` - Template de configuration

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que le fichier `.env` existe dans `covoiturage-app/`
2. Vérifiez que les variables commencent bien par `EXPO_PUBLIC_`
3. Redémarrez complètement Expo (Ctrl+C puis `npm start`)
4. Vérifiez les logs dans le terminal Expo

---

**Date de mise à jour** : 25 octobre 2025  
**API Backend** : http://37.59.126.29:3000/





