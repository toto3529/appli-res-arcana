import { useThemeStore } from "@stores/themeStore"
import { StyleSheet } from "react-native"

export const useStatsStyles = () => {
  const { isDark } = useThemeStore()

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
      fontSize: 20,
      fontWeight: "bold",
      color: textMain,
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
    },
    monthButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: isDark ? "#444" : "#ccc",
      borderRadius: 8,
    },
    monthButtonText: {
      fontSize: 18,
      color: isDark ? "#fff" : "#000",
    },
    monthLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: textMain,
    },
    blocksWrapper: {
      gap: 10,
    },
  })
}
