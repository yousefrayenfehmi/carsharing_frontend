import { Header } from '@/components/header';
import { SearchForm } from '@/components/search-form';
import { Colors } from '@/constants/colors';
import { useTrips } from '@/hooks/use-trips';
import { useNegotiations } from '@/hooks/use-negotiations';
import { useNotifications } from '@/hooks/use-notifications';
import { useBookings } from '@/hooks/use-bookings';
import { useAlert } from '@/contexts/alert-context';
import { SearchParams } from '@/types/search';
import { NotificationBanner } from '@/components/notification-banner';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { searchTrips, loading } = useTrips();
  const { createNegotiation, loading: negotiationLoading } = useNegotiations();
  const { createBooking, loading: bookingLoading } = useBookings();
  const { notifications } = useNotifications();
  const { showError, showSuccess, showConfirm } = useAlert();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [negotiatingTrip, setNegotiatingTrip] = useState<string | null>(null);
  const [proposedPrices, setProposedPrices] = useState<{ [key: string]: string }>({});
  const [bookingSeats, setBookingSeats] = useState<{ [key: string]: number }>({});
  const [notificationBanner, setNotificationBanner] = useState<{
    visible: boolean;
    type: 'accepted' | 'rejected' | 'counter_offer';
    message: string;
  }>({
    visible: false,
    type: 'accepted',
    message: '',
  });

  const handleSearch = async (params: SearchParams) => {
    if (!params.departure || !params.destination) {
      showError('Erreur', 'Veuillez sélectionner un lieu de départ et une destination');
      return;
    }

    try {
      const searchQuery: any = {
        departureCity: params.departure.city,
        destinationCity: params.destination.city,
        date: params.date.toISOString().split('T')[0],
        minSeats: params.passengers,
        radius: 50, // Rayon de recherche de 50 km par défaut
      };

      // Ajouter les coordonnées du départ si disponibles
      if (params.departure.latitude && params.departure.longitude) {
        searchQuery.departureLatitude = params.departure.latitude;
        searchQuery.departureLongitude = params.departure.longitude;
        console.log(`📍 Coordonnées départ: ${params.departure.latitude}, ${params.departure.longitude}`);
      }

      // Ajouter les coordonnées de la destination si disponibles
      if (params.destination.latitude && params.destination.longitude) {
        searchQuery.destinationLatitude = params.destination.latitude;
        searchQuery.destinationLongitude = params.destination.longitude;
        console.log(`📍 Coordonnées destination: ${params.destination.latitude}, ${params.destination.longitude}`);
      }

      console.log('🔍 Paramètres de recherche envoyés:', searchQuery);

      const results = await searchTrips(searchQuery);
      
      setSearchResults(results);
      
      const departureText = params.departure.address || params.departure.city;
      const destinationText = params.destination.address || params.destination.city;
      
      if (results.length === 0) {
        showError('Aucun résultat', 'Aucun trajet ne correspond à votre recherche.');
      }
      
      // Ici, vous pourriez naviguer vers une page de résultats
      // router.push({ pathname: '/search-results', params: { results: JSON.stringify(results) } });
    } catch (error: any) {
      showError('Erreur de recherche', error.message || 'Une erreur est survenue lors de la recherche');
    }
  };

  const handleNegotiate = (tripId: string, currentPrice: number) => {
    setNegotiatingTrip(tripId);
    setProposedPrices({ ...proposedPrices, [tripId]: currentPrice.toString() });
  };

  const handleProposePrice = async (tripId: string) => {
    const proposedPrice = proposedPrices[tripId];
    if (!proposedPrice || parseFloat(proposedPrice) <= 0) {
      showError('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    try {
      await createNegotiation({
        tripId,
        proposedPrice: parseFloat(proposedPrice),
        message: `Je propose ${proposedPrice} DA pour ce trajet.`,
      });

      showSuccess('Proposition envoyée', `Votre proposition de ${proposedPrice} DA a été envoyée au conducteur. Vous serez notifié de sa réponse.`);
      setNegotiatingTrip(null);
      setProposedPrices({ ...proposedPrices, [tripId]: '' });
    } catch (error: any) {
      showError('Erreur', error.message || 'Impossible d\'envoyer la proposition. Veuillez réessayer.');
    }
  };

  const handleCancelNegotiation = (tripId: string) => {
    setNegotiatingTrip(null);
    setProposedPrices({ ...proposedPrices, [tripId]: '' });
  };

  const handleBookNow = async (tripId: string, tripPrice: number, availableSeats: number) => {
    const seats = bookingSeats[tripId] || 1;

    showConfirm(
      'Réserver ce trajet',
      `Nombre de places : ${seats}\nPrix total : ${tripPrice * seats} DA`,
      async () => {
        try {
          const booking = await createBooking({
            tripId,
            seats,
            message: 'Réservation directe',
          });
          
          showSuccess('Réservation confirmée !', `Votre réservation de ${seats} place(s) au prix de ${tripPrice * seats} DA a été créée avec succès.`);
          setBookingSeats({ ...bookingSeats, [tripId]: 1 });
          // Rafraîchir les résultats pour voir les places mises à jour
        } catch (error: any) {
          showError('Erreur', error.message || 'Impossible de créer la réservation. Veuillez réessayer.');
        }
      }
    );
  };

  // Vérifier les notifications
  useEffect(() => {
    if (notifications.hasNewUpdates) {
      setNotificationBanner({
        visible: true,
        type: 'accepted',
        message: 'Vous avez de nouvelles réponses à vos propositions !',
      });
    }
  }, [notifications.hasNewUpdates]);

  return (
    <View style={styles.container}>
      {/* Notification Banner */}
      <NotificationBanner
        visible={notificationBanner.visible}
        type={notificationBanner.type}
        message={notificationBanner.message}
        onPress={() => {
          setNotificationBanner({ ...notificationBanner, visible: false });
        }}
        onDismiss={() => {
          setNotificationBanner({ ...notificationBanner, visible: false });
        }}
      />
      
      {/* Header */}
      <Header />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Vous avez vos plans, on a vos bons plans.
          </Text>
          <Text style={styles.heroSubtitle}>
            Trouvez un trajet ou publiez le vôtre
          </Text>
        </View>

        {/* Formulaire de recherche */}
        <View style={styles.searchSection}>
          <SearchForm onSearch={handleSearch} />
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Recherche en cours...</Text>
            </View>
          )}
        </View>

        {/* Résultats de recherche */}
        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} trajet{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
            </Text>
            
            {searchResults.map((trip: any) => (
              <View 
                key={trip._id} 
                style={styles.tripCard}
              >
                {/* En-tête avec conducteur */}
                <View style={styles.tripHeader}>
                  <View style={styles.driverInfo}>
                    {trip.driver?.profilePicture ? (
                      <Image 
                        source={{ uri: trip.driver.profilePicture }} 
                        style={styles.driverAvatar}
                      />
                    ) : (
                      <View style={[styles.driverAvatar, styles.driverAvatarPlaceholder]}>
                        <Text style={styles.driverInitials}>
                          {trip.driver?.firstName?.[0]?.toUpperCase() || ''}{trip.driver?.lastName?.[0]?.toUpperCase() || ''}
                        </Text>
                      </View>
                    )}
                    <View style={styles.driverDetails}>
                      <Text style={styles.driverName}>
                        {trip.driver?.firstName} {trip.driver?.lastName}
                      </Text>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={styles.ratingText}>
                          {(() => {
                            const rating = trip.driver?.rating || 0;
                            const totalRatings = trip.driver?.totalRatings || 0;
                            if (totalRatings === 0) return 'Nouveau';
                            return (rating / totalRatings).toFixed(1);
                          })()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceAmount}>{String(trip.price)} DA</Text>
                    <View style={styles.priceLabelRow}>
                      <Text style={styles.priceLabel}>par personne</Text>
                      {trip.priceType === 'negotiable' && (
                        <View style={styles.negotiableBadge}>
                          <Ionicons name="chatbubbles" size={10} color={Colors.primary} />
                          <Text style={styles.negotiableText}>Négociable</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Itinéraire */}
                <View style={styles.routeContainer}>
                  <View style={styles.routeItem}>
                    <View style={styles.routeIconContainer}>
                      <View style={styles.dotDeparture} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>Départ</Text>
                      <Text style={styles.routeText}>
                        {trip.departure?.address || trip.departure?.city}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeDivider} />

                  <View style={styles.routeItem}>
                    <View style={styles.routeIconContainer}>
                      <Ionicons name="location" size={16} color={Colors.primary} />
                    </View>
                    <View style={styles.routeInfo}>
                      <Text style={styles.routeLabel}>Destination</Text>
                      <Text style={styles.routeText}>
                        {trip.destination?.address || trip.destination?.city}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Infos supplémentaires */}
                <View style={styles.tripFooter}>
                  <View style={styles.tripInfo}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.tripInfoText}>
                      {new Date(trip.departureTime).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <View style={styles.tripInfo}>
                    <Ionicons name="people-outline" size={16} color={Colors.text.secondary} />
                    <Text style={styles.tripInfoText}>
                      {String(trip.availableSeats)} place{trip.availableSeats > 1 ? 's' : ''}
                    </Text>
                  </View>
                  {trip.distance && (
                    <View style={styles.tripInfo}>
                      <Ionicons name="navigate-outline" size={16} color={Colors.text.secondary} />
                      <Text style={styles.tripInfoText}>
                        {String(trip.distance.toFixed(0))} km
                      </Text>
                    </View>
                  )}
                </View>

                {/* Zone de réservation / négociation */}
                <View style={styles.negotiationSection}>
                  {negotiatingTrip === trip._id ? (
                    // Formulaire de négociation
                    <View style={styles.negotiationForm}>
                      <Text style={styles.negotiationTitle}>Proposer un prix</Text>
                      <View style={styles.priceInputContainer}>
                        <TextInput
                          style={styles.priceInput}
                          placeholder="Votre prix"
                          keyboardType="numeric"
                          value={proposedPrices[trip._id] || ''}
                          onChangeText={(text) => 
                            setProposedPrices({ ...proposedPrices, [trip._id]: text })
                          }
                        />
                        <Text style={styles.currencyText}>DA</Text>
                      </View>
                      <View style={styles.negotiationButtons}>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => handleCancelNegotiation(trip._id)}
                        >
                          <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.proposeButton, negotiationLoading && styles.proposeButtonDisabled]}
                          onPress={() => handleProposePrice(trip._id)}
                          disabled={negotiationLoading}
                        >
                          {negotiationLoading ? (
                            <ActivityIndicator size="small" color={Colors.text.white} />
                          ) : (
                            <>
                              <Ionicons name="send" size={16} color={Colors.text.white} />
                              <Text style={styles.proposeButtonText}>Envoyer</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : trip.priceType === 'negotiable' ? (
                    // Prix négociable : Afficher les deux options
                    <View style={styles.negotiableActions}>
                      <TouchableOpacity
                        style={styles.bookAtPriceButton}
                        onPress={() => handleBookNow(trip._id, trip.price, trip.availableSeats)}
                        disabled={bookingLoading}
                      >
                        {bookingLoading ? (
                          <ActivityIndicator size="small" color={Colors.primary} />
                        ) : (
                          <>
                            <Ionicons name="checkmark-circle-outline" size={18} color={Colors.primary} />
                            <Text style={styles.bookAtPriceButtonText}>Réserver à {String(trip.price)} DA</Text>
                          </>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.negotiateButton}
                        onPress={() => handleNegotiate(trip._id, trip.price)}
                      >
                        <Ionicons name="chatbubbles-outline" size={18} color={Colors.text.white} />
                        <Text style={styles.negotiateButtonText}>Négocier</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    // Prix fixe : Afficher le bouton de réservation directe
                    <TouchableOpacity
                      style={styles.bookNowButton}
                      onPress={() => handleBookNow(trip._id, trip.price, trip.availableSeats)}
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <ActivityIndicator size="small" color={Colors.text.white} />
                      ) : (
                        <>
                          <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
                          <Text style={styles.bookNowButtonText}>Réserver maintenant</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Avantages (masqués si résultats) */}
        {searchResults.length === 0 && (
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Pourquoi choisir FITARIKI ?</Text>
          
          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>💰</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Économisez</Text>
              <Text style={styles.benefitDescription}>
                Partagez les frais de route et réduisez vos dépenses de transport
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>🌍</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Protégez l'environnement</Text>
              <Text style={styles.benefitDescription}>
                Moins de voitures sur la route = moins de pollution
              </Text>
            </View>
          </View>

          <View style={styles.benefitCard}>
            <View style={styles.benefitIcon}>
              <Text style={styles.benefitEmoji}>🤝</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Rencontrez des gens</Text>
              <Text style={styles.benefitDescription}>
                Faites de nouvelles rencontres pendant vos trajets
              </Text>
            </View>
          </View>
        </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: Colors.background.white,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: Colors.background.light,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  benefitsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background.light,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitContent: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background.light,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverAvatarPlaceholder: {
    backgroundColor: Colors.primary,
  },
  driverInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  negotiableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  negotiableText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primary,
  },
  routeContainer: {
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeIconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  dotDeparture: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  routeText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  routeDivider: {
    width: 2,
    height: 12,
    backgroundColor: Colors.border.light,
    marginLeft: 11,
    marginVertical: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripInfoText: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  negotiationSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  negotiableActions: {
    flexDirection: 'row',
    gap: 8,
  },
  bookAtPriceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  bookAtPriceButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  negotiateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  negotiateButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.white,
  },
  negotiationForm: {
    gap: 12,
  },
  negotiationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  negotiationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  proposeButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  proposeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  proposeButtonDisabled: {
    opacity: 0.6,
  },
  bookNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookNowButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.white,
  },
});
