import { SiGithub } from '@icons-pack/react-simple-icons'

const socialLinks = [
  {
    name: 'GitHub',
    icon: SiGithub,
    url: 'https://github.com/jantonca/josemi-anton-resume',
  },
]

export function Copyright() {
  return (
    <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
      <div className='flex items-center gap-4'>
        <span className='font-mono'>© 2024</span>
        <span className='h-1 w-1 rounded-full bg-pacific'></span>
        <span>
          Built with <span className='text-pacific'>♥</span> by Josemi Anton
        </span>
      </div>
      <div className='flex items-center gap-4'>
        {socialLinks.map(({ name, icon: Icon, url }) => (
          <a
            key={name}
            href={url}
            className='hover:text-pacific transition-colors duration-300 flex items-center gap-2'
            target='_blank'
            rel='noopener noreferrer'
          >
            <span>View this project on</span>
            <Icon className='h-5 w-5' />
          </a>
        ))}
      </div>
    </div>
  )
}
