import { useLocalStorage } from './useLocalStorage'
import type { Photo, FrameSettings } from '../types'
import { DEFAULT_FRAME } from '../types'

export function usePhotos() {
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', [])

  const add = (partial: Pick<Photo, 'src' | 'type' | 'name' | 'albumId'>) =>
    setPhotos(prev => [
      ...prev,
      { ...partial, id: crypto.randomUUID(), order: prev.length, frame: DEFAULT_FRAME },
    ])

  const remove = (id: string) => setPhotos(prev => prev.filter(p => p.id !== id))

  const updateFrame = (id: string, frame: FrameSettings) =>
    setPhotos(prev => prev.map(p => (p.id === id ? { ...p, frame } : p)))

  const reorder = (ids: string[]) =>
    setPhotos(prev => {
      const map = new Map(prev.map(p => [p.id, p]))
      return ids.map((id, i) => ({ ...map.get(id)!, order: i }))
    })

  return { photos, add, remove, updateFrame, reorder }
}
