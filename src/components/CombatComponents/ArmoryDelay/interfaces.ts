/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Equipment {
  attack_bonus: number
  damage_bonus: number | string | null
  armor_class_bonus?: number
  fortitude_bonus?: number
  reflex_bonus?: number
  will_bonus?: number
}

export interface Character {
  id: number
  name: string
  Size?: string
  BaseAttack?: number
  StrMod?: number
  StrModTemp?: number
  DexMod?: number
  DexModTemp?: number
  Weapon?: any[]
  Equipment?: Equipment[]
}

export interface APICharacter {
  Cod: number
  Name: string
  Size?: string
  BaseAttack?: number
  StrMod?: number
  StrModTemp?: number
  DexMod?: number
  DexModTemp?: number
  Weapon?: any[]
  Equipment?: Equipment[]
}

export interface ArmoryProps {
  character: any
  weapons: any[]
  loadChar: () => Promise<void>
}
