import { useState, useEffect, useRef } from 'react'

export type Transition = 'fade' | 'slide' | 'zoom'

export function useSlideshow(total: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [interval, setIntervalMs] = useState(3000)
  const [shuffle, setShuffle] = useState(false)
  const [transition, setTransition] = useState<Transition>('fade')
  const orderRef = useRef<number[]>([])

  useEffect(() => {
    orderRef.current = Array.from({ length: total }, (_, i) => i)
    if (shuffle) orderRef.current.sort(() => Math.random() - 0.5)
  }, [total, shuffle])

  useEffect(() => {
    if (!playing || total < 2) return
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % total)
    }, interval)
    return () => clearInterval(id)
  }, [playing, interval, total])

  const next = () => setIndex(p => (p + 1) % Math.max(total, 1))
  const prev = () => setIndex(p => (p - 1 + Math.max(total, 1)) % Math.max(total, 1))

  return { index, setIndex, playing, setPlaying, interval, setIntervalMs, shuffle, setShuffle, transition, setTransition, next, prev }
}
