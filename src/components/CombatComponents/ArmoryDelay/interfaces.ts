/* eslint-disable @typescript-eslint/no-explicit-any */

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
}

export interface ArmoryProps {
  character: any
  weapons: any[]
  loadChar: () => Promise<void>
}
