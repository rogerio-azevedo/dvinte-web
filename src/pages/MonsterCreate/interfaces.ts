export interface Attack {
  name: string
  dice: string
  multiplier: string
  critical: string
  crit_from: string
  range: string
  hit: string
  damage: string
}

export interface FormData {
  name: string
  quantity: number
  type: string
  subType: string
  size: string
  alignment: string
  health: string
  initiative: string
  displacement: string
  ca: string
  defense: string
  grab: string
  challenge: string
  attack_special: string
  special_qualities: string
  fort: string
  reflex: string
  will: string
  skills: string
  feats: string
  monster_url: string
  strength: string
  dexterity: string
  constitution: string
  intelligence: string
  wisdom: string
  charisma: string
  notes: string
  is_ativo: boolean
}
