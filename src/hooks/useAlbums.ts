import { useLocalStorage } from './useLocalStorage'
import type { Album } from '../types'

export function useAlbums() {
  const [albums, setAlbums] = useLocalStorage<Album[]>('albums', [])

  const add = (name: string) =>
    setAlbums(prev => [...prev, { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }])

  const remove = (id: string) => setAlbums(prev => prev.filter(a => a.id !== id))

  return { albums, add, remove }
}
