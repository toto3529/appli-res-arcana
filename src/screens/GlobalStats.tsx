import { useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
import { Game } from "@stores/gameStore"
import { calculateGlobalStats } from "@utils/statsHelpers"
import { useStatsStyles } from "./StatsScreen.styles"
import { usePlayerStore } from "@stores/playerStore"
import PieChart from "@components/PieChart"

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
        <Text style={sharedStyles.title}>Stats globales</Text>
        <Text style={sharedStyles.blockText}>Encore trop peu de données pour le streak / moyenne.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <Text style={sharedStyles.title}>Stats globales</Text>

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

        <View style={sharedStyles.winRateBar}>
          {stats.rawRateA > 0 && (
            <View style={[sharedStyles.winRateSegmentA, { flex: stats.rawRateA }]}>
              <Text style={sharedStyles.winRateSegmentText}>{stats.rawRateA}%</Text>
            </View>
          )}
          {stats.drawRate > 0 && (
            <View style={[sharedStyles.winRateSegmentDraw, { flex: stats.drawRate }]}>
              <Text style={sharedStyles.winRateSegmentText}>{stats.drawRate}%</Text>
            </View>
          )}
          {stats.rawRateB > 0 && (
            <View style={[sharedStyles.winRateSegmentB, { flex: stats.rawRateB }]}>
              <Text style={sharedStyles.winRateSegmentText}>{stats.rawRateB}%</Text>
            </View>
          )}
        </View>

        <View style={sharedStyles.row}>
          <View style={sharedStyles.half}>
            <Text style={sharedStyles.label}>{playerA}</Text>
          </View>
          <View style={sharedStyles.half}>
            <Text style={[sharedStyles.label, { textAlign: "right" }]}>{playerB}</Text>
          </View>
        </View>
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

      {/* Donut Répartitions Victoires / Défaites */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Répartition Victoires / Défaites</Text>
        <View style={sharedStyles.pieContainer}>
          <PieChart valueA={stats.rawRateA} valueB={stats.rawRateB} valueDraw={stats.drawRate} labelA={playerA} labelB={playerB} />
        </View>
      </View>

      {/* Meilleure victoire */}
      <View style={sharedStyles.block}>
        <Text style={sharedStyles.blockTitle}>Meilleure victoire (écart)</Text>
        <View style={sharedStyles.row}>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerA}</Text>
            <Text style={sharedStyles.playerValue}>+ {stats.bestVictoryA} pts</Text>
          </View>
          <View style={sharedStyles.column}>
            <Text style={sharedStyles.blockSubtitle}>{playerB}</Text>
            <Text style={sharedStyles.playerValue}>+ {stats.bestVictoryB} pts</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
