import { create } from "zustand"
import { Appearance } from "react-native"

interface ThemeStore {
  isDark: boolean
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: Appearance.getColorScheme() === "dark",
  toggleTheme: () => set({ isDark: !get().isDark }),
}))
