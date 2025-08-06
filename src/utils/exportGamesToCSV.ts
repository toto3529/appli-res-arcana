import * as FileSystem from "expo-file-system"
import { Game } from "@stores/gameStore"
import { usePlayerStore } from "@stores/playerStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export const exportGamesToCSV = async (games: Game[]): Promise<string> => {
  try {
    // Récupération des noms des joueurs
    const playerA = usePlayerStore.getState().playerA
    const playerB = usePlayerStore.getState().playerB

    // Génération du nom de fichier avec la date
    const dateStr = format(new Date(), "yyyy-MM-dd", { locale: fr })
    const fileName = `res-arcana-games-${dateStr}.csv`
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    const csvHeader = "Date,Joueur A,Score A,Joueur B,Score B,Vainqueur\n"

    const csvRows = games.map((g) => {
      const date = new Date(g.date).toLocaleDateString("fr-FR")

      const winner =
        g.scoreA > g.scoreB
          ? playerA
          : g.scoreB > g.scoreA
            ? playerB
            : g.winnerOnTie === "A"
              ? playerA
              : g.winnerOnTie === "B"
                ? playerB
                : "Égalité parfaite"

      return `${date},${playerA},${g.scoreA},${playerB},${g.scoreB},${winner}`
    })

    const csvContent = csvHeader + csvRows.join("\n")

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    })

    return filePath
  } catch (error) {
    throw new Error("Erreur lors de l'export CSV : " + (error as Error).message)
  }
}
