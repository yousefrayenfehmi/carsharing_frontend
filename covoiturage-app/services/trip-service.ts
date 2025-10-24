import api from './api';

/**
 * Service pour la gestion des trajets
 */

export interface Location {
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateTripData {
  departure: Location;
  destination: Location;
  departureTime: Date | string;
  price: number;
  priceType?: 'fixed' | 'negotiable';
  availableSeats: number;
  description?: string;
}

export interface CreateRecurringTripData {
  departure: Location;
  destination: Location;
  departureTime: string; // Format "HH:MM"
  price: number;
  priceType?: 'fixed' | 'negotiable';
  availableSeats: number;
  description?: string;
  recurringDays: number[]; // [1, 2, 3, 4, 5] = Lundi à Vendredi
  startDate: string; // Format ISO date
  endDate: string; // Format ISO date
}

export interface SearchParams {
  departureCity?: string;
  destinationCity?: string;
  departureLatitude?: number;
  departureLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  date?: string;
  minSeats?: number;
  maxPrice?: number;
  radius?: number;
}

export interface Trip {
  _id: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating: number;
  };
  departure: {
    city: string;
    address?: string;
    coordinates: [number, number];
  };
  destination: {
    city: string;
    address?: string;
    coordinates: [number, number];
  };
  departureTime: string;
  price: number;
  priceType: 'fixed' | 'negotiable';
  availableSeats: number;
  description?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export const tripService = {
  /**
   * Créer un nouveau trajet
   */
  async createTrip(data: CreateTripData): Promise<Trip> {
    const response = await api.post('/trips', data);
    return response.data.data;
  },

  /**
   * Créer des trajets récurrents
   */
  async createRecurringTrips(data: CreateRecurringTripData): Promise<{
    count: number;
    trips: Trip[];
    period: { start: string; end: string };
    days: number[];
  }> {
    const response = await api.post('/trips/recurring', data);
    return response.data.data;
  },

  /**
   * Rechercher des trajets
   */
  async searchTrips(params: SearchParams): Promise<Trip[]> {
    const response = await api.get('/trips/search', { params });
    return response.data.data;
  },

  /**
   * Récupérer un trajet par ID
   */
  async getTripById(id: string): Promise<Trip> {
    const response = await api.get(`/trips/${id}`);
    return response.data.data;
  },

  /**
   * Récupérer mes trajets
   */
  async getMyTrips(status?: 'active' | 'completed' | 'cancelled'): Promise<Trip[]> {
    const response = await api.get('/trips/my/trips', {
      params: status ? { status } : undefined,
    });
    return response.data.data;
  },

  /**
   * Mettre à jour un trajet
   */
  async updateTrip(id: string, data: Partial<CreateTripData>): Promise<Trip> {
    const response = await api.put(`/trips/${id}`, data);
    return response.data.data;
  },

  /**
   * Annuler un trajet
   */
  async cancelTrip(id: string): Promise<Trip> {
    const response = await api.delete(`/trips/${id}`);
    return response.data.data;
  },

  /**
   * Marquer un trajet comme terminé
   */
  async completeTrip(id: string): Promise<Trip> {
    const response = await api.put(`/trips/${id}/complete`);
    return response.data.data;
  },

  /**
   * Récupérer les statistiques du conducteur
   */
  async getDriverStats(): Promise<{
    totalTrips: number;
    activeTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    totalRevenue: number;
    totalCommission: number;
    netRevenue: number;
    totalPassengers: number;
    averageRating: number;
  }> {
    const response = await api.get('/trips/my/stats');
    return response.data.data;
  },
};

