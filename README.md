# FinTrack Mobile 📱

Application mobile de gestion financière développée avec React Native et Expo.

## 🚀 Fonctionnalités

- **Dashboard** avec graphiques d'évolution du patrimoine et composition
- **Transactions** avec filtres et recherche avancée
- **Budgets** avec suivi en temps réel et alertes
- **Analytics** avec graphiques détaillés par catégorie
- **Profil** utilisateur avec paramètres

## 🛠 Technologies

- **React Native** - Framework mobile
- **Expo SDK 53** - Plateforme de développement
- **TypeScript** - Typage statique
- **React Navigation** - Navigation
- **React Native Chart Kit** - Graphiques
- **AsyncStorage** - Stockage local

## 📋 Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **yarn**
- **Expo CLI** installé globalement
- **Expo Go** app sur votre téléphone

## 🎯 Installation et Test

### 1. **Installation des dépendances**

```bash
cd FinTrackMobile
npm install
```

### 2. **Démarrage du serveur de développement**

```bash
npm start
# ou
npx expo start
```

### 3. **Test sur votre téléphone**

#### **Option A : Expo Go (Recommandé pour démo)**

1. **Téléchargez Expo Go** :
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scannez le QR code** :
   - Ouvrez Expo Go sur votre téléphone
   - Scannez le QR code affiché dans votre terminal
   - L'app se lance automatiquement !

#### **Option B : Simulateur/Émulateur**

```bash
# iOS Simulator (macOS uniquement)
npm run ios

# Android Emulator
npm run android
```

## 🔧 Configuration API

L'app se connecte au backend FinTrack API. Assurez-vous que :

1. **Le backend est lancé** sur `http://localhost:8000`
2. **Les données de démo sont chargées** :
   ```bash
   cd ../fintrack-api
   python manage.py populate_demo_data
   ```

### **Configuration manuelle (si nécessaire)**

Modifiez `src/config/api.ts` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://votre-ip:8000/api',  // Remplacez par votre IP
  AUTH_URL: 'http://votre-ip:8000/auth',
  TIMEOUT: 10000,
};
```

⚠️ **Important** : Utilisez votre **IP locale** (pas localhost) pour tester sur téléphone !

## 📱 Build pour Distribution

### **Créer un APK Android**

```bash
# Installation EAS CLI
npm install -g eas-cli

# Connexion Expo (créez un compte gratuit)
npx eas login

# Configuration build
npx eas build:configure

# Génération APK
npx eas build --platform android --profile preview
```

### **Build iOS (TestFlight)**

```bash
# Nécessite un compte Apple Developer
npx eas build --platform ios --profile preview
```

## 🧪 Comptes de Test

L'app est pré-configurée avec des comptes de démo :

- **Email** : `demo@fintrack.com`
- **Mot de passe** : `demo123`

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
├── screens/            # Écrans de l'application
├── navigation/         # Configuration navigation
├── contexts/           # Contextes React (Auth, etc.)
├── services/           # Services API
├── types/              # Types TypeScript
├── theme/              # Couleurs et styles
└── config/             # Configuration API
```

## 🎨 Design System

L'app utilise un design system cohérent :

- **Couleurs** : Palette dorée avec mode sombre
- **Typography** : Système de tailles cohérent
- **Spacing** : Espacement uniforme
- **Components** : Composants réutilisables

## 🐛 Dépannage

### **Problème de connexion API**

1. Vérifiez que le backend est lancé
2. Utilisez votre IP locale dans la config
3. Désactivez les firewalls temporairement

### **Erreur Metro Bundler**

```bash
npx expo start --clear
```

### **Problème de cache**

```bash
npm start -- --reset-cache
```

## 📄 Licence

Ce projet est développé dans un cadre éducatif.

---

**Développé avec ❤️ pour la gestion financière moderne**