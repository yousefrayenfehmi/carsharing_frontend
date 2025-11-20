# 🔍 Guide de Débogage : Problème de Connexion APK

## ❌ Problème

L'application affiche "Problème de connexion. Vérifiez votre réseau." quand installée en APK, mais fonctionne avec `npm start`.

---

## 🔍 ÉTAPE 1 : Vérifier que le Build a été Refait

**IMPORTANT** : Après avoir modifié `app.json`, vous DEVEZ rebuild l'APK !

### Vérification

1. Avez-vous rebuild l'APK après avoir ajouté les configurations HTTP ?
2. Si non, faites-le maintenant :

```bash
cd covoiturage-app
eas build --platform android --profile preview --clear-cache
```

---

## 🔍 ÉTAPE 2 : Vérifier l'Accessibilité du Backend

### Test depuis le Téléphone

1. **Ouvrez le navigateur** sur votre téléphone Android
2. **Allez sur** : `http://37.59.126.29:3000/health`
3. **Vérifiez** :
   - ✅ Si ça fonctionne → Le backend est accessible
   - ❌ Si ça ne fonctionne pas → Problème réseau/firewall

### Test depuis le PC

```bash
curl http://37.59.126.29:3000/health
curl http://37.59.126.29:3000/api
```

---

## 🔍 ÉTAPE 3 : Vérifier les Logs de l'Application

### Sur Android

1. **Activez le débogage USB** sur votre téléphone
2. **Connectez en USB**
3. **Affichez les logs** :

```bash
adb logcat | grep -E "API|connexion|Network|Error"
```

Ou pour voir tous les logs de l'app :
```bash
adb logcat | grep "ReactNativeJS"
```

### Ce qu'il faut chercher

- `🌐 API URL configurée: http://37.59.126.29:3000/api`
- `🔗 API Base URL configurée: http://37.59.126.29:3000/api`
- `❌ Erreur API:` (avec les détails)

---

## 🔍 ÉTAPE 4 : Vérifier les Variables d'Environnement

### Problème Possible

Les variables d'environnement (`EXPO_PUBLIC_*`) ne sont peut-être pas incluses dans le build.

### Solution

1. **Créez un fichier `.env`** dans `covoiturage-app/` :

```env
EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
EXPO_PUBLIC_USE_PRODUCTION=true
```

2. **Rebuild avec cache clear** :

```bash
eas build --platform android --profile preview --clear-cache
```

---

## 🔍 ÉTAPE 5 : Vérifier la Configuration Network Security

### Android

Vérifiez que dans `app.json`, vous avez bien :

```json
"android": {
  "networkSecurityConfig": {
    "cleartextTrafficPermitted": true
  }
}
```

### iOS

Vérifiez que dans `app.json`, vous avez bien :

```json
"ios": {
  "infoPlist": {
    "NSAppTransportSecurity": {
      "NSAllowsArbitraryLoads": true
    }
  }
}
```

---

## 🔍 ÉTAPE 6 : Test de Connexion Directe

Ajoutez temporairement un test de connexion dans l'app pour vérifier.

### Créer un écran de test

Créez `app/test-connection.tsx` :

```typescript
import { API_URL } from '@/services/api';
import axios from 'axios';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function TestConnection() {
  const [result, setResult] = useState<string>('');
  
  const testConnection = async () => {
    try {
      console.log('🔗 Test de connexion à:', API_URL);
      const response = await axios.get(`${API_URL}/health`);
      setResult(`✅ Succès: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`❌ Erreur: ${error.message}\nCode: ${error.code}\nURL: ${API_URL}`);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Text>URL API: {API_URL}</Text>
      <Button title="Tester la connexion" onPress={testConnection} />
      <Text>{result}</Text>
    </View>
  );
}
```

Puis testez cette page dans l'app.

---

## 🔍 ÉTAPE 7 : Vérifier le Firewall/Port

### Sur le Serveur

Vérifiez que le port 3000 est ouvert :

```bash
# Sur le serveur
netstat -tuln | grep 3000
# ou
ss -tuln | grep 3000
```

### Vérifier le Firewall

Si vous utilisez un firewall (ufw, iptables, etc.), assurez-vous que le port 3000 est ouvert :

```bash
# UFW
sudo ufw allow 3000/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
```

---

## 🔍 ÉTAPE 8 : Vérifier l'URL dans le Build

### Problème Possible

L'URL pourrait être différente dans le build de production.

### Solution

Ajoutez des logs dans `config.ts` pour voir l'URL utilisée :

```typescript
export const API_URL = getApiUrl();

console.log('🌐 API URL configurée:', API_URL);
console.log('📡 Mode:', USE_PRODUCTION ? 'PRODUCTION (OVH)' : 'LOCAL');
console.log('🔍 Variables env:', {
  ENV_API_URL,
  ENV_USE_PRODUCTION,
  USE_PRODUCTION,
});
```

Puis vérifiez les logs avec `adb logcat`.

---

## ✅ Solutions Rapides

### Solution 1 : Rebuild avec Variables d'Environnement

```bash
cd covoiturage-app

# Créer .env si pas déjà fait
echo "EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api" > .env
echo "EXPO_PUBLIC_USE_PRODUCTION=true" >> .env

# Rebuild
eas build --platform android --profile preview --clear-cache
```

### Solution 2 : Vérifier le Backend

```bash
# Test depuis votre PC
curl http://37.59.126.29:3000/health

# Test depuis votre téléphone (navigateur)
# Ouvrez : http://37.59.126.29:3000/health
```

### Solution 3 : Vérifier les Logs

```bash
# Connectez votre téléphone en USB
adb logcat | grep -E "API|Error|Network"
```

---

## 🆘 Si Rien Ne Fonctionne

### Option A : Utiliser HTTPS (Recommandé)

Configurez HTTPS sur votre serveur et utilisez `https://` au lieu de `http://`.

### Option B : Test avec IP Locale

Si vous testez en local :

1. Trouvez votre IP locale : `ipconfig` (Windows)
2. Configurez `.env` :
   ```env
   EXPO_PUBLIC_USE_PRODUCTION=false
   EXPO_PUBLIC_USE_LOCAL_IP=true
   EXPO_PUBLIC_LOCAL_IP=192.168.1.14
   ```
3. Assurez-vous que le téléphone et le PC sont sur le même Wi-Fi

---

## 📋 Checklist de Débogage

- [ ] APK rebuild après modifications de `app.json`
- [ ] Fichier `.env` créé avec les bonnes variables
- [ ] Backend accessible depuis le navigateur du téléphone
- [ ] Configuration `networkSecurityConfig` présente dans `app.json`
- [ ] Configuration `NSAppTransportSecurity` présente dans `app.json` (iOS)
- [ ] Port 3000 ouvert sur le serveur
- [ ] Firewall configuré correctement
- [ ] Logs vérifiés avec `adb logcat`
- [ ] URL API correcte dans les logs

---

## 🎯 Prochaines Actions

1. **Vérifiez les logs** avec `adb logcat` pour voir l'erreur exacte
2. **Testez le backend** depuis le navigateur du téléphone
3. **Rebuild l'APK** si vous ne l'avez pas fait après les modifications
4. **Vérifiez le fichier `.env`** existe et contient les bonnes valeurs

---

**Les logs vous donneront la réponse exacte ! 🔍**

