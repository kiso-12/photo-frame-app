import { useState } from 'react'
import type { Album } from '../types'

interface Props {
  albums: Album[]
  selected: string | null
  onSelect: (id: string | null) => void
  onAdd: (name: string) => void
  onRemove: (id: string) => void
}

export function AlbumList({ albums, selected, onSelect, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) { onAdd(name.trim()); setName('') }
  }

  return (
    <aside className="w-48 shrink-0 bg-gray-100 border-r border-gray-200 p-3 flex flex-col gap-2">
      <h2 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">アルバム</h2>
      <button
        onClick={() => onSelect(null)}
        className={`text-left px-2 py-1 rounded text-sm ${selected === null ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
      >
        すべて
      </button>
      {albums.map(a => (
        <div key={a.id} className="flex items-center gap-1 group">
          <button
            onClick={() => onSelect(a.id)}
            className={`flex-1 text-left px-2 py-1 rounded text-sm truncate ${selected === a.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
          >
            {a.name}
          </button>
          <button
            onClick={() => onRemove(a.id)}
            className="hidden group-hover:block text-red-400 hover:text-red-600 text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}
      <form onSubmit={submit} className="flex gap-1 mt-auto">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="新しいアルバム"
          className="flex-1 text-xs border rounded px-1 py-1 min-w-0"
        />
        <button type="submit" className="text-xs bg-blue-500 text-white px-2 rounded hover:bg-blue-600">+</button>
      </form>
    </aside>
  )
}
