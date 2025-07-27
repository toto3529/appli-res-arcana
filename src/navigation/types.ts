// Liste de toutes les routes de ton NativeStack et leurs params
// Routes du stack "Home"
export type RootStackParamList = {
  HomeMain: undefined // écran d’accueil / historique
  AddGame: undefined // le modal d’ajout de partie
  EditGame: { id: string } // édition d'une partie
  StatsMain: undefined // écran statistiques
  SettingsMain: undefined // écran réglages
}

// Routes du bottom-tabs
export type RootTabParamList = {
  HomeTab: undefined
  StatsTab: undefined
  SettingsTab: undefined
}
