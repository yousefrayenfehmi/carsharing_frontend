@echo off
REM Script automatique pour build Android APK
REM Windows uniquement

echo ========================================
echo  FITARIKI - Build Android APK
echo ========================================
echo.

REM Vérifier si EAS CLI est installé
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo [ETAPE 1/4] Installation de EAS CLI...
    call npm install -g eas-cli
    if %errorlevel% neq 0 (
        echo ERREUR: Installation de EAS CLI a echoue
        pause
        exit /b 1
    )
    echo EAS CLI installe avec succes!
) else (
    echo [ETAPE 1/4] EAS CLI deja installe
)
echo.

REM Vérifier la connexion
echo [ETAPE 2/4] Verification de la connexion...
eas whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Vous devez vous connecter a Expo
    echo.
    eas login
    if %errorlevel% neq 0 (
        echo ERREUR: Connexion echouee
        pause
        exit /b 1
    )
)
echo Connecte en tant que:
eas whoami
echo.

REM Choix du profil
echo [ETAPE 3/4] Choisissez le type de build:
echo.
echo 1. Preview (test rapide - APK)
echo 2. Production (final - APK)
echo 3. Production AAB (Google Play Store)
echo.
set /p choice="Votre choix (1, 2 ou 3): "

if "%choice%"=="1" (
    set PROFILE=preview
    echo Build Preview selectionne
) else if "%choice%"=="2" (
    set PROFILE=production
    echo Build Production selectionne
) else if "%choice%"=="3" (
    set PROFILE=production-aab
    echo Build Production AAB selectionne
) else (
    echo Choix invalide
    pause
    exit /b 1
)
echo.

REM Vérifier l'API
echo [VERIFICATION] Configuration API:
if exist .env (
    findstr "EXPO_PUBLIC_API_URL" .env
) else (
    echo ATTENTION: Fichier .env non trouve
    echo API par defaut: http://37.59.126.29:3000/api
)
echo.

REM Lancer le build
echo [ETAPE 4/4] Lancement du build Android...
echo Profile: %PROFILE%
echo.
echo Cela peut prendre 15-20 minutes...
echo Vous recevrez un email avec le lien de telechargement.
echo.
pause
echo.

eas build --platform android --profile %PROFILE%

if %errorlevel% neq 0 (
    echo.
    echo ERREUR: Le build a echoue
    echo Consultez les logs ci-dessus pour plus de details
    pause
    exit /b 1
)

echo.
echo ========================================
echo  BUILD TERMINE AVEC SUCCES!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Vous allez recevoir un email avec le lien
echo 2. OU allez sur: https://expo.dev
echo 3. Telechargez l'APK ou AAB
echo 4. Installez sur votre telephone Android
echo.
echo Pour voir l'historique des builds:
echo   eas build:list
echo.
pause





