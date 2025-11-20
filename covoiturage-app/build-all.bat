@echo off
REM Script pour build Android ET iOS ensemble
REM Windows uniquement

echo ========================================
echo  FITARIKI - Build Android + iOS
echo ========================================
echo.

REM Vérifier si EAS CLI est installé
where eas >nul 2>nul
if %errorlevel% neq 0 (
    echo Installation de EAS CLI...
    call npm install -g eas-cli
    if %errorlevel% neq 0 (
        echo ERREUR: Installation de EAS CLI a echoue
        pause
        exit /b 1
    )
)
echo.

REM Vérifier la connexion
eas whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Connexion a Expo...
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
echo Choisissez le type de build:
echo.
echo 1. Preview (test)
echo 2. Production
echo.
set /p choice="Votre choix (1 ou 2): "

if "%choice%"=="1" (
    set PROFILE=preview
) else if "%choice%"=="2" (
    set PROFILE=production
) else (
    echo Choix invalide
    pause
    exit /b 1
)
echo.

echo Configuration API:
if exist .env (
    findstr "EXPO_PUBLIC_API_URL" .env
)
echo.

echo Lancement du build Android + iOS...
echo Profile: %PROFILE%
echo.
echo Cela peut prendre 30-40 minutes au total...
echo.
pause

eas build --platform all --profile %PROFILE%

if %errorlevel% neq 0 (
    echo.
    echo ERREUR: Le build a echoue
    pause
    exit /b 1
)

echo.
echo ========================================
echo  BUILDS TERMINES AVEC SUCCES!
echo ========================================
echo.
echo Vous allez recevoir 2 emails:
echo - Un pour Android (APK)
echo - Un pour iOS (.ipa)
echo.
echo Ou consultez: https://expo.dev
echo.
pause





