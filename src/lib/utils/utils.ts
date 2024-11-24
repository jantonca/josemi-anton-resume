import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { socialLinks } from '../../data/socialLinks'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface EmailParts {
  username: string
  domain: string
}

export const emailParts: EmailParts = {
  username: 'jantonca',
  domain: 'gmail.com',
} as const

export const handleEmailClick = (emailParts: EmailParts): void => {
  try {
    const emailAddress = `${emailParts.username}@${emailParts.domain}`
    const mailtoUrl = `mailto:${emailAddress}`
    window.location.href = mailtoUrl
  } catch (error) {
    console.error('Error opening email client:', error)
    alert('Unable to open email client. Please try again later.')
  }
}

export const filterSocialLinks = (names: string[]) => {
  return socialLinks.filter((link) => names.includes(link.name))
}
