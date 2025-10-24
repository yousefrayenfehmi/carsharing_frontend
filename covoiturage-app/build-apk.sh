#!/bin/bash

# ================================
# Script de Build APK Automatique
# Covoiturage App
# ================================

echo "🚀 Build APK Covoiturage..."
echo ""

# Vérifier si eas-cli est installé
if ! command -v eas &> /dev/null; then
    echo "📦 Installation de EAS CLI..."
    npm install -g eas-cli
fi

# Vérifier si l'utilisateur est connecté
if ! eas whoami &> /dev/null; then
    echo "🔐 Connexion à Expo..."
    eas login
fi

echo ""
echo "Choisissez le type de build :"
echo "1) APK de test (preview)"
echo "2) APK de production"
echo "3) AAB pour Google Play"
echo ""
read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "📱 Build APK de test..."
        eas build -p android --profile preview
        ;;
    2)
        echo "📱 Build APK de production..."
        eas build -p android --profile production
        ;;
    3)
        echo "📱 Build AAB pour Google Play..."
        eas build -p android --profile production-aab
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "✅ Build lancé !"
echo "📧 Vous recevrez un email quand le build sera terminé"
echo "🌐 Ou allez sur https://expo.dev pour voir la progression"


