// src/hooks/useTheme.ts
import type { Theme } from '../types/theme'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
}

export function useTheme(): UseThemeReturn {
  const theme = window.getCurrentTheme()
  const isDark = theme === 'dark'

  return {
    theme,
    setTheme: window.setTheme,
    toggleTheme: window.handleThemeChange,
    isDark,
  }
}
