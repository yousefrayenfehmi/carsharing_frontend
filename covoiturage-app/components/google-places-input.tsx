import { Colors } from '@/constants/colors';
import { 
  searchPlaces, 
  getPlaceDetails, 
  PlacePrediction, 
  PlaceDetails,
  isGoogleMapsConfigured 
} from '@/services/google-maps-service';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface GooglePlacesInputProps {
  value: string;
  onPlaceSelect: (place: {
    name: string;
    address: string;
    city: string;
    wilaya?: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  searchType?: 'cities' | 'addresses' | 'all';
  useModal?: boolean;
}

export const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onPlaceSelect,
  placeholder = 'Rechercher un lieu...',
  label,
  icon = 'location',
  searchType = 'all',
  useModal = false,
}) => {
  const [query, setQuery] = useState(value);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isConfigured] = useState(isGoogleMapsConfigured());

  // Effet de debounce pour la recherche
  useEffect(() => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchLocations(query);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchLocations = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      let typeOption: string | undefined;
      
      if (searchType === 'cities') {
        typeOption = '(cities)';
      } else if (searchType === 'addresses') {
        typeOption = 'address';
      }

      const results = await searchPlaces(searchQuery, {
        types: typeOption,
        countryRestriction: 'dz',
      });
      
      setPredictions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur recherche lieu:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    setIsLoading(true);
    try {
      const details = await getPlaceDetails(prediction.placeId);
      
      if (details) {
        setQuery(prediction.mainText);
        setShowSuggestions(false);
        setIsFocused(false);
        setModalVisible(false);
        
        onPlaceSelect({
          name: details.name,
          address: details.formattedAddress,
          city: details.city,
          wilaya: details.wilaya,
          latitude: details.latitude,
          longitude: details.longitude,
        });
      }
    } catch (error) {
      console.error('Erreur récupération détails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = useCallback(() => {
    setQuery('');
    setPredictions([]);
    setShowSuggestions(false);
    setIsFocused(false);
  }, []);

  const renderPrediction = (item: PlacePrediction, index: number) => (
    <Pressable
      key={item.placeId}
      style={({ pressed }) => [
        styles.predictionItem,
        pressed && styles.predictionItemPressed
      ]}
      onPress={() => handleSelectPrediction(item)}
    >
      <View style={styles.predictionIcon}>
        <Ionicons name="location-outline" size={20} color={Colors.primary} />
      </View>
      <View style={styles.predictionContent}>
        <Text style={styles.predictionMainText}>{item.mainText}</Text>
        {item.secondaryText && (
          <Text style={styles.predictionSecondaryText} numberOfLines={1}>
            {item.secondaryText}
          </Text>
        )}
      </View>
    </Pressable>
  );

  // Mode Modal (pour remplacer WilayaPicker)
  if (useModal) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name={icon} size={20} color={Colors.primary} style={styles.pickerIcon} />
          <Text style={[styles.pickerText, !value && styles.pickerPlaceholder]}>
            {value || placeholder}
          </Text>
          <Ionicons name="chevron-down" size={24} color={Colors.text.secondary} />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color={Colors.text.primary} />
                </TouchableOpacity>
              </View>

              {!isConfigured && (
                <View style={styles.warningBanner}>
                  <Ionicons name="warning" size={20} color="#FFA000" />
                  <Text style={styles.warningText}>
                    Clé API Google Maps non configurée
                  </Text>
                </View>
              )}

              <View style={styles.modalSearchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color={Colors.text.secondary}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.text.secondary}
                  value={query}
                  onChangeText={setQuery}
                  autoFocus
                />
                {query.length > 0 && (
                  <TouchableOpacity onPress={clearInput}>
                    <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
                  </TouchableOpacity>
                )}
                {isLoading && (
                  <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
                )}
              </View>

              {predictions.length > 0 && (
                <Text style={styles.resultCount}>
                  {predictions.length} résultat{predictions.length > 1 ? 's' : ''} trouvé{predictions.length > 1 ? 's' : ''}
                </Text>
              )}

              <ScrollView
                style={styles.modalList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
              >
                {predictions.map((item, index) => renderPrediction(item, index))}
                
                {query.length >= 2 && predictions.length === 0 && !isLoading && (
                  <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={48} color={Colors.text.secondary} />
                    <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
                    <Text style={styles.emptySubtext}>Essayez avec un autre terme</Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.poweredBy}>
                <Text style={styles.poweredByText}>Powered by Google</Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Mode inline (pour AddressInput)
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Ionicons name={icon} size={20} color={Colors.primary} style={styles.inputIcon} />
        
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.secondary}
          onFocus={() => {
            setIsFocused(true);
            if (predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {isLoading && (
          <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        )}

        {query.length > 0 && !isLoading && (
          <Pressable onPress={clearInput} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
          </Pressable>
        )}
      </View>

      {!isConfigured && isFocused && (
        <View style={styles.warningBannerInline}>
          <Ionicons name="warning" size={16} color="#FFA000" />
          <Text style={styles.warningTextInline}>
            Clé API Google Maps non configurée
          </Text>
        </View>
      )}

      {showSuggestions && predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {predictions.map((item, index) => renderPrediction(item, index))}
          </ScrollView>
          <View style={styles.poweredByInline}>
            <Text style={styles.poweredByTextInline}>Powered by Google</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Styles pour le mode inline
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
    fontWeight: '500',
  },
  loader: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  
  // Styles pour les suggestions inline
  suggestionsContainer: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 280,
    borderWidth: 1,
    borderColor: Colors.border.light,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  
  // Styles pour les prédictions
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  predictionItemPressed: {
    backgroundColor: '#F0F9FF',
  },
  predictionIcon: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
  },
  predictionContent: {
    flex: 1,
  },
  predictionMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  predictionSecondaryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  
  // Styles pour le mode picker/modal
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.background.white,
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  pickerPlaceholder: {
    color: Colors.text.secondary,
  },
  
  // Styles pour le modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  modalSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
  },
  modalList: {
    maxHeight: 400,
  },
  resultCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  
  // État vide
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  
  // Powered by Google
  poweredBy: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  poweredByText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  poweredByInline: {
    alignItems: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  poweredByTextInline: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  
  // Warning banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F57C00',
  },
  warningBannerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
  },
  warningTextInline: {
    marginLeft: 6,
    fontSize: 12,
    color: '#F57C00',
  },
});

export default GooglePlacesInput;

