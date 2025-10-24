# 🚀 Démarrage Rapide - Photo de Profil

## ⚡ En 3 Minutes

### **1️⃣ Démarrer le Backend**

```bash
# Ouvrez un terminal et tapez :
cd backend
npm run dev
```

**✅ Vous devriez voir :**
```
🔧 Configuration Cloudinary: {
  cloud_name: '✅',
  api_key: '✅ (85423...)',
  api_secret: '✅ (****)'
}
🚗 ====================================== 🚗
   🚀 Serveur démarré avec succès !
   📡 Port: 5000
🚗 ====================================== 🚗
```

---

### **2️⃣ Démarrer l'Application Mobile**

Ouvrez un **NOUVEAU terminal** :

```bash
cd covoiturage-app
npx expo start
```

Scannez le QR code avec **Expo Go** sur votre téléphone.

---

### **3️⃣ Ajouter une Photo**

Sur votre téléphone :
1. Ouvrez l'app
2. Allez dans **"Profil"** (en bas à droite)
3. Tapez sur votre **avatar** (cercle avec initiales)
4. Choisissez **"Choisir dans la galerie"** ou **"Prendre une photo"**
5. Sélectionnez/Prenez une photo
6. ✅ Terminé !

---

## 🧪 Tester Cloudinary

Pour vérifier que tout fonctionne :

```bash
cd backend
npm run build
node dist/scripts/test-cloudinary.js
```

**✅ Résultat attendu :**
```
🎉 Tous les tests ont réussi!
```

---

## ❌ Si ça ne marche pas

### **Erreur : "npm run dev" ne marche pas**

Vérifiez que vous êtes dans le bon dossier :

```bash
# ❌ Mauvais :
C:\Users\youss\OneDrive\Bureau\projet-covoiturage> npm run dev

# ✅ Correct :
C:\Users\youss\OneDrive\Bureau\projet-covoiturage\backend> npm run dev
```

### **Erreur : "L'upload d'images n'est pas configuré"**

1. Arrêtez le serveur (`Ctrl + C`)
2. Vérifiez que `backend/.env` contient :
   ```env
   CLOUDINARY_CLOUD_NAME=dmxpnnptr
   CLOUDINARY_API_KEY=854231211996854
   CLOUDINARY_API_SECRET=tRNxOH_en6dUsWhCJFwFaZNBnN0
   ```
3. Redémarrez : `npm run dev`

### **Erreur : "Must supply api_key"**

Le serveur n'a pas chargé les variables d'environnement.

**Solution :**
1. Fermez TOUS les terminaux
2. Ouvrez un nouveau terminal
3. Allez dans `backend/` : `cd backend`
4. Lancez : `npm run dev`

### **L'image ne s'affiche pas**

1. Secouez le téléphone
2. Tapez **"Reload"**
3. Réessayez

---

## 📱 Voir les Photos Uploadées

**Sur Cloudinary :**
1. https://cloudinary.com/console
2. Connectez-vous
3. Media Library → `covoiturage/profiles/`

---

## 📋 Checklist Rapide

Avant de tester :

- [ ] Backend lancé (`cd backend && npm run dev`)
- [ ] App mobile lancée (Expo Go)
- [ ] Connecté dans l'app
- [ ] PC et téléphone sur le même WiFi
- [ ] Permissions galerie autorisées

---

## ✅ Tout Fonctionne ?

Félicitations ! 🎉 Votre système de photos de profil est opérationnel.

**Pour plus de détails, consultez :** `GUIDE_PHOTO_PROFIL.md`

---

## 🆘 Besoin d'Aide ?

1. Vérifiez les **logs du terminal backend**
2. Testez avec : `node dist/scripts/test-cloudinary.js`
3. Consultez `GUIDE_PHOTO_PROFIL.md` section **Dépannage**

**Bon développement ! 🚀**

