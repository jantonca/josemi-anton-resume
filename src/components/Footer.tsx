import { Copyright } from './Copyright'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className='py-6 mt-auto'>
      <div className='container mx-auto px-4'>
        <SocialLinks />
        <Copyright />
      </div>
    </footer>
  )
}
