import { useState, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, Platform, Alert, Modal, ScrollView } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { usePlayerStore } from "@stores/playerStore"
import { useGameStore } from "@stores/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { useThemeStore } from "@stores/themeStore"
import { formatDateFr } from "@utils/formatDate"
import { useFocusEffect } from "@react-navigation/native"
import { useAppStyles } from "src/styles/useAppStyles"

// Définition des props de navigation pour TypeScript
type Props = NativeStackScreenProps<RootStackParamList, "AddGame">

export default function AddGameScreen({ navigation }: Props) {
  const isDark = useThemeStore((s) => s.isDark())

  // On récupère les noms de joueurs depuis le store persistant
  const playerA = usePlayerStore((s) => s.playerA)
  const playerB = usePlayerStore((s) => s.playerB)

  // La fonction pour ajouter une partie dans le store (et en BDD)
  const addGame = useGameStore((s) => s.addGame)

  const styles = useAppStyles()

  // --- États locaux du composant ---
  // date : la date sélectionnée (initialisée à aujourd’hui)
  const [date, setDate] = useState<Date>(new Date())
  // showPicker : contrôle l’affichage du DateTimePicker
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)
  // scoreA / scoreB : saisies utilisateurs (chaînes, pour TextInput)
  const [scoreA, setScoreA] = useState<string>("")
  const [scoreB, setScoreB] = useState<string>("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [winnerOnTie, setWinnerOnTie] = useState<"A" | "B" | "draw" | null>(null)

  useFocusEffect(
    useCallback(() => {
      setDate(new Date())
      setScoreA("")
      setScoreB("")
      setWinnerOnTie(null)
      setIsModalVisible(false)
      setShowPicker(false)
      setShowTimePicker(false)
    }, []),
  )

  const onChangeDate = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios")
    if (selectedDate) {
      const d = new Date(date)
      d.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      setDate(d)
    }
  }

  // Mets à jour jeure/minutes
  const onChangeTime = (_event: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios")
    if (selected) {
      const d = new Date(date)
      d.setHours(selected.getHours(), selected.getMinutes(), 0, 0)
      setDate(d)
    }
  }

  /**
   * handleSubmit :
   * - convertit les scores en entiers
   * - contrôle que ce sont des nombres valides
   * - appelle addGame pour persister la partie
   * - navigue vers l’écran History ou revient en arrière
   */
  const handleSubmit = async () => {
    const a = parseInt(scoreA, 10)
    const b = parseInt(scoreB, 10)

    // Vérification basique : scores valides ?
    if (isNaN(a) || isNaN(b)) {
      Alert.alert("Erreur", "Veuillez saisir deux scores valides.")
      return
    }

    // Egalité des scores
    if (scoreA === scoreB && winnerOnTie === null) {
      // Égalité, mais pas encore de choix sur les essences
      setIsModalVisible(true)
      return
    }

    try {
      // Appel au store (Zustand + WatermelonDB)
      await addGame({
        date,
        scoreA: a,
        scoreB: b,
        winnerOnTie: a === b ? winnerOnTie : null,
      })
      navigation.goBack() // revient à l'écran précédent
    } catch (error) {
      console.error("Erreur ajout partie :", error)
      Alert.alert("Erreur", "Impossible d'ajouter la partie. Réessayez.")
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Titre */}
      <Text style={styles.titleSection}>Ajouter une partie</Text>

      {/* Date */}
      <Text style={styles.formLabel}>Date de la partie :</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.formDateText}>{formatDateFr(date, "eeee d MMMM yyyy")}</Text>
      </TouchableOpacity>
      {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      {/* Heure */}
      <Text style={styles.formLabel}>Heure :</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text style={styles.formDateText}>{formatDateFr(date, "HH:mm")}</Text>
      </TouchableOpacity>
      {showTimePicker && <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} />}

      {/* Score A */}
      <Text style={styles.formLabel}>{playerA} – Score :</Text>
      <TextInput
        style={styles.formInput}
        keyboardType="numeric"
        value={scoreA}
        onChangeText={setScoreA}
        placeholder="0"
        placeholderTextColor={styles.label.color}
      />

      {/* Score B */}
      <Text style={styles.formLabel}>{playerB} – Score :</Text>
      <TextInput
        style={styles.formInput}
        keyboardType="numeric"
        value={scoreB}
        onChangeText={setScoreB}
        placeholder="0"
        placeholderTextColor={styles.label.color}
      />

      {/* Bouton Ajouter */}
      <View style={styles.formButtonWrapper}>
        <TouchableOpacity
          style={[styles.settingsButton, styles.settingsButtonPrimary, { opacity: !scoreA.trim() || !scoreB.trim() ? 0.5 : 1 }]}
          onPress={handleSubmit}
          disabled={!scoreA.trim() || !scoreB.trim()}
        >
          <Text style={styles.settingsButtonText}>Ajouter la partie</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Annuler */}
      <View style={styles.formButtonWrapper}>
        <TouchableOpacity style={[styles.settingsButton, styles.settingsButtonDanger]} onPress={() => navigation.goBack()}>
          <Text style={styles.settingsButtonTextDanger}>Annuler</Text>
        </TouchableOpacity>
      </View>

      {/* Modal égalité */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Qui a le plus d'essences ?</Text>

            {["A", "B", "draw"].map((value) => {
              const label = value === "A" ? playerA : value === "B" ? playerB : "Égalité parfaite"
              const selected = winnerOnTie === value
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setWinnerOnTie(value as "A" | "B" | "draw")}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                >
                  <Text style={selected ? styles.modalOptionTextSelected : styles.modalOptionText}>{label}</Text>
                </TouchableOpacity>
              )
            })}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setWinnerOnTie(null)
                  setIsModalVisible(false)
                }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOkButton, { opacity: winnerOnTie === null ? 0.5 : 1 }]}
                onPress={() => {
                  setIsModalVisible(false)
                  handleSubmit()
                }}
                disabled={winnerOnTie === null}
              >
                <Text style={styles.modalOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
