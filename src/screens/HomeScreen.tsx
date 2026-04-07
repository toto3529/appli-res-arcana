import { useCallback, useRef, useState } from "react"
import { View, Text, TouchableOpacity, LayoutAnimation } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view"
import { format } from "date-fns"
import { useGameStore } from "@stores/gameStore"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "src/navigation/types"
import { usePlayerStore } from "@stores/playerStore"
import { useAppStyles } from "src/styles/useAppStyles"
import ConfirmModal from "@components/ConfirmModal"

type Props = NativeStackScreenProps<RootStackParamList, "HomeMain">

export default function HomeScreen({ navigation }: Props) {
  const rawGames = useGameStore((state) => state.games)
  const games = rawGames.filter((g) => g.id !== "__placeholder__")
  const loadGames = useGameStore((s) => s.loadGames)
  const deleteGame = useGameStore((s) => s.deleteGame)
  const listRef = useRef<SwipeListView<any>>(null)
  const openRowRef = useRef<SwipeRow<any> | null>(null)
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null)
  const { playerA, playerB } = usePlayerStore()
  const styles = useAppStyles()

  useFocusEffect(
    useCallback(() => {
      loadGames()
    }, [loadGames]),
  )

  const handleEdit = (id: string, rowMap: { [key: string]: SwipeRow<any> }) => {
    const rowRef = rowMap[id]
    if (rowRef) rowRef.closeRow() // ← Ferme le swipe si encore ouvert
    navigation.navigate("EditGame", { id })
  }

  const confirmDelete = (id: string) => {
    setDeleteModalId(id)
  }

  // On trie & slice les 20 dernières parties
  const data = [...games]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 20)
    .map((item) => ({ key: item.id, ...item }) as any) // SwipeListView exige un champ `key`

  return (
    <View style={styles.screenBackground}>
      <Text style={styles.titleGold}>RES ARCANA</Text>
      <View style={styles.titleSeparator}>
        <View style={styles.titleLine} />
        <Text style={styles.titleDiamond}>◆</Text>
        <View style={styles.titleLine} />
      </View>
      <Text style={styles.subtitle}>Dernières parties</Text>

      <View style={styles.listWrapper}>
        <SwipeListView
          ref={listRef}
          data={data}
          bounces={false}
          keyExtractor={(item) => item.key}
          leftOpenValue={80}
          rightOpenValue={-80}
          contentContainerStyle={{ paddingBottom: 100 }}
          onRowOpen={(rowKey, rowMap) => {
            if (openRowRef.current && openRowRef.current !== rowMap[rowKey]) {
              openRowRef.current.closeRow()
            }
            openRowRef.current = rowMap[rowKey]
          }}
          renderItem={({ item }) => {
            let winA: boolean | null = item.scoreA > item.scoreB
            const draw = item.scoreA === item.scoreB

            if (draw && item.winnerOnTie === "A") winA = true
            else if (draw && item.winnerOnTie === "B") winA = false
            else if (draw && item.winnerOnTie === "draw") winA = null

            return (
              <TouchableOpacity
                style={[styles.rowFront, winA === true ? styles.rowFrontWinA : winA === false ? styles.rowFrontWinB : styles.rowFrontDraw]}
                activeOpacity={1}
              >
                <View style={styles.rowContent}>
                  {/* Joueur A */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
                      {playerA}
                    </Text>
                    <View style={[styles.badge, winA === true ? styles.badgeWin : winA === false ? styles.badgeLoss : styles.badgeDraw]}>
                      <Text
                        style={[styles.badgeText, winA === true ? styles.badgeTextWin : winA === false ? styles.badgeTextLoss : styles.badgeTextDraw]}
                      >
                        {winA === true ? "Victory" : winA === false ? "Defeat" : "Draw"}
                      </Text>
                    </View>
                  </View>

                  {/* Score */}
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>
                      {item.scoreA} – {item.scoreB}
                    </Text>
                    <Text style={styles.dateText}>{format(item.date, "dd/MM/yyyy")}</Text>
                  </View>

                  {/* Joueur B */}
                  <View style={styles.playerBox}>
                    <Text style={styles.playerName} numberOfLines={1} ellipsizeMode="tail">
                      {playerB}
                    </Text>
                    <View style={[styles.badge, winA === false ? styles.badgeWin : winA === true ? styles.badgeLoss : styles.badgeDraw]}>
                      <Text
                        style={[styles.badgeText, winA === false ? styles.badgeTextWin : winA === true ? styles.badgeTextLoss : styles.badgeTextDraw]}
                      >
                        {winA === false ? "Victory" : winA === true ? "Defeat" : "Draw"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          renderHiddenItem={({ item }, rowMap) => (
            <View style={styles.rowBack}>
              {/* Swipe gauche (Éditer) */}
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.key, rowMap)}>
                <Text style={styles.editText}>Éditer</Text>
              </TouchableOpacity>

              {/* Swipe droite (Supprimer) */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.key)}>
                <Text style={styles.deleteText}>Suppr</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AddGame")}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
      <ConfirmModal
        visible={deleteModalId !== null}
        title="Supprimer la partie"
        message="Voulez-vous vraiment supprimer cette partie ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        danger={true}
        onConfirm={() => {
          if (deleteModalId) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            deleteGame(deleteModalId)
          }
          setDeleteModalId(null)
        }}
        onCancel={() => setDeleteModalId(null)}
      />
    </View>
  )
}
