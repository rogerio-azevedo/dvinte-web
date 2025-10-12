import React from 'react'
import { Tooltip } from 'antd'

interface Equipment {
  name: string
  attack_bonus?: number
  damage_bonus?: number
  armor_class_bonus?: number
  fortitude_bonus?: number
  reflex_bonus?: number
  will_bonus?: number
}

interface EquipmentBonusBadgeProps {
  equipments: Equipment[]
  bonusType:
    | 'attack'
    | 'armorClass'
    | 'fortitude'
    | 'reflex'
    | 'will'
    | 'damage'
  totalBonus: number | string
}

const bonusLabels = {
  attack: 'Acerto',
  armorClass: 'CA',
  fortitude: 'Fort',
  reflex: 'Refl',
  will: 'Vont',
  damage: 'Dano',
}

const bonusFields = {
  attack: 'attack_bonus',
  armorClass: 'armor_class_bonus',
  fortitude: 'fortitude_bonus',
  reflex: 'reflex_bonus',
  will: 'will_bonus',
  damage: 'damage_bonus',
}

const EquipmentBonusBadge: React.FC<EquipmentBonusBadgeProps> = ({
  equipments,
  bonusType,
  totalBonus,
}) => {
  // Filtra equipamentos que fornecem esse bônus
  const relevantEquipments = equipments?.filter(equip => {
    const field = bonusFields[bonusType] as keyof Equipment
    const value = equip[field]
    if (bonusType === 'damage') {
      return value && value !== ''
    }
    return value && (typeof value === 'number' ? value !== 0 : true)
  })

  if (!relevantEquipments || relevantEquipments.length === 0) {
    return null
  }

  // Cria o conteúdo do tooltip
  const tooltipContent = (
    <div style={{ maxWidth: '250px' }}>
      <div
        style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}
      >
        Bônus de {bonusLabels[bonusType]}:
      </div>
      {relevantEquipments.map((equip, index) => {
        const field = bonusFields[bonusType] as keyof Equipment
        const value = equip[field]
        return (
          <div
            key={index}
            style={{
              fontSize: '12px',
              padding: '2px 0',
              borderBottom:
                index < relevantEquipments.length - 1
                  ? '1px solid rgba(255,255,255,0.2)'
                  : 'none',
            }}
          >
            <span style={{ color: '#ffd700' }}>•</span> {equip.name}:{' '}
            <span style={{ fontWeight: 'bold' }}>
              {bonusType === 'damage' ? value : `+${value}`}
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <Tooltip title={tooltipContent} placement="top">
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#8e0e00',
          color: 'white',
          borderRadius: '4px',
          padding: '2px 6px',
          fontSize: '11px',
          fontWeight: 'bold',
          marginLeft: '4px',
          cursor: 'help',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        title="Clique para ver detalhes"
      >
        {typeof totalBonus === 'number' && totalBonus > 0 && '+'}
        {totalBonus}
      </span>
    </Tooltip>
  )
}

export default EquipmentBonusBadge
