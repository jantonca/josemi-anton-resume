// src/types/theme.ts

export type Theme = 'light' | 'dark'

export interface ThemeConfig {
  defaultTheme?: Theme
  storageKey?: string
}
