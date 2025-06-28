export interface User {
  id: number
  name: string
  is_gm: boolean
}

export interface RootState {
  user: {
    profile: User
  }
  menu: {
    chatMenu: boolean
  }
}

export interface Armor {
  id: number
  type: number
  bonus: number
  defense: number
  dexterity: number
}

export interface Weapon {
  id: number
  name: string
  nickname?: string
  dice_m: number
  dice_s: number
  multiplier_m: number
  multiplier_s: number
  critical: number
  crit_from: number
  crit_from_mod: number
  crit_mod: number
  range: number
  damage: number
  element: number
  hit: number
  str_bonus: number
  dex_damage: boolean
}

export interface Character {
  id: number
  name: string
  Health: number
  HealthNow: number
  Size: string
  Fortitude: number
  Reflex: number
  Will: number
  BaseAttack: number
  StrMod: number
  DexMod: number
  ConMod: number
  WisMod: number
  StrModTemp?: number
  DexModTemp?: number
  ConModTemp?: number
  WisModTemp?: number
  Armor: Armor[]
  Weapon: Weapon[]
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

export interface CharStatusProps {
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

export type MenuType =
  | 'chat'
  | 'init'
  | 'saves'
  | 'damage'
  | 'status'
  | 'attack'
  | 'config'
