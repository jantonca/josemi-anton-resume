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

export interface AboutContent {
  skills: string[]
  description: string[]
  profileImage: {
    alt: string
  }
  currentWork: {
    company: string
    url: string
  }
  previousWork: {
    company: string
    url: string
  }[]
}

export interface JobContent {
  company: string
  title: string
  url: string
  date: string
  points: string[]
}

export interface JobsContent {
  jobs: JobContent[]
}

export interface SkillGroup {
  label: string
  tags: string[]
}

export interface Skills {
  groups: SkillGroup[]
}

export interface EducationItem {
  degree: string
  institution: string
  year: string
  detail?: string
}

export interface Language {
  name: string
  level: string
}

export interface EducationContent {
  items: EducationItem[]
  languages: Language[]
}

export interface Contact {
  headingNumber: string
  headingText: string
  subheading: string
  description: string
  email: string
}

export interface socialLink {
  name: string
  url: string
}

export interface SocialLinks {
  socialLinks: socialLink[]
}

export interface SelectedWorkItem {
  title: string
  description: string
  url: string
  linkText: string
  linkLabel: string
}

export interface SelectedWorkContent {
  headingNumber: string
  headingText: string
  description: string
  items: SelectedWorkItem[]
}
