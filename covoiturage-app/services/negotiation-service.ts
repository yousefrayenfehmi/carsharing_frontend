import api from './api';

export interface NegotiationMessage {
  sender: string;
  senderType: 'passenger' | 'driver';
  message: string;
  priceOffer?: number;
  createdAt: string;
}

export interface Negotiation {
  _id: string;
  trip: {
    _id: string;
    departure: {
      city: string;
      address?: string;
    };
    destination: {
      city: string;
      address?: string;
    };
    departureTime: string;
    price: number;
    priceType: 'fixed' | 'negotiable';
    status: string;
  };
  passenger: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    rating?: number;
  };
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  originalPrice: number;
  currentOffer: number;
  lastOfferBy: 'passenger' | 'driver';
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  messages: NegotiationMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateNegotiationParams {
  tripId: string;
  proposedPrice: number;
  message?: string;
}

export interface CounterOfferParams {
  counterPrice: number;
  message?: string;
}

/**
 * Service pour la gestion des négociations de prix
 */
class NegotiationService {
  /**
   * Créer une nouvelle négociation
   */
  async createNegotiation(params: CreateNegotiationParams): Promise<Negotiation> {
    const response = await api.post('/negotiations', params);
    return response.data.data;
  }

  /**
   * Faire une contre-proposition
   */
  async counterOffer(negotiationId: string, params: CounterOfferParams): Promise<Negotiation> {
    const response = await api.post(`/negotiations/${negotiationId}/counter`, params);
    return response.data.data;
  }

  /**
   * Accepter une négociation
   */
  async acceptNegotiation(negotiationId: string, message?: string): Promise<Negotiation> {
    const response = await api.post(`/negotiations/${negotiationId}/accept`, { message });
    return response.data.data;
  }

  /**
   * Rejeter une négociation
   */
  async rejectNegotiation(negotiationId: string, message?: string): Promise<Negotiation> {
    const response = await api.post(`/negotiations/${negotiationId}/reject`, { message });
    return response.data.data;
  }

  /**
   * Récupérer les négociations d'un trajet (pour le conducteur)
   */
  async getTripNegotiations(tripId: string): Promise<Negotiation[]> {
    const response = await api.get(`/negotiations/trip/${tripId}`);
    return response.data.data;
  }

  /**
   * Récupérer mes négociations
   */
  async getMyNegotiations(status?: 'pending' | 'accepted' | 'rejected' | 'expired'): Promise<Negotiation[]> {
    const params = status ? { status } : {};
    const response = await api.get('/negotiations/my', { params });
    return response.data.data;
  }

  /**
   * Récupérer les détails d'une négociation
   */
  async getNegotiationById(negotiationId: string): Promise<Negotiation> {
    const response = await api.get(`/negotiations/${negotiationId}`);
    return response.data.data;
  }
}

export default new NegotiationService();


