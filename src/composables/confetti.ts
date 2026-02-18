import confetti from 'canvas-confetti'

const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
}

const useConfetti = () => {
  function runConfetti() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star'],
    })

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle'],
    })
  }

  const shoot = () => {
    setTimeout(runConfetti, 0)
    setTimeout(runConfetti, 100)
    setTimeout(runConfetti, 200)
    setTimeout(runConfetti, 300)
  }

  return { shoot }
}

export { useConfetti }
