import { cn } from '../lib/utils/utils'
import React from 'react'

interface InnerGlowCardProps {
  children: React.ReactNode
}

export function InnerGlowCard({ children }: InnerGlowCardProps) {
  return (
    <div className={cn('rounded-2xl p-2 InnerGlowCard')}>
      <div className='InnerGlowCard__content'>{children}</div>
    </div>
  )
}
