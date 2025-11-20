@echo off
REM Script automatique pour build iOS
REM Windows uniquement

echo ========================================
echo  FITARIKI - Build iOS
echo ========================================
echo.

REM Vérifier si EAS CLI est installé
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo [ETAPE 1/5] Installation de EAS CLI...
    call npm install -g eas-cli
    if %errorlevel% neq 0 (
        echo ERREUR: Installation de EAS CLI a echoue
        pause
        exit /b 1
    )
    echo EAS CLI installe avec succes!
) else (
    echo [ETAPE 1/5] EAS CLI deja installe
)
echo.

REM Vérifier la connexion
echo [ETAPE 2/5] Verification de la connexion...
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

REM Rappel Apple Developer
echo [ETAPE 3/5] Verification des prerequis Apple...
echo.
echo IMPORTANT: Pour build iOS, vous avez besoin de:
echo  - Compte Apple Developer (99 USD/an)
echo  - App ID cree sur developer.apple.com
echo  - App creee sur appstoreconnect.apple.com
echo  - eas.json configure avec vos identifiants Apple
echo.
set /p ready="Avez-vous tout configure? (o/n): "
if /i not "%ready%"=="o" (
    echo.
    echo Consultez GUIDE_BUILD_COMPLET.md pour les instructions
    echo.
    pause
    exit /b 0
)
echo.

REM Choix du profil
echo [ETAPE 4/5] Choisissez le type de build:
echo.
echo 1. Preview (test avec TestFlight)
echo 2. Production (App Store - upload auto)
echo 3. Production (App Store - upload manuel)
echo.
set /p choice="Votre choix (1, 2 ou 3): "

if "%choice%"=="1" (
    set PROFILE=preview
    set AUTO_SUBMIT=
    echo Build Preview selectionne
) else if "%choice%"=="2" (
    set PROFILE=production
    set AUTO_SUBMIT=--auto-submit
    echo Build Production avec upload automatique
) else if "%choice%"=="3" (
    set PROFILE=production
    set AUTO_SUBMIT=
    echo Build Production avec upload manuel
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
echo [ETAPE 5/5] Lancement du build iOS...
echo Profile: %PROFILE%
if not "%AUTO_SUBMIT%"=="" echo Upload automatique: Oui
echo.
echo Cela peut prendre 20-30 minutes...
echo EAS va vous demander vos identifiants Apple.
echo.
pause
echo.

if not "%AUTO_SUBMIT%"=="" (
    eas build --platform ios --profile %PROFILE% %AUTO_SUBMIT%
) else (
    eas build --platform ios --profile %PROFILE%
)

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
if not "%AUTO_SUBMIT%"=="" (
    echo Prochaines etapes:
    echo 1. Le build a ete uploade sur App Store Connect
    echo 2. Allez sur: https://appstoreconnect.apple.com
    echo 3. Finalisez les metadonnees
    echo 4. Ajoutez les captures d'ecran
    echo 5. Soumettez pour revision
) else (
    echo Prochaines etapes:
    echo 1. Vous allez recevoir un email avec le lien
    echo 2. OU allez sur: https://expo.dev
    echo 3. Telechargez le .ipa
    echo.
    echo Pour uploader manuellement:
    echo   eas submit --platform ios --latest
)
echo.
echo Pour voir l'historique des builds:
echo   eas build:list
echo.
pause





