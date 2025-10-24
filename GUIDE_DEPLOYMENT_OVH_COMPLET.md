# 🚀 Guide Complet de Déploiement OVH

## 📦 Fichiers créés pour vous

Tous les fichiers nécessaires pour déployer votre backend sur OVH ont été créés !

---

## 📁 Structure des fichiers de déploiement

```
projet-covoiturage/
│
├── backend/
│   │
│   ├── 📘 GUIDES DE DÉPLOIEMENT
│   │   ├── INDEX_DEPLOIEMENT.md ⭐ COMMENCEZ ICI
│   │   ├── README_DEPLOYMENT.md (Vue d'ensemble de toutes les options)
│   │   ├── DEPLOYMENT_OVH.md ⭐ GUIDE COMPLET (45 min)
│   │   ├── RESUME_DEPLOYMENT_OVH.md (Version rapide - 20 min)
│   │   └── CHECKLIST_DEPLOIEMENT_OVH.md ⭐ À SUIVRE PENDANT LE DÉPLOIEMENT
│   │
│   ├── 🔧 OUTILS ET RÉFÉRENCES
│   │   ├── COMMANDES_OVH.md ⭐ AIDE-MÉMOIRE (gardez-le ouvert)
│   │   ├── deploy-ovh.sh ⭐ SCRIPT AUTOMATIQUE (chmod +x déjà fait)
│   │   └── ecosystem.config.js (Configuration PM2)
│   │
│   └── 📚 AUTRES DOCUMENTATIONS
│       ├── DEPLOYMENT.md (Multi-plateforme)
│       ├── DOCKER_GUIDE.md (Docker)
│       ├── API.md
│       └── README.md
│
└── GUIDE_DEPLOYMENT_OVH_COMPLET.md (Ce fichier)
```

---

## 🎯 DÉMARRAGE RAPIDE

### Option 1️⃣ : Je veux comprendre chaque étape (Recommandé si premier déploiement)

```
1. Ouvrez : backend/INDEX_DEPLOIEMENT.md
2. Lisez : backend/README_DEPLOYMENT.md (10 min)
3. Suivez : backend/DEPLOYMENT_OVH.md (guide complet)
4. Cochez : backend/CHECKLIST_DEPLOIEMENT_OVH.md (pendant le déploiement)
5. Référence : backend/COMMANDES_OVH.md (commandes à copier-coller)
```

### Option 2️⃣ : Je connais Linux, je veux aller vite

```
1. Ouvrez : backend/RESUME_DEPLOYMENT_OVH.md
2. Cochez : backend/CHECKLIST_DEPLOIEMENT_OVH.md
3. Référence : backend/COMMANDES_OVH.md
```

### Option 3️⃣ : Je veux juste les commandes essentielles

```
Ouvrez : backend/COMMANDES_OVH.md
```

---

## 📖 Description de chaque fichier

### 🌟 Fichiers principaux

| Fichier | Quoi | Quand l'utiliser | Temps |
|---------|------|------------------|-------|
| **INDEX_DEPLOIEMENT.md** | Index de tous les guides | 🚀 COMMENCEZ ICI | 5 min |
| **DEPLOYMENT_OVH.md** | Guide détaillé pas à pas | Premier déploiement | 45 min |
| **CHECKLIST_DEPLOIEMENT_OVH.md** | Checklist à cocher | Pendant le déploiement | 30-45 min |
| **RESUME_DEPLOYMENT_OVH.md** | Version ultra-rapide | Si vous connaissez Linux | 20 min |
| **COMMANDES_OVH.md** | Aide-mémoire commandes | Référence permanente | - |
| **deploy-ovh.sh** | Script automatique | Après le déploiement | - |

---

## 🎬 Par où commencer ?

### 🆕 **Premier déploiement sur OVH**

1. **Ouvrez ces 3 fichiers :**
   - `backend/INDEX_DEPLOIEMENT.md` (pour comprendre la structure)
   - `backend/DEPLOYMENT_OVH.md` (guide détaillé)
   - `backend/CHECKLIST_DEPLOIEMENT_OVH.md` (checklist)

2. **Préparez ces informations :**
   - ✅ IP de votre serveur OVH : `__________________`
   - ✅ MongoDB Atlas URI : `mongodb+srv://...`
   - ✅ Cloudinary Cloud Name, API Key, API Secret
   - ✅ Gmail App Password (pour les emails)
   - ✅ Nom de domaine (optionnel)

3. **Suivez le guide DEPLOYMENT_OVH.md et cochez la CHECKLIST**

4. **Temps total estimé : 30-45 minutes**

---

## 🔥 Guide ultra-rapide (pour les pressés)

```bash
# 1. Se connecter au serveur OVH
ssh ubuntu@votre-ip-ovh

# 2. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Cloner le projet
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/votre-repo/projet-covoiturage.git
cd projet-covoiturage/backend

# 4. Configurer .env
cp env.example .env
nano .env  # Ajustez les variables

# 5. Installer et build
npm install
npm run build

# 6. Démarrer avec PM2
sudo npm install -g pm2
pm2 start dist/server.js --name covoiturage-api
pm2 startup && pm2 save

# 7. Nginx
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/covoiturage-api
# (Copiez la config depuis DEPLOYMENT_OVH.md)
sudo ln -s /etc/nginx/sites-available/covoiturage-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 8. Firewall
sudo ufw allow 22 && sudo ufw allow 80 && sudo ufw allow 443
sudo ufw enable

# 9. Tester
curl http://localhost:3000/health
```

**Pour plus de détails, consultez `backend/DEPLOYMENT_OVH.md`**

---

## 🛠️ Après le déploiement

### 1. Utiliser le script d'automatisation

```bash
cd ~/apps/projet-covoiturage/backend
./deploy-ovh.sh
```

Menu interactif :
- 📥 Premier déploiement complet
- 🔄 Mettre à jour le code (git pull)
- 🔨 Rebuild et redémarrer
- 📊 Voir les logs
- 🧪 Tester l'API

### 2. Mettre à jour l'application mobile

Dans `covoiturage-app/config/api.ts` :
```typescript
export const API_URL = 'https://api.votre-domaine.com/api';
// ou
export const API_URL = 'http://votre-ip-ovh/api';
```

### 3. Tester l'application complète

- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Création de trajet fonctionne
- [ ] Recherche fonctionne
- [ ] Réservation fonctionne
- [ ] Upload photo de profil fonctionne
- [ ] Notifications fonctionnent

---

## 📋 Checklist pré-déploiement

### Prérequis

- [ ] Serveur VPS OVH avec Ubuntu 20.04/22.04
- [ ] Accès SSH au serveur
- [ ] MongoDB Atlas configuré (compte gratuit)
- [ ] Cloudinary configuré (compte gratuit)
- [ ] Gmail App Password créé (pour les emails)
- [ ] Code backend testé localement

### Informations nécessaires

- [ ] IP du serveur : `__________________`
- [ ] MongoDB URI : `mongodb+srv://...`
- [ ] Cloudinary credentials configurés
- [ ] SMTP configuré
- [ ] JWT secrets générés (différents du dev)
- [ ] Frontend URL définie

---

## 🔄 Mise à jour du code

### Avec le script (recommandé)

```bash
ssh ubuntu@votre-ip-ovh
cd ~/apps/projet-covoiturage/backend
./deploy-ovh.sh
# Choisir option 2 : Mettre à jour le code
```

### Manuellement

```bash
ssh ubuntu@votre-ip-ovh
cd ~/apps/projet-covoiturage/backend
git pull origin main
npm install
npm run build
pm2 restart covoiturage-api
pm2 logs
```

---

## 🆘 En cas de problème

### L'API ne répond pas

```bash
# Vérifier le statut
pm2 status

# Voir les logs
pm2 logs covoiturage-api

# Redémarrer
pm2 restart covoiturage-api

# Tester localement
curl http://localhost:3000/health
```

### Nginx retourne 502 Bad Gateway

```bash
# Vérifier Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Vérifier que PM2 tourne
pm2 status

# Vérifier le port 3000
sudo lsof -i :3000
```

### MongoDB ne se connecte pas

```bash
# Vérifier le .env
cat .env | grep MONGODB_URI

# Tester la connexion
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ OK')).catch(e => console.log('❌', e.message));"
```

**Pour plus de solutions, consultez :**
- `backend/DEPLOYMENT_OVH.md` > Section "Dépannage"
- `backend/COMMANDES_OVH.md` > Section "Dépannage rapide"

---

## 📊 Commandes essentielles

### Connexion
```bash
ssh ubuntu@votre-ip-ovh
```

### PM2
```bash
pm2 status                      # Voir le statut
pm2 logs                        # Voir les logs
pm2 restart covoiturage-api     # Redémarrer
pm2 monit                       # Monitoring en temps réel
```

### Nginx
```bash
sudo systemctl status nginx             # Statut
sudo systemctl restart nginx            # Redémarrer
sudo tail -f /var/log/nginx/error.log  # Logs d'erreur
```

### Tests
```bash
curl http://localhost:3000/health       # Test local
curl http://votre-ip-ovh/health         # Test via Nginx
```

---

## 📚 Documentation complète

Tous les guides sont dans le dossier `backend/` :

| Guide | Description |
|-------|-------------|
| `INDEX_DEPLOIEMENT.md` | 📑 Index de tous les guides |
| `README_DEPLOYMENT.md` | 📖 Vue d'ensemble |
| `DEPLOYMENT_OVH.md` | 📘 Guide complet détaillé |
| `RESUME_DEPLOYMENT_OVH.md` | ⚡ Version rapide |
| `CHECKLIST_DEPLOIEMENT_OVH.md` | ✅ Checklist à suivre |
| `COMMANDES_OVH.md` | 🔧 Aide-mémoire |
| `DEPLOYMENT.md` | 🌐 Multi-plateforme |
| `DOCKER_GUIDE.md` | 🐳 Docker |

---

## 🎯 Workflow recommandé

### 1️⃣ Préparation (sur votre PC)

```
✅ Lire INDEX_DEPLOIEMENT.md
✅ Lire README_DEPLOYMENT.md
✅ Préparer le fichier .env
✅ Noter toutes les informations nécessaires
✅ S'assurer que MongoDB Atlas et Cloudinary sont configurés
```

### 2️⃣ Déploiement (sur le serveur OVH)

```
✅ Suivre DEPLOYMENT_OVH.md pas à pas
✅ Cocher CHECKLIST_DEPLOIEMENT_OVH.md
✅ Utiliser COMMANDES_OVH.md pour copier-coller
✅ Tester après chaque étape
```

### 3️⃣ Finalisation (sur votre PC)

```
✅ Mettre à jour l'URL API dans le frontend
✅ Recompiler l'application mobile
✅ Tester toutes les fonctionnalités
```

### 4️⃣ Maintenance (régulièrement)

```
✅ Utiliser deploy-ovh.sh pour les mises à jour
✅ Surveiller les logs : pm2 logs
✅ Vérifier l'espace disque : df -h
✅ Backups MongoDB Atlas
```

---

## 🌟 Conseils pour réussir

### ✅ À FAIRE

- Suivre le guide étape par étape
- Tester après chaque étape
- Garder les logs ouverts (`pm2 logs`)
- Sauvegarder les configurations
- Documenter vos modifications personnelles
- Tester le redémarrage du serveur

### ❌ À ÉVITER

- Sauter des étapes
- Ne pas changer les secrets JWT en production
- Oublier de whitelister l'IP OVH dans MongoDB Atlas
- Activer UFW avant d'autoriser le port 22
- Ne pas configurer `pm2 startup` et `pm2 save`
- Commiter le fichier `.env` sur Git

---

## 💡 Fonctionnalités du script deploy-ovh.sh

Le script `backend/deploy-ovh.sh` offre un menu interactif :

```
1) 📥 Premier déploiement complet
2) 🔄 Mettre à jour le code (git pull)
3) 🔨 Rebuild et redémarrer
4) 🔁 Redémarrer l'application
5) 📊 Voir les logs
6) 📈 Voir le statut
7) 🛑 Arrêter l'application
8) ▶️  Démarrer l'application
9) 🧪 Tester l'API
10) 🧹 Nettoyer (node_modules, dist)
```

**Utilisation :**
```bash
cd ~/apps/projet-covoiturage/backend
./deploy-ovh.sh
```

---

## 🎉 Résultat attendu

Après un déploiement réussi, vous aurez :

✅ API accessible sur `http://votre-ip-ovh` ou `https://api.votre-domaine.com`  
✅ MongoDB Atlas connecté  
✅ Cloudinary configuré pour les uploads  
✅ PM2 gérant l'application  
✅ Nginx comme reverse proxy  
✅ Firewall configuré  
✅ SSL configuré (si domaine)  
✅ Redémarrage automatique au boot  
✅ Logs accessibles via `pm2 logs`  

---

## 📞 Support

### Ordre de consultation en cas de problème :

1. **Section Dépannage** dans `DEPLOYMENT_OVH.md`
2. **Aide-mémoire** dans `COMMANDES_OVH.md`
3. **Logs :** `pm2 logs covoiturage-api`
4. **Logs Nginx :** `sudo tail -f /var/log/nginx/error.log`

---

## 🚀 COMMENCEZ MAINTENANT !

### Étape suivante :

```bash
# Sur votre PC, ouvrez le guide principal
cd C:\Users\youss\OneDrive\Bureau\projet-covoiturage\backend
notepad INDEX_DEPLOIEMENT.md

# Ou avec VSCode
code INDEX_DEPLOIEMENT.md
```

---

**Bonne chance avec votre déploiement ! 🎉**

**N'oubliez pas :** Commencez par lire `backend/INDEX_DEPLOIEMENT.md` !

---

## 📈 Statistiques des fichiers créés

- **7** guides de déploiement
- **1** script d'automatisation
- **1** configuration PM2
- **150+** commandes documentées
- **30-45 min** pour un déploiement complet
- **100%** gratuit (hors coûts VPS)

---

**Tout est prêt pour votre déploiement OVH ! 🚀🇩🇿**

