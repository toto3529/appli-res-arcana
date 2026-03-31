import { useEffect, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, Platform, ScrollView } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { database } from "src/db/database"
import GameModel from "src/models/GameModel"
import { formatDateFr } from "@utils/formatDate"
import { usePlayerStore } from "@stores/playerStore"
import { useAppStyles } from "src/styles/useAppStyles"

type Props = NativeStackScreenProps<RootStackParamList, "EditGame">

export default function EditGameScreen({ route, navigation }: Props) {
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
  const styles = useAppStyles()

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

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      {/* Titre */}
      <Text style={styles.titleSection}>Modifier la partie</Text>

      {/* Date */}
      <Text style={styles.formLabel}>Date de la partie :</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.formDateText}>{formatDateFr(date, "eeee d MMMM yyyy")}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}

      {/* Heure */}
      <Text style={styles.formLabel}>Heure :</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text style={styles.formDateText}>{formatDateFr(date, "HH:mm")}</Text>
      </TouchableOpacity>
      {showTimePicker && <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} />}

      {/* Score A */}
      <Text style={styles.formLabel}>Score {playerA} :</Text>
      <TextInput style={styles.formInput} keyboardType="numeric" value={scoreA} onChangeText={setScoreA} placeholderTextColor={styles.label.color} />

      {/* Score B */}
      <Text style={styles.formLabel}>Score {playerB} :</Text>
      <TextInput style={styles.formInput} keyboardType="numeric" value={scoreB} onChangeText={setScoreB} placeholderTextColor={styles.label.color} />

      {/* Bouton Enregistrer */}
      <View style={styles.formButtonWrapper}>
        <TouchableOpacity style={[styles.settingsButton, styles.settingsButtonPrimary]} onPress={handleSubmit}>
          <Text style={styles.settingsButtonText}>Enregistrer les modifications</Text>
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
