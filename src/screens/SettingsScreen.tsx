import { View, Text, ScrollView, Switch, Alert, TextInput, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useThemeStore } from "@stores/themeStore"
import { useGameStore } from "@stores/gameStore"
import { usePlayerStore } from "@stores/playerStore"
import { exportGamesToCSV } from "@utils/exportGamesToCSV"
import { importGamesFromCSV } from "@utils/importGamesFromCSV"
import { useCallback, useEffect, useState } from "react"
import { getCurrentSafDir, resetSafLocation } from "@utils/safStorage"
import { useFocusEffect } from "@react-navigation/native"
import { useAppStyles } from "src/styles/useAppStyles"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const isDark = useThemeStore((s) => s.isDark())
  const setMode = useThemeStore((s) => s.setMode)
  const resetStats = useGameStore((s) => s.resetStats)
  const rawGames = useGameStore((state) => state.games)
  const games = rawGames.filter((g) => g.id !== "__placeholder__")
  const playerA = usePlayerStore((s) => s.playerA)
  const playerB = usePlayerStore((s) => s.playerB)
  const setPlayerA = usePlayerStore((s) => s.setPlayerA)
  const setPlayerB = usePlayerStore((s) => s.setPlayerB)
  const [currentPath, setCurrentPath] = useState<string | null>(null)
  const styles = useAppStyles()

  useEffect(() => {
    getCurrentSafDir().then(setCurrentPath)
  }, [])

  useFocusEffect(
    useCallback(() => {
      getCurrentSafDir().then(setCurrentPath)
    }, []),
  )

  const toggleTheme = () => {
    setMode(isDark ? "light" : "dark")
  }

  const handleResetStats = () => {
    Alert.alert("Confirmation", "Voulez-vous vraiment supprimer toutes les statistiques ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          await resetStats()
          Alert.alert("✅ Terminé", "Toutes les parties ont été supprimées.")
        },
      },
    ])
  }

  const handleResetFolder = async () => {
    await resetSafLocation()
    setCurrentPath(null)
    Alert.alert("Réinitialisé", "Le dossier de sauvegarde sera redemandé au prochain export.")
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Titre */}
      <Text style={styles.titleSection}>⚙️ Settings</Text>

      {/* Bloc 1 - Thème */}
      <View style={styles.block}>
        <View style={styles.rowBetween}>
          <Text style={styles.blockLabel}>{isDark ? "🌙 Mode sombre" : "☀️ Mode clair"}</Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Bloc 2 - Joueurs */}
      <View style={styles.block}>
        <Text style={styles.blockLabel}>👤 Nom des joueurs</Text>
        <TextInput placeholder="Joueur A" placeholderTextColor={styles.label.color} value={playerA} onChangeText={setPlayerA} style={styles.input} />
        <TextInput placeholder="Joueur B" placeholderTextColor={styles.label.color} value={playerB} onChangeText={setPlayerB} style={styles.input} />
      </View>

      {/* Bloc 3 - Import CSV */}
      <View style={styles.block}>
        <TouchableOpacity style={[styles.settingsButton, styles.settingsButtonPrimary]} onPress={async () => await importGamesFromCSV()}>
          <Text style={styles.settingsButtonText}>📥 Import save (.csv)</Text>
        </TouchableOpacity>
      </View>

      {/* Bloc 4 - Export CSV */}
      <View style={styles.block}>
        <TouchableOpacity
          style={[styles.settingsButton, styles.settingsButtonPrimary]}
          onPress={async () => {
            const dir = await exportGamesToCSV(games)
            if (dir) setCurrentPath(dir)
          }}
        >
          <Text style={styles.settingsButtonText}>📤 Export save (.csv)</Text>
        </TouchableOpacity>
      </View>

      {/* Bloc 5 - Reset dossier */}
      <View style={styles.block}>
        <TouchableOpacity style={[styles.settingsButton, styles.settingsButtonDanger]} onPress={handleResetFolder}>
          <Text style={styles.settingsButtonTextDanger}>♻️ Réinitialiser dossier</Text>
        </TouchableOpacity>
        <Text style={styles.pathText}>{currentPath ? decodeURIComponent(currentPath) : "Aucun dossier défini"}</Text>
      </View>

      {/* Bloc 6 - Reset stats */}
      <View style={styles.block}>
        <TouchableOpacity style={[styles.settingsButton, styles.settingsButtonDanger]} onPress={handleResetStats}>
          <Text style={styles.settingsButtonTextDanger}>🗑️ Reset stats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
