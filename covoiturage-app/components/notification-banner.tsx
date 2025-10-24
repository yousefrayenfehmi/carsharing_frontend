import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface NotificationBannerProps {
  visible: boolean;
  type: 'accepted' | 'rejected' | 'counter_offer';
  message: string;
  onPress?: () => void;
  onDismiss?: () => void;
  duration?: number;
}

export function NotificationBanner({
  visible,
  type,
  message,
  onPress,
  onDismiss,
  duration = 5000,
}: NotificationBannerProps) {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss après la durée spécifiée
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Animation de sortie
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration]);

  const handleDismiss = () => {
    onDismiss?.();
  };

  const getIconAndColor = () => {
    switch (type) {
      case 'accepted':
        return {
          icon: 'checkmark-circle' as const,
          color: '#10B981',
          backgroundColor: '#D1FAE5',
        };
      case 'rejected':
        return {
          icon: 'close-circle' as const,
          color: '#EF4444',
          backgroundColor: '#FEE2E2',
        };
      case 'counter_offer':
        return {
          icon: 'sync' as const,
          color: Colors.primary,
          backgroundColor: Colors.primaryLight,
        };
      default:
        return {
          icon: 'information-circle' as const,
          color: Colors.text.secondary,
          backgroundColor: Colors.background.light,
        };
    }
  };

  const { icon, color, backgroundColor } = getIconAndColor();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.banner, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color }]}>
              {type === 'accepted' && 'Proposition acceptée !'}
              {type === 'rejected' && 'Proposition refusée'}
              {type === 'counter_offer' && 'Nouvelle contre-proposition'}
            </Text>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={color} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 50, // Pour éviter la barre de statut
  },
  banner: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});

