import type { Theme } from './theme'

declare global {
  // Window interface extensions
  interface Window {
    handleThemeChange: () => void
    getCurrentTheme: () => Theme
    setTheme: (theme: Theme) => void
  }

  // Global declarations here
  namespace App {
    interface Locals {
      theme: Theme
    }
  }

  // Asset declarations
  declare module '*.svg' {
    const content: string
    export default content
  }

  declare module '*.png' {
    const content: string
    export default content
  }

  declare module '*.jpg' {
    const content: string
    export default content
  }
}

export {}
