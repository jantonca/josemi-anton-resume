import React, { useState } from 'react'
import { NumberedHeading } from './ui/numbered-heading'

export function Experience() {
  const [activeTab, setActiveTab] = useState(0)

  const jobs = [
    {
      company: 'Rotor Studios',
      title: 'Senior Front End Engineer',
      url: '#',
      date: 'Nov 2023 - Present',
      points: [
        'Specializing in modern HTML, ReactJS, Vanilla JavaScript, and cutting-edge web technologies',
        'Contributing to groundbreaking projects in VR/AR and WebGL',
        'Leading technical implementations and architectural decisions',
        'Collaborating with design and product teams to deliver high-quality solutions',
      ],
    },
    {
      company: 'Pedestrian Group',
      title: 'WordPress Developer',
      url: '#',
      date: 'Jan 2022 - Nov 2023',
      points: [
        'Enhanced front-end experience through creative design and development',
        'Created custom WordPress themes and plugins',
        'Integrated cutting-edge features and functionalities',
        'Improved user experience and site performance',
      ],
    },
    {
      company: 'The Intermedia Group',
      title: 'Web Designer and Developer',
      url: '#',
      date: 'Aug 2018 - Dec 2021',
      points: [
        'Produced and maintained WordPress sites and custom PHP solutions',
        'Implemented front-end technologies including HTML5, CSS3, and JavaScript',
        'Developed responsive and performant web applications',
        'Managed multiple projects simultaneously',
      ],
    },
    {
      company: 'Made Agency',
      title: 'Web Designer and Developer',
      url: '#',
      date: 'Nov 2016 - Jul 2018',
      points: [
        'Created new and innovative web products using clean code',
        'Developed new web applications concepts',
        'Created technical solutions for specified business requirements',
        'Implemented responsive design and modern web technologies',
      ],
    },
  ]

  return (
    <section
      id='experience'
      className='py-32'
    >
      <div className='container mx-auto px-4 max-w-[1200px]'>
        <NumberedHeading number='02.'>Where I've Worked</NumberedHeading>

        <div className='grid grid-cols-[max-content,1fr] gap-4'>
          {/* Vertical tabs */}
          <div className='flex flex-col border-l border-border'>
            {jobs.map((job, index) => (
              <button
                key={index}
                className={`px-5 py-2 text-left font-mono text-sm relative transition-all duration-300
                 ${activeTab === index ? 'text-pacific before:absolute before:left-0 before:top-0 before:w-[2px] before:h-full before:bg-pacific before:-ml-[1px]' : 'text-muted-foreground before:transition-all before:duration-300'}
                 hover:text-pacific hover:bg-pacific/5`}
                onClick={() => setActiveTab(index)}
              >
                {job.company}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className=''>
            <div className='mb-2'>
              <h3 className='text-xl font-heading mb-2'>
                <span>{jobs[activeTab].title}</span>{' '}
                <span className='text-pacific'>
                  @ {jobs[activeTab].company}
                </span>
              </h3>
              <p className='font-mono text-sm text-muted-foreground'>
                {jobs[activeTab].date}
              </p>
            </div>

            <ul className='space-y-4'>
              {jobs[activeTab].points.map((point, i) => (
                <li
                  key={i}
                  className="relative pl-6 before:content-['▹'] before:absolute before:left-0 before:text-pacific before:transition-all before:duration-300"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
