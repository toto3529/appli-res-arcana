import { View, Text } from "react-native"
import { useMemo } from "react"
import { Game } from "@stores/gameStore"

interface Props {
  games: Game[]
}

export default function GlobalStats({ games }: Props) {
  const total = games.length

  const stats = useMemo(() => {
    let winsA = 0
    let winsB = 0
    let draws = 0
    let totalPoints = 0
    let bestDiffA = 0
    let bestDiffB = 0

    let streakA = 0
    let maxStreakA = 0
    let streakB = 0
    let maxStreakB = 0

    games.forEach((g) => {
      totalPoints += g.scoreA + g.scoreB
      const diff = Math.abs(g.scoreA - g.scoreB)

      let winner: "A" | "B" | "equal" = "equal"
      if (g.scoreA > g.scoreB || (g.scoreA === g.scoreB && g.winnerOnTie === "A")) {
        winner = "A"
      } else if (g.scoreB > g.scoreA || (g.scoreA === g.scoreB && g.winnerOnTie === "B")) {
        winner = "B"
      }

      if (winner === "A") {
        winsA++
        streakA++
        streakB = 0
        bestDiffA = Math.max(bestDiffA, diff)
      } else if (winner === "B") {
        winsB++
        streakB++
        streakA = 0
        bestDiffB = Math.max(bestDiffB, diff)
      } else {
        draws++
        streakA = 0
        streakB = 0
      }

      maxStreakA = Math.max(maxStreakA, streakA)
      maxStreakB = Math.max(maxStreakB, streakB)
    })

    const avgPoints = total > 0 ? totalPoints / total : 0

    return {
      winsA,
      winsB,
      draws,
      avgPoints,
      bestDiffA,
      bestDiffB,
      maxStreakA,
      maxStreakB,
    }
  }, [games])

  if (total < 5) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Encore trop peu de données pour le streak / average.</Text>
      </View>
    )
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>🌍 Stats Globales</Text>
      <Text>Nombre total de parties : {total}</Text>
      <Text>% Victoires Joueur A : {((stats.winsA / total) * 100).toFixed(1)}%</Text>
      <Text>% Victoires Joueur B : {((stats.winsB / total) * 100).toFixed(1)}%</Text>
      <Text>% Égalités : {((stats.draws / total) * 100).toFixed(1)}%</Text>
      <Text>Moyenne de points par partie : {stats.avgPoints.toFixed(1)}</Text>
      <Text>Meilleure victoire Joueur A (écart) : {stats.bestDiffA}</Text>
      <Text>Meilleure victoire Joueur B (écart) : {stats.bestDiffB}</Text>
      <Text>Plus grande série de victoires Joueur A : {stats.maxStreakA}</Text>
      <Text>Plus grande série de victoires Joueur B : {stats.maxStreakB}</Text>
    </View>
  )
}
