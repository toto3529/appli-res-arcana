import { useState } from "react"
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform, Alert } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { usePlayerStore } from "src/store/playerStore"
import { useGameStore } from "src/store/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"

// Définition des props de navigation pour TypeScript
type Props = NativeStackScreenProps<RootStackParamList, "AddGame">

export default function AddGameScreen({ navigation }: Props) {
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

    try {
      // Appel au store (Zustand + WatermelonDB)
      await addGame({ date, scoreA: a, scoreB: b })
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

  return (
    <View style={styles.container}>
      {/* Label + déclencheur du picker de date */}
      <Text style={styles.label}>Date de la partie :</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginTop: 16,
  },
  dateText: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    width: 80,
  },
  buttonWrapper: {
    marginTop: 12,
  },
})
