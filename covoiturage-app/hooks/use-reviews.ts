import { useState } from 'react';
import reviewService, { CreateReviewData, Review } from '@/services/review-service';

export function useReviews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = async (data: CreateReviewData) => {
    try {
      setLoading(true);
      setError(null);
      const review = await reviewService.createReview(data);
      return review;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la création de l\'avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUserReviews = async (userId: string, role?: 'driver' | 'passenger') => {
    try {
      setLoading(true);
      setError(null);
      const reviews = await reviewService.getUserReviews(userId, role);
      return reviews;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyGivenReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviews = await reviewService.getMyGivenReviews();
      return reviews;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyReceivedReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const reviews = await reviewService.getMyReceivedReviews();
      return reviews;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getBookingReviews = async (bookingId: string) => {
    try {
      setLoading(true);
      setError(null);
      const reviews = await reviewService.getBookingReviews(bookingId);
      return reviews;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId: string, rating: number, comment?: string) => {
    try {
      setLoading(true);
      setError(null);
      const review = await reviewService.updateReview(reviewId, rating, comment);
      return review;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la modification de l\'avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      setLoading(true);
      setError(null);
      await reviewService.deleteReview(reviewId);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression de l\'avis';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createReview,
    getUserReviews,
    getMyGivenReviews,
    getMyReceivedReviews,
    getBookingReviews,
    updateReview,
    deleteReview,
  };
}
