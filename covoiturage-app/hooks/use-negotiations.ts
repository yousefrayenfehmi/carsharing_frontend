import { useState } from 'react';
import negotiationService, { 
  Negotiation, 
  CreateNegotiationParams, 
  CounterOfferParams 
} from '@/services/negotiation-service';

export function useNegotiations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNegotiation = async (params: CreateNegotiationParams): Promise<Negotiation | null> => {
    try {
      setLoading(true);
      setError(null);
      const negotiation = await negotiationService.createNegotiation(params);
      return negotiation;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la création de la négociation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const counterOffer = async (negotiationId: string, params: CounterOfferParams): Promise<Negotiation | null> => {
    try {
      setLoading(true);
      setError(null);
      const negotiation = await negotiationService.counterOffer(negotiationId, params);
      return negotiation;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la contre-proposition';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const acceptNegotiation = async (negotiationId: string, message?: string): Promise<Negotiation | null> => {
    try {
      setLoading(true);
      setError(null);
      const negotiation = await negotiationService.acceptNegotiation(negotiationId, message);
      return negotiation;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'acceptation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const rejectNegotiation = async (negotiationId: string, message?: string): Promise<Negotiation | null> => {
    try {
      setLoading(true);
      setError(null);
      const negotiation = await negotiationService.rejectNegotiation(negotiationId, message);
      return negotiation;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du rejet';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTripNegotiations = async (tripId: string): Promise<Negotiation[]> => {
    try {
      setLoading(true);
      setError(null);
      const negotiations = await negotiationService.getTripNegotiations(tripId);
      return negotiations;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des négociations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMyNegotiations = async (status?: 'pending' | 'accepted' | 'rejected' | 'expired'): Promise<Negotiation[]> => {
    try {
      setLoading(true);
      setError(null);
      const negotiations = await negotiationService.getMyNegotiations(status);
      return negotiations;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération des négociations';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getNegotiationById = async (negotiationId: string): Promise<Negotiation | null> => {
    try {
      setLoading(true);
      setError(null);
      const negotiation = await negotiationService.getNegotiationById(negotiationId);
      return negotiation;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la récupération de la négociation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createNegotiation,
    counterOffer,
    acceptNegotiation,
    rejectNegotiation,
    getTripNegotiations,
    getMyNegotiations,
    getNegotiationById,
  };
}


