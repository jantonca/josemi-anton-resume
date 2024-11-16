import React from 'react'
import { Mail } from 'lucide-react'
import { SiGithub, SiLinkedin } from '@icons-pack/react-simple-icons'
import { NumberedHeading } from './ui/numbered-heading'

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
]

export function Contact() {
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const username = 'jantonca'
    const domain = 'gmail.com'
    window.location.href = `mailto:${username}@${domain}`
  }

  return (
    <section
      id='contact'
      className=' py-8 lg:py-32'
    >
      <div className='container mx-auto px-4 lg:max-w-[600px]'>
        <NumberedHeading number='04.'>What's Next?</NumberedHeading>
        <div className='max-w-2xl mx-auto'>
          <h2 className='font-heading text-4xl md:text-5xl mb-6 text-primary'>
            Get In Touch
          </h2>
          <p className='text-lg text-muted-foreground mb-12 font-extralight'>
            Although I'm currently engaged in exciting projects at Rotor
            Studios, I'm always open to new connections and opportunities.
            Whether you have a question or just want to say hello, I'll do my
            best to get back to you!
          </p>
          <div className='flex justify-center'>
            <a
              href='mailto:jantonca@gmail.com'
              onClick={handleEmailClick}
              className='inline-flex items-center gap-2 px-8 py-4 border-2 border-pacific 
                text-pacific font-mono text-sm rounded-md hover:bg-pacific/10 
                transition-colors duration-300'
            >
              <Mail className='w-4 h-4' />
              Say Hello
            </a>
          </div>
          <div className='mt-12 flex flex-col items-center gap-2 text-sm text-muted-foreground'>
            <p className='font-mono'>or find me on</p>
            <div className='flex items-center gap-4'>
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  aria-label={name}
                  target='_blank'
                  rel='noreferrer'
                  className='text-muted-foreground hover:text-pacific transition-colors duration-200'
                >
                  <Icon className='h-6 w-6' />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
