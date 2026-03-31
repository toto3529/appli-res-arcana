import { useThemeStore } from "@stores/themeStore"
import { StyleSheet } from "react-native"

export const useAppStyles = () => {
  const isDark = useThemeStore((s) => s.isDark())

  // === COULEURS & THÈME ===
  const textMain = isDark ? "#fff" : "#000"
  const textSecondary = isDark ? "#ccc" : "#333"
  const background = isDark ? "#000" : "#fff"
  const blockBackground = isDark ? "#1e1e1e" : "#e5e5e5"
  const border = isDark ? "#444" : "#aaa"
  const separator = isDark ? "#888" : "#666"
  const label = isDark ? "#aaa" : "#444"
  const card = isDark ? "#1a1a1a" : "#eee"
  const inputBackground = isDark ? "#2a2a2a" : "#fff"

  // === COULEURS FIXES ===
  const gold = "#C9A84C"
  const win = "#4CAF50"
  const loss = "#e74c3c"
  const warning = "#f99"

  return StyleSheet.create({
    // === LAYOUT ===
    container: {
      padding: 16,
      backgroundColor: background,
      flexGrow: 1,
    },
    screenBackground: {
      flex: 1,
      backgroundColor: background,
      paddingTop: 32,
    },

    // === TYPOGRAPHIE ===
    titleGold: {
      fontSize: 28,
      fontWeight: "900",
      color: gold,
      letterSpacing: 6,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 4,
    },
    titleSection: {
      fontSize: 22,
      fontWeight: "900",
      color: gold,
      letterSpacing: 4,
      textTransform: "uppercase",
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      textAlign: "center",
      fontSize: 13,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 16,
      color: textSecondary,
    },
    textMain: {
      color: textMain,
      fontSize: 14,
    },
    textSecondary: {
      color: textSecondary,
      fontSize: 14,
    },
    warning: {
      color: warning,
      fontSize: 16,
      fontStyle: "italic",
      textAlign: "center",
    },

    // === TITRE SÉPARATEUR (Home) ===
    titleSeparator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      gap: 8,
    },
    titleLine: {
      height: 1,
      width: 60,
      backgroundColor: gold,
      opacity: 0.5,
    },
    titleDiamond: {
      color: gold,
      fontSize: 10,
      opacity: 0.8,
    },

    // === ADD / EDIT GAME ===
    formContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: background,
    },
    formLabel: {
      fontSize: 16,
      marginTop: 16,
      color: textMain,
      fontWeight: "600",
    },
    formDateText: {
      fontSize: 18,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: blockBackground,
      borderRadius: 8,
      marginTop: 4,
      alignSelf: "flex-start",
      color: textMain,
      borderWidth: 1,
      borderColor: border,
    },
    formInput: {
      borderWidth: 1,
      borderColor: border,
      backgroundColor: blockBackground,
      color: textMain,
      borderRadius: 8,
      padding: 12,
      marginTop: 4,
      fontSize: 16,
    },
    formButtonWrapper: {
      marginTop: 16,
    },

    // === MODAL ÉGALITÉ ===
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: blockBackground,
      padding: 24,
      borderRadius: 12,
      width: "80%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 16,
      color: gold,
      letterSpacing: 1,
    },
    modalOption: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: isDark ? "#2a2a2a" : "#fff",
      borderRadius: 8,
      marginVertical: 6,
      width: "100%",
      alignItems: "center",
      borderWidth: 1,
      borderColor: border,
    },
    modalOptionSelected: {
      backgroundColor: isDark ? "#3a2e0a" : "#f5e6c0",
      borderColor: gold,
    },
    modalOptionText: {
      fontSize: 16,
      color: textMain,
    },
    modalOptionTextSelected: {
      fontSize: 16,
      color: gold,
      fontWeight: "bold",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      width: "100%",
      gap: 12,
    },
    modalCancelButton: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: isDark ? "#2a2a2a" : "#fff",
      borderRadius: 8,
      alignItems: "center",
      borderWidth: 1,
      borderColor: border,
    },
    modalCancelText: {
      color: textMain,
      fontWeight: "bold",
    },
    modalOkButton: {
      flex: 1,
      paddingVertical: 12,
      backgroundColor: gold,
      borderRadius: 8,
      alignItems: "center",
    },
    modalOkText: {
      color: "#000",
      fontWeight: "bold",
    },
    confirmModalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: textMain,
      textAlign: "center",
    },
    confirmModalMessage: {
      fontSize: 14,
      color: textSecondary,
      textAlign: "center",
      marginBottom: 20,
    },

    // === BLOCS / CARDS ===
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
    blockLabel: {
      fontSize: 16,
      color: textMain,
      marginBottom: 8,
    },

    // === STATS - TABS ===
    statsContainer: {
      flex: 1,
      backgroundColor: background,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
      marginHorizontal: 16,
      borderWidth: 1,
      borderRadius: 8,
      overflow: "hidden",
      borderColor: border,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      backgroundColor: isDark ? "#222" : "#eaeaea",
    },
    tabButtonActive: {
      backgroundColor: gold,
    },
    tabText: {
      fontWeight: "bold",
      color: isDark ? "#ccc" : "#333",
    },
    tabTextActive: {
      fontWeight: "bold",
      color: "#000",
    },

    // === STATS - HISTORIQUE ===
    historyLetterRow: {
      flexDirection: "row",
      gap: 4,
      marginTop: 4,
    },

    // === LAYOUT ROWS / COLUMNS ===
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

    // === JOUEURS ===
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

    // === LABELS / VALUES ===
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

    // === HOME - LISTE DES PARTIES ===
    listWrapper: {
      flex: 1,
      overflow: "hidden",
    },
    rowFront: {
      marginHorizontal: 16,
      marginVertical: 6,
      height: 80,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: card,
    },
    rowFrontWinA: {
      borderLeftWidth: 4,
      borderLeftColor: win,
      borderRightWidth: 4,
      borderRightColor: loss,
    },
    rowFrontWinB: {
      borderLeftWidth: 4,
      borderLeftColor: loss,
      borderRightWidth: 4,
      borderRightColor: win,
    },
    rowFrontDraw: {
      borderLeftWidth: 4,
      borderLeftColor: gold,
      borderRightWidth: 4,
      borderRightColor: gold,
    },
    rowContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
    },
    playerBox: {
      width: "30%",
      alignItems: "center",
      justifyContent: "center",
    },
    scoreBox: {
      width: "40%",
      alignItems: "center",
      justifyContent: "center",
    },
    scoreText: {
      fontSize: 18,
      fontWeight: "bold",
      color: textMain,
    },
    dateText: {
      fontSize: 12,
      color: textSecondary,
      marginTop: 4,
    },
    rowBack: {
      position: "absolute",
      top: 6,
      bottom: 6,
      left: 16,
      right: 16,
      height: 80,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 4,
      overflow: "hidden",
    },
    editButton: {
      width: 80,
      height: 80,
      backgroundColor: win,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    editText: {
      color: "#fff",
      fontWeight: "bold",
    },
    deleteButton: {
      width: 80,
      height: 80,
      backgroundColor: loss,
      justifyContent: "center",
      alignItems: "center",
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
    deleteText: {
      color: "#fff",
      fontWeight: "bold",
    },

    // === FAB ===
    fab: {
      position: "absolute",
      bottom: 24,
      alignSelf: "center",
      left: "50%",
      marginLeft: -30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: gold,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
    },
    fabText: {
      fontSize: 32,
      color: "#000",
      fontWeight: "bold",
      lineHeight: 36,
    },

    // === BADGES V/D/N ===
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      marginTop: 4,
    },
    badgeWin: {
      backgroundColor: "#1a3a1a",
    },
    badgeLoss: {
      backgroundColor: "#3a1a1a",
    },
    badgeDraw: {
      backgroundColor: "#3a2e0a",
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    badgeTextWin: {
      color: win,
    },
    badgeTextLoss: {
      color: loss,
    },
    badgeTextDraw: {
      color: gold,
    },

    // === STATS - NAVIGATION MOIS ===
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
      color: textMain,
      textAlign: "center",
      lineHeight: 28,
    },
    monthLabel: {
      fontSize: 18,
      fontWeight: "bold",
      color: gold,
      letterSpacing: 2,
    },
    blocksWrapper: {
      gap: 10,
    },

    // === STATS - WIN RATE BAR ===
    winRateBar: {
      flexDirection: "row",
      height: 28,
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 10,
      marginBottom: 4,
    },
    winRateSegmentA: {
      backgroundColor: win,
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentDraw: {
      backgroundColor: gold,
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentB: {
      backgroundColor: loss,
      justifyContent: "center",
      alignItems: "center",
    },
    winRateSegmentText: {
      fontSize: 11,
      fontWeight: "bold",
      color: "#000",
    },

    // === STATS - HISTORIQUE ===
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
    historyLetterWin: {
      color: win,
      fontSize: 16,
      fontWeight: "bold",
    },
    historyLetterLoss: {
      color: loss,
      fontSize: 16,
      fontWeight: "bold",
    },
    historyLetterDraw: {
      color: gold,
      fontSize: 16,
      fontWeight: "bold",
    },

    // === STATS - PIE CHART ===
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
      color: textSecondary,
    },

    // === SETTINGS ===
    input: {
      borderRadius: 8,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: border,
      backgroundColor: inputBackground,
      color: textMain,
    },
    settingsButton: {
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 0,
    },
    settingsButtonPrimary: {
      backgroundColor: gold,
    },
    settingsButtonDanger: {
      backgroundColor: loss,
    },
    settingsButtonText: {
      fontWeight: "bold",
      fontSize: 14,
      color: "#000",
    },
    settingsButtonTextDanger: {
      fontWeight: "bold",
      fontSize: 14,
      color: "#000",
    },
    pathText: {
      color: textSecondary,
      fontSize: 12,
      marginTop: 8,
    },
  })
}
