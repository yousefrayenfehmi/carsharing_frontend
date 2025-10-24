import { Colors } from '@/constants/colors';
import { ALGERIAN_CITIES, AlgerianCity, searchAlgerianCity } from '@/constants/algerian-cities';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface AlgerianCityPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: { city: string; latitude: number; longitude: number }) => void;
  title: string;
}

export const AlgerianCityPicker: React.FC<AlgerianCityPickerProps> = ({
  visible,
  onClose,
  onSelect,
  title,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<AlgerianCity[]>(ALGERIAN_CITIES);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchAlgerianCity(query);
    setFilteredCities(results);
  };

  const handleSelectCity = (city: AlgerianCity) => {
    onSelect({
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setSearchQuery('');
    setFilteredCities(ALGERIAN_CITIES);
    onClose();
  };

  const renderCityItem = ({ item }: { item: AlgerianCity }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => handleSelectCity(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cityInfo}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.cityArabic}>{item.arabicName}</Text>
        <Text style={styles.wilaya}>Wilaya de {item.wilaya}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une ville (français ou arabe)..."
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.resultCount}>
            {String(filteredCities.length)} ville{filteredCities.length > 1 ? 's' : ''} trouvée
            {filteredCities.length > 1 ? 's' : ''}
          </Text>

          <FlatList
            data={filteredCities}
            renderItem={renderCityItem}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  searchContainer: {
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
  },
  resultCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cityArabic: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  wilaya: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 24,
  },
});

