import Constants from 'expo-constants';

/**
 * Service Google Maps pour l'autocomplétion d'adresses
 * Utilise l'API Google Places Autocomplete
 */

// Clé API Google Maps - à configurer dans app.json ou .env
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || 'VOTRE_CLE_API_GOOGLE_MAPS';

const PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place';

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  city: string;
  wilaya?: string;
  latitude: number;
  longitude: number;
  country: string;
}

/**
 * Rechercher des lieux avec l'API Google Places Autocomplete
 */
export const searchPlaces = async (
  query: string,
  options?: {
    types?: string;
    countryRestriction?: string;
  }
): Promise<PlacePrediction[]> => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const params = new URLSearchParams({
      input: query,
      key: GOOGLE_MAPS_API_KEY,
      language: 'fr',
      components: options?.countryRestriction ? `country:${options.countryRestriction}` : 'country:dz', // Algérie par défaut
    });

    if (options?.types) {
      params.append('types', options.types);
    }

    const response = await fetch(
      `${PLACES_API_URL}/autocomplete/json?${params.toString()}`
    );

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return [];
    }

    return (data.predictions || []).map((prediction: any) => ({
      placeId: prediction.place_id,
      description: prediction.description,
      mainText: prediction.structured_formatting?.main_text || prediction.description,
      secondaryText: prediction.structured_formatting?.secondary_text || '',
      types: prediction.types || [],
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche Google Places:', error);
    return [];
  }
};

/**
 * Obtenir les détails d'un lieu par son place_id
 */
export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  try {
    const params = new URLSearchParams({
      place_id: placeId,
      key: GOOGLE_MAPS_API_KEY,
      language: 'fr',
      fields: 'place_id,name,formatted_address,geometry,address_components',
    });

    const response = await fetch(
      `${PLACES_API_URL}/details/json?${params.toString()}`
    );

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places Details API error:', data.status, data.error_message);
      return null;
    }

    const result = data.result;
    const addressComponents = result.address_components || [];

    // Extraire la ville et la wilaya des composants d'adresse
    let city = '';
    let wilaya = '';
    let country = '';

    for (const component of addressComponents) {
      const types = component.types || [];
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        wilaya = component.long_name;
      } else if (types.includes('administrative_area_level_2') && !city) {
        city = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      }
    }

    // Si pas de ville trouvée, utiliser le nom du lieu
    if (!city) {
      city = result.name;
    }

    return {
      placeId: result.place_id,
      name: result.name,
      formattedAddress: result.formatted_address,
      city,
      wilaya,
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      country,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du lieu:', error);
    return null;
  }
};

/**
 * Rechercher des villes/régions en Algérie (pour remplacer WilayaPicker)
 */
export const searchCities = async (query: string): Promise<PlacePrediction[]> => {
  return searchPlaces(query, {
    types: '(cities)',
    countryRestriction: 'dz',
  });
};

/**
 * Rechercher des adresses en Algérie
 */
export const searchAddresses = async (query: string): Promise<PlacePrediction[]> => {
  return searchPlaces(query, {
    countryRestriction: 'dz',
  });
};

/**
 * Vérifier si la clé API est configurée
 */
export const isGoogleMapsConfigured = (): boolean => {
  return GOOGLE_MAPS_API_KEY !== 'VOTRE_CLE_API_GOOGLE_MAPS' && GOOGLE_MAPS_API_KEY.length > 0;
};

export default {
  searchPlaces,
  getPlaceDetails,
  searchCities,
  searchAddresses,
  isGoogleMapsConfigured,
};

