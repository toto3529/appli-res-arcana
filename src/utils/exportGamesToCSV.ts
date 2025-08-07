import * as FileSystem from "expo-file-system"
import { Game } from "@stores/gameStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Alert } from "react-native"

export const exportGamesToCSV = async (games: Game[]): Promise<string | null> => {
  try {
    // Génération du nom de fichier avec la date
    const dateStr = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: fr })
    const fileName = `res-arcana-games-${dateStr}.csv`
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    const csvHeader = "ID,Date,Score A,Score B,Vainqueur\n"

    const filteredGames = games.filter((g) => g.id !== "__placeholder__")

    const csvRows = filteredGames.map((g) => {
      const date = new Date(g.date).toLocaleDateString("fr-FR")

      const winner =
        g.scoreA > g.scoreB ? "A" : g.scoreB > g.scoreA ? "B" : g.winnerOnTie === "A" ? "A" : g.winnerOnTie === "B" ? "B" : "Égalité parfaite"

      return `${g.id},${date},${g.scoreA},${g.scoreB},${winner}`
    })

    const csvContent = csvHeader + csvRows.join("\n")

    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    })

    Alert.alert("✅ Export terminé", `Fichier sauvegardé avec succès !\n\n📁 Chemin :\n${fileName}`)
    return filePath
  } catch (error) {
    Alert.alert("❌ Erreur export", (error as Error).message || "Une erreur est survenue lors de l'export CSV.")
    return null
  }
}
