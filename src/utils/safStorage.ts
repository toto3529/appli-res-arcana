import * as FileSystem from "expo-file-system"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const SAF_PARENT_DIR_KEY = "resarcana.saf.parent.dir"
export const SAF_SUBDIR_KEY = "resarcana.saf.subdir.uri"
export const SAF_SUBDIR_NAME = "ResArcana"

// Sélectionner un dossier parent
export async function pickParentDir(): Promise<string | null> {
  const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
  if (!perm.granted) return null

  const parentUri = perm.directoryUri
  await AsyncStorage.setItem(SAF_PARENT_DIR_KEY, parentUri)
  return parentUri
}

// Récupérer le chemin actuel
export async function getCurrentSafDir(): Promise<string | null> {
  return (await AsyncStorage.getItem(SAF_SUBDIR_KEY)) || null
}

// Reset complet
export async function resetSafLocation(): Promise<void> {
  await AsyncStorage.removeItem(SAF_PARENT_DIR_KEY)
  await AsyncStorage.removeItem(SAF_SUBDIR_KEY)
}
