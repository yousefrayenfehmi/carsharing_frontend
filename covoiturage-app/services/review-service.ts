import api from './api';

export interface CreateReviewData {
  bookingId: string;
  rating: number;
  comment?: string;
  isAnonymous?: boolean;
}

export interface Review {
  _id: string;
  trip: any;
  booking: string;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  reviewee: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating?: number;
    totalRatings?: number;
  };
  rating: number;
  comment?: string;
  reviewerRole: 'driver' | 'passenger';
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service pour la gestion des avis
 */
class ReviewService {
  /**
   * Créer un avis
   */
  async createReview(data: CreateReviewData): Promise<Review> {
    const response = await api.post('/reviews', data);
    return response.data.data;
  }

  /**
   * Récupérer les avis reçus par un utilisateur
   */
  async getUserReviews(userId: string, role?: 'driver' | 'passenger'): Promise<Review[]> {
    const params = role ? { role } : {};
    const response = await api.get(`/reviews/user/${userId}`, { params });
    return response.data.data;
  }

  /**
   * Récupérer mes avis donnés
   */
  async getMyGivenReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/my/given');
    return response.data.data;
  }

  /**
   * Récupérer mes avis reçus
   */
  async getMyReceivedReviews(): Promise<Review[]> {
    const response = await api.get('/reviews/my/received');
    return response.data.data;
  }

  /**
   * Récupérer les avis d'une réservation
   */
  async getBookingReviews(bookingId: string): Promise<Review[]> {
    const response = await api.get(`/reviews/booking/${bookingId}`);
    return response.data.data;
  }

  /**
   * Modifier un avis
   */
  async updateReview(reviewId: string, rating: number, comment?: string): Promise<Review> {
    const response = await api.put(`/reviews/${reviewId}`, { rating, comment });
    return response.data.data;
  }

  /**
   * Supprimer un avis
   */
  async deleteReview(reviewId: string): Promise<void> {
    await api.delete(`/reviews/${reviewId}`);
  }
}

export default new ReviewService();



