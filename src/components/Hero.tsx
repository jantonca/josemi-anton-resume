import React from 'react'
import { InnerGlowCard } from './InnerGlowCard'

export function Hero() {
  return (
    <section className='min-h-screen flex items-center pt-16 pb-32'>
      <div className='container mx-auto px-4 max-w-4xl'>
        <InnerGlowCard>
          <p className='text-lg mb-5 text-honolulu'>Hi, my name is</p>
          <h1 className='text-5xl md:text-7xl font-bold mb-4 text-primary'>
            Josemi Anton
          </h1>
          <h2 className='text-4xl md:text-6xl font-bold mb-8 text-muted-foreground'>
            I build things for the web.
          </h2>
          <div className='max-w-2xl mb-12'>
            <p className='text-lg text-muted-foreground'>
              I'm a Web Designer & Developer based in Sydney, passionate about
              crafting new sites and revitalizing older ones. Specializing in
              modern HTML, ReactJS, and cutting-edge web technologies, I'm
              currently working at{' '}
              <a
                href='https://www.rotorstudios.com/'
                className='text-honolulu hover:underline'
                target='_blank'
              >
                Rotor Studios
              </a>{' '}
              on groundbreaking projects in VR/AR and WebGL.
            </p>
          </div>
        </InnerGlowCard>
      </div>
    </section>
  )
}
