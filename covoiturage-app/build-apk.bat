@echo off
REM ================================
REM Script de Build APK Automatique
REM Covoiturage App (Windows)
REM ================================

echo 🚀 Build APK Covoiturage...
echo.

REM Vérifier si eas-cli est installé
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installation de EAS CLI...
    call npm install -g eas-cli
)

REM Vérifier si l'utilisateur est connecté
eas whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Connexion à Expo...
    call eas login
)

echo.
echo Choisissez le type de build :
echo 1^) APK de test (preview^)
echo 2^) APK de production
echo 3^) AAB pour Google Play
echo.
set /p choice="Votre choix (1-3): "

if "%choice%"=="1" (
    echo 📱 Build APK de test...
    call eas build -p android --profile preview
) else if "%choice%"=="2" (
    echo 📱 Build APK de production...
    call eas build -p android --profile production
) else if "%choice%"=="3" (
    echo 📱 Build AAB pour Google Play...
    call eas build -p android --profile production-aab
) else (
    echo ❌ Choix invalide
    pause
    exit /b 1
)

echo.
echo ✅ Build lancé !
echo 📧 Vous recevrez un email quand le build sera terminé
echo 🌐 Ou allez sur https://expo.dev pour voir la progression
echo.
pause


