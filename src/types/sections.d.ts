// src/types/sections.d.ts
import type { Theme } from './theme'

export interface SectionProps {
  class?: string
  id?: string
}

export interface HeroProps extends SectionProps {
  theme?: Theme
}

export interface AboutProps extends SectionProps {
  theme?: Theme
}

export interface ExperienceProps extends SectionProps {
  theme?: Theme
}

export interface SkillsProps extends SectionProps {
  theme?: Theme
}

export interface ContactProps extends SectionProps {
  theme?: Theme
}

export interface FooterProps extends SectionProps {
  theme?: Theme
}
