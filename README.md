# 🎴 Res Arcana Tracker

Application mobile de suivi de scores pour le jeu de cartes **Res Arcana**, développée avec Expo / React Native.

---

## 📱 Fonctionnalités

- Enregistrement des parties (scores, date, victoire/défaite/égalité)
- Historique des 20 dernières parties avec swipe pour éditer ou supprimer
- Statistiques mensuelles et globales (win rate, séries de victoires, moyenne de points...)
- Noms des joueurs personnalisables
- Thème clair / sombre
- Import / Export des données en CSV

---

## ⚙️ Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé)
- [pnpm](https://pnpm.io/) — gestionnaire de paquets utilisé dans ce projet
  ```bash
  npm install -g pnpm
  ```
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
  ```bash
  npm install -g expo-cli
  ```
- [Android Studio](https://developer.android.com/studio) avec un émulateur configuré **ou** l'app **Expo Go** sur ton téléphone

---

## 🚀 Lancer l'application

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Lancer en mode développement

#### Sur ton téléphone physique (Android)

```bash
pnpm dev:android
```

Scanne le QR code avec l'app **Expo Go** sur ton téléphone.

#### Sur émulateur Android (Android Studio requis)

```bash
pnpm android
```

#### Sur émulateur iOS (Mac uniquement)

```bash
pnpm ios
```

#### En mode web (limité, non recommandé pour tester)

```bash
pnpm web
```

---

## 📁 Structure du projet

```
src/
├── components/         # Composants réutilisables (ScreenContainer...)
├── db/                 # Configuration WatermelonDB (database, migrations, schema)
├── models/             # Modèles WatermelonDB (GameModel)
├── navigation/         # Navigation (MainNavigation, types)
├── screens/            # Écrans de l'app
│   ├── HomeScreen.tsx          # Accueil — liste des parties
│   ├── AddGameScreen.tsx       # Ajouter une partie
│   ├── EditGameScreen.tsx      # Modifier une partie
│   ├── StatsScreen.tsx         # Conteneur stats (onglets Mois / Global)
│   ├── GlobalStats.tsx         # Stats globales
│   ├── MonthlyStats.tsx        # Stats mensuelles
│   └── SettingsScreen.tsx      # Paramètres (joueurs, thème, import/export)
├── stores/             # Stores Zustand
│   ├── gameStore.ts            # Gestion des parties
│   ├── playerStore.ts          # Noms des joueurs (AsyncStorage)
│   └── themeStore.ts           # Thème clair/sombre (AsyncStorage)
└── utils/              # Fonctions utilitaires
    ├── statsHelpers.ts         # Calculs statistiques
    ├── exportGamesToCSV.ts     # Export CSV
    ├── importGamesFromCSV.ts   # Import CSV
    ├── gameFilters.ts          # Filtres sur les parties
    ├── formatDate.ts           # Formatage des dates
    └── safStorage.ts           # Wrapper AsyncStorage
```

---

## 🗃️ Base de données

L'app utilise **WatermelonDB** (SQLite sous le capot) pour stocker les parties en local sur le téléphone. Les données persistent entre les sessions sans connexion internet.

Les noms des joueurs et le thème sont stockés séparément via **AsyncStorage**.

---

## 🔧 Stack technique

| Technologie        | Usage                               |
| ------------------ | ----------------------------------- |
| React Native 0.79  | Framework mobile                    |
| Expo SDK 53        | Toolchain & build                   |
| WatermelonDB 0.28  | Base de données locale              |
| Zustand 5          | State management                    |
| React Navigation 7 | Navigation (tabs + stack)           |
| date-fns           | Formatage des dates                 |
| AsyncStorage       | Persistance légère (thème, joueurs) |

---

## 📦 Build de production (EAS)

Le projet est configuré avec **EAS Build** (Expo Application Services).

```bash
# Installer EAS CLI si pas déjà fait
npm install -g eas-cli

# Build Android (.apk ou .aab)
eas build --platform android

# Build iOS
eas build --platform ios
```

> Le `projectId` EAS est déjà configuré dans `app.json`.

---

## 🐛 Problèmes fréquents

**Metro bundler qui plante au démarrage**

```bash
pnpm start --clear
```

**Erreur de dépendances après un `git pull`**

```bash
pnpm install
```

**La base de données semble vide après une mise à jour**

> Les migrations WatermelonDB sont dans `src/db/migrations.ts`. Si tu as modifié le schéma sans ajouter de migration, il faut désinstaller l'app du téléphone et la réinstaller.

---

## 👤 Auteur

Projet personnel — Antoine  
Package : `com.antoine.appliresarcana`
