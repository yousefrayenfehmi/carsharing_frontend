import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo et nom */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/fitriqi.png')}
            style={styles.logoIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>FITARIKI</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {/* Profil utilisateur */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              router.push('/(tabs)/profile');
            }}
          >
            {isAuthenticated ? (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {String(user?.firstName?.[0]?.toUpperCase() || 'U')}
                </Text>
              </View>
            ) : (
              <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.white,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
});

