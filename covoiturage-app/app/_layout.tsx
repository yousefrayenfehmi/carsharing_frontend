import { AuthProvider } from '@/contexts/auth-context';
import { AlertProvider } from '@/contexts/alert-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: 'signup',
};

function AppContent() {
  const colorScheme = useColorScheme();
  // Initialiser les notifications push (détecte automatiquement si disponible)
  usePushNotifications();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="email-signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin-login" options={{ headerShown: false }} />
        <Stack.Screen name="admin-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="admin-change-password" options={{ headerShown: false }} />
        <Stack.Screen name="admin-users" options={{ headerShown: false }} />
        <Stack.Screen name="admin-user-stats" options={{ headerShown: false }} />
        <Stack.Screen name="admin-admins" options={{ headerShown: false }} />
        <Stack.Screen name="admin-commission" options={{ headerShown: false }} />
        <Stack.Screen name="admin-payments" options={{ headerShown: false }} />
        <Stack.Screen name="terms-of-service" options={{ headerShown: false }} />
        <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
        <Stack.Screen name="trip-details" options={{ headerShown: false }} />
        <Stack.Screen name="trip-bookings" options={{ headerShown: false }} />
        <Stack.Screen name="my-bookings" options={{ headerShown: false }} />
        <Stack.Screen name="negotiations" options={{ headerShown: false }} />
        <Stack.Screen name="trip-negotiations/[tripId]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="dark" translucent={false} backgroundColor="white" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
