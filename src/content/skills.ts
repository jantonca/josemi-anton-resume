import type { Skills } from '@/types/components'

export const skillsContent: Skills = {
  groups: [
    {
      label: 'Frontend',
      tags: [
        'TypeScript',
        'JavaScript',
        'React',
        'Next.js',
        'Astro',
        'HTML',
        'CSS',
      ],
    },
    {
      label: 'Architecture & Quality',
      tags: [
        'Frontend Architecture',
        'Reusable Component Systems',
        'Engineering Standards',
        'Code Review',
        'Vitest',
        'Jest',
        'Playwright',
        'CI/CD',
        'GitHub Actions',
        'Bitbucket Pipelines',
        'Web Performance',
      ],
    },
    {
      label: '3D & Visual',
      tags: ['WebGL', 'Three.js', 'React Three Fiber', 'XR'],
    },
    {
      label: 'Supporting',
      tags: [
        'Node.js',
        'REST APIs',
        'AWS',
        'Azure',
        'PHP',
        'WordPress',
        'MySQL',
        'Git',
      ],
    },
  ],
}
