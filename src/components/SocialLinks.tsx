import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from '@icons-pack/react-simple-icons'

import { Globe } from 'lucide-react'

const socialLinks = [
  {
    name: 'GitHub',
    icon: SiGithub,
    url: 'https://github.com/jantonca',
  },
  {
    name: 'LinkedIn',
    icon: SiLinkedin,
    url: 'https://www.linkedin.com/in/josemiantoncasado/',
  },
  {
    name: 'Instagram',
    icon: SiInstagram,
    url: 'https://www.instagram.com/joxemiel_a_c',
  },
  {
    name: 'Website',
    icon: Globe,
    url: 'https://bobeliadesign.com',
  },
]

export function SocialLinks() {
  return (
    <div className='md:fixed md:bottom-0 md:left-[40px] md:z-10 md:block md:mb-8'>
      <ul className='flex md:flex-col items-center justify-center gap-4 pb-8 md:pb-0 md:after:block md:after:h-[90px] md:after:w-[1px] md:after:bg-border md:after:my-2 md:after:border-nonphoto2'>
        {socialLinks.map(({ name, icon: Icon, url }) => (
          <li
            key={name}
            className='transition-transform duration-200 hover:-translate-y-1'
          >
            <a
              href={url}
              aria-label={name}
              target='_blank'
              rel='noreferrer'
              className='text-muted-foreground hover:text-pacific transition-colors duration-200'
            >
              <Icon className='h-5 w-5' />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
