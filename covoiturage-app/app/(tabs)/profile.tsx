import { Button } from '@/components/ui/button';
import { Toast } from '@/components/toast';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { useAlert } from '@/contexts/alert-context';
import { useToast } from '@/hooks/use-toast';
import { getUserFriendlyErrorMessage } from '@/utils/error-messages';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '@/services/user-service';
import { authService } from '@/services/auth-service';
import { WilayaPicker } from '@/components/wilaya-picker';
import { Wilaya, getWilayaByName } from '@/constants/algerian-wilayas';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, updateUser, refreshProfile } = useAuth();
  const { toast, showSuccess, showError, showWarning, hideToast } = useToast();
  const { showError: showAlertError, showSuccess: showAlertSuccess, showConfirm } = useAlert();
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showWilayaPicker, setShowWilayaPicker] = useState(false);
  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    cin: user?.cin || '',
    driverLicenseNumber: user?.driverLicenseNumber || '',
    vehicleBrand: user?.vehicle?.brand || '',
    vehicleModel: user?.vehicle?.model || '',
    vehicleYear: user?.vehicle?.year?.toString() || '',
    vehicleColor: user?.vehicle?.color || '',
    vehicleLicensePlate: user?.vehicle?.licensePlate || '',
  });
  useEffect(() => {
    console.log("user", user);
  }, [user]);
  const handleLogout = () => {
    showConfirm(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      async () => {
        await logout();
        router.replace('/login');
      }
    );
  };

  const handleSaveProfile = async () => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      showAlertError('Erreur', 'Le prénom et le nom sont obligatoires');
      return;
    }

    try {
      const updateData: any = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
        cin: editForm.cin,
        driverLicenseNumber: editForm.driverLicenseNumber,
        wilaya: selectedWilaya?.name,
      };

      // Ajouter les informations du véhicule si remplies
      if (editForm.vehicleBrand && editForm.vehicleModel) {
        updateData.vehicle = {
          brand: editForm.vehicleBrand,
          model: editForm.vehicleModel,
          year: editForm.vehicleYear ? parseInt(editForm.vehicleYear) : undefined,
          color: editForm.vehicleColor,
          licensePlate: editForm.vehicleLicensePlate,
        };
      }

      await updateUser(updateData);

      setShowEditModal(false);
      showAlertSuccess('Succès', 'Votre profil a été mis à jour');
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showAlertError('Erreur', errorMessage);
    }
  };

  const openEditModal = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      cin: user?.cin || '',
      driverLicenseNumber: user?.driverLicenseNumber || '',
      vehicleBrand: user?.vehicle?.brand || '',
      vehicleModel: user?.vehicle?.model || '',
      vehicleYear: user?.vehicle?.year?.toString() || '',
      vehicleColor: user?.vehicle?.color || '',
      vehicleLicensePlate: user?.vehicle?.licensePlate || '',
    });
    // Initialiser la wilaya sélectionnée
    if (user?.wilaya) {
      const wilaya = getWilayaByName(user.wilaya);
      setSelectedWilaya(wilaya || null);
    } else {
      setSelectedWilaya(null);
    }
    setShowEditModal(true);
  };

  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        showWarning('Vous devez autoriser l\'accès à la caméra');
        return;
      }

      setShowImagePickerModal(false);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowImagePreview(true);
      }
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleChooseFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        showWarning('Vous devez autoriser l\'accès à la galerie');
        return;
      }

      setShowImagePickerModal(false);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri);
        setShowImagePreview(true);
      }
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleConfirmPhoto = async () => {
    if (!selectedImageUri) return;
    
    setShowImagePreview(false);
    setUploadingPhoto(true);
    
    try {
      await userService.uploadProfilePicture(selectedImageUri);
      await refreshProfile();
      showSuccess('Photo de profil mise à jour avec succès !');
      setSelectedImageUri(null);
    } catch (error: any) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      showError(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setShowImagePreview(false);
    setSelectedImageUri(null);
  };

  const handleVerifyEmail = () => {
    setVerificationCode('');
    setShowVerificationModal(true);
  };

  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    try {
      await authService.sendEmailVerification();
      showAlertSuccess('Code envoyé', 'Un code de vérification a été envoyé à votre email. Vérifiez la console du serveur backend.');
    } catch (error: any) {
      showAlertError('Erreur', error.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showAlertError('Erreur', 'Veuillez entrer un code à 6 chiffres');
      return;
    }

    setVerifying(true);
    try {
      await authService.verifyEmail(verificationCode);
      await refreshProfile();
      showAlertSuccess('Succès', 'Email vérifié avec succès!');
      setShowVerificationModal(false);
    } catch (error: any) {
      showAlertError('Erreur', error.response?.data?.message || 'Code invalide ou expiré');
    } finally {
      setVerifying(false);
    }
  };

  // Si non authentifié, afficher un écran de connexion
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.notAuthContainer}>
          <View style={styles.notAuthIcon}>
            <Ionicons name="person-circle-outline" size={120} color={Colors.border.medium} />
          </View>
          
          <Text style={styles.notAuthTitle}>Vous n'êtes pas connecté</Text>
          <Text style={styles.notAuthSubtitle}>
            Connectez-vous pour accéder à votre profil et gérer vos trajets
          </Text>

          <Button
            title="Se connecter"
            onPress={() => router.push('/login')}
            style={styles.loginButton}
          />

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signupText}>
              Pas encore de compte ? <Text style={styles.signupTextBold}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête du profil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {uploadingPhoto && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.uploadText}>Upload en cours...</Text>
              </View>
            )}
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.firstName[0]}{user?.lastName[0]}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={() => setShowImagePickerModal(true)}
              disabled={uploadingPhoto}
            >
              <Ionicons name="camera" size={20} color={Colors.text.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={openEditModal}
            >
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
              <Text style={styles.editProfileText}>Modifier le profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.negotiationsButton}
              onPress={() => router.push('/negotiations' as any)}
            >
              <Ionicons name="chatbubbles-outline" size={18} color={Colors.primary} />
              <Text style={styles.negotiationsButtonText}>Mes négociations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookingsButton}
              onPress={() => router.push('/my-bookings' as any)}
            >
              <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
              <Text style={styles.bookingsButtonText}>Mes réservations</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>

          <View style={styles.card}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoRow}>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                  </View>
                  {user?.isEmailVerified ? (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                      <Text style={styles.verifiedText}>Vérifié</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.verifyButton}
                      onPress={handleVerifyEmail}
                    >
                      <Text style={styles.verifyButtonText}>Vérifier</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Téléphone</Text>
                <Text style={styles.infoValue}>
                  {user?.phoneNumber || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Wilaya</Text>
                <Text style={styles.infoValue}>
                  {user?.wilaya || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Membre depuis</Text>
                <Text style={styles.infoValue}>
                  {user?.createdAt && new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="card-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>CIN</Text>
                <Text style={styles.infoValue}>
                  {user?.cin || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="document-text-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Permis de conduire</Text>
                <Text style={styles.infoValue}>
                  {user?.driverLicenseNumber || 'Non renseigné'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informations du véhicule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon véhicule</Text>

          <View style={styles.card}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="car-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Marque et Modèle</Text>
                <Text style={styles.infoValue}>
                  {user?.vehicle?.brand && user?.vehicle?.model 
                    ? `${user.vehicle.brand} ${user.vehicle.model}` 
                    : 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Année</Text>
                <Text style={styles.infoValue}>
                  {user?.vehicle?.year || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="color-palette-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Couleur</Text>
                <Text style={styles.infoValue}>
                  {user?.vehicle?.color || 'Non renseigné'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="pricetag-outline" size={20} color={Colors.text.secondary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Plaque d'immatriculation (Matricule)</Text>
                <Text style={styles.infoValue}>
                  {user?.vehicle?.licensePlate || 'Non renseigné'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modal d'édition du profil */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.formGroup}>
                <Text style={styles.label}>Prénom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  value={editForm.firstName}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, firstName: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  value={editForm.lastName}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, lastName: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  value={editForm.phoneNumber}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, phoneNumber: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Wilaya</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setShowWilayaPicker(true)}
                >
                  <Text style={[styles.pickerText, !selectedWilaya && styles.pickerPlaceholder]}>
                    {selectedWilaya ? `${selectedWilaya.code} - ${selectedWilaya.name}` : 'Sélectionnez votre wilaya'}
                  </Text>
                  <Ionicons name="chevron-down" size={24} color="#6D7175" />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>CIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de CIN"
                  value={editForm.cin}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, cin: text.toUpperCase() })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Permis de conduire</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de permis"
                  value={editForm.driverLicenseNumber}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, driverLicenseNumber: text.toUpperCase() })
                  }
                />
              </View>

              <Text style={styles.sectionTitle}>Informations du véhicule</Text>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Marque</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Peugeot, Renault"
                  value={editForm.vehicleBrand}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, vehicleBrand: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Modèle</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 208, Clio"
                  value={editForm.vehicleModel}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, vehicleModel: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Année</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 2020"
                  value={editForm.vehicleYear}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, vehicleYear: text })
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Couleur</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Noir, Blanc"
                  value={editForm.vehicleColor}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, vehicleColor: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Plaque d'immatriculation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 123-A-456"
                  value={editForm.vehicleLicensePlate}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, vehicleLicensePlate: text.toUpperCase() })
                  }
                />
              </View>

              <Button
                title="Enregistrer"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de vérification */}
      <Modal
        visible={showVerificationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Vérifier l'email
              </Text>
              <TouchableOpacity onPress={() => setShowVerificationModal(false)}>
                <Ionicons name="close" size={28} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.verificationInstructions}>
              Un code de vérification à 6 chiffres sera envoyé à votre email.
            </Text>

            <Button
              title={sendingCode ? "Envoi en cours..." : "Envoyer le code"}
              onPress={handleSendVerificationCode}
              disabled={sendingCode}
              style={styles.sendCodeButton}
            />

            <View style={styles.codeInputContainer}>
              <Text style={styles.label}>Code de vérification</Text>
              <TextInput
                style={styles.codeInput}
                placeholder="Entrez le code à 6 chiffres"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <Button
              title={verifying ? "Vérification..." : "Vérifier"}
              onPress={handleVerifyCode}
              disabled={verifying || verificationCode.length !== 6}
              style={styles.verifyCodeButton}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de sélection de wilaya */}
      <WilayaPicker
        visible={showWilayaPicker}
        onClose={() => setShowWilayaPicker(false)}
        onSelect={(wilaya) => setSelectedWilaya(wilaya)}
        selectedWilaya={selectedWilaya?.name}
      />

      {/* Modal de sélection de la source de la photo */}
      <Modal
        visible={showImagePickerModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.imagePickerModalOverlay}>
          <View style={styles.imagePickerModalContent}>
            <Text style={styles.imagePickerTitle}>Changer votre photo de profil</Text>
            <Text style={styles.imagePickerSubtitle}>Choisissez une méthode</Text>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handleTakePhoto}
            >
              <View style={styles.imagePickerIconContainer}>
                <Ionicons name="camera" size={28} color={Colors.primary} />
              </View>
              <View style={styles.imagePickerOptionText}>
                <Text style={styles.imagePickerOptionTitle}>Prendre une photo</Text>
                <Text style={styles.imagePickerOptionDescription}>
                  Utilisez votre caméra
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handleChooseFromGallery}
            >
              <View style={styles.imagePickerIconContainer}>
                <Ionicons name="images" size={28} color={Colors.primary} />
              </View>
              <View style={styles.imagePickerOptionText}>
                <Text style={styles.imagePickerOptionTitle}>Choisir dans la galerie</Text>
                <Text style={styles.imagePickerOptionDescription}>
                  Sélectionnez une photo existante
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerCancelButton}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={styles.imagePickerCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de prévisualisation de la photo */}
      <Modal
        visible={showImagePreview}
        transparent
        animationType="fade"
        onRequestClose={handleCancelPhoto}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Aperçu de votre photo</Text>
            <Text style={styles.previewSubtitle}>
              Confirmez ou modifiez votre sélection
            </Text>

            <View style={styles.previewImageContainer}>
              {selectedImageUri && (
                <Image source={{ uri: selectedImageUri }} style={styles.previewImage} />
              )}
            </View>

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.previewCancelButton}
                onPress={handleCancelPhoto}
              >
                <Ionicons name="close-circle-outline" size={24} color={Colors.text.secondary} />
                <Text style={styles.previewCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewConfirmButton}
                onPress={handleConfirmPhoto}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator size="small" color={Colors.text.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={24} color={Colors.text.white} />
                    <Text style={styles.previewConfirmText}>Confirmer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast pour les messages */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    backgroundColor: Colors.background.white,
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.background.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.text.white,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 8,
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editProfileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  negotiationsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  negotiationsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  bookingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
  },
  bookingsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: 68,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.background.white,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },
  bottomSpace: {
    height: 20,
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notAuthIcon: {
    marginBottom: 24,
  },
  notAuthTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  notAuthSubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  signupLink: {
    paddingVertical: 12,
  },
  signupText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  signupTextBold: {
    fontWeight: '700',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  saveButton: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  infoTextContainer: {
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  verifyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  verifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },
  verificationInstructions: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  sendCodeButton: {
    marginBottom: 24,
  },
  codeInputContainer: {
    marginBottom: 20,
  },
  codeInput: {
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    borderWidth: 2,
    borderColor: Colors.primary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyCodeButton: {
    marginTop: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  pickerPlaceholder: {
    color: Colors.text.secondary,
  },
  imagePickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerModalContent: {
    backgroundColor: Colors.background.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  imagePickerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  imagePickerSubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.light,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imagePickerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  imagePickerOptionText: {
    flex: 1,
  },
  imagePickerOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  imagePickerOptionDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  imagePickerCancelButton: {
    marginTop: 12,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.background.light,
  },
  imagePickerCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  previewContainer: {
    width: '100%',
    backgroundColor: Colors.background.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  previewSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  previewImageContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  previewCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.background.light,
    borderWidth: 2,
    borderColor: Colors.border.medium,
  },
  previewCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  previewConfirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  previewConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.white,
  },
});

