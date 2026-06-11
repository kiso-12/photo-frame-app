import type { FrameSettings } from '../types'
import type { CSSProperties } from 'react'

export function frameToCSS(f: FrameSettings): CSSProperties {
  switch (f.preset) {
    case 'classic':
      return { border: '8px solid #8B4513', boxShadow: '2px 2px 6px rgba(0,0,0,0.4)' }
    case 'modern':
      return { border: '2px solid #333' }
    case 'polaroid':
      return { border: '12px solid white', borderBottom: '40px solid white', boxShadow: '2px 2px 8px rgba(0,0,0,0.3)' }
    case 'shadow':
      return { boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }
    default: {
      const style: CSSProperties = {}
      if (f.width > 0) style.border = `${f.width}px solid ${f.color}`
      if (f.shadow) style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)'
      return style
    }
  }
}
