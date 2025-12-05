/**
 * Configuration de l'application
 * 
 * 🌍 MODES DE CONFIGURATION :
 * 
 * Pour configurer l'API, créez un fichier .env à la racine de covoiturage-app/ :
 * 
 * EXPO_PUBLIC_API_URL=http://37.59.126.29:3000/api
 * EXPO_PUBLIC_USE_PRODUCTION=true
 * EXPO_PUBLIC_LOCAL_IP=192.168.1.14
 * EXPO_PUBLIC_BACKEND_PORT=3000
 * EXPO_PUBLIC_USE_LOCAL_IP=false
 * 
 * 1. PRODUCTION (USE_PRODUCTION = true)
 *    → L'app utilisera l'URL définie dans EXPO_PUBLIC_API_URL
 *    → Pour déploiement en production ou tests avec backend OVH
 * 
 * 2. ÉMULATEUR Android (USE_PRODUCTION = false, USE_LOCAL_IP = false)
 *    → L'app utilisera http://10.0.2.2:3000/api
 *    → Backend local sur le port 3000
 * 
 * 3. APPAREIL PHYSIQUE (USE_PRODUCTION = false, USE_LOCAL_IP = true)
 *    → L'app utilisera http://[VOTRE_IP]:3000/api
 *    → Trouvez votre IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
 *    → Votre téléphone et PC doivent être sur le MÊME réseau Wi-Fi
 */

// Lecture des variables d'environnement (fichier .env)
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;
const ENV_USE_PRODUCTION = process.env.EXPO_PUBLIC_USE_PRODUCTION;
const ENV_LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP;
const ENV_BACKEND_PORT = process.env.EXPO_PUBLIC_BACKEND_PORT;
const ENV_USE_LOCAL_IP = process.env.EXPO_PUBLIC_USE_LOCAL_IP;

// ⚠️ VALEURS PAR DÉFAUT (utilisées si .env n'existe pas)
// Si la variable n'est pas définie OU vaut 'true', on utilise le mode production
export const USE_PRODUCTION = ENV_USE_PRODUCTION !== 'false'; // true = backend production, false = backend local
export const USE_LOCAL_IP = ENV_USE_LOCAL_IP === 'true'; // true = appareil physique, false = émulateur (ignoré si USE_PRODUCTION = true)
export const LOCAL_IP = ENV_LOCAL_IP ?? '192.168.1.14'; // Votre IP Wi-Fi (utilisé uniquement en mode local)
export const BACKEND_PORT = parseInt(ENV_BACKEND_PORT ?? '3000'); // Port du backend local

// URL de production (Serveur OVH) - lue depuis .env ou valeur par défaut
export const PRODUCTION_API_URL = ENV_API_URL ?? 'http://37.59.126.29:3000/api';

// Configuration automatique
export const getApiUrl = () => {
  // Mode Production : utiliser le backend OVH
  if (USE_PRODUCTION) {
    return PRODUCTION_API_URL;
  }
  
  // Mode Local : appareil physique ou émulateur
  if (USE_LOCAL_IP) {
    return `http://${LOCAL_IP}:${BACKEND_PORT}/api`;
  }
  
  // Pour émulateur Android
  return `http://10.0.2.2:${BACKEND_PORT}/api`;
};

export const API_URL = getApiUrl();

console.log('🌐 API URL configurée:', API_URL);
console.log('📡 Mode:', USE_PRODUCTION ? 'PRODUCTION (OVH)' : 'LOCAL');


