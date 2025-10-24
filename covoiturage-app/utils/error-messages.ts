/**
 * Messages d'erreur conviviaux pour les utilisateurs
 * Traduit les erreurs techniques en messages clairs et utiles
 */

export const ERROR_MESSAGES: Record<string, string> = {
  // Erreurs réseau
  'Network request failed': 'Impossible de se connecter. Vérifiez votre connexion internet.',
  'Network Error': 'Problème de connexion. Vérifiez votre réseau.',
  'timeout': 'La requête a pris trop de temps. Réessayez.',
  
  // Erreurs d'authentification
  'Invalid credentials': 'Email ou mot de passe incorrect.',
  'Email ou mot de passe incorrect': 'Email ou mot de passe incorrect.',
  'Token expired': 'Votre session a expiré. Veuillez vous reconnecter.',
  'Unauthorized': 'Vous devez vous connecter pour continuer.',
  'Invalid token': 'Votre session a expiré. Veuillez vous reconnecter.',
  
  // Erreurs de compte
  'Un compte avec cet email existe déjà': 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.',
  'User not found': 'Aucun compte trouvé avec cet email.',
  'Utilisateur non trouvé': 'Compte introuvable.',
  
  // Erreurs de trajet
  'Trip not found': 'Ce trajet n\'existe plus.',
  'Trajet non trouvé': 'Ce trajet n\'existe plus.',
  'Not enough seats': 'Il n\'y a plus assez de places disponibles.',
  'Trip is full': 'Ce trajet est complet.',
  'Trip already started': 'Ce trajet a déjà commencé.',
  'Trip cancelled': 'Ce trajet a été annulé.',
  
  // Erreurs de réservation
  'Booking not found': 'Cette réservation n\'existe pas.',
  'Already booked': 'Vous avez déjà réservé ce trajet.',
  'Cannot book own trip': 'Vous ne pouvez pas réserver votre propre trajet.',
  'Vous ne pouvez pas réserver votre propre trajet': 'Vous ne pouvez pas réserver votre propre trajet.',
  
  // Erreurs de validation
  'Validation error': 'Certaines informations sont incorrectes.',
  'Invalid email': 'Adresse email invalide.',
  'Password too short': 'Le mot de passe doit contenir au moins 6 caractères.',
  'Required field': 'Ce champ est obligatoire.',
  
  // Erreurs serveur
  '500': 'Une erreur est survenue. Nos équipes ont été notifiées.',
  'Internal server error': 'Une erreur est survenue. Réessayez dans quelques instants.',
  'Service unavailable': 'Le service est temporairement indisponible.',
  
  // Erreurs de permissions
  'Permission denied': 'Vous n\'avez pas les permissions nécessaires.',
  'Forbidden': 'Accès refusé.',
  
  // Erreurs de paiement
  'Payment failed': 'Le paiement a échoué. Vérifiez vos informations.',
  'Insufficient funds': 'Solde insuffisant.',
  
  // Erreurs de fichiers
  'File too large': 'Le fichier est trop volumineux. Maximum 5 Mo.',
  'Invalid file type': 'Type de fichier non supporté.',
  'Upload failed': 'L\'envoi du fichier a échoué. Réessayez.',
};

/**
 * Traduit une erreur technique en message convivial
 */
export function getUserFriendlyErrorMessage(error: any): string {
  // Si l'erreur contient déjà un message convivial
  if (error?.response?.data?.message) {
    const backendMessage = error.response.data.message;
    return ERROR_MESSAGES[backendMessage] || backendMessage;
  }

  // Si c'est un message d'erreur direct
  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  // Si c'est une erreur avec message
  if (error?.message) {
    return ERROR_MESSAGES[error.message] || error.message;
  }

  // Message par défaut
  return 'Une erreur est survenue. Veuillez réessayer.';
}

/**
 * Détermine le type de toast basé sur l'erreur
 */
export function getErrorType(error: any): 'error' | 'warning' | 'info' {
  const message = error?.response?.data?.message || error?.message || '';
  
  // Avertissements (pas critiques)
  if (
    message.includes('session') ||
    message.includes('expiré') ||
    message.includes('complet') ||
    message.includes('déjà')
  ) {
    return 'warning';
  }
  
  // Informations
  if (
    message.includes('vérifi') ||
    message.includes('connexion')
  ) {
    return 'info';
  }
  
  // Par défaut : erreur
  return 'error';
}

