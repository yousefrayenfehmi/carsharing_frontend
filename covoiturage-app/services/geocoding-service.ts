import axios from 'axios';

/**
 * Service de géocodage pour l'Algérie utilisant OpenStreetMap Nominatim
 * Gratuit et fonctionne très bien en Algérie
 */

export interface GeocodingResult {
  city: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
}

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

/**
 * Nettoyer le nom d'affichage en retirant les caractères arabes mal encodés
 */
const cleanDisplayName = (displayName: string): string => {
  // Retirer les caractères arabes et les caractères spéciaux mal encodés
  return displayName
    .replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g, '') // Caractères arabes
    .replace(/[‎‏]/g, '') // Marques de direction de texte
    .replace(/ك؟.*?الجزائر/g, '') // Pattern spécifique
    .replace(/\s+/g, ' ') // Espaces multiples → un seul
    .replace(/,\s*,/g, ',') // Virgules doubles
    .replace(/,\s*$/, '') // Virgule finale
    .trim();
};

/**
 * Rechercher une ville en Algérie
 */
export const searchCityInAlgeria = async (query: string): Promise<GeocodingResult[]> => {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const response = await axios.get(`${NOMINATIM_API}/search`, {
      params: {
        q: `${query}, Algeria`,
        format: 'json',
        addressdetails: 1,
        limit: 10,
        countrycodes: 'dz', // Code ISO pour l'Algérie
      },
      headers: {
        'User-Agent': 'CovoiturageApp/1.0', // Nominatim requiert un User-Agent
      },
    });

    return response.data.map((item: any) => {
      const cityName = item.address.city || item.address.town || item.address.village || item.name;
      const cleanedDisplayName = cleanDisplayName(item.display_name);
      
      return {
        city: cityName,
        displayName: cleanedDisplayName || cityName, // Fallback sur la ville si le nettoyage donne un résultat vide
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        country: 'Algérie',
      };
    });
  } catch (error) {
    console.error('Erreur lors de la recherche de ville:', error);
    return [];
  }
};

/**
 * Obtenir les coordonnées d'une ville algérienne
 */
export const geocodeAlgerianCity = async (city: string): Promise<GeocodingResult | null> => {
  try {
    const results = await searchCityInAlgeria(city);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    return null;
  }
};

/**
 * Géocodage inversé : obtenir la ville à partir de coordonnées
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    const response = await axios.get(`${NOMINATIM_API}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'CovoiturageApp/1.0',
      },
    });

    const address = response.data.address;
    return address.city || address.town || address.village || address.state || null;
  } catch (error) {
    console.error('Erreur lors du géocodage inversé:', error);
    return null;
  }
};

