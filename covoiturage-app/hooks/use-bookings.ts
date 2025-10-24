import { useState, useEffect } from 'react';
import { bookingService, type Booking, type CreateBookingData } from '@/services/booking-service';

/**
 * Hook personnalisé pour la gestion des réservations
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (data: CreateBookingData) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.createBooking(data);
      return booking;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la réservation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getMyBookings = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const myBookings = await bookingService.getMyBookings(status);
      setBookings(myBookings);
      return myBookings;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la récupération';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTripBookings = async (tripId: string) => {
    try {
      setLoading(true);
      setError(null);
      const tripBookings = await bookingService.getTripBookings(tripId);
      setBookings(tripBookings);
      return tripBookings;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la récupération des réservations du trajet';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.confirmBooking(id);
      return booking;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la confirmation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const confirmBookingNew = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.confirmBookingNew(id);
      return booking;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la confirmation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.cancelBooking(id, reason);
      return booking;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const cancelBookingWithLocation = async (
    id: string, 
    currentLatitude: number, 
    currentLongitude: number, 
    reason?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const booking = await bookingService.cancelBookingWithLocation(
        id, 
        currentLatitude, 
        currentLongitude, 
        reason
      );
      return booking;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'annulation';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (bookingId: string, rating: number, comment?: string) => {
    try {
      setLoading(true);
      setError(null);
      const review = await bookingService.createReview(bookingId, rating, comment);
      return review;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de la création de l\'avis';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    getMyBookings,
    getTripBookings,
    confirmBooking,
    confirmBookingNew,
    cancelBooking,
    cancelBookingWithLocation,
    createReview,
  };
};

