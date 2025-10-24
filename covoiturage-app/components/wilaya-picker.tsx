import { Colors } from '@/constants/colors';
import { ALGERIAN_WILAYAS, Wilaya, searchWilaya } from '@/constants/algerian-wilayas';
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

interface WilayaPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (wilaya: Wilaya) => void;
  selectedWilaya?: string;
}

export const WilayaPicker: React.FC<WilayaPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedWilaya,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWilayas, setFilteredWilayas] = useState<Wilaya[]>(ALGERIAN_WILAYAS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchWilaya(query);
    setFilteredWilayas(results);
  };

  const handleSelectWilaya = (wilaya: Wilaya) => {
    onSelect(wilaya);
    setSearchQuery('');
    setFilteredWilayas(ALGERIAN_WILAYAS);
    onClose();
  };

  const renderWilayaItem = ({ item }: { item: Wilaya }) => {
    const isSelected = selectedWilaya === item.name;
    
    return (
      <TouchableOpacity
        style={[styles.wilayaItem, isSelected && styles.wilayaItemSelected]}
        onPress={() => handleSelectWilaya(item)}
        activeOpacity={0.7}
      >
        <View style={styles.wilayaInfo}>
          <View style={styles.wilayaHeader}>
            <Text style={styles.wilayaCode}>{item.code}</Text>
            <Text style={styles.wilayaName}>{item.name}</Text>
          </View>
          <Text style={styles.wilayaArabic}>{item.arabicName}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
        )}
      </TouchableOpacity>
    );
  };

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
            <Text style={styles.modalTitle}>Sélectionnez votre wilaya</Text>
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
              placeholder="Rechercher une wilaya (français ou arabe)..."
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
            {String(filteredWilayas.length)} wilaya{filteredWilayas.length > 1 ? 's' : ''} trouvée
            {filteredWilayas.length > 1 ? 's' : ''}
          </Text>

          <FlatList
            data={filteredWilayas}
            renderItem={renderWilayaItem}
            keyExtractor={(item) => item.code}
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
  wilayaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  wilayaItemSelected: {
    backgroundColor: Colors.background.light,
  },
  wilayaInfo: {
    flex: 1,
  },
  wilayaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  wilayaCode: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    marginRight: 8,
    minWidth: 30,
  },
  wilayaName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  wilayaArabic: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 38,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 24,
  },
});

