import { StyleSheet } from "react-native"

export const sharedStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#000",
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  warning: {
    color: "#f99",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
  block: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  blockSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ccc",
    marginBottom: 2,
  },
  blockText: {
    color: "#ccc",
    fontSize: 14,
  },
  blockTextCenter: {
    color: "#ccc",
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
    color: "#ccc",
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 8,
  },
  playerName: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  playerValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  playerLabel: {
    fontWeight: "bold",
    color: "#aaa",
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
    color: "#fff",
    marginTop: 4,
  },
})
