# 📱 Guide de Test sur Appareil Physique (USB/Wi-Fi)

## ❌ Problème : "Network Error" lors de la connexion

Ce guide vous aide à résoudre les erreurs de connexion réseau quand vous testez l'application sur un appareil physique.

---

## 🔍 Diagnostic du Problème

L'erreur "Network Error" signifie que l'application mobile ne peut pas atteindre le backend. Voici les causes possibles :

1. ❌ Le backend n'est pas démarré
2. ❌ Le téléphone et l'ordinateur ne sont pas sur le même réseau Wi-Fi
3. ❌ L'URL de l'API est incorrecte
4. ❌ Le pare-feu Windows bloque la connexion

---

## ✅ Solution Complète (Étape par Étape)

### **Étape 1 : Vérifier votre IP locale**

```bash
# Sur Windows
ipconfig
```

Cherchez la ligne **"Carte réseau sans fil Wi-Fi"** → **"Adresse IPv4"**

Exemple : `192.168.1.14` ✅

### **Étape 2 : Configurer l'application mobile**

Ouvrez le fichier : `covoiturage-app/config.ts`

```typescript
export const USE_LOCAL_IP = true;        // ✅ true pour appareil physique
export const LOCAL_IP = '192.168.1.14';  // ✅ Mettez VOTRE IP ici
export const BACKEND_PORT = 5000;        // ✅ Port du backend
```

**Important :**
- Pour **appareil physique** (USB/Wi-Fi) : `USE_LOCAL_IP = true`
- Pour **émulateur Android** : `USE_LOCAL_IP = false`

### **Étape 3 : Démarrer le backend**

```bash
# Terminal 1 - Dans le dossier projet-covoiturage
cd backend
npm run dev
```

Attendez de voir :
```
🚗 ====================================== 🚗
   🚀 Serveur démarré avec succès !
   📡 Port: 5000
   📝 API: http://localhost:5000/api
🚗 ====================================== 🚗
```

### **Étape 4 : Tester la connexion au backend**

Depuis votre **téléphone**, ouvrez le navigateur et tapez :

```
http://192.168.1.14:5000/health
```

*(Remplacez `192.168.1.14` par VOTRE IP)*

**Résultat attendu :**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

✅ Si ça fonctionne → Passez à l'étape 5  
❌ Si ça ne fonctionne pas → Voir "Dépannage" ci-dessous

### **Étape 5 : Relancer l'application mobile**

```bash
# Terminal 2 - Dans le dossier projet-covoiturage
cd covoiturage-app

# Arrêter l'app (Ctrl+C) puis relancer
npx expo start --clear
```

Sur votre téléphone :
1. **Secouez** le téléphone
2. Tapez sur **"Reload"** ou **"Recharger"**
3. Essayez de vous connecter

---

## 🔧 Dépannage Avancé

### Problème 1 : Le backend ne démarre pas

**Vérifier le fichier .env :**
```bash
cd backend
cat .env
```

Le fichier doit contenir au minimum :
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://yousseffehmi98:YOUSSEFrayen123@cluster0.puydf.mongodb.net/covoiturage?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=7d
```

### Problème 2 : Le téléphone ne peut pas accéder au backend

**a) Vérifier que les appareils sont sur le même Wi-Fi :**
- Ordinateur : Paramètres → Wi-Fi → Nom du réseau
- Téléphone : Paramètres → Wi-Fi → Nom du réseau
- Les deux doivent être **identiques** ✅

**b) Désactiver temporairement le pare-feu Windows :**

1. Panneau de configuration → Pare-feu Windows Defender
2. "Activer ou désactiver le pare-feu Windows Defender"
3. Désactiver pour **"Réseau privé"** (temporairement)
4. Tester l'application
5. **Réactiver après le test !**

**c) Autoriser le port 5000 dans le pare-feu :**

```powershell
# Exécuter PowerShell en tant qu'administrateur
New-NetFirewallRule -DisplayName "Backend Node.js" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### Problème 3 : L'application ne recharge pas la configuration

**Solution : Clear cache complet**

```bash
cd covoiturage-app

# Arrêter Metro (Ctrl+C)

# Supprimer le cache
rm -rf .expo
rm -rf node_modules/.cache

# Relancer
npx expo start --clear
```

### Problème 4 : Port 5000 déjà utilisé

**Trouver et arrêter le processus :**

```bash
# Windows - Trouver le processus sur le port 5000
netstat -ano | findstr :5000

# Tuer le processus (remplacez PID par le numéro trouvé)
taskkill /PID [PID] /F
```

---

## 📊 Checklist de Vérification

Avant de tester, vérifiez que :

- [ ] Le fichier `backend/.env` existe avec les bonnes configurations
- [ ] Le backend est démarré (`npm run dev` dans backend/)
- [ ] Vous voyez "Serveur démarré avec succès" dans le terminal
- [ ] Votre IP locale est correcte dans `covoiturage-app/config.ts`
- [ ] `USE_LOCAL_IP = true` dans `covoiturage-app/config.ts`
- [ ] Le téléphone ET l'ordinateur sont sur le MÊME Wi-Fi
- [ ] Vous pouvez accéder à `http://[VOTRE_IP]:5000/health` depuis le navigateur du téléphone
- [ ] L'application mobile a été rechargée (secouer → Reload)

---

## 🎯 Configuration Rapide (Résumé)

### Pour appareil physique (USB/Wi-Fi) :

**1. Trouver votre IP :**
```bash
ipconfig  # Windows
```

**2. Modifier `covoiturage-app/config.ts` :**
```typescript
export const USE_LOCAL_IP = true;
export const LOCAL_IP = '192.168.1.14'; // VOTRE IP
```

**3. Démarrer le backend :**
```bash
cd backend && npm run dev
```

**4. Relancer l'app :**
```bash
cd covoiturage-app && npx expo start --clear
```

**5. Sur le téléphone :**
- Secouer → Reload
- Tester la connexion

---

## 🆘 Toujours des problèmes ?

### Test manuel de connexion :

```bash
# Depuis votre ordinateur
curl http://localhost:5000/health

# Devrait retourner : {"status":"ok","message":"API is running"}
```

### Vérifier les logs du backend :

Regardez le terminal où tourne `npm run dev`. Cherchez :
- ✅ "Serveur démarré avec succès"
- ✅ "MongoDB connecté"
- ❌ Erreurs en rouge

### Vérifier les logs de l'app mobile :

Dans le terminal Expo, cherchez :
- 🌐 "API URL configurée: http://192.168.1.14:5000/api"
- ❌ "Network Error"

---

## 💡 Astuces

1. **Utilisez toujours `--clear`** quand vous changez la configuration :
   ```bash
   npx expo start --clear
   ```

2. **Testez d'abord avec le navigateur du téléphone** :
   - Si `http://[IP]:5000/health` ne marche pas dans le navigateur
   - Alors l'app ne marchera pas non plus
   - C'est un problème réseau, pas un problème d'app

3. **Gardez les deux terminaux ouverts** :
   - Terminal 1 : Backend (`npm run dev`)
   - Terminal 2 : App mobile (`npx expo start`)

4. **IP change ?** Si votre IP change (après redémarrage, changement de réseau), mettez à jour `config.ts` !

---

## 📝 Notes Importantes

⚠️ **Pour l'émulateur Android** :
```typescript
export const USE_LOCAL_IP = false; // Utilisera 10.0.2.2
```

⚠️ **Le backend doit tourner sur le port 5000** (défini dans `backend/.env`)

⚠️ **Même réseau Wi-Fi obligatoire** pour appareil physique

⚠️ **Ne pas utiliser VPN** pendant les tests (peut bloquer la connexion locale)

---

## ✅ Succès !

Si tout fonctionne, vous devriez voir :
1. Backend : "Serveur démarré avec succès"
2. App mobile : Écran de connexion sans erreur
3. Tentative de connexion → Pas d'erreur "Network Error"

🎉 Bon développement !










