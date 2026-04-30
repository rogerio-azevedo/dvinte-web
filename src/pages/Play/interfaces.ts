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
  Equipment: EquipmentItem[]
}

export interface ArmorItem {
  type: number
  bonus: number
  defense: number
  dexterity: number
}

export const MENU = {
  ATTACK: 'attack',
  CHAT: 'chat',
  SAVES: 'saves',
  DAMAGE: 'damage',
  INIT: 'init',
  STATUS: 'status',
  CONFIG: 'config',
} as const

export type MenuType = (typeof MENU)[keyof typeof MENU]

export interface WeaponItem {
  id: number
  name: string
  damage: string
  critical: string
}

export interface EquipmentItem {
  id: number
  name: string
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  attack_bonus: number
  damage_bonus: number
  armor_class_bonus: number
  fortitude_bonus: number
  reflex_bonus: number
  will_bonus: number
  weight: number
  price: number
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
