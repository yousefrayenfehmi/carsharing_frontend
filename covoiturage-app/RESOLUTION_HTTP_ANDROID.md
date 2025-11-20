# 🔧 Résolution : Erreur de Connexion HTTP sur Android et iOS

## ❌ Problème

L'application fonctionne avec `npm start` mais affiche "Problème de connexion" quand installée en APK/IPA.

**Cause** : Android et iOS bloquent les connexions HTTP non sécurisées (http://) dans les builds de production pour des raisons de sécurité.

---

## ✅ SOLUTION : Autoriser le Trafic HTTP (Cleartext)

### Étape 1 : Configuration Android dans app.json

J'ai ajouté la configuration suivante pour Android :

```json
"android": {
  "networkSecurityConfig": {
    "cleartextTrafficPermitted": true
  }
}
```

### Étape 2 : Configuration iOS dans app.json

J'ai ajouté la configuration suivante pour iOS :

```json
"ios": {
  "infoPlist": {
    "NSAppTransportSecurity": {
      "NSAllowsArbitraryLoads": true
    }
  }
}
```

Ces configurations autorisent les connexions HTTP pour votre domaine sur Android et iOS.

### Étape 3 : Rebuild les Applications

Après ces modifications, vous devez **rebuild les applications** :

**Pour Android** :
```bash
cd covoiturage-app
eas build --platform android --profile preview --clear-cache
```

**Pour iOS** :
```bash
cd covoiturage-app
eas build --platform ios --profile production --clear-cache
```

---

## 🔒 Solution Recommandée à Long Terme : HTTPS

Pour la production, il est **fortement recommandé** d'utiliser HTTPS au lieu de HTTP.

### Option A : Certificat SSL Gratuit (Let's Encrypt)

1. Installez Certbot sur votre serveur
2. Obtenez un certificat SSL gratuit
3. Configurez votre serveur pour utiliser HTTPS
4. Mettez à jour l'URL dans `config.ts` :
   ```typescript
   export const PRODUCTION_API_URL = ENV_API_URL ?? 'https://37.59.126.29:3000/api';
   ```

### Option B : Reverse Proxy (Nginx)

Utilisez Nginx comme reverse proxy avec SSL :

```nginx
server {
    listen 443 ssl;
    server_name votre-domaine.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## 📋 Vérifications

### 1. Vérifier que la Configuration est Appliquée

Après le rebuild, vérifiez dans les logs que l'URL est correcte :
```
🌐 API URL configurée: http://37.59.126.29:3000/api
```

### 2. Tester la Connexion

**Sur Android** :
1. Installez le nouvel APK
2. Ouvrez l'application
3. Vérifiez que la connexion fonctionne

**Sur iOS** :
1. Installez le nouvel IPA (via TestFlight ou directement)
2. Ouvrez l'application
3. Vérifiez que la connexion fonctionne

### 3. Vérifier le Backend

Assurez-vous que le backend est accessible :
```bash
curl http://37.59.126.29:3000/health
```

---

## 🆘 Si Ça Ne Fonctionne Toujours Pas

### Vérification 1 : Backend Accessible

Testez depuis votre téléphone (navigateur) :
```
http://37.59.126.29:3000/health
```

Si ça ne fonctionne pas, le problème vient du réseau/firewall.

### Vérification 2 : Variables d'Environnement

Vérifiez que les variables d'environnement sont bien incluses dans le build :

1. Créez un fichier `.env` dans `covoiturage-app/` :
   ```env
   EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
   EXPO_PUBLIC_USE_PRODUCTION=true
   ```

2. Rebuild :
   ```bash
   eas build --platform android --profile preview --clear-cache
   ```

### Vérification 3 : Logs de l'Application

Ajoutez des logs pour déboguer :

Dans `config.ts`, ajoutez :
```typescript
console.log('🌐 API URL configurée:', API_URL);
console.log('📡 Mode:', USE_PRODUCTION ? 'PRODUCTION (OVH)' : 'LOCAL');
```

Puis vérifiez les logs avec :
```bash
adb logcat | grep "API URL"
```

---

## ✅ Checklist

- [ ] Configuration `networkSecurityConfig` ajoutée pour Android dans `app.json`
- [ ] Configuration `NSAppTransportSecurity` ajoutée pour iOS dans `app.json`
- [ ] APK rebuild avec `--clear-cache` (Android)
- [ ] IPA rebuild avec `--clear-cache` (iOS)
- [ ] Backend accessible depuis le téléphone
- [ ] Variables d'environnement correctes
- [ ] Nouvel APK/IPA installé sur le téléphone
- [ ] Application testée

---

## 🎯 Résumé

1. ✅ Configuration Android ajoutée dans `app.json` pour autoriser HTTP
2. ✅ Configuration iOS ajoutée dans `app.json` pour autoriser HTTP
3. ⏳ **Rebuild l'APK** (Android) avec `eas build --platform android --profile preview --clear-cache`
4. ⏳ **Rebuild l'IPA** (iOS) avec `eas build --platform ios --profile production --clear-cache`
5. ⏳ **Installez les nouvelles versions** sur vos téléphones
6. ⏳ **Testez** la connexion

**Note** : Pour la production finale, utilisez HTTPS au lieu de HTTP pour plus de sécurité.

---

**Après le rebuild, les applications Android et iOS devraient fonctionner ! 🚀**

