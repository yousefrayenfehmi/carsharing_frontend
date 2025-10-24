/**
 * Types pour la recherche de trajets
 */

export interface Location {
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface SearchParams {
  departure: Location | null;
  destination: Location | null;
  date: Date;
  passengers: number;
}

export interface Trip {
  id: string;
  driver: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  departure: Location;
  destination: Location;
  departureTime: Date;
  price: number;
  priceType: 'fixed' | 'negotiable';
  availableSeats: number;
}

export interface CreateTripParams {
  departure: Location;
  destination: Location;
  departureDate: Date;
  departureTime: Date;
  price: number;
  priceType?: 'fixed' | 'negotiable';
  availableSeats: number;
  description?: string;
}

