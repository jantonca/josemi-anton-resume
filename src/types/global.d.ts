declare global {
  interface Window {
    handleThemeChange: () => void
    getCurrentTheme: () => 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
  }
}

export {}
