import { toast } from 'react-toastify'

import api from '../../services/api'
import { calcDext } from '../../util/calcDex'
import { calculateEquipmentBonuses } from '../../util/calculateEquipmentBonuses'
import type { Character } from './interfaces'

export async function getCharacter(user: { id: number }) {
  try {
    const response = await api.get<Character>(`combats/${user?.id}`)
    const char = response.data

    const StrMod = char.StrModTemp ?? char.StrMod
    const ConMod = char.ConModTemp ?? char.ConMod
    const DexMod = char.DexModTemp ?? char.DexMod
    const WisMod = char.WisModTemp ?? char.WisMod

    // Calcula bônus de equipamentos
    const equipmentBonuses = calculateEquipmentBonuses(char?.Equipment || [])

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
    // Adiciona bônus de CA dos equipamentos
    const ca =
      10 +
      shield +
      armor +
      bonusDext +
      natural +
      outros +
      equipmentBonuses.armorClass

    return {
      char,
      maxDext,
      weapons: char?.Weapon,
      charInit: DexMod,
      // Adiciona bônus de resistências dos equipamentos
      fortitude: char.Fortitude + ConMod + equipmentBonuses.fortitude,
      reflex: char.Reflex + DexMod + equipmentBonuses.reflex,
      will: char.Will + WisMod + equipmentBonuses.will,
      // Adiciona bônus de ataque dos equipamentos
      strength: char.BaseAttack + StrMod + equipmentBonuses.attack,
      charStatus: {
        fortitude: char.Fortitude + ConMod + equipmentBonuses.fortitude,
        reflex: char.Reflex + DexMod + equipmentBonuses.reflex,
        will: char.Will + WisMod + equipmentBonuses.will,
        charInit: DexMod,
        melee: char.BaseAttack + StrMod + equipmentBonuses.attack,
        ranged: char.BaseAttack + DexMod + equipmentBonuses.attack,
        totalCa: ca,
        health: char.Health,
        healthNow: char.HealthNow,
      },
      equipmentBonuses, // Retorna os bônus para exibição
    }
  } catch (e) {
    console.error('Erro ao carregar os dados dos personagens:', e)
    toast.error('Houve um problema ao carregar os dados dos personagens!')
  }
}
