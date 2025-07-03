import type { ReactNode } from 'react'

export interface Profile {
  id: number
  is_gm: boolean
  name: string
}

export interface Character {
  id: number
  Fortitude: number
  Reflex: number
  Will: number
  BaseAttack: number
  Health: number
  HealthNow: number
  StrMod: number
  StrModTemp?: number
  ConMod: number
  ConModTemp?: number
  DexMod: number
  DexModTemp?: number
  WisMod: number
  WisModTemp?: number
  Armor: ArmorItem[]
  Weapon: WeaponItem[]
}

export interface ArmorItem {
  type: number
  bonus: number
  defense: number
  dexterity: number
}

export interface WeaponItem {
  id: number
  name: string
  damage: string
  critical: string
}

export interface CharStatusData {
  fortitude: number
  reflex: number
  will: number
  charInit: number
  melee: number
  ranged: number
  totalCa: number
  health: number
  healthNow: number
}

export interface Token {
  id: number
  name: string
  url: string
  x: number
  y: number
  image: string
  width: number
  height: number
  rotation: number
  enabled: boolean
  character_id: number
}

export interface StyledProps {
  show?: boolean | number
  children?: ReactNode
}

// Redux State Types
export interface RootState {
  user: {
    profile: Profile
  }
  menu: {
    chatMenu: boolean
  }
  dices: {
    diceShow: boolean
    diceRoll: boolean
  }
}
