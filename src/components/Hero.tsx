import React from 'react'
import { InnerGlowCard } from './InnerGlowCard'
import { InteractiveBackground } from './InteractiveBackground'

export function Hero() {
  return (
    <section className='relative min-h-screen flex items-center pt-16 pb-32'>
      <InteractiveBackground />
      <div className='container mx-auto px-4 max-w-4xl relative z-10'>
        <InnerGlowCard>
          <p className='text-lg mb-5 mt-12 text-nonphoto'>Hi, my name is</p>
          <h1 className='text-5xl md:text-7xl font-bold mb-4 text-primary font-heading'>
            Josemi Anton
          </h1>
          <h2 className='text-4xl md:text-6xl mb-8 text-muted-foreground font-extralight'>
            I build things for the web.
          </h2>
          <div className='mb-12'>
            <p className='text-lg text-muted-foreground'>
              I'm a Web Designer & Developer based in Sydney, passionate about
              crafting new sites and revitalizing older ones. Specializing in
              modern HTML, ReactJS, and cutting-edge web technologies, I'm
              currently working at{' '}
              <a
                href='https://www.rotorstudios.com/'
                className='text-nonphoto hover:underline font-normal'
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
