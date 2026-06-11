export interface FrameSettings {
  preset: 'none' | 'classic' | 'modern' | 'polaroid' | 'shadow'
  color: string
  width: number
  shadow: boolean
}

export interface Photo {
  id: string
  albumId: string
  src: string
  type: 'file' | 'url'
  name: string
  order: number
  frame: FrameSettings
}

export interface Album {
  id: string
  name: string
  createdAt: string
}

export const DEFAULT_FRAME: FrameSettings = {
  preset: 'none',
  color: '#000000',
  width: 4,
  shadow: false,
}
