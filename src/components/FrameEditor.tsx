import type { FrameSettings } from '../types'

const PRESETS: FrameSettings['preset'][] = ['none', 'classic', 'modern', 'polaroid', 'shadow']
const PRESET_LABELS: Record<FrameSettings['preset'], string> = {
  none: 'なし', classic: 'クラシック', modern: 'モダン', polaroid: 'ポラロイド', shadow: 'シャドウ',
}

interface Props {
  frame: FrameSettings
  onChange: (f: FrameSettings) => void
}

export function FrameEditor({ frame, onChange }: Props) {
  const set = (patch: Partial<FrameSettings>) => onChange({ ...frame, ...patch })

  return (
    <div className="p-3 flex flex-col gap-3">
      <h3 className="font-semibold text-sm text-gray-600">フレーム</h3>
      <div className="flex flex-wrap gap-1">
        {PRESETS.map(p => (
          <button key={p} onClick={() => set({ preset: p })}
            className={`px-2 py-1 rounded text-xs border ${frame.preset === p ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100'}`}>
            {PRESET_LABELS[p]}
          </button>
        ))}
      </div>

      {frame.preset === 'none' && (
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            色
            <input type="color" value={frame.color} onChange={e => set({ color: e.target.value })} className="w-8 h-6 cursor-pointer" />
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            太さ {frame.width}px
            <input type="range" min="0" max="30" value={frame.width} onChange={e => set({ width: +e.target.value })} className="flex-1" />
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="checkbox" checked={frame.shadow} onChange={e => set({ shadow: e.target.checked })} />
            影
          </label>
        </div>
      )}
    </div>
  )
}
