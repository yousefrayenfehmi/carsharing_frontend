import api from './api';

/**
 * Service pour la gestion des réservations
 */

export interface CreateBookingData {
  tripId: string;
  seats: number;
  message?: string;
}

export interface Booking {
  _id: string;
  trip: any;
  passenger: any;
  driver: any;
  seats: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  message?: string;
  createdAt: string;
}

export const bookingService = {
  /**
   * Créer une réservation
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await api.post('/bookings', data);
    return response.data.data;
  },

  /**
   * Récupérer mes réservations
   */
  async getMyBookings(status?: string): Promise<Booking[]> {
    const response = await api.get('/bookings/my/bookings', {
      params: status ? { status } : undefined,
    });
    return response.data.data;
  },

  /**
   * Récupérer une réservation par ID
   */
  async getBookingById(id: string): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  /**
   * Récupérer les réservations d'un trajet (conducteur)
   */
  async getTripBookings(tripId: string): Promise<Booking[]> {
    const response = await api.get(`/bookings/trip/${tripId}`);
    return response.data.data;
  },

  /**
   * Confirmer une réservation
   */
  async confirmBooking(id: string): Promise<Booking> {
    const response = await api.put(`/bookings/${id}/status`, {
      status: 'confirmed',
    });
    return response.data.data;
  },

  /**
   * Confirmer une réservation (nouveau endpoint)
   */
  async confirmBookingNew(id: string): Promise<Booking> {
    const response = await api.put(`/bookings/${id}/confirm`);
    return response.data.data;
  },

  /**
   * Annuler une réservation
   */
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const response = await api.put(`/bookings/${id}/status`, {
      status: 'cancelled',
      cancellationReason: reason,
    });
    return response.data.data;
  },

  /**
   * Annuler une réservation avec géolocalisation
   */
  async cancelBookingWithLocation(
    id: string, 
    currentLatitude: number, 
    currentLongitude: number, 
    cancellationReason?: string
  ): Promise<Booking> {
    const response = await api.post(`/bookings/${id}/cancel-with-location`, {
      cancellationReason,
      currentLatitude,
      currentLongitude,
    });
    return response.data.data;
  },

  /**
   * Créer un avis pour une réservation
   */
  async createReview(bookingId: string, rating: number, comment?: string): Promise<any> {
    const response = await api.post(`/bookings/${bookingId}/review`, {
      rating,
      comment,
    });
    return response.data.data;
  },
};

