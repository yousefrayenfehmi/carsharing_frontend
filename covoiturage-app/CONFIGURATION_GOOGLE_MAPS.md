# Configuration de l'API Google Maps

## 📋 Prérequis

Pour utiliser l'autocomplétion d'adresses avec Google Maps, vous devez :

1. Avoir un compte Google Cloud Platform
2. Créer un projet GCP
3. Activer les APIs nécessaires
4. Créer une clé API

## 🔧 Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le nom de votre projet

### 2. Activer les APIs nécessaires

Dans votre projet Google Cloud, activez les APIs suivantes :

- **Places API** (pour l'autocomplétion)
- **Geocoding API** (pour le géocodage inversé, optionnel)
- **Maps SDK for Android** (si vous ciblez Android)
- **Maps SDK for iOS** (si vous ciblez iOS)

Pour activer une API :
1. Allez dans "APIs & Services" > "Library"
2. Recherchez l'API
3. Cliquez dessus puis "Enable"

### 3. Créer une clé API

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "API Key"
3. Copiez la clé générée

### 4. Sécuriser votre clé API (Recommandé)

Pour sécuriser votre clé API :

1. Cliquez sur votre clé API nouvellement créée
2. Sous "Application restrictions" :
   - Pour Android : sélectionnez "Android apps" et ajoutez votre package name
   - Pour iOS : sélectionnez "iOS apps" et ajoutez votre bundle identifier
3. Sous "API restrictions" :
   - Sélectionnez "Restrict key"
   - Choisissez uniquement les APIs nécessaires (Places API, Geocoding API, etc.)

### 5. Configurer la clé dans l'application

Modifiez le fichier `app.json` et remplacez `VOTRE_CLE_API_GOOGLE_MAPS` par votre vraie clé :

```json
{
  "expo": {
    "extra": {
      "googleMapsApiKey": "AIzaSy... votre clé ici ..."
    }
  }
}
```

## 💰 Tarification

Google Maps Platform offre un crédit mensuel gratuit de 200$ :

- **Places Autocomplete** : ~0.00283$ par requête
- **Place Details** : ~0.017$ par requête
- **Geocoding** : ~0.005$ par requête

Avec le crédit gratuit, vous pouvez effectuer environ :
- ~70,000 requêtes Autocomplete par mois
- ~11,700 requêtes Place Details par mois

### Conseils pour économiser :

1. Utilisez le debounce (déjà implémenté - 400ms)
2. Limitez les champs retournés (déjà optimisé)
3. Utilisez les restrictions géographiques (déjà configuré pour l'Algérie)

## 🔍 Test de la configuration

Après avoir configuré votre clé API :

1. Relancez l'application
2. Allez sur un écran avec recherche d'adresse
3. Tapez une adresse algérienne (ex: "Alger", "Oran")
4. Les suggestions devraient apparaître

Si vous voyez un avertissement "Clé API Google Maps non configurée", vérifiez :
- Que la clé est bien dans `app.json`
- Que les APIs sont activées dans Google Cloud Console
- Que la clé n'est pas restreinte de manière incorrecte

## 🚨 Dépannage

### Erreur "REQUEST_DENIED"
- Vérifiez que l'API Places est activée
- Vérifiez les restrictions de la clé API

### Erreur "OVER_QUERY_LIMIT"
- Vous avez dépassé votre quota
- Vérifiez votre facturation dans Google Cloud Console

### Pas de résultats
- Vérifiez que la restriction `countryRestriction: 'dz'` est correcte
- Testez avec une recherche plus générique

## 📱 Utilisation dans l'application

Le nouveau système utilise :

1. **GooglePlacesInput** (mode modal) - Pour la sélection de ville/wilaya
2. **AddressInput** - Pour la saisie d'adresses précises

Les deux composants utilisent automatiquement l'API Google Maps lorsque la clé est configurée.

