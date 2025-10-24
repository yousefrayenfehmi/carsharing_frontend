/**
 * Configuration de l'application
 * 
 * 🌍 MODES DE CONFIGURATION :
 * 
 * 1. PRODUCTION (USE_PRODUCTION = true)
 *    → L'app utilisera https://covoiturage-backend.onrender.com/api
 *    → Pour déploiement en production ou tests avec backend déployé
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

// ⚠️ CONFIGURATION PRINCIPALE - CHANGEZ ICI
export const USE_PRODUCTION = true; // true = backend Render, false = backend local
export const USE_LOCAL_IP = false; // true = appareil physique, false = émulateur (ignoré si USE_PRODUCTION = true)
export const LOCAL_IP = '192.168.1.14'; // Votre IP Wi-Fi (utilisé uniquement en mode local)
export const BACKEND_PORT = 3000; // Port du backend local

// URL de production (Render)
export const PRODUCTION_API_URL = 'https://covoiturage-backend.onrender.com/api';

// Configuration automatique
export const getApiUrl = () => {
  // Mode Production : utiliser le backend Render
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
console.log('📡 Mode:', USE_PRODUCTION ? 'PRODUCTION (Render)' : 'LOCAL');


