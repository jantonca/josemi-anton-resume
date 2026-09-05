import type { AboutContent } from '@/types/components'

export const aboutContent: AboutContent = {
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Astro',
    'Frontend Architecture',
    'WebGL',
    'Node.js',
  ],
  description: [
    "I'm a Senior Frontend Engineer with more than 10 years in web development. My React work started with Gutenberg in 2018, and I've been building with it ever since.",
    'At Rotor Studios I\'m responsible for the frontend architecture of React and TypeScript vehicle configurators covering more than 40 models across Toyota, Lexus and Nissan, and I build the internal packages other teams use. I also work on WebGL and XR experiences, automated testing, CI/CD and frontend standards.',
  ],
  profileImage: {
    alt: 'Josemi Anton',
  },
  currentWork: {
    company: 'Rotor Studios',
    url: 'https://www.rotorstudios.com/',
  },
  previousWork: [
    {
      company: 'Pedestrian Group',
      url: 'https://pedestriangroup.com.au/',
    },
    {
      company: 'The Intermedia Group',
      url: 'https://intermedia.com.au/',
    },
    {
      company: 'Made Agency',
      url: 'https://madeagency.com.au/',
    },
  ],
}
