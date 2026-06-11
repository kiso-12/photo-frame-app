import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Photo } from '../types'
import { frameToCSS } from '../utils/frameToCSS'

function SortablePhoto({ photo, onRemove, onSelect }: { photo: Photo; onRemove: () => void; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative group cursor-pointer" {...attributes} {...listeners}>
      <div style={frameToCSS(photo.frame)} className="overflow-hidden rounded">
        <img src={photo.src} alt={photo.name} onClick={onSelect}
          className="w-full h-32 object-cover" />
      </div>
      <button onClick={e => { e.stopPropagation(); onRemove() }}
        className="absolute top-1 right-1 hidden group-hover:flex bg-red-500 text-white rounded-full w-5 h-5 items-center justify-center text-xs">
        ✕
      </button>
    </div>
  )
}

interface Props {
  photos: Photo[]
  onRemove: (id: string) => void
  onSelect: (id: string) => void
  onReorder: (ids: string[]) => void
}

export function PhotoGrid({ photos, onRemove, onSelect, onReorder }: Props) {
  if (photos.length === 0)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
        <span className="text-4xl">🖼️</span>
        <p>写真がありません。追加してください。</p>
      </div>
    )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const ids = photos.map(p => p.id)
    const from = ids.indexOf(active.id as string)
    const to = ids.indexOf(over.id as string)
    onReorder(arrayMove(ids, from, to))
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
          {photos.map(p => (
            <SortablePhoto key={p.id} photo={p} onRemove={() => onRemove(p.id)} onSelect={() => onSelect(p.id)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
