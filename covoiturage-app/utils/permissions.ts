/**
 * Utilitaire pour gérer les permissions de l'application
 * Utilisez ces fonctions avant d'accéder aux fonctionnalités sensibles
 */

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Demande la permission de localisation
 * @returns true si accordée, false sinon
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'FITARIKI a besoin d\'accéder à votre localisation pour trouver des trajets à proximité.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Paramètres', 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur permission localisation:', error);
    return false;
  }
}

/**
 * Demande la permission de la caméra
 * @returns true si accordée, false sinon
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'FITARIKI a besoin d\'accéder à votre caméra pour prendre une photo de profil.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Paramètres', 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur permission caméra:', error);
    return false;
  }
}

/**
 * Demande la permission de la bibliothèque photos
 * @returns true si accordée, false sinon
 */
export async function requestMediaLibraryPermission(): Promise<boolean> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'FITARIKI a besoin d\'accéder à vos photos pour définir votre photo de profil.',
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Paramètres', 
            onPress: () => Linking.openSettings() 
          }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur permission photos:', error);
    return false;
  }
}

/**
 * Vérifie si la permission de localisation est accordée
 * @returns true si accordée, false sinon
 */
export async function checkLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Erreur vérification permission localisation:', error);
    return false;
  }
}

/**
 * Obtient la position actuelle de l'utilisateur
 * Demande la permission si nécessaire
 * @returns Coordonnées ou null si refusé
 */
export async function getCurrentLocation(): Promise<{latitude: number, longitude: number} | null> {
  try {
    // Vérifier d'abord la permission
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    // Obtenir la position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Erreur obtention localisation:', error);
    Alert.alert(
      'Erreur',
      'Impossible d\'obtenir votre localisation. Vérifiez que le GPS est activé.'
    );
    return null;
  }
}

/**
 * Prendre une photo avec la caméra
 * @returns URI de la photo ou null si annulé
 */
export async function takePhoto(): Promise<string | null> {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Erreur prise de photo:', error);
    Alert.alert('Erreur', 'Impossible de prendre la photo.');
    return null;
  }
}

/**
 * Choisir une photo depuis la galerie
 * @returns URI de la photo ou null si annulé
 */
export async function pickImage(): Promise<string | null> {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.error('Erreur sélection photo:', error);
    Alert.alert('Erreur', 'Impossible de sélectionner la photo.');
    return null;
  }
}

/**
 * Demande toutes les permissions nécessaires au démarrage
 * Utile pour l'écran d'onboarding
 */
export async function requestAllPermissions(): Promise<void> {
  try {
    // Demander la localisation (la plus importante)
    await requestLocationPermission();
    
    // Note: Ne pas demander caméra/photos au démarrage
    // Ces permissions seront demandées quand l'utilisateur
    // voudra ajouter une photo de profil
  } catch (error) {
    console.error('Erreur demande permissions:', error);
  }
}

/**
 * Affiche un résumé des permissions accordées (pour debug)
 */
export async function checkAllPermissions(): Promise<void> {
  try {
    const locationStatus = await Location.getForegroundPermissionsAsync();
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.getMediaLibraryPermissionsAsync();

    console.log('📍 Localisation:', locationStatus.status);
    console.log('📷 Caméra:', cameraStatus.status);
    console.log('🖼️ Photos:', mediaStatus.status);
  } catch (error) {
    console.error('Erreur vérification permissions:', error);
  }
}

