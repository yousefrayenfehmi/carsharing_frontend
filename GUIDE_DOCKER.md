# 🐳 Guide Docker - Backend Covoiturage

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration](#configuration)
3. [Commandes Docker de Base](#commandes-docker-de-base)
4. [Déploiement avec Docker Compose](#déploiement-avec-docker-compose)
5. [Commandes Utiles](#commandes-utiles)
6. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Installation de Docker

#### Windows
```bash
# Télécharger Docker Desktop depuis:
https://www.docker.com/products/docker-desktop/

# Après installation, vérifier:
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian)
```bash
# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

#### Mac
```bash
# Installer via Homebrew
brew install --cask docker

# Ou télécharger Docker Desktop depuis:
https://www.docker.com/products/docker-desktop/
```

---

## ⚙️ Configuration

### 1. Créer le fichier `.env`

Dans le dossier `backend/`, créez un fichier `.env` :

```bash
cd backend
nano .env  # ou utilisez votre éditeur préféré
```

Contenu du fichier `.env` :

```env
# ==========================================
# NODE
# ==========================================
NODE_ENV=production
PORT=3000

# ==========================================
# MONGODB
# ==========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/covoiturage?retryWrites=true&w=majority

# ==========================================
# JWT
# ==========================================
JWT_SECRET=votre_secret_jwt_tres_securise_a_changer_en_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=votre_secret_refresh_token_tres_securise
JWT_REFRESH_EXPIRES_IN=30d

# ==========================================
# EMAIL (SMTP)
# ==========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-app-password-gmail
SMTP_FROM=votre-email@gmail.com

# ==========================================
# CLOUDINARY (Upload d'images)
# ==========================================
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# ==========================================
# FRONTEND
# ==========================================
FRONTEND_URL=http://localhost:8081

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Commandes Docker de Base

### Construction de l'Image Docker

```bash
cd backend

# Construire l'image Docker
docker build -t covoiturage-backend:latest .

# Construire avec un tag spécifique
docker build -t covoiturage-backend:v1.0.0 .

# Construire sans cache (si vous avez des problèmes)
docker build --no-cache -t covoiturage-backend:latest .
```

### Exécution d'un Conteneur

```bash
# Démarrer le conteneur en mode détaché
docker run -d \
  --name covoiturage-backend \
  -p 3000:3000 \
  --env-file .env \
  covoiturage-backend:latest

# Démarrer le conteneur en mode interactif (voir les logs)
docker run -it \
  --name covoiturage-backend \
  -p 3000:3000 \
  --env-file .env \
  covoiturage-backend:latest
```

### Gestion des Conteneurs

```bash
# Lister les conteneurs en cours d'exécution
docker ps

# Lister tous les conteneurs (y compris arrêtés)
docker ps -a

# Arrêter un conteneur
docker stop covoiturage-backend

# Démarrer un conteneur arrêté
docker start covoiturage-backend

# Redémarrer un conteneur
docker restart covoiturage-backend

# Supprimer un conteneur
docker rm covoiturage-backend

# Supprimer un conteneur en cours d'exécution (force)
docker rm -f covoiturage-backend
```

### Visualisation des Logs

```bash
# Voir les logs en temps réel
docker logs -f covoiturage-backend

# Voir les 100 dernières lignes
docker logs --tail 100 covoiturage-backend

# Voir les logs avec timestamps
docker logs -t covoiturage-backend
```

---

## 🎯 Déploiement avec Docker Compose

### Commandes Docker Compose

```bash
cd backend

# 1. Construire et démarrer tous les services
docker-compose up -d

# 2. Construire les images (sans démarrer)
docker-compose build

# 3. Démarrer les services existants
docker-compose start

# 4. Arrêter les services (sans supprimer)
docker-compose stop

# 5. Arrêter et supprimer les conteneurs
docker-compose down

# 6. Arrêter et supprimer les conteneurs + volumes
docker-compose down -v

# 7. Voir les logs de tous les services
docker-compose logs -f

# 8. Voir les logs d'un service spécifique
docker-compose logs -f backend

# 9. Reconstruire et redémarrer (après changements)
docker-compose up -d --build

# 10. Voir l'état des services
docker-compose ps
```

### Premier Déploiement Complet

```bash
# Étape 1 : Se placer dans le dossier backend
cd backend

# Étape 2 : Vérifier que le fichier .env existe
ls -la .env

# Étape 3 : Construire et démarrer
docker-compose up -d --build

# Étape 4 : Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f

# Étape 5 : Tester l'API
curl http://localhost:3000/health
```

### Mise à Jour du Backend

```bash
# Après avoir modifié le code
cd backend

# 1. Arrêter le conteneur
docker-compose down

# 2. Reconstruire l'image
docker-compose build

# 3. Redémarrer
docker-compose up -d

# OU en une seule commande :
docker-compose up -d --build
```

---

## 🛠️ Commandes Utiles

### Inspection et Débogage

```bash
# Entrer dans le conteneur en cours d'exécution
docker exec -it covoiturage-backend sh

# Vérifier les variables d'environnement
docker exec covoiturage-backend env

# Vérifier l'utilisation des ressources
docker stats covoiturage-backend

# Inspecter le conteneur
docker inspect covoiturage-backend

# Vérifier le healthcheck
docker inspect --format='{{json .State.Health}}' covoiturage-backend | jq
```

### Gestion des Images

```bash
# Lister les images
docker images

# Supprimer une image
docker rmi covoiturage-backend:latest

# Supprimer les images non utilisées
docker image prune -a

# Voir la taille d'une image
docker images covoiturage-backend
```

### Nettoyage

```bash
# Nettoyer tous les conteneurs arrêtés
docker container prune

# Nettoyer toutes les images non utilisées
docker image prune -a

# Nettoyer tous les volumes non utilisés
docker volume prune

# Nettoyer tous les réseaux non utilisés
docker network prune

# Nettoyer TOUT (⚠️ ATTENTION)
docker system prune -a --volumes
```

---

## 🔍 Dépannage

### Problème 1 : Le conteneur ne démarre pas

```bash
# Voir les logs d'erreur
docker logs covoiturage-backend

# Causes communes :
# - Variables d'environnement manquantes
# - MongoDB inaccessible
# - Port 3000 déjà utilisé
```

**Solution :**
```bash
# Vérifier les variables d'environnement
docker exec covoiturage-backend env | grep MONGODB_URI

# Changer le port si nécessaire
docker run -p 3001:3000 ...
```

### Problème 2 : Erreur de connexion MongoDB

```bash
# Vérifier que MongoDB est accessible
docker exec covoiturage-backend ping cluster.mongodb.net

# Tester la connexion depuis le conteneur
docker exec -it covoiturage-backend sh
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('OK'))"
```

### Problème 3 : Le build échoue

```bash
# Construire sans cache
docker-compose build --no-cache

# Voir les détails du build
docker-compose build --progress=plain
```

### Problème 4 : Port déjà utilisé

```bash
# Trouver le processus qui utilise le port 3000
# Windows :
netstat -ano | findstr :3000

# Linux/Mac :
lsof -i :3000

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Problème 5 : Healthcheck échoue

```bash
# Vérifier le healthcheck
docker inspect --format='{{json .State.Health}}' covoiturage-backend

# Tester manuellement l'endpoint
curl http://localhost:3000/health

# Voir les logs du healthcheck
docker logs covoiturage-backend 2>&1 | grep health
```

---

## 📊 Monitoring

### Vérifier l'état de santé

```bash
# Health check de l'API
curl http://localhost:3000/health

# Réponse attendue :
# {
#   "success": true,
#   "message": "API Covoiturage - Serveur opérationnel",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "environment": "production"
# }
```

### Ressources utilisées

```bash
# Voir les ressources en temps réel
docker stats covoiturage-backend

# CPU, Mémoire, Réseau, etc.
```

---

## 🚀 Déploiement en Production

### Sur un VPS (Ubuntu)

```bash
# 1. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Cloner le repo
git clone https://github.com/votre-repo/projet-covoiturage.git
cd projet-covoiturage/backend

# 3. Créer le fichier .env (avec les vraies valeurs)
nano .env

# 4. Démarrer avec Docker Compose
docker-compose up -d --build

# 5. Vérifier
curl http://localhost:3000/health
```

### Avec Nginx (Reverse Proxy)

```bash
# Installer Nginx
sudo apt-get install nginx

# Configurer Nginx
sudo nano /etc/nginx/sites-available/covoiturage

# Contenu :
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/covoiturage /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📝 Checklist de Déploiement

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] MongoDB accessible (Atlas ou local)
- [ ] Port 3000 disponible
- [ ] Image Docker construite : `docker-compose build`
- [ ] Conteneur démarré : `docker-compose up -d`
- [ ] Healthcheck OK : `curl http://localhost:3000/health`
- [ ] Logs vérifiés : `docker-compose logs -f`

---

## 🎯 Commandes les Plus Utilisées

```bash
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Redémarrer après changements
docker-compose up -d --build

# Arrêter
docker-compose down

# Nettoyer tout
docker-compose down -v
docker system prune -a
```

---

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Best Practices Docker](https://docs.docker.com/develop/dev-best-practices/)

---

**🐳 Votre backend est maintenant prêt pour Docker !**

