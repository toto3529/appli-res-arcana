import * as FileSystem from "expo-file-system"
import { Game } from "@stores/gameStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SAF_PARENT_DIR_KEY = "resarcana.saf.parent.dir"
const SAF_SUBDIR_KEY = "resarcana.saf.subdir.uri"

async function pickParentDirIfNeeded(): Promise<string | null> {
  let savedDir = await AsyncStorage.getItem(SAF_PARENT_DIR_KEY)
  if (savedDir) return savedDir

  const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  if (!perm.granted) return null

  savedDir = perm.directoryUri
  await AsyncStorage.setItem(SAF_PARENT_DIR_KEY, savedDir)
  await AsyncStorage.setItem(SAF_SUBDIR_KEY, savedDir)
  return savedDir
}

export type ExportResult = {
  success: boolean
  title: string
  message: string
  dirUri?: string
}

export const exportGamesToCSV = async (games: Game[]): Promise<ExportResult> => {
  try {
    const dateStr = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: fr })
    const fileName = `res-arcana-games-${dateStr}.csv`
    const header = "ID,Date,Score A,Score B,Vainqueur\n"

    const rows = games
      .filter((g) => g.id !== "__placeholder__")
      .map((g) => {
        const date = format(new Date(g.date), "dd/MM/yyyy HH:mm", { locale: fr })
        const winner =
          g.scoreA > g.scoreB ? "A" : g.scoreB > g.scoreA ? "B" : g.winnerOnTie === "A" ? "A" : g.winnerOnTie === "B" ? "B" : "Égalité parfaite"
        return `${g.id},${date},${g.scoreA},${g.scoreB},${winner}`
      })
    const csvContent = header + rows.join("\n")

    const targetDir = await pickParentDirIfNeeded()
    if (targetDir) {
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(targetDir, fileName, "text/csv")
      await FileSystem.writeAsStringAsync(uri, csvContent, { encoding: FileSystem.EncodingType.UTF8 })
      return { success: true, title: "✅ Export terminé", message: `Sauvegardé dans le dossier sélectionné.\n\n${fileName}`, dirUri: targetDir }
    }

    const localPath = `${FileSystem.documentDirectory}${fileName}`
    await FileSystem.writeAsStringAsync(localPath, csvContent, { encoding: FileSystem.EncodingType.UTF8 })
    return { success: true, title: "✅ Export local", message: `Sauvegardé dans l'espace de l'app (temporaire).\n\n${fileName}`, dirUri: localPath }
  } catch (err) {
    return { success: false, title: "❌ Erreur export", message: (err as Error).message || "Une erreur est survenue lors de l'export CSV." }
  }
}
