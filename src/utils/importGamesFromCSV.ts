import { parse } from "date-fns"
import { fr } from "date-fns/locale"
import * as FileSystem from "expo-file-system"
import { database } from "src/db/database"
import GameModel from "src/models/GameModel"
import { generateUUID } from "./uuid"
import { Alert } from "react-native"

export const importGamesFromCSV = async () => {
  try {
    // 1. Liste les fichiers .csv dans documentDirectory
    const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory || "")
    const csvFiles = files.filter((f) => f.endsWith(".csv"))
    if (csvFiles.length === 0) throw new Error("Aucun fichier CSV trouvé.")

    // 2. Récupérer les dates de modification et trier
    const filesWithInfo = await Promise.all(
      csvFiles.map(async (file) => {
        const path = FileSystem.documentDirectory + file
        const info = await FileSystem.getInfoAsync(path)
        const mtime = info.exists && typeof info.modificationTime === "number" ? info.modificationTime : 0
        return { file, mtime }
      }),
    )

    filesWithInfo.sort((a, b) => b.mtime - a.mtime)
    const latestFile = filesWithInfo[0]?.file
    if (!latestFile) throw new Error("Fichier CSV introuvable.")

    const filePath = FileSystem.documentDirectory + latestFile

    // 3. Lire le contenu
    const content = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.UTF8,
    })

    // 4. Parser les lignes
    const lines = content.split("\n").slice(1) // skip header
    const collection = database.get<GameModel>("games")
    const allGames = await collection.query().fetch()
    let importedCount = 0

    await database.write(async () => {
      for (const line of lines) {
        if (!line.trim()) continue
        // On ignore l'ID du CSV car on génère un nouvel ID pour chaque import
        const [, dateStr, scoreA, scoreB, winnerLabel] = line.split(",").map((s) => s.trim())

        const scoreANum = parseInt(scoreA, 10)
        const scoreBNum = parseInt(scoreB, 10)
        const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date(), { locale: fr })

        let winnerOnTie: "A" | "B" | "equal" | null = null

        const w = winnerLabel.trim().toLowerCase()
        if (w.includes("égalité") || w.includes("equal")) {
          winnerOnTie = "equal"
        }

        const isAlreadyPresent = allGames.some((game) => {
          const sameDay =
            game.date.getDate() === parsedDate.getDate() &&
            game.date.getMonth() === parsedDate.getMonth() &&
            game.date.getFullYear() === parsedDate.getFullYear()

          const sameScores = game.scoreA === scoreANum && game.scoreB === scoreBNum
          const sameWinner = game.winnerOnTie === winnerOnTie

          return sameDay && sameScores && sameWinner
        })

        if (isAlreadyPresent) continue

        await collection.create((game) => {
          game._raw.id = generateUUID()
          game.date = parsedDate
          game.scoreA = scoreANum
          game.scoreB = scoreBNum
          game.winnerOnTie = winnerOnTie
        })

        importedCount++
      }
    })

    const message =
      importedCount > 0
        ? `🎉 Import terminé avec succès !\n\n${importedCount} ${importedCount === 1 ? "nouvelle partie a été ajoutée" : "nouvelles parties ont été ajoutées"} depuis le fichier :\n${latestFile}`
        : `✅ Import terminé\nAucune nouvelle partie détectée dans le fichier :\n${latestFile}`

    Alert.alert("Import terminé", message)
    return latestFile
  } catch (error) {
    Alert.alert("❌ Erreur d'import", (error as Error).message)
    return null
  }
}
