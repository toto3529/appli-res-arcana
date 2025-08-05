import { useState } from "react"
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform, Alert, Modal } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { usePlayerStore } from "@stores/playerStore"
import { useGameStore } from "@stores/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { useThemeStore } from "@stores/themeStore"
import { formatDateFr } from "@utils/formatDate"

// Définition des props de navigation pour TypeScript
type Props = NativeStackScreenProps<RootStackParamList, "AddGame">

export default function AddGameScreen({ navigation }: Props) {
  const isDark = useThemeStore((s) => s.isDark())

  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    inputBg: isDark ? "#222" : "#eee",
    inputBorder: isDark ? "#444" : "#ccc",
    buttonBg: isDark ? "#111" : "#fff",
    modalBg: isDark ? "#1a1a1a" : "#fff",
    modalText: isDark ? "#fff" : "#333",
    overlay: "rgba(0,0,0,0.5)",
  }

  // On récupère les noms de joueurs depuis le store persistant
  const playerA = usePlayerStore((s) => s.playerA)
  const playerB = usePlayerStore((s) => s.playerB)

  // La fonction pour ajouter une partie dans le store (et en BDD)
  const addGame = useGameStore((s) => s.addGame)

  // --- États locaux du composant ---
  // date : la date sélectionnée (initialisée à aujourd’hui)
  const [date, setDate] = useState<Date>(new Date())
  // showPicker : contrôle l’affichage du DateTimePicker
  const [showPicker, setShowPicker] = useState<boolean>(false)
  // scoreA / scoreB : saisies utilisateurs (chaînes, pour TextInput)
  const [scoreA, setScoreA] = useState<string>("")
  const [scoreB, setScoreB] = useState<string>("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [winnerOnTie, setWinnerOnTie] = useState<"A" | "B" | "equal" | null>(null)

  /**
   * onChangeDate :
   * - callback appelé par le DateTimePicker
   * - cache le picker sur Android (iOS le garde ouvert si Platform.OS==='ios')
   * - met à jour la date si l’utilisateur a choisi une valeur
   */
  const onChangeDate = (_event: any, selectedDate?: Date) => {
    // Sur Android, masquer le picker dès qu’une date est choisie ou qu’on annule
    setShowPicker(Platform.OS === "ios")
    if (selectedDate) {
      setDate(selectedDate)
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
  /**
   * handleCancel : annule l'ajout et retourne à l'écran précédent
   */
  const handleCancel = () => {
    navigation.goBack()
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: 16,
      marginTop: 16,
      color: colors.text,
    },
    dateText: {
      fontSize: 18,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.inputBg,
      borderRadius: 4,
      marginTop: 4,
      alignSelf: "flex-start",
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderRadius: 4,
      padding: 8,
      marginTop: 4,
      width: 80,
    },
    buttonWrapper: {
      marginTop: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: colors.modalBg,
      padding: 24,
      borderRadius: 8,
      width: "80%",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      color: colors.text,
    },
    modalOption: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.inputBg,
      borderRadius: 4,
      marginVertical: 6,
      width: "100%",
      alignItems: "center",
    },
    modalOptionSelected: {
      backgroundColor: "#007BFF",
    },
    modalOptionText: {
      fontSize: 16,
      color: colors.modalText,
    },
    modalOptionTextSelected: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      width: "100%",
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#ccc",
      borderRadius: 4,
    },
    cancelText: {
      color: "#333",
      fontWeight: "bold",
    },
    okButton: {
      paddingVertical: 10,
      paddingHorizontal: 32,
      backgroundColor: "#007BFF",
      borderRadius: 4,
    },
    okText: {
      color: "#fff",
      fontWeight: "bold",
    },
  })

  return (
    <View style={styles.container}>
      {/* Label + déclencheur du picker de date */}
      <Text style={styles.label}>Date de la partie :</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{formatDateFr(date, "eeee d MMMM yyyy")}</Text>
      </TouchableOpacity>

      {/* DateTimePicker natif (iOS & Android) */}
      {showPicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      {/* Saisie du score pour le joueur A */}
      <Text style={styles.label}>{playerA || "Joueur A"} – Score :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreA} onChangeText={setScoreA} placeholder="" />

      {/* Saisie du score pour le joueur B */}
      <Text style={styles.label}>{playerB || "Joueur B"} – Score :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreB} onChangeText={setScoreB} placeholder="" />

      {/* Bouton de validation, désactivé si l’un des champs est vide */}
      <View style={styles.buttonWrapper}>
        <Button title="Ajouter la partie" onPress={handleSubmit} disabled={!scoreA.trim() || !scoreB.trim()} />
      </View>

      {/* Bouton Annuler : revient à l’écran précédent */}
      <View style={styles.buttonWrapper}>
        <Button title="Annuler" onPress={handleCancel} />
      </View>
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Qui a le plus d'essences ?</Text>
            {/* Options de sélection */}
            {["A", "B", "equal"].map((value) => {
              const label = value === "A" ? playerA : value === "B" ? playerB : "Égalité parfaite"
              const selected = winnerOnTie === value
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setWinnerOnTie(value as "A" | "B" | "equal")}
                  style={[styles.modalOption, selected && styles.modalOptionSelected]}
                >
                  <Text style={selected ? styles.modalOptionTextSelected : styles.modalOptionText}>{label}</Text>
                </TouchableOpacity>
              )
            })}

            {/* Boutons de validation */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.okButton, { opacity: winnerOnTie === null ? 0.5 : 1 }]}
                onPress={() => {
                  setIsModalVisible(false)
                  handleSubmit()
                }}
                disabled={winnerOnTie === null}
              >
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
