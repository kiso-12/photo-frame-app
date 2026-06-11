import { useState } from 'react'
import { useAlbums } from './hooks/useAlbums'
import { usePhotos } from './hooks/usePhotos'
import { AlbumList } from './components/AlbumList'
import { PhotoGrid } from './components/PhotoGrid'
import { PhotoUploader } from './components/PhotoUploader'
import { PhotoViewer } from './components/PhotoViewer'
import { Slideshow } from './components/Slideshow'

export default function App() {
  const { albums, add: addAlbum, remove: removeAlbum } = useAlbums()
  const { photos, add: addPhoto, remove: removePhoto, updateFrame, reorder, clearAll } = usePhotos()
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)
  const [uploaderOpen, setUploaderOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [slideshowOpen, setSlideshowOpen] = useState(false)

  const filtered = selectedAlbum ? photos.filter(p => p.albumId === selectedAlbum) : photos
  const sorted = [...filtered].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-bold text-lg">🖼️ フォトフレーム</h1>
        <div className="flex gap-2">
          <button onClick={() => setUploaderOpen(true)}
            className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
            + 写真を追加
          </button>
          <button onClick={() => setSlideshowOpen(true)} disabled={sorted.length === 0}
            className="bg-blue-500 border border-white/50 text-white px-3 py-1 rounded text-sm hover:bg-blue-400 disabled:opacity-40">
            ▶ スライドショー
          </button>
          <button
            onClick={async () => { if (confirm('写真とアルバムをすべて削除しますか？')) { await clearAll(); localStorage.removeItem('albums'); location.reload() } }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
            🗑 リセット
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <AlbumList
          albums={albums}
          selected={selectedAlbum}
          onSelect={setSelectedAlbum}
          onAdd={addAlbum}
          onRemove={id => { removeAlbum(id); if (selectedAlbum === id) setSelectedAlbum(null) }}
        />

        <main className="flex-1 overflow-y-auto">
          <PhotoGrid
            photos={sorted}
            onRemove={removePhoto}
            onSelect={id => setViewerIndex(sorted.findIndex(p => p.id === id))}
            onReorder={ids => reorder(ids)}
          />
        </main>
      </div>

      {/* Modals */}
      {uploaderOpen && (
        <PhotoUploader
          albums={albums}
          defaultAlbumId={selectedAlbum}
          onAdd={(src, type, name, albumId) => addPhoto({ src, type, name, albumId })}
          onClose={() => setUploaderOpen(false)}
        />
      )}

      {viewerIndex !== null && (
        <PhotoViewer
          photos={sorted}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onFrameChange={updateFrame}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {slideshowOpen && (
        <Slideshow photos={sorted} onClose={() => setSlideshowOpen(false)} />
      )}
    </div>
  )
}
