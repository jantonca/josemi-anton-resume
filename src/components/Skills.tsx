export function Skills() {
  const skills = {
    Frontend: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'TypeScript',
      'React.js',
      'Next.js',
      'Node.js',
      'Webpack',
    ],
    'CMS & Tools': [
      'WordPress',
      'WooCommerce',
      'Git',
      'GitHub',
      'Bitbucket',
      'npm',
      'REST API',
    ],
    Design: [
      'UI/UX Design',
      'Responsive Design',
      'SEO',
      'Adobe Creative Suite',
    ],
    Other: [
      'PHP',
      'MySQL',
      'AWS',
      'G Suite',
      'API Development',
      'WebGL',
      'VR/AR',
    ],
  }

  return (
    <section
      id='skills'
      className='py-32'
    >
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl font-bold mb-12 text-primary'>
          Skills & Technologies
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <h3 className='text-xl font-semibold mb-4 text-honolulu'>
                {category}
              </h3>
              <ul className='space-y-2'>
                {items.map((skill) => (
                  <li
                    key={skill}
                    className='text-muted-foreground'
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
