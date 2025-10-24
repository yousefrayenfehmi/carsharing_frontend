import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, type User, type LoginCredentials, type SignupCredentials } from '@/services/auth-service';
import { userService } from '@/services/user-service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  signup: (credentials: SignupCredentials) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<User>;
  refreshProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider pour gérer l'état d'authentification global
 * 
 * @example
 * // Dans app/_layout.tsx
 * <AuthProvider>
 *   <Stack>
 *     <Stack.Screen name="(tabs)" />
 *   </Stack>
 * </AuthProvider>
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * Charge les informations d'authentification stockées
   */
  const loadStoredAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Récupérer l'utilisateur du cache
        const cachedUser = await authService.getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // Rafraîchir le profil depuis le serveur
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          // Si erreur (token expiré), garder l'utilisateur en cache
          console.log('Impossible de rafraîchir le profil:', err);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connecte l'utilisateur avec email et mot de passe (ou admin)
   */
  const login = async (credentials: LoginCredentials): Promise<any> => {
    try {
      setIsLoading(true);
      const result = await authService.login(credentials);
      
      // Si c'est un utilisateur normal (pas admin)
      if (result.user && !result.isAdmin) {
        setUser(result.user);
      }
      
      // Retourner l'objet complet pour gérer la redirection
      return result;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inscription d'un nouvel utilisateur
   */
  const signup = async (credentials: SignupCredentials): Promise<User> => {
    try {
      setIsLoading(true);
      const { user: userData } = await authService.signup(credentials);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setUser(null);
    }
  };

  /**
   * Rafraîchir le profil depuis le serveur
   */
  const refreshProfile = async (): Promise<User> => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      throw error;
    }
  };

  /**
   * Met à jour les informations de l'utilisateur
   */
  const updateUser = async (userData: any): Promise<User> => {
    try {
      // Appeler le service backend pour sauvegarder
      const updatedUser = await userService.updateProfile(userData);
      
      // Mettre à jour l'état local
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook pour utiliser le contexte d'authentification
 * 
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   return <Text>Bonjour {user.firstName}!</Text>
 * }
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
}

