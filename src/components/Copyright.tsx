import { SiAstro } from '@icons-pack/react-simple-icons'
import { filterSocialLinks } from '../lib/utils/utils'

export function Copyright() {
  const filteredSocialLinks = filterSocialLinks(['GitHub'])

  return (
    <div className='flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
      <div className='flex items-center gap-2'>
        <span className='font-mono'>© 2024</span>
        <span className='h-1 w-1 rounded-full bg-pacific'></span>Built with{' '}
        <span className='text-pacific'>♥</span> &{' '}
        <SiAstro className='h-4 w-4' /> by Josemi Anton
      </div>
      <div className='flex items-center gap-4'>
        {filteredSocialLinks.map(({ name, icon: Icon, url }) => (
          <a
            key={name}
            href={url + '/josemi-anton-resume'}
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
