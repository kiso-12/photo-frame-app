import { useState } from 'react'
import type { Album } from '../types'

interface Props {
  albums: Album[]
  defaultAlbumId: string | null
  onAdd: (src: string, type: 'file' | 'url', name: string, albumId: string) => void
  onClose: () => void
}

export function PhotoUploader({ albums, defaultAlbumId, onAdd, onClose }: Props) {
  const [tab, setTab] = useState<'file' | 'url'>('file')
  const [url, setUrl] = useState('')
  const [albumId, setAlbumId] = useState(defaultAlbumId ?? albums[0]?.id ?? '')

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => onAdd(ev.target!.result as string, 'file', file.name, albumId)
      reader.readAsDataURL(file)
    })
    onClose()
  }

  const handleUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) { onAdd(url.trim(), 'url', url.trim().split('/').pop() ?? 'image', albumId); onClose() }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">写真を追加</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        {albums.length > 0 && (
          <select value={albumId} onChange={e => setAlbumId(e.target.value)} className="w-full border rounded px-2 py-1 text-sm mb-4">
            {albums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        )}

        <div className="flex gap-2 mb-4">
          {(['file', 'url'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-1 rounded text-sm ${tab === t ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {t === 'file' ? 'ローカルファイル' : 'URL'}
            </button>
          ))}
        </div>

        {tab === 'file' ? (
          <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400">
            <span className="text-gray-500 text-sm">クリックして写真を選択</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
        ) : (
          <form onSubmit={handleUrl} className="flex flex-col gap-3">
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/image.jpg"
              className="border rounded px-2 py-2 text-sm w-full" />
            {url && <img src={url} alt="" className="w-full h-32 object-contain rounded border" onError={e => (e.currentTarget.style.display = 'none')} />}
            <button type="submit" className="bg-blue-500 text-white rounded py-2 text-sm hover:bg-blue-600">追加</button>
          </form>
        )}
      </div>
    </div>
  )
}
