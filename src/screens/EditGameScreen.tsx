import { useEffect, useState } from "react"
import { View, Text, TextInput, Button, StyleSheet, Alert, Modal, TouchableOpacity, Platform } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { database } from "src/db/database"
import GameModel from "src/models/GameModel"
import { useThemeStore } from "@stores/themeStore"
import { formatDateFr } from "@utils/formatDate"
import { usePlayerStore } from "@stores/playerStore"

type Props = NativeStackScreenProps<RootStackParamList, "EditGame">

export default function EditGameScreen({ route, navigation }: Props) {
  const isDark = useThemeStore((s) => s.isDark())
  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    inputBg: isDark ? "#222" : "#eee",
    inputBorder: isDark ? "#444" : "#ccc",
    modalBg: isDark ? "#1a1a1a" : "#fff",
    modalText: isDark ? "#fff" : "#333",
    overlay: "rgba(0,0,0,0.5)",
  }

  const { id } = route.params
  const [game, setGame] = useState<GameModel | null>(null)
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [scoreA, setScoreA] = useState("")
  const [scoreB, setScoreB] = useState("")
  const [winnerOnTie, setWinnerOnTie] = useState<"A" | "B" | "draw" | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { playerA, playerB } = usePlayerStore()

  useEffect(() => {
    const load = async () => {
      const collection = database.get<GameModel>("games")
      const found = await collection.find(id)
      setGame(found)
      setDate(found.date)
      setScoreA(found.scoreA.toString())
      setScoreB(found.scoreB.toString())
      setWinnerOnTie(found.winnerOnTie ?? null)
    }

    load().catch((e) => {
      console.error("❌ Erreur chargement partie", e)
      Alert.alert("Erreur", "Impossible de charger la partie.")
      navigation.goBack()
    })
  }, [id])

  useEffect(() => {
    const a = parseInt(scoreA, 10)
    const b = parseInt(scoreB, 10)
    if (!isNaN(a) && !isNaN(b) && a !== b && winnerOnTie !== null) {
      setWinnerOnTie(null)
    }
  }, [scoreA, scoreB])

  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios")
    if (selected) {
      const d = new Date(date)
      d.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate())
      setDate(d)
    }
  }

  const onChangeTime = (_: any, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios")
    if (selected) {
      const d = new Date(date)
      d.setHours(selected.getHours(), selected.getMinutes(), 0, 0)
      setDate(d)
    }
  }

  const handleSubmit = async () => {
    if (!game) return

    const a = parseInt(scoreA, 10)
    const b = parseInt(scoreB, 10)

    if (isNaN(a) || isNaN(b)) {
      Alert.alert("Erreur", "Veuillez entrer des scores valides.")
      return
    }

    // Égalité sans décision -> demander via modale
    if (a === b && winnerOnTie === null) {
      setIsModalVisible(true)
      return
    }

    await database.write(async () => {
      await game.update((g) => {
        g.date = date
        g.scoreA = a
        g.scoreB = b
        g.winnerOnTie = a === b ? winnerOnTie : null
      })
    })

    Alert.alert("✅ Modifié", "La partie a bien été mise à jour.")
    navigation.goBack()
  }
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.background },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, color: colors.text },
    label: { fontSize: 16, marginTop: 12, color: colors.text },
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
      padding: 8,
      borderRadius: 6,
      marginTop: 4,
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
      <Text style={styles.title}>Modifier la partie</Text>

      {/* Date */}
      <Text style={styles.label}>Date de la partie :</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{formatDateFr(date, "eeee d MMMM yyyy")}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      {/* Heure */}
      <Text style={[styles.label, { marginTop: 8 }]}>Heure :</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text style={styles.dateText}>{formatDateFr(date, "HH:mm")}</Text>
      </TouchableOpacity>
      {showTimePicker && <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} />}

      {/* Scores */}
      <Text style={styles.label}>Score {playerA} :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreA} onChangeText={setScoreA} />

      <Text style={styles.label}>Score {playerB} :</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={scoreB} onChangeText={setScoreB} />

      <View style={styles.buttonWrapper}>
        <Button title="Enregistrer les modifications" onPress={handleSubmit} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Annuler" onPress={() => navigation.goBack()} />
      </View>

      {/* Modale égalité */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Qui a le plus d'essences ?</Text>

            {/* Options de sélection */}
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

            {/* Boutons de validation */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setWinnerOnTie(null)
                  setIsModalVisible(false)
                }}
              >
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
