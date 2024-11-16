import { NumberedHeading } from './ui/numbered-heading'
import { cn } from '../lib/utils/utils'
import React from 'react'

export function Skills() {
  const TAGS = [
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React.js',
    'Next.js',
    'Node.js',
    'Webpack',
    'WordPress',
    'WooCommerce',
    'Git',
    'GitHub',
    'Bitbucket',
    'npm',
    'REST API',
    'UI/UX Design',
    'Responsive Design',
    'SEO',
    'Adobe Creative Suite',
    'PHP',
    'MySQL',
    'AWS',
    'API Development',
    'WebGL',
    'VR/AR',
  ]

  const DURATION = 18000
  const ROWS = 5
  const TAGS_PER_ROW = 8

  const random = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min)) + min
  const shuffle = (arr: string[]): string[] =>
    [...arr].sort(() => 0.5 - Math.random())

  interface InfiniteLoopSliderProps {
    children: React.ReactNode
    duration: number
    reverse?: boolean
  }

  const InfiniteLoopSlider: React.FC<InfiniteLoopSliderProps> = ({
    children,
    duration,
    reverse = false,
  }) => {
    return (
      <div
        className='loop-slider'
        style={
          {
            '--duration': `${duration}ms`,
            '--direction': reverse ? 'reverse' : 'normal',
          } as React.CSSProperties
        }
      >
        <div className='inner flex w-fit'>
          {children}
          {children}
        </div>
      </div>
    )
  }

  interface TagProps {
    text: string
  }

  const Tag: React.FC<TagProps> = ({ text }) => (
    <div
      className={cn(
        'tag bg-honolulu text-nonphoto flex items-center py-[0.7rem] rounded-md px-4 mr-4 shadow-md whitespace-nowrap',
        'shadow-[0_0.1rem_0.2rem_rgba(3,4,94,0.2),0_0.1rem_0.5rem_rgba(3,4,94,0.3),0_0.2rem_1.5rem_rgba(3,4,94,0.4)]'
      )}
    >
      <span className='text-pacific'>#</span> {text}
    </div>
  )

  return (
    <section
      id='skills'
      className=' py-8 lg:py-32'
    >
      <div className={cn('container mx-auto px-4 lg:max-w-[900px]')}>
        <NumberedHeading number='03.'>Skills & Technologies</NumberedHeading>
        <div>
          <div className='lg:max-w-[48rem] flex flex-shrink-0 flex-col gap-y-4 relative py-6 overflow-hidden'>
            {[...new Array(ROWS)].map((_, i) => (
              <InfiniteLoopSlider
                key={i}
                duration={random(DURATION - 5000, DURATION + 5000)}
                reverse={i % 2 === 0}
              >
                {shuffle(TAGS)
                  .slice(0, TAGS_PER_ROW)
                  .map((tag) => (
                    <Tag
                      text={tag}
                      key={tag}
                    />
                  ))}
              </InfiniteLoopSlider>
            ))}
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-federal via-transparent to-federal'></div>
          </div>
        </div>
      </div>
    </section>
  )
}
