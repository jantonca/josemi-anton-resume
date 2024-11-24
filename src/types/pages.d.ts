export interface PageProps {
  title: string
  description?: string
}

export interface HomePageConfig {
  seoTitle: string
  seoDescription: string
  sections: {
    hero: boolean
    about: boolean
    experience: boolean
    skills: boolean
    contact: boolean
    footer: boolean
  }
}
