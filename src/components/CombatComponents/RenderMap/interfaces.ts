import type { Dispatch, SetStateAction } from 'react'

export interface RenderMapProps {
  tokens?: Token[]
  allowDrag?: boolean
  setTokens?: Dispatch<SetStateAction<Token[]>>
}

export interface Token {
  id: number
  x: number
  y: number
  image: string
  width: number
  height: number
  rotation: number
  enabled: boolean
  character_id: number
  label?: string | null
  layer?: 'public' | 'gm'
  character?: {
    id: number
    name: string
    level: number
    health: number
    health_now: number
    user_id: number
  }
}

export interface MapData {
  width: number
  height: number
  battle: string
  battle_gm?: string
  portrait: string
  portrait_gm?: string
  grid: boolean
  fog: boolean
  orientation: boolean
  gm_layer?: boolean
}

export interface Line {
  id: number
  tool: string
  points: number[]
  size?: number
  color?: string
}

export interface StagePos {
  x: number
  y: number
}

export interface Profile {
  id: number
  is_gm: boolean
}

// Redux State Types
export interface RootState {
  user: {
    profile: Profile
  }
  menu: {
    fogLevel: number
    eraserSize: number
    fogPersist: Line[]
    chatMenu: boolean
  }
}
