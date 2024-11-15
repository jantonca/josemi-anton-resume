import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from './theme-provider'

export function Navigation() {
  const { theme, setTheme } = useTheme()

  const links = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className='fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-50 border-b border-border'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='text-lg font-bold text-primary'>Josemi Anton</div>

          <div className='hidden md:flex items-center space-x-8'>
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                {link.name}
              </a>
            ))}
          </div>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className='ml-4'
          >
            <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
