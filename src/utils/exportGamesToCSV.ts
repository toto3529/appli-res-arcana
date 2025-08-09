import * as FileSystem from "expo-file-system"
import { Game } from "@stores/gameStore"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Alert } from "react-native"
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

export const exportGamesToCSV = async (games: Game[]): Promise<string | null> => {
  try {
    // 1) Construire le CSV
    const dateStr = format(new Date(), "yyyy-MM-dd_HH-mm-ss", { locale: fr })
    const fileName = `res-arcana-games-${dateStr}.csv`
    const header = "ID,Date,Score A,Score B,Vainqueur\n"
    const rows = games
      .filter((g) => g.id !== "__placeholder__")
      .map((g) => {
        const date = new Date(g.date).toLocaleDateString("fr-FR")
        const winner =
          g.scoreA > g.scoreB ? "A" : g.scoreB > g.scoreA ? "B" : g.winnerOnTie === "A" ? "A" : g.winnerOnTie === "B" ? "B" : "Égalité parfaite"
        return `${g.id},${date},${g.scoreA},${g.scoreB},${winner}`
      })
    const csvContent = header + rows.join("\n")

    // 2) Tenter d’enregistrer dans Téléchargements/ResArcanaSave
    const targetDir = await pickParentDirIfNeeded()
    if (targetDir) {
      const uri = await FileSystem.StorageAccessFramework.createFileAsync(targetDir, fileName, "text/csv")
      await FileSystem.writeAsStringAsync(uri, csvContent, { encoding: FileSystem.EncodingType.UTF8 })

      Alert.alert("✅ Export terminé", `Sauvegardé dans le dossier sélectionné.\n\n${fileName}`)
      return targetDir
    }

    // 3) Fallback local (disparaît si l’app est désinstallée)
    const localPath = `${FileSystem.documentDirectory}${fileName}`
    await FileSystem.writeAsStringAsync(localPath, csvContent, { encoding: FileSystem.EncodingType.UTF8 })
    Alert.alert("✅ Export local", `Sauvegardé dans l’espace de l’app (temporaire).\n\n${fileName}`)
    return localPath
  } catch (err) {
    Alert.alert("❌ Erreur export", (err as Error).message || "Une erreur est survenue lors de l'export CSV.")
    return null
  }
}
