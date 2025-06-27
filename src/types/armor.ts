export interface Armor {
  id: number
  name?: string
  type: number
  bonus: number
  defense: number
  dexterity: number
  penalty?: number
  displacement_m?: number
  displacement_s?: number
  weight?: number
  price?: number
}

export enum ArmorType {
  Armor = 1,
  Shield = 2,
  Natural = 3,
  Others = 5,
}
