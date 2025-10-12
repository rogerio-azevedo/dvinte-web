export interface CharacterClass {
  id: number
  name: string
  level: number
}

export interface Armor {
  id: number
  type: number
  bonus: number
  defense: number
  dexterity: number
  name: string
  penalty: number
  displacement_m: number
  displacement_s: number
  weight: number
  price: number
}

export interface Weapon {
  id: number
  name: string
  damage: string
  critical: string
  range: number
  type: string
  weight: number
}

export interface Equipment {
  id: number
  name: string
  quantity: number
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
  CharacterEquipment?: {
    id: number
    description: string
  }
}

export interface Character {
  id: number
  Name: string
  User: string
  Race: string
  Alig: string
  Age: number
  Gender: string
  Size: string
  Divin: string
  Height: string
  Weight: string
  Eye: string
  Hair: string
  Skin: string
  Portrait: string
  Level: number
  Exp: number
  Health: number
  HealthNow: number
  BaseAttack: number
  Str: number
  StrMod: number
  StrTemp: number
  StrModTemp: number
  Dex: number
  DexMod: number
  DexTemp: number
  DexModTemp: number
  Con: number
  ConMod: number
  ConTemp: number
  ConModTemp: number
  Int: number
  IntMod: number
  IntTemp: number
  IntModTemp: number
  Wis: number
  WisMod: number
  WisTemp: number
  WisModTemp: number
  Cha: number
  ChaMod: number
  ChaTemp: number
  ChaModTemp: number
  Cod: number
  Classes: CharacterClass[]
  Armor: Armor[]
  Weapon: Weapon[]
  Equipment: Equipment[]
  Fortitude: number
  Reflex: number
  Will: number
}

export interface Resistance {
  Fortitude: number
  Reflex: number
  Will: number
  ConMod: number
  DexMod: number
  WisMod: number
  ConModTemp?: number
  DexModTemp?: number
  WisModTemp?: number
}
