import { useState, useEffect } from 'react';
import { authService, type User, type LoginCredentials, type SignupCredentials } from '@/services/auth-service';

/**
 * Hook personnalisé pour l'authentification
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Essayer de récupérer l'utilisateur du cache
        const cachedUser = await authService.getCachedUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // Puis rafraîchir depuis le serveur
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          // Si erreur (token expiré), utiliser l'utilisateur en cache
          console.log('Erreur lors du rafraîchissement du profil:', err);
        }
      }
    } catch (err: any) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser } = await authService.login(credentials);
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur de connexion';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser } = await authService.signup(credentials);
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur d\'inscription';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async (facebookToken: string, facebookId: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser } = await authService.loginWithFacebook(facebookToken, facebookId);
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur d\'authentification Facebook';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      return profile;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithFacebook,
    logout,
    checkAuth,
    refreshProfile,
  };
};

