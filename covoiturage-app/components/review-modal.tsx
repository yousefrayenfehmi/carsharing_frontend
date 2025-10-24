import { Colors } from '@/constants/colors';
import { useAlert } from '@/contexts/alert-context';
import { useReviews } from '@/hooks/use-reviews';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ReviewModalProps {
  visible: boolean;
  bookingId: string;
  driverName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ReviewModal({
  visible,
  bookingId,
  driverName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const { showError, showSuccess } = useAlert();
  const { createReview, loading } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      showError('Note requise', 'Veuillez sélectionner une note avant de continuer');
      return;
    }

    try {
      await createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });

      showSuccess('Merci !', 'Votre avis a été enregistré avec succès.');
      setRating(0);
      setComment('');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      showError('Erreur', error.message);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={40}
              color={star <= rating ? '#FFA500' : Colors.text.disabled}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getRatingLabel = () => {
    switch (rating) {
      case 1: return '😞 Très insatisfait';
      case 2: return '😕 Insatisfait';
      case 3: return '😐 Moyen';
      case 4: return '😊 Satisfait';
      case 5: return '🤩 Excellent';
      default: return 'Sélectionnez une note';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Noter le conducteur</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Driver Info */}
            <View style={styles.driverInfo}>
              <Ionicons name="person-circle" size={48} color={Colors.primary} />
              <Text style={styles.driverName}>{driverName}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingSection}>
              <Text style={styles.sectionTitle}>Votre note</Text>
              {renderStars()}
              <Text style={styles.ratingLabel}>{getRatingLabel()}</Text>
            </View>

            {/* Comment */}
            <View style={styles.commentSection}>
              <Text style={styles.sectionTitle}>Commentaire (optionnel)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Partagez votre expérience..."
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
                maxLength={1000}
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>
                {String(comment.length)}/1000 caractères
              </Text>
            </View>

            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Quelques suggestions</Text>
              <Text style={styles.tipText}>• Ponctualité du conducteur</Text>
              <Text style={styles.tipText}>• Conduite sûre et agréable</Text>
              <Text style={styles.tipText}>• Convivialité et respect</Text>
              <Text style={styles.tipText}>• État et propreté du véhicule</Text>
            </View>
          </ScrollView>

          {/* Submit Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading || rating === 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.text.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
                  <Text style={styles.submitButtonText}>Envoyer mon avis</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  driverInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 8,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentInput: {
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Colors.text.primary,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border.medium,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.disabled,
    textAlign: 'right',
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },
});



