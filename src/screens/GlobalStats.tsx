import { useMemo } from "react"
import { View, Text, ScrollView } from "react-native"
import { Game } from "@stores/gameStore"
import { calculateGlobalStats } from "@utils/statsHelpers"
import { useAppStyles } from "src/styles/useAppStyles"
import { usePlayerStore } from "@stores/playerStore"
import { useThemeStore } from "@stores/themeStore"
import PieChart from "@components/PieChart"

interface Props {
  games: Game[]
}

export const GlobalStats = ({ games }: Props) => {
  const orderedGames = useMemo(() => [...games].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [games])
  const stats = useMemo(() => calculateGlobalStats(orderedGames), [orderedGames])
  const styles = useAppStyles()
  const { playerA, playerB } = usePlayerStore()
  const isDark = useThemeStore((s) => s.isDark())

  if (games.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.titleSection}>Stats globales</Text>
        <Text style={styles.blockText}>Encore trop peu de données pour le streak / moyenne.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titleSection}>Stats globales</Text>

      {/* Plus grande série de victoires */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Plus grande série de victoire :</Text>
        <Text style={styles.blockText}>
          {playerA} : {stats.longestStreakA}
        </Text>
        <Text style={styles.blockText}>
          {playerB} : {stats.longestStreakB}
        </Text>
      </View>

      {/* Nombre total de parties */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Nombre de parties : {stats.totalGames}</Text>
        <View style={styles.winRateBar}>
          {stats.rawRateA > 0 && (
            <View style={[styles.winRateSegmentA, { flex: stats.rawRateA }]}>
              <Text style={styles.winRateSegmentText}>{stats.winA}</Text>
            </View>
          )}
          {stats.drawRate > 0 && (
            <View style={[styles.winRateSegmentDraw, { flex: stats.drawRate }]}>
              <Text style={styles.winRateSegmentText}>{stats.draws}</Text>
            </View>
          )}
          {stats.rawRateB > 0 && (
            <View style={[styles.winRateSegmentB, { flex: stats.rawRateB }]}>
              <Text style={styles.winRateSegmentText}>{stats.winB}</Text>
            </View>
          )}
        </View>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>
              {playerA} : {stats.winA} victoires
            </Text>
          </View>
          <View style={styles.half}>
            <Text style={[styles.label, { textAlign: "right" }]}>
              {playerB} : {stats.winB} victoires
            </Text>
          </View>
        </View>
      </View>

      {/* Moyenne de points */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Moyenne de points / partie</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.blockSubtitle}>{playerA}</Text>
            <Text style={styles.blockText}>{stats.avgScoreA} pts</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.blockSubtitle}>{playerB}</Text>
            <Text style={styles.blockText}>{stats.avgScoreB} pts</Text>
          </View>
        </View>
      </View>

      {/* Répartition V/D */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Répartition Victoires / Défaites</Text>
        <View style={styles.pieContainer}>
          <PieChart valueA={stats.rawRateA} valueB={stats.rawRateB} valueDraw={stats.drawRate} labelA={playerA} labelB={playerB} isDark={isDark} />
        </View>
      </View>

      {/* Meilleure victoire */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Meilleure victoire (écart)</Text>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.blockSubtitle}>{playerA}</Text>
            <Text style={styles.blockText}>+{stats.bestVictoryA}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.blockSubtitle}>{playerB}</Text>
            <Text style={styles.blockText}>+{stats.bestVictoryB}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
