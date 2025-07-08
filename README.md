# FinTrack Mobile 📱

Démo d'application mobile de gestion financière et budgets développée avec React Native et Expo, dans le cadre d'un recrutement.

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

1. **Le backend est lancé**
2. **Les données de démo sont chargées**
   
⚠️ **Important** : Utilisez votre **IP locale** (pas localhost) pour tester sur téléphone !

## 🧪 Compte de Test

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

## 📄 Licence

Ce projet est développé dans un cadre éducatif.

---
