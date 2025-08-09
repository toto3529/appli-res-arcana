import { useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
import { Game } from "@stores/gameStore"
import { calculateGlobalStats } from "@utils/statsHelpers"
import { useStatsStyles } from "./StatsScreen.styles"
import { usePlayerStore } from "@stores/playerStore"

interface Props {
  games: Game[]
}

export const GlobalStats = ({ games }: Props) => {
  const orderedGames = useMemo(() => [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [games])
  const stats = useMemo(() => calculateGlobalStats(orderedGames), [orderedGames])
  const sharedStyles = useStatsStyles()
  const { playerA, playerB } = usePlayerStore()

  if (games.length < 2) {
    return (
      <View style={sharedStyles.container}>
        <Text style={sharedStyles.title}>🌍 Stats globales</Text>
        <Text style={sharedStyles.blockText}>Encore trop peu de données pour le streak / moyenne.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <Text style={sharedStyles.title}>🌍 Stats globales</Text>

      {/* Plus grande série de victoires */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Plus grande série de victoire :</Text>
        <Text style={sharedStyles.blockText}>
          {playerA} : {stats.longestStreakA}
        </Text>
        <Text style={sharedStyles.blockText}>
          {playerB} : {stats.longestStreakB}
        </Text>
      </View>

      {/* Nombre total de parties + % victoires */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Nombre de parties : {stats.totalGames}</Text>
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerA}</Text>
            <Text style={sharedStyles.blockText}>{stats.rawRateA}%</Text>
          </View>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerB}</Text>
            <Text style={sharedStyles.blockText}>{stats.rawRateB}%</Text>
          </View>
        </View>
        <Text style={sharedStyles.blockTextCenter}>Matchs nuls : {stats.drawRate}%</Text>
      </View>

      {/* Moyenne de points */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Moyenne de points / partie</Text>
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerA}</Text>
            <Text style={sharedStyles.blockText}>{stats.avgScoreA} pts</Text>
          </View>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerB}</Text>
            <Text style={sharedStyles.blockText}>{stats.avgScoreB} pts</Text>
          </View>
        </View>
      </View>

      {/* Donut Chart Placeholder */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>📊 Donut répartitions V/D</Text>
        <Text style={sharedStyles.blockText}>[À intégrer plus tard]</Text>
      </View>

      {/* Meilleure victoire */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Meilleure victoire (écart)</Text>
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerA}</Text>
            <Text style={sharedStyles.blockText}>{stats.bestVictoryA}</Text>
          </View>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerB}</Text>
            <Text style={sharedStyles.blockText}>{stats.bestVictoryB}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
