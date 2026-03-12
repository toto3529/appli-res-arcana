import { useThemeStore } from "@stores/themeStore"
import { StyleSheet } from "react-native"

export const useStatsStyles = () => {
  const isDark = useThemeStore((s) => s.isDark())

  const textMain = isDark ? "#fff" : "#000"
  const textSecondary = isDark ? "#ccc" : "#333"
  const background = isDark ? "#000" : "#fff"
  const blockBackground = isDark ? "#1e1e1e" : "#e5e5e5"
  const border = isDark ? "#444" : "#aaa"
  const warning = "#f99"
  const separator = isDark ? "#888" : "#666"
  const label = isDark ? "#aaa" : "#444"

  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: background,
      flexGrow: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: "900",
      color: "#C9A84C",
      letterSpacing: 4,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 12,
    },
    warning: {
      color: warning,
      fontSize: 16,
      fontStyle: "italic",
      textAlign: "center",
    },
    block: {
      backgroundColor: blockBackground,
      padding: 12,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: border,
    },

    blockTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: textMain,
      marginBottom: 6,
    },

    blockSubtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: textSecondary,
      marginBottom: 2,
    },
    blockText: {
      color: textSecondary,
      fontSize: 14,
    },
    blockTextCenter: {
      color: textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 6,
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    column: {
      alignItems: "center",
      marginHorizontal: 12,
    },
    half: {
      flex: 1,
      alignItems: "center",
    },
    label: {
      color: textSecondary,
      fontSize: 14,
      marginBottom: 2,
    },
    value: {
      color: textMain,
      fontSize: 16,
      fontWeight: "bold",
    },
    separator: {
      color: separator,
      fontSize: 18,
      marginHorizontal: 8,
    },
    playerName: {
      color: label,
      fontSize: 14,
      marginBottom: 4,
    },
    playerValue: {
      color: textMain,
      fontSize: 16,
      fontWeight: "bold",
    },
    playerLabel: {
      fontWeight: "bold",
      color: label,
      marginBottom: 4,
    },
    playerStat: {
      alignItems: "center",
      flex: 1,
    },
    historyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 8,
    },
    historyColumn: {
      alignItems: "center",
      flex: 1,
    },
    historyText: {
      fontSize: 16,
      fontWeight: "bold",
      color: textMain,
      marginTop: 4,
    },
    monthSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    monthButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDark ? "#444" : "#ddd",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
    },
    monthButtonText: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
      textAlign: "center",
      lineHeight: 28,
    },
    monthLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#C9A84C",
      letterSpacing: 2,
    },
    blocksWrapper: {
      gap: 10,
    },
    winRateBar: {
      flexDirection: "row",
      height: 28,
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 10,
      marginBottom: 4,
    },
    winRateSegmentA: {
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentDraw: {
      backgroundColor: "#C9A84C",
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentB: {
      backgroundColor: "#e74c3c",
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#000",
    },
    historyLetterWin: {
      color: "#4CAF50",
      fontSize: 16,
      fontWeight: "bold",
    },
    historyLetterLoss: {
      color: "#e74c3c",
      fontSize: 16,
      fontWeight: "bold",
    },
    historyLetterDraw: {
      color: "#C9A84C",
      fontSize: 16,
      fontWeight: "bold",
    },
    pieContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    pieLegend: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginTop: 12,
    },
    pieLegendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    pieLegendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    pieLegendText: {
      fontSize: 12,
      color: "#ccc",
    },
  })
}
