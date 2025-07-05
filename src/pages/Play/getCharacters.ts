import { toast } from 'react-toastify'

import api from '../../services/api'
import { calcDext } from '../../util/calcDex'
import type { Character } from './interfaces'

export async function getCharacter(user: { id: number }) {
  try {
    const response = await api.get<Character>(`combats/${user?.id}`)
    const char = response.data

    const StrMod = char.StrModTemp ?? char.StrMod
    const ConMod = char.ConModTemp ?? char.ConMod
    const DexMod = char.DexModTemp ?? char.DexMod
    const WisMod = char.WisModTemp ?? char.WisMod

    const shield = char?.Armor.filter(t => t.type === 2).reduce(
      (acc, val) => acc + (val.bonus + val.defense),
      0
    )
    const armor = char?.Armor.filter(t => t.type === 1).reduce(
      (acc, val) => acc + (val.bonus + val.defense),
      0
    )
    const natural = char?.Armor.filter(t => t.type === 3).reduce(
      (acc, val) => acc + (val.bonus + val.defense),
      0
    )
    const outros = char?.Armor.filter(t => t.type === 5).reduce(
      (acc, val) => acc + (val.bonus + val.defense),
      0
    )
    const maxDext = char?.Armor.reduce(
      (min, p) => (p?.dexterity < min ? p?.dexterity : min),
      char?.Armor[0]?.dexterity
    )

    const bonusDext = await calcDext(DexMod, maxDext)
    const ca = 10 + shield + armor + bonusDext + natural + outros

    return {
      char,
      maxDext,
      weapons: char?.Weapon,
      charInit: DexMod,
      fortitude: char.Fortitude + ConMod,
      reflex: char.Reflex + DexMod,
      will: char.Will + WisMod,
      strength: char.BaseAttack + StrMod,
      charStatus: {
        fortitude: char.Fortitude + ConMod,
        reflex: char.Reflex + DexMod,
        will: char.Will + WisMod,
        charInit: DexMod,
        melee: char.BaseAttack + StrMod,
        ranged: char.BaseAttack + DexMod,
        totalCa: ca,
        health: char.Health,
        healthNow: char.HealthNow,
      },
    }
  } catch (e) {
    console.error('Erro ao carregar os dados dos personagens:', e)
    toast.error('Houve um problema ao carregar os dados dos personagens!')
  }
}
