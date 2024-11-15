import { useEffect } from 'react'

export function InteractiveBackground() {
  useEffect(() => {
    const interBubble = document.querySelector('.interactive') as HTMLElement
    let curX = 0
    let curY = 0
    let tgX = 0
    let tgY = 0

    const move = () => {
      curX += (tgX - curX) / 20
      curY += (tgY - curY) / 20
      if (interBubble) {
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      }
      requestAnimationFrame(move)
    }

    window.addEventListener('mousemove', (event) => {
      tgX = event.clientX
      tgY = event.clientY
    })

    move()

    return () => {
      window.removeEventListener('mousemove', (event) => {
        tgX = event.clientX
        tgY = event.clientY
      })
    }
  }, [])

  return (
    <div className='gradients-container font-sans overflow-hidden'>
      <div className='g1'></div>
      <div className='g2'></div>
      <div className='g3'></div>
      <div className='g4'></div>
      <div className='g5'></div>
      <div className='interactive'></div>
    </div>
  )
}
