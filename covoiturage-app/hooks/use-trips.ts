import { useState, useEffect } from 'react';
import { tripService, type Trip, type SearchParams, type CreateTripData, type CreateRecurringTripData } from '@/services/trip-service';

/**
 * Hook personnalisé pour la gestion des trajets
 */
export const useTrips = (searchParams?: SearchParams) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTrips = async (params?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const results = await tripService.searchTrips(params || searchParams || {});
      setTrips(results);
      return results;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la recherche';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (data: CreateTripData) => {
    try {
      setLoading(true);
      setError(null);
      const trip = await tripService.createTrip(data);
      return trip;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la création du trajet';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const createRecurringTrips = async (data: CreateRecurringTripData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await tripService.createRecurringTrips(data);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la création des trajets récurrents';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getMyTrips = async (status?: 'active' | 'completed' | 'cancelled') => {
    try {
      setLoading(true);
      setError(null);
      const myTrips = await tripService.getMyTrips(status);
      setTrips(myTrips);
      return myTrips;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la récupération des trajets';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelTrip = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const cancelledTrip = await tripService.cancelTrip(id);
      // Mettre à jour la liste des trajets après annulation
      const updatedTrips = trips.filter(trip => trip._id !== id);
      setTrips(updatedTrips);
      return cancelledTrip;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const completeTrip = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const completedTrip = await tripService.completeTrip(id);
      // Mettre à jour la liste des trajets après marquage comme terminé
      const updatedTrips = trips.map(trip => 
        trip._id === id ? { ...trip, status: 'completed' as const } : trip
      );
      setTrips(updatedTrips);
      return completedTrip;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors du marquage comme terminé';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams) {
      searchTrips(searchParams);
    }
  }, []);

  return {
    trips,
    loading,
    error,
    searchTrips,
    createTrip,
    createRecurringTrips,
    getMyTrips,
    getTripById: async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        const trip = await tripService.getTripById(id);
        return trip;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erreur lors de la récupération du trajet';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    cancelTrip,
    completeTrip,
  };
};

/**
 * Hook pour un trajet spécifique
 */
export const useTrip = (tripId?: string) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const tripData = await tripService.getTripById(id);
      setTrip(tripData);
      return tripData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la récupération du trajet';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (id: string, data: Partial<CreateTripData>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTrip = await tripService.updateTrip(id, data);
      setTrip(updatedTrip);
      return updatedTrip;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la mise à jour';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelTrip = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const cancelledTrip = await tripService.cancelTrip(id);
      setTrip(cancelledTrip);
      return cancelledTrip;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTrip(tripId);
    }
  }, [tripId]);

  return {
    trip,
    loading,
    error,
    fetchTrip,
    updateTrip,
    cancelTrip,
  };
};

