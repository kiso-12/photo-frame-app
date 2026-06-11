import { useEffect, useState } from 'react'
import type { Photo, FrameSettings } from '../types'
import { DEFAULT_FRAME } from '../types'

const DB_NAME = 'photo-frame-db'
const STORE = 'photos'
const VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function dbGetAll(db: IDBDatabase): Promise<Photo[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result as Photo[])
    req.onerror = () => reject(req.error)
  })
}

function dbPut(db: IDBDatabase, photo: Photo): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).put(photo)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

function dbDelete(db: IDBDatabase, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

function dbClear(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    openDB().then(async db => {
      setDb(db)
      const all = await dbGetAll(db)
      setPhotos(all.sort((a, b) => a.order - b.order))
    })
  }, [])

  const add = async (partial: Pick<Photo, 'src' | 'type' | 'name' | 'albumId'>) => {
    if (!db) return
    const photo: Photo = {
      ...partial,
      id: crypto.randomUUID(),
      order: photos.length,
      frame: DEFAULT_FRAME,
    }
    await dbPut(db, photo)
    setPhotos(prev => [...prev, photo])
  }

  const remove = async (id: string) => {
    if (!db) return
    await dbDelete(db, id)
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const updateFrame = async (id: string, frame: FrameSettings) => {
    if (!db) return
    const photo = photos.find(p => p.id === id)
    if (!photo) return
    const updated = { ...photo, frame }
    await dbPut(db, updated)
    setPhotos(prev => prev.map(p => (p.id === id ? updated : p)))
  }

  const reorder = async (ids: string[]) => {
    if (!db) return
    const map = new Map(photos.map(p => [p.id, p]))
    const reordered = ids.map((id, i) => ({ ...map.get(id)!, order: i }))
    await Promise.all(reordered.map(p => dbPut(db, p)))
    setPhotos(reordered)
  }

  const clearAll = async () => {
    if (!db) return
    await dbClear(db)
    setPhotos([])
  }

  return { photos, add, remove, updateFrame, reorder, clearAll }
}
