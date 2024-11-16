import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleEmailClick = (e: React.MouseEvent) => {
  e.preventDefault()
  const username = 'jantonca'
  const domain = 'gmail.com'
  window.location.href = `mailto:${username}@${domain}`
}
