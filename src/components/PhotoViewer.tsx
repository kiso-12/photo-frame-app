import { useEffect } from 'react'
import type { Photo } from '../types'
import { frameToCSS } from '../utils/frameToCSS'
import { FrameEditor } from './FrameEditor'
import type { FrameSettings } from '../types'

interface Props {
  photos: Photo[]
  index: number
  onIndexChange: (i: number) => void
  onFrameChange: (id: string, f: FrameSettings) => void
  onClose: () => void
}

export function PhotoViewer({ photos, index, onIndexChange, onFrameChange, onClose }: Props) {
  const photo = photos[index]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % photos.length)
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, photos.length, onClose, onIndexChange])

  if (!photo) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="flex gap-4 items-start max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div style={frameToCSS(photo.frame)} className="overflow-hidden rounded max-h-[70vh]">
            <img src={photo.src} alt={photo.name} className="max-h-[70vh] max-w-full object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}
              className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded">◀</button>
            <span className="text-white text-sm">{index + 1} / {photos.length}</span>
            <button onClick={() => onIndexChange((index + 1) % photos.length)}
              className="bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded">▶</button>
          </div>
        </div>
        <div className="bg-white rounded-lg w-48 shrink-0">
          <FrameEditor frame={photo.frame} onChange={f => onFrameChange(photo.id, f)} />
        </div>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">✕</button>
    </div>
  )
}
