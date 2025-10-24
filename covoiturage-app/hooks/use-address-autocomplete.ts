import { useState, useEffect, useCallback } from 'react';
import { searchCityInAlgeria } from '@/services/geocoding-service';

/**
 * Hook pour l'autocomplétion d'adresses en Algérie
 * Utilise Nominatim pour rechercher des adresses précises (rues, quartiers, etc.)
 */

export interface AddressSuggestion {
  displayName: string;
  city: string;
  street?: string;
  suburb?: string;
  latitude: number;
  longitude: number;
  type: 'city' | 'street' | 'suburb' | 'poi';
}

export const useAddressAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, 500); // Attendre 500ms après la dernière frappe

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchAddresses = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchCityInAlgeria(searchQuery);
      
      const formatted: AddressSuggestion[] = results.map((result) => ({
        displayName: result.displayName,
        city: result.city,
        latitude: result.latitude,
        longitude: result.longitude,
        type: 'city' as const,
      }));

      setSuggestions(formatted);
    } catch (err) {
      setError('Erreur lors de la recherche d\'adresses');
      console.error('Address search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    clearSuggestions,
  };
};


