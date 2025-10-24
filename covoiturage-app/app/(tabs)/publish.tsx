import { AddressInput } from '@/components/address-input';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useAuth } from '@/contexts/auth-context';
import { useTrips } from '@/hooks/use-trips';
import { Location } from '@/types/search';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function PublishScreen() {
  const { showError, showSuccess } = useAlert();
  const { isAuthenticated, user } = useAuth();
  const { createTrip, createRecurringTrips, loading: isLoading } = useTrips();
  const [departure, setDeparture] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [departureTime, setDepartureTime] = useState<Date>(new Date());
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>('fixed');
  const [availableSeats, setAvailableSeats] = useState(1);
  
  // États pour les trajets récurrents
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1); // 1 mois par défaut
    return date;
  });
  const [recurringDays, setRecurringDays] = useState<number[]>([1, 2, 3, 4, 5]); // Lun-Ven par défaut
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);

  // Taux de commission dynamique
  const [commissionRate, setCommissionRate] = useState(0.16); // Valeur par défaut

  // Charger le taux de commission au montage
  useEffect(() => {
    const loadCommissionRate = async () => {
      try {
        const { rate } = await adminService.getCommissionRate();
        setCommissionRate(rate);
      } catch (error) {
        console.error('Erreur chargement commission:', error);
        // Garder la valeur par défaut de 0.16 en cas d'erreur
      }
    };
    loadCommissionRate();
  }, []);

  // Prix calculés
  const clientPrice = parseFloat(price) || 0; // Prix que le client paie
  const commission = clientPrice * commissionRate; // Commission dynamique
  const driverPrice = clientPrice - commission; // Ce que le conducteur reçoit
  const [description, setDescription] = useState('');

  // États pour les modales
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";

    const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

    return `${days[date.getDay()]} ${String(date.getDate())} ${months[date.getMonth()]}`;
  };

  const getTimeLabel = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDateModal(false);
    }
    if (selectedDate) {
      setDepartureDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimeModal(false);
    }
    if (selectedTime) {
      setDepartureTime(selectedTime);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartDateModal(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndDateModal(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleDepartureAddressSelect = (address: {
    fullAddress: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => {
    setDeparture({
      city: address.city,
      address: address.fullAddress,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setDepartureAddress(address.fullAddress);
  };

  const handleDestinationAddressSelect = (address: {
    fullAddress: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => {
    setDestination({
      city: address.city,
      address: address.fullAddress,
      latitude: address.latitude,
      longitude: address.longitude,
    });
    setDestinationAddress(address.fullAddress);
  };

  const incrementSeats = () => {
    if (availableSeats < 8) {
      setAvailableSeats(availableSeats + 1);
    }
  };

  const decrementSeats = () => {
    if (availableSeats > 1) {
      setAvailableSeats(availableSeats - 1);
    }
  };

  const handlePublish = async () => {
    // Vérifier l'authentification
    if (!isAuthenticated) {
      showError('Connexion requise', 'Vous devez être connecté pour publier un trajet');
      return;
    }

    // Vérifier le numéro de permis de conduire
    if (!user?.driverLicenseNumber) {
      showError('Permis de conduire requis', 'Vous devez renseigner votre numéro de permis de conduire dans votre profil pour publier un trajet en tant que conducteur.');
      return;
    }

    if (!departure || !destination) {
      showError('Informations manquantes', 'Veuillez renseigner une ville de départ et de destination.');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      showError('Prix invalide', 'Veuillez renseigner un prix valide.');
      return;
    }

    // Validations spécifiques pour les trajets récurrents
    if (isRecurring) {
      if (recurringDays.length === 0) {
        showError('Jours manquants', 'Veuillez sélectionner au moins un jour de la semaine.');
        return;
      }

      if (endDate <= startDate) {
        showError('Dates invalides', 'La date de fin doit être après la date de début.');
        return;
      }
    }

    try {
      const tripPrice = parseFloat(price);

      if (isRecurring) {
        // Créer des trajets récurrents
        const hours = departureTime.getHours().toString().padStart(2, '0');
        const minutes = departureTime.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const result = await createRecurringTrips({
          departure,
          destination,
          departureTime: timeString,
          availableSeats,
          price: tripPrice,
          priceType,
          description: description.trim() || undefined,
          recurringDays,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });

        const daysNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const selectedDaysNames = recurringDays.map(d => daysNames[d]).join(', ');

        showSuccess('Trajets récurrents publiés !', `${result.count} trajets créés de ${departure.city} à ${destination.city}.\n\nJours: ${selectedDaysNames}\nPériode: du ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`);
      } else {
        // Créer un trajet unique
        const departureDateTime = new Date(departureDate);
        departureDateTime.setHours(departureTime.getHours());
        departureDateTime.setMinutes(departureTime.getMinutes());

        await createTrip({
          departure,
          destination,
          departureTime: departureDateTime.toISOString(),
          availableSeats,
          price: tripPrice,
          priceType,
          description: description.trim() || undefined,
        });

        showSuccess('Trajet publié !', `Votre trajet de ${departure.city} à ${destination.city} a été publié avec succès.`);
      }

      // Réinitialiser le formulaire
      setDeparture(null);
      setDestination(null);
      setDepartureDate(new Date());
      setDepartureTime(new Date());
      setPrice('');
      setPriceType('fixed');
      setAvailableSeats(1);
      setDescription('');
      setIsRecurring(false);
      setRecurringDays([1, 2, 3, 4, 5]);
      setStartDate(new Date());
      const newEndDate = new Date();
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      setEndDate(newEndDate);
    } catch (error: any) {
      showError('Erreur', error.message || 'Une erreur est survenue lors de la publication du trajet');
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* En-tête */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Publier un trajet</Text>
            <Text style={styles.pageSubtitle}>
              Remplissez les informations de votre trajet
            </Text>
          </View>

          {/* Formulaire */}
          <View style={styles.formContainer}>
            {/* Itinéraire */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Itinéraire</Text>

              {/* Mode adresse détaillée avec autocomplétion */}
              <View style={styles.card}>
                <View style={styles.addressInputWrapper}>
                  <AddressInput
                    value={departureAddress}
                    onAddressSelect={handleDepartureAddressSelect}
                    label="Adresse de départ"
                    placeholder="Ex: Rue Didouche Mourad, Alger"
                    icon="radio-button-on"
                  />
                </View>
                
                <View style={styles.separator} />
                
                <View style={styles.addressInputWrapper}>
                  <AddressInput
                    value={destinationAddress}
                    onAddressSelect={handleDestinationAddressSelect}
                    label="Adresse de destination"
                    placeholder="Ex: Place 1er Novembre, Oran"
                    icon="location"
                  />
                </View>
              </View>
            </View>

            {/* Type de trajet */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de trajet</Text>
              <View style={styles.card}>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[styles.tripTypeButton, !isRecurring && styles.tripTypeButtonActive]}
                    onPress={() => setIsRecurring(false)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={!isRecurring ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color={!isRecurring ? Colors.primary : Colors.text.secondary}
                    />
                    <Text style={[styles.tripTypeText, !isRecurring && styles.tripTypeTextActive]}>
                      Trajet unique
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tripTypeButton, isRecurring && styles.tripTypeButtonActive]}
                    onPress={() => setIsRecurring(true)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isRecurring ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color={isRecurring ? Colors.primary : Colors.text.secondary}
                    />
                    <Text style={[styles.tripTypeText, isRecurring && styles.tripTypeTextActive]}>
                      Trajet récurrent
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Date et heure - Trajet unique */}
            {!isRecurring && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date et heure de départ</Text>

                <View style={styles.card}>
                  <View style={styles.row}>
                    <TouchableOpacity
                      style={[styles.inputField, styles.halfWidth]}
                      onPress={() => setShowDateModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <Text style={styles.inputValue}>{String(getDateLabel(departureDate))}</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.verticalSeparator} />

                    <TouchableOpacity
                      style={[styles.inputField, styles.halfWidth]}
                      onPress={() => setShowTimeModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="time-outline" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>Heure</Text>
                        <Text style={styles.inputValue}>{String(getTimeLabel(departureTime))}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Configuration pour trajets récurrents */}
            {isRecurring && (
              <>
                {/* Heure de départ */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Heure de départ</Text>
                  <View style={styles.card}>
                    <TouchableOpacity
                      style={styles.inputField}
                      onPress={() => setShowTimeModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="time-outline" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>Heure</Text>
                        <Text style={styles.inputValue}>{String(getTimeLabel(departureTime))}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Jours de la semaine */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Jours de la semaine</Text>
                  <View style={styles.card}>
                    <View style={styles.daysContainer}>
                      {[
                        { label: 'Dim', value: 0 },
                        { label: 'Lun', value: 1 },
                        { label: 'Mar', value: 2 },
                        { label: 'Mer', value: 3 },
                        { label: 'Jeu', value: 4 },
                        { label: 'Ven', value: 5 },
                        { label: 'Sam', value: 6 },
                      ].map((day) => (
                        <TouchableOpacity
                          key={day.value}
                          style={[
                            styles.dayButton,
                            recurringDays.includes(day.value) && styles.dayButtonActive,
                          ]}
                          onPress={() => {
                            if (recurringDays.includes(day.value)) {
                              setRecurringDays(recurringDays.filter(d => d !== day.value));
                            } else {
                              setRecurringDays([...recurringDays, day.value].sort());
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.dayButtonText,
                              recurringDays.includes(day.value) && styles.dayButtonTextActive,
                            ]}
                          >
                            {day.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Période */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Période</Text>
                  <View style={styles.card}>
                    <TouchableOpacity
                      style={styles.inputField}
                      onPress={() => setShowStartDateModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>Date de début</Text>
                        <Text style={styles.inputValue}>{startDate.toLocaleDateString('fr-FR')}</Text>
                      </View>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity
                      style={styles.inputField}
                      onPress={() => setShowEndDateModal(true)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.iconContainer}>
                        <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                      </View>
                      <View style={styles.inputContent}>
                        <Text style={styles.inputLabel}>Date de fin</Text>
                        <Text style={styles.inputValue}>{endDate.toLocaleDateString('fr-FR')}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Prix et places */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prix et places disponibles</Text>

              <View style={styles.card}>
                <View style={styles.row}>
                  {/* Prix */}
                  <View style={[styles.inputField, styles.halfWidth]}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.inputContent}>
                      <Text style={styles.inputLabel}>Prix du trajet</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="0"
                        placeholderTextColor={Colors.text.secondary}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    <Text style={styles.currency}>DA</Text>
                  </View>

                  <View style={styles.verticalSeparator} />

                  {/* Places */}
                  <TouchableOpacity
                    style={[styles.inputField, styles.halfWidth]}
                    onPress={() => setShowSeatsModal(true)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name="people-outline" size={20} color={Colors.primary} />
                    </View>
                    <View style={styles.inputContent}>
                      <Text style={styles.inputLabel}>Places</Text>
                      <Text style={styles.inputValue}>
                        {String(availableSeats)} place{availableSeats > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Affichage de la commission - Balise de calcul */}
              {clientPrice > 0 && (
                <View style={styles.commissionCard}>
                  {/* Badge Commission */}
                  <View style={styles.commissionBadge}>
                    <Ionicons name="calculator" size={16} color="#fff" />
                    <Text style={styles.commissionBadgeText}>COMMISSION {(commissionRate * 100).toFixed(0)}%</Text>
                  </View>

                  <View style={styles.commissionHeader}>
                    <View style={styles.commissionHeaderLeft}>
                      <Ionicons name="analytics" size={24} color={Colors.primary} />
                      <Text style={styles.commissionTitle}>Calcul automatique</Text>
                    </View>
                  </View>
                  
                  <View style={styles.commissionDetails}>
                    <View style={styles.commissionRow}>
                      <View style={styles.commissionLabelContainer}>
                        <Ionicons name="cash-outline" size={16} color={Colors.text.secondary} />
                        <Text style={styles.commissionLabel}>Prix du trajet</Text>
                      </View>
                      <Text style={styles.commissionValue}>{String(clientPrice.toFixed(2))} DA</Text>
                    </View>
                    
                    <View style={styles.commissionDivider} />
                    
                    <View style={styles.commissionRow}>
                      <View style={styles.commissionLabelContainer}>
                        <Ionicons name="remove-circle-outline" size={16} color="#FF6B6B" />
                        <Text style={styles.commissionLabel}>Commission ({(commissionRate * 100).toFixed(0)}%)</Text>
                      </View>
                      <Text style={styles.commissionValueNegative}>-{String(commission.toFixed(2))} DA</Text>
                    </View>
                    
                    <View style={styles.commissionDivider} />
                    
                    <View style={[styles.commissionRow, styles.commissionRowTotal]}>
                      <View style={styles.commissionLabelContainer}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                        <Text style={styles.commissionLabelTotal}>Vous recevez</Text>
                      </View>
                      <Text style={styles.commissionValueTotal}>{String(driverPrice.toFixed(2))} DA</Text>
                    </View>
                  </View>

                  <View style={styles.commissionNote}>
                    <Ionicons name="bulb" size={16} color="#FFA500" style={styles.bulbIcon} />
                    <Text style={styles.commissionNoteText}>
                      Pour un prix de <Text style={styles.highlightText}>{String(clientPrice.toFixed(2))} DA</Text>, vous recevrez <Text style={styles.highlightText}>{String(driverPrice.toFixed(2))} DA</Text> par passager après déduction de la commission de {(commissionRate * 100).toFixed(0)}%.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Type de prix */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de prix</Text>

              <View style={styles.card}>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[
                      styles.priceTypeButton,
                      priceType === 'fixed' && styles.priceTypeButtonActive
                    ]}
                    onPress={() => setPriceType('fixed')}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="lock-closed" 
                      size={20} 
                      color={priceType === 'fixed' ? Colors.primary : Colors.text.secondary}
                    />
                    <Text style={[
                      styles.priceTypeText,
                      priceType === 'fixed' && styles.priceTypeTextActive
                    ]}>
                      Prix fixe
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.priceTypeButtonSeparator} />

                  <TouchableOpacity
                    style={[
                      styles.priceTypeButton,
                      priceType === 'negotiable' && styles.priceTypeButtonActive
                    ]}
                    onPress={() => setPriceType('negotiable')}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name="chatbubbles" 
                      size={20} 
                      color={priceType === 'negotiable' ? Colors.primary : Colors.text.secondary}
                    />
                    <Text style={[
                      styles.priceTypeText,
                      priceType === 'negotiable' && styles.priceTypeTextActive
                    ]}>
                      Négociable
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Description (optionnel) */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Description <Text style={styles.optional}>(optionnel)</Text>
              </Text>

              <View style={styles.card}>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Ajoutez des informations supplémentaires sur votre trajet..."
                  placeholderTextColor={Colors.text.secondary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Bouton publier */}
            <Button
              title={isLoading ? 'Publication...' : 'Publier le trajet'}
              size="large"
              onPress={handlePublish}
              style={styles.publishButton}
              disabled={isLoading}
            />
            {isLoading && (
              <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modales */}
      {/* Modal pour les places */}
      <Modal
        visible={showSeatsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSeatsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nombre de places</Text>
              <TouchableOpacity onPress={() => setShowSeatsModal(false)}>
                <Ionicons name="close" size={28} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.seatsSelector}>
              <TouchableOpacity
                onPress={decrementSeats}
                style={[styles.seatsButton, availableSeats <= 1 && styles.seatsButtonDisabled]}
                disabled={availableSeats <= 1}
              >
                <Ionicons
                  name="remove-circle"
                  size={48}
                  color={availableSeats <= 1 ? Colors.border.medium : Colors.primary}
                />
              </TouchableOpacity>

              <View style={styles.seatsCount}>
                <Text style={styles.seatsNumber}>{String(availableSeats)}</Text>
                <Text style={styles.seatsLabel}>place{availableSeats > 1 ? 's' : ''}</Text>
              </View>

              <TouchableOpacity
                onPress={incrementSeats}
                style={[styles.seatsButton, availableSeats >= 8 && styles.seatsButtonDisabled]}
                disabled={availableSeats >= 8}
              >
                <Ionicons
                  name="add-circle"
                  size={48}
                  color={availableSeats >= 8 ? Colors.border.medium : Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <Button
              title="Valider"
              onPress={() => setShowSeatsModal(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Modal pour la date */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Date du trajet</Text>
                <TouchableOpacity onPress={() => setShowDateModal(false)}>
                  <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={departureDate}
                  mode="date"
                  display="inline"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                  locale="fr-FR"
                  textColor={Colors.text.primary}
                  accentColor={Colors.primary}
                  style={styles.datePicker}
                />
              </View>

              <Button
                title="Valider"
                onPress={() => setShowDateModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDateModal && (
          <DateTimePicker
            value={departureDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
          />
        )
      )}

      {/* Modal pour l'heure */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showTimeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Heure de départ</Text>
                <TouchableOpacity onPress={() => setShowTimeModal(false)}>
                  <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={departureTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  locale="fr-FR"
                  textColor={Colors.text.primary}
                  accentColor={Colors.primary}
                  style={styles.timePicker}
                />
              </View>

              <Button
                title="Valider"
                onPress={() => setShowTimeModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showTimeModal && (
          <DateTimePicker
            value={departureTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}

      {/* Modal pour la date de début (trajets récurrents) */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showStartDateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowStartDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Date de début</Text>
                <TouchableOpacity onPress={() => setShowStartDateModal(false)}>
                  <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="inline"
                  onChange={handleStartDateChange}
                  minimumDate={new Date()}
                  maximumDate={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)}
                  locale="fr-FR"
                  textColor={Colors.text.primary}
                  accentColor={Colors.primary}
                  style={styles.datePicker}
                />
              </View>

              <Button
                title="Valider"
                onPress={() => setShowStartDateModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showStartDateModal && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)}
          />
        )
      )}

      {/* Modal pour la date de fin (trajets récurrents) */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showEndDateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEndDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Date de fin</Text>
                <TouchableOpacity onPress={() => setShowEndDateModal(false)}>
                  <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="inline"
                  onChange={handleEndDateChange}
                  minimumDate={startDate}
                  maximumDate={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)}
                  locale="fr-FR"
                  textColor={Colors.text.primary}
                  accentColor={Colors.primary}
                  style={styles.datePicker}
                />
              </View>

              <Button
                title="Valider"
                onPress={() => setShowEndDateModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showEndDateModal && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            minimumDate={startDate}
            maximumDate={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.background.white,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  addressInputWrapper: {
    padding: 16,
  },
  optional: {
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  card: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 60,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotDeparture: {
    backgroundColor: Colors.primary,
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 2,
    fontWeight: '500',
  },
  inputValue: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  placeholder: {
    color: Colors.text.secondary,
    fontWeight: '400',
  },
  textInput: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  currency: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 52,
  },
  row: {
    flexDirection: 'row',
  },
  halfWidth: {
    flex: 1,
  },
  verticalSeparator: {
    width: 1,
    backgroundColor: Colors.border.light,
  },
  descriptionInput: {
    padding: 16,
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 120,
  },
  publishButton: {
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 250,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  modalInput: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  modalButton: {
    width: '100%',
  },
  seatsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 30,
    marginBottom: 20,
  },
  seatsButton: {
    padding: 10,
  },
  seatsButtonDisabled: {
    opacity: 0.3,
  },
  seatsCount: {
    alignItems: 'center',
    minWidth: 100,
  },
  seatsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  seatsLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    height: 320,
  },
  timePicker: {
    width: '100%',
    height: 200,
  },
  loader: {
    marginTop: 16,
  },
  priceTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  priceTypeButtonActive: {
    backgroundColor: Colors.background.light,
  },
  priceTypeButtonSeparator: {
    width: 1,
    backgroundColor: Colors.border.light,
  },
  priceTypeText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  priceTypeTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  commissionCard: {
    marginTop: 16,
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    padding: 0,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  commissionBadge: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  commissionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  commissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  commissionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  commissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  commissionDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  commissionRowTotal: {
    backgroundColor: Colors.primary + '08',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  commissionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commissionLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  commissionLabelTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  commissionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  commissionValueNegative: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  commissionValueTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  commissionDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 4,
  },
  commissionNote: {
    backgroundColor: '#FFF9E6',
    borderTopWidth: 1,
    borderTopColor: '#FFE8B3',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulbIcon: {
    marginTop: 2,
  },
  commissionNoteText: {
    flex: 1,
    fontSize: 13,
    color: '#8B7355',
    lineHeight: 20,
    fontWeight: '500',
  },
  highlightText: {
    fontWeight: '700',
    color: Colors.primary,
  },
  // Styles pour les trajets récurrents
  tripTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  tripTypeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  tripTypeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tripTypeTextActive: {
    color: Colors.primary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.light,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  dayButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  dayButtonTextActive: {
    color: Colors.text.white,
  },
});

