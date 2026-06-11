import { useEffect, useState } from 'react'
import type { Photo } from '../types'
import { frameToCSS } from '../utils/frameToCSS'
import { useSlideshow, type Transition } from '../hooks/useSlideshow'

interface Props {
  photos: Photo[]
  onClose: () => void
}

export function Slideshow({ photos, onClose }: Props) {
  const { index, playing, setPlaying, interval, setIntervalMs, shuffle, setShuffle, transition, setTransition, next, prev } = useSlideshow(photos.length)
  const [visible, setVisible] = useState(true)

  // trigger transition animation on index change
  useEffect(() => { setVisible(false); const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t) }, [index])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, next, prev])

  const photo = photos[index]
  if (!photo) return null

  const transClass: Record<Transition, string> = {
    fade: 'transition-opacity duration-500',
    slide: 'transition-transform duration-500',
    zoom: 'transition-all duration-500',
  }
  const hiddenClass: Record<Transition, string> = {
    fade: 'opacity-0',
    slide: '-translate-x-4 opacity-0',
    zoom: 'scale-90 opacity-0',
  }

  const toggleFS = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className={`flex-1 flex items-center justify-center w-full ${transClass[transition]} ${visible ? '' : hiddenClass[transition]}`}>
        <div style={frameToCSS(photo.frame)} className="overflow-hidden rounded">
          <img src={photo.src} alt={photo.name} className="max-h-[80vh] max-w-[90vw] object-contain" />
        </div>
      </div>

      <div className="flex items-center gap-3 bg-black/60 px-4 py-3 rounded-t-xl text-white flex-wrap justify-center">
        <button onClick={prev} className="hover:text-gray-300">◀</button>
        <button onClick={() => setPlaying(!playing)} className="px-3 py-1 bg-white/20 rounded hover:bg-white/30">
          {playing ? '⏸' : '▶'}
        </button>
        <button onClick={next} className="hover:text-gray-300">▶</button>
        <span className="text-sm">{index + 1}/{photos.length}</span>

        <label className="flex items-center gap-1 text-sm">
          {Math.round(interval / 1000)}s
          <input type="range" min="1000" max="10000" step="500" value={interval}
            onChange={e => setIntervalMs(+e.target.value)} className="w-20" />
        </label>

        <select value={transition} onChange={e => setTransition(e.target.value as Transition)}
          className="bg-white/20 rounded px-1 py-0.5 text-sm">
          <option value="fade">フェード</option>
          <option value="slide">スライド</option>
          <option value="zoom">ズーム</option>
        </select>

        <button onClick={() => setShuffle(!shuffle)}
          className={`text-sm px-2 py-0.5 rounded ${shuffle ? 'bg-blue-500' : 'bg-white/20'}`}>
          シャッフル
        </button>

        <button onClick={toggleFS} className="text-sm bg-white/20 px-2 py-0.5 rounded hover:bg-white/30">⛶</button>
        <button onClick={onClose} className="text-sm bg-red-500/60 px-2 py-0.5 rounded hover:bg-red-500">✕ 閉じる</button>
      </div>
    </div>
  )
}
