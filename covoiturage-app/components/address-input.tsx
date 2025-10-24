import { Colors } from '@/constants/colors';
import { searchCityInAlgeria, GeocodingResult } from '@/services/geocoding-service';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface AddressInputProps {
  value: string;
  onAddressSelect: (address: {
    fullAddress: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  value,
  onAddressSelect,
  placeholder = 'Saisissez une adresse...',
  label,
  icon = 'location',
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchAddresses(query);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchAddresses = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const results = await searchCityInAlgeria(searchQuery);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur recherche adresse:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (result: GeocodingResult) => {
    setQuery(result.displayName);
    setShowSuggestions(false);
    setIsFocused(false);
    onAddressSelect({
      fullAddress: result.displayName,
      city: result.city,
      latitude: result.latitude,
      longitude: result.longitude,
    });
  };

  const renderSuggestion = (item: GeocodingResult, index: number) => (
    <Pressable
      key={`${item.city}-${index}`}
      style={({ pressed }) => [
        styles.suggestionItem,
        pressed && styles.suggestionItemPressed
      ]}
      onPress={() => handleSelectAddress(item)}
    >
      <Ionicons name="location-outline" size={20} color={Colors.primary} style={styles.suggestionIcon} />
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionCity}>{item.city}</Text>
        <Text style={styles.suggestionAddress} numberOfLines={1}>
          {item.displayName}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Ionicons name={icon} size={20} color={Colors.primary} style={styles.icon} />
        
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.secondary}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {isLoading && (
          <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        )}

        {query.length > 0 && !isLoading && (
          <Pressable
            onPress={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
              setIsFocused(false);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
          </Pressable>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {suggestions.map((item, index) => renderSuggestion(item, index))}
          </ScrollView>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: 'transparent',
    backgroundColor: Colors.background.white,
  },
  icon: {
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
  suggestionsContainer: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    marginTop: 8,
    marginHorizontal: 4,
    maxHeight: 250,
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
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  suggestionItemPressed: {
    backgroundColor: '#F0F9FF',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionCity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 3,
  },
  suggestionAddress: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});

