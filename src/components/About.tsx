import { NumberedHeading } from './ui/numbered-heading'

const skills = [
  'Node.JS',
  'Next.JS',
  'React.JS',
  'TypeScript',
  'JavaScript',
  'PHP',
  'WordPress',
]

const SkillList = ({ skills }: { skills: string[] }) => (
  <ul className='grid grid-cols-2 gap-x-8 gap-y-2 mt-4'>
    {skills.map((skill) => (
      <li
        key={skill}
        className="relative pl-6 before:content-['▹'] before:absolute before:left-0 before:text-pacific"
      >
        {skill}
      </li>
    ))}
  </ul>
)

export function About() {
  return (
    <section
      id='about'
      className='py-32'
    >
      <div className='container mx-auto px-4'>
        <NumberedHeading number='01.'>About Me</NumberedHeading>

        <div className='grid grid-cols-1 md:grid-cols-[3fr,2fr] gap-12'>
          <div className='space-y-6 text-lg font-extralight text-muted-foreground'>
            <p>
              Web Designer & Developer, based in Sydney, at work in the world.
              Passionate about crafting new sites and revitalizing older ones.
            </p>

            <p>
              Fast-forward to today, and I've had the privilege of working at{' '}
              <a
                href='#'
                className='text-pacific hover:underline'
                aria-label='The Intermedia Group'
              >
                The Intermedia Group
              </a>
              ,{' '}
              <a
                href='#'
                className='text-pacific hover:underline'
                aria-label='Made Agency'
              >
                Made Agency
              </a>
              , and{' '}
              <a
                href='#'
                className='text-pacific hover:underline'
                aria-label='Pedestrian Group'
              >
                Pedestrian Group
              </a>
              . Currently, I'm focused on building innovative web experiences at{' '}
              <a
                href='#'
                className='text-pacific hover:underline'
                aria-label='Rotor Studios'
              >
                Rotor Studios
              </a>
              , working on groundbreaking projects in VR/AR and WebGL.
            </p>

            <p>
              My diverse IT background spans various roles, and I thrive both
              solo and in team settings, even in high-speed environments. Fluent
              in English and Spanish, I'm a good communicator.
            </p>

            <p>Here are a few technologies I've been working with recently:</p>

            <SkillList skills={skills} />
          </div>
          <div className='relative w-full max-w-[300px]'>
            <div className='relative group'>
              <div className='absolute inset-0 transform translate-x-4 translate-y-4 border-2 border-pacific rounded transition-transform duration-300 group-hover:translate-x-6 group-hover:translate-y-6'></div>
              <img
                src='/images/profile.jpg'
                alt='Josemi Anton'
                className='relative z-10 w-full h-full rounded-lg object-cover mix-blend-lighten filter grayscale contrast-100 transition-all duration-300 group-hover:filter-none group-hover:-translate-x-2 group-hover:-translate-y-2'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
