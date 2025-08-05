import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Appearance } from "react-native"

export type ThemeMode = "light" | "dark"

interface ThemeStore {
  mode: ThemeMode | "system"
  setMode: (mode: ThemeMode) => Promise<void>
  loadTheme: () => Promise<void>
  effectiveTheme: () => ThemeMode
  isDark: () => boolean
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "system",

  setMode: async (mode) => {
    await AsyncStorage.setItem("app_theme_mode", mode)
    set({ mode })
  },

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem("app_theme_mode")
    if (saved === "light" || saved === "dark" || saved === "system") {
      set({ mode: saved })
    }
  },

  effectiveTheme: () => {
    const mode = get().mode
    if (mode === "light" || mode === "dark") return mode
    return Appearance.getColorScheme() === "dark" ? "dark" : "light"
  },
  isDark: () => get().effectiveTheme() === "dark",
}))
