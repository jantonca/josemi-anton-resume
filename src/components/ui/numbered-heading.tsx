interface NumberedHeadingProps {
  number: string
  children: React.ReactNode
}

export function NumberedHeading({ number, children }: NumberedHeadingProps) {
  return (
    <h2 className='flex items-center font-heading text-3xl text-primary mb-12'>
      <span className='text-pacific font-mono mr-2'>{number}</span>
      <span>{children}</span>
      <span className='ml-4 w-full h-[1px] max-w-[300px] bg-border hidden md:block'></span>
    </h2>
  )
}
