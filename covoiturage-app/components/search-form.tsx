import { AddressInput } from '@/components/address-input';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { Location, SearchParams } from '@/types/search';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { showError } = useAlert();
  const [departure, setDeparture] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [departureAddress, setDepartureAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [passengers, setPassengers] = useState(1);
  
  // États pour les modales
  const [showPassengersModal, setShowPassengersModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  
  const getDateLabel = () => {
    const today = new Date();
    const diffDays = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    
    // Format: Lun. 20 janv.
    const days = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    
    return `${days[date.getDay()]} ${String(date.getDate())} ${months[date.getMonth()]}`;
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDateModal(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'ios') {
        // Sur iOS, on garde la modale ouverte pour permettre plusieurs changements
      }
    }
  };

  const handleSearch = () => {
    if (!departure || !destination) {
      showError('Informations manquantes', 'Veuillez renseigner une ville de départ et de destination.');
      return;
    }
    
    onSearch({
      departure,
      destination,
      date,
      passengers,
    });
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
  
  const incrementPassengers = () => {
    if (passengers < 8) {
      setPassengers(passengers + 1);
    }
  };
  
  const decrementPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {/* Formulaire d'adresse précise avec autocomplétion */}
        <View style={styles.addressInputWrapper}>
          <AddressInput
            value={departureAddress}
            onAddressSelect={handleDepartureAddressSelect}
            label="D'où partez-vous ?"
            placeholder="Ex: Rue Didouche Mourad, Alger"
            icon="radio-button-on"
          />
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.addressInputWrapper}>
          <AddressInput
            value={destinationAddress}
            onAddressSelect={handleDestinationAddressSelect}
            label="Où allez-vous ?"
            placeholder="Ex: Place 1er Novembre, Oran"
            icon="location"
          />
        </View>

        <View style={styles.separator} />

        {/* Date et Passager */}
        <View style={styles.datePassengerRow}>
          <TouchableOpacity 
            style={[styles.datePassengerCard, styles.halfWidth]}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="calendar" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>DATE</Text>
              <Text style={styles.cardValue}>{getDateLabel()}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.datePassengerCard, styles.halfWidth]}
            onPress={() => setShowPassengersModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>PASSAGER{passengers > 1 ? 'S' : ''}</Text>
              <Text style={styles.cardValue}>{passengers} passager{passengers > 1 ? 's' : ''}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bouton de recherche */}
      <Button
        title="Rechercher"
        size="large"
        onPress={handleSearch}
        style={styles.searchButton}
      />
      
      {/* Modal pour les passagers */}
      <Modal
        visible={showPassengersModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPassengersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nombre de passager{passengers > 1 ? 's' : ''}</Text>
              <TouchableOpacity onPress={() => setShowPassengersModal(false)}>
                <Ionicons name="close" size={28} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passengerSelector}>
              <TouchableOpacity 
                onPress={decrementPassengers}
                style={[styles.passengerModalButton, passengers <= 1 && styles.passengerModalButtonDisabled]}
                disabled={passengers <= 1}
              >
                <Ionicons 
                  name="remove-circle" 
                  size={48} 
                  color={passengers <= 1 ? Colors.border.medium : Colors.primary} 
                />
              </TouchableOpacity>
              
              <View style={styles.passengerCount}>
                <Text style={styles.passengerNumber}>{passengers}</Text>
                <Text style={styles.passengerLabel}>passager{passengers > 1 ? 's' : ''}</Text>
              </View>
              
              <TouchableOpacity 
                onPress={incrementPassengers}
                style={[styles.passengerModalButton, passengers >= 8 && styles.passengerModalButtonDisabled]}
                disabled={passengers >= 8}
              >
                <Ionicons 
                  name="add-circle" 
                  size={48} 
                  color={passengers >= 8 ? Colors.border.medium : Colors.primary} 
                />
              </TouchableOpacity>
            </View>
            
            <Button
              title="Valider"
              onPress={() => setShowPassengersModal(false)}
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
              
              <View style={styles.calendarContainer}>
                <DateTimePicker
                  value={date}
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
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  addressInputWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.white,
  },
  form: {
    backgroundColor: Colors.background.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: 16,
  },
  datePassengerRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: Colors.background.white,
  },
  datePassengerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  halfWidth: {
    flex: 1,
  },
  searchButton: {
    marginTop: 16,
    width: '100%',
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
  passengerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 30,
    marginBottom: 20,
  },
  passengerModalButton: {
    padding: 10,
  },
  passengerModalButtonDisabled: {
    opacity: 0.3,
  },
  passengerCount: {
    alignItems: 'center',
    minWidth: 100,
  },
  passengerNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  passengerLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    height: 320,
  },
});

