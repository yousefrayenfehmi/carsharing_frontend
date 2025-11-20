# 🔧 Configuration des Variables d'Environnement

## 📋 Vue d'ensemble

L'application utilise des variables d'environnement pour configurer l'URL de l'API backend. Cela permet de changer facilement entre différents environnements (production, développement local, etc.) sans modifier le code.

## 🚀 Configuration Rapide

### 1. Créer le fichier .env

Créez un fichier `.env` à la racine du dossier `covoiturage-app/` avec le contenu suivant :

```env
# Configuration de l'API Backend

# URL de l'API en production
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api

# Mode de configuration
# true = utiliser EXPO_PUBLIC_API_URL
# false = utiliser l'IP locale (pour développement)
EXPO_PUBLIC_USE_PRODUCTION=true

# Configuration locale (pour développement uniquement)
EXPO_PUBLIC_LOCAL_IP=192.168.1.14
EXPO_PUBLIC_BACKEND_PORT=3000
EXPO_PUBLIC_USE_LOCAL_IP=false
```

### 2. Redémarrer Expo

Après avoir créé ou modifié le fichier `.env`, vous devez redémarrer le serveur Expo :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm start
```

⚠️ **Important** : Les variables d'environnement sont lues au démarrage. Vous devez redémarrer Expo après chaque modification du `.env`.

## 🌍 Modes de Configuration

### Mode Production (Backend OVH)

Pour utiliser l'API de production sur le serveur OVH :

```env
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
EXPO_PUBLIC_USE_PRODUCTION=true
```

L'application utilisera : `http://37.59.126.29:3000/api`

### Mode Développement - Émulateur Android

Pour tester avec un backend local sur un émulateur Android :

```env
EXPO_PUBLIC_USE_PRODUCTION=false
EXPO_PUBLIC_USE_LOCAL_IP=false
EXPO_PUBLIC_BACKEND_PORT=3000
```

L'application utilisera : `http://10.0.2.2:3000/api`

### Mode Développement - Appareil Physique

Pour tester avec un backend local sur un téléphone physique :

1. Trouvez votre IP locale :
   - **Windows** : `ipconfig` dans le terminal
   - **Mac/Linux** : `ifconfig` dans le terminal
   - Cherchez l'adresse IPv4 (ex: 192.168.1.14)

2. Configurez le `.env` :

```env
EXPO_PUBLIC_USE_PRODUCTION=false
EXPO_PUBLIC_USE_LOCAL_IP=true
EXPO_PUBLIC_LOCAL_IP=192.168.1.14
EXPO_PUBLIC_BACKEND_PORT=3000
```

L'application utilisera : `http://192.168.1.14:3000/api`

⚠️ Votre téléphone et votre PC doivent être sur le **même réseau Wi-Fi**.

## 📝 Variables Disponibles

| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `EXPO_PUBLIC_API_URL` | URL de l'API en production | `http://37.59.126.29:3000/api` | ✅ |
| `EXPO_PUBLIC_USE_PRODUCTION` | Utiliser l'URL de production | `true` | ✅ |
| `EXPO_PUBLIC_USE_LOCAL_IP` | Utiliser une IP locale | `false` | Non |
| `EXPO_PUBLIC_LOCAL_IP` | IP locale pour développement | `192.168.1.14` | Non |
| `EXPO_PUBLIC_BACKEND_PORT` | Port du backend local | `3000` | Non |

## 🔒 Sécurité

Le fichier `.env` est automatiquement ignoré par Git (`.gitignore`) pour éviter de commiter des informations sensibles.

**Ne commitez JAMAIS le fichier `.env` dans Git !**

## ✅ Vérification

Pour vérifier que votre configuration fonctionne :

1. Démarrez l'application
2. Regardez les logs dans le terminal Expo
3. Vous devriez voir :
   ```
   🌐 API URL configurée: http://37.59.126.29:3000/api
   📡 Mode: PRODUCTION (OVH)
   ```

## 🔧 Valeurs par Défaut

Si le fichier `.env` n'existe pas, l'application utilisera les valeurs par défaut configurées dans `config.ts` :
- URL de production : `http://37.59.126.29:3000/api`
- Mode production : activé
- L'application fonctionnera normalement avec ces valeurs

## 🆘 Dépannage

### L'application n'utilise pas les nouvelles variables

**Solution** : Redémarrez complètement Expo (Ctrl+C puis `npm start`)

### Erreur de connexion au backend

1. Vérifiez que l'URL dans `.env` est correcte
2. Vérifiez que le backend est démarré
3. En mode local avec appareil physique :
   - Vérifiez que le téléphone et le PC sont sur le même Wi-Fi
   - Vérifiez que l'IP locale est correcte (`ipconfig` ou `ifconfig`)
   - Vérifiez que le firewall n'bloque pas la connexion

### Les variables ne sont pas reconnues

Les variables doivent **obligatoirement** commencer par `EXPO_PUBLIC_` pour être accessibles dans l'application React Native avec Expo.

## 📚 En Savoir Plus

- [Documentation Expo sur les variables d'environnement](https://docs.expo.dev/guides/environment-variables/)
- [Guide de configuration Expo](https://docs.expo.dev/workflow/configuration/)





