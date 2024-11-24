export interface NavProps {
  class?: string
}

export interface ThemeToggleProps {
  class?: string
}

export interface HeroContent {
  greeting: string
  name: string
  tagline: string
  description: string
  currentWork: {
    company: string
    url: string
    role: string
  }
}

export interface HeroProps {
  content?: HeroContent
  class?: string
}

export interface InnerGlowCardProps {
  class?: string
  variant?: 'default' | 'subtle' | 'prominent'
  animation?: 'default' | 'none'
  children: any
}

export interface InteractiveBackgroundProps {
  class?: string
  sensitivity?: number
  colors?: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    quinary: string
  }
  blur?: number
  opacity?: number
}
