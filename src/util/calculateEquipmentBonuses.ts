interface Equipment {
  attack_bonus: number
  damage_bonus: number
  armor_class_bonus: number
  fortitude_bonus: number
  reflex_bonus: number
  will_bonus: number
}

export interface EquipmentBonuses {
  attack: number
  damage: number
  armorClass: number
  fortitude: number
  reflex: number
  will: number
}

/**
 * Calcula todos os bônus fornecidos pelos equipamentos do personagem
 */
export function calculateEquipmentBonuses(
  equipments: Equipment[]
): EquipmentBonuses {
  if (!equipments || equipments.length === 0) {
    return {
      attack: 0,
      damage: 0,
      armorClass: 0,
      fortitude: 0,
      reflex: 0,
      will: 0,
    }
  }

  const bonuses = equipments.reduce(
    (acc, equip) => {
      // Soma todos os bônus numéricos
      acc.attack += equip.attack_bonus || 0
      acc.damage += equip.damage_bonus || 0
      acc.armorClass += equip.armor_class_bonus || 0
      acc.fortitude += equip.fortitude_bonus || 0
      acc.reflex += equip.reflex_bonus || 0
      acc.will += equip.will_bonus || 0

      return acc
    },
    {
      attack: 0,
      damage: 0,
      armorClass: 0,
      fortitude: 0,
      reflex: 0,
      will: 0,
    }
  )

  return bonuses
}
