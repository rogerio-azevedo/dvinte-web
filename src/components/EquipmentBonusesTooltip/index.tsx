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

interface EquipmentBonusesTooltipProps {
  equipments: Equipment[]
  bonusType: 'attack' | 'armorClass' | 'fortitude' | 'reflex' | 'will'
  children: React.ReactNode
}

const bonusLabels = {
  attack: 'Acerto',
  armorClass: 'CA',
  fortitude: 'Fortitude',
  reflex: 'Reflexos',
  will: 'Vontade',
}

const bonusFields = {
  attack: 'attack_bonus',
  armorClass: 'armor_class_bonus',
  fortitude: 'fortitude_bonus',
  reflex: 'reflex_bonus',
  will: 'will_bonus',
}

const EquipmentBonusesTooltip: React.FC<EquipmentBonusesTooltipProps> = ({
  equipments,
  bonusType,
  children,
}) => {
  // Filtra equipamentos que fornecem esse bônus
  const relevantEquipments = equipments?.filter(equip => {
    const field = bonusFields[bonusType] as keyof Equipment
    const value = equip[field]
    return value && (typeof value === 'number' ? value !== 0 : true)
  })

  if (!relevantEquipments || relevantEquipments.length === 0) {
    return <>{children}</>
  }

  // Cria o conteúdo do tooltip
  const tooltipContent = (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        Bônus de {bonusLabels[bonusType]} dos Equipamentos:
      </div>
      {relevantEquipments.map((equip, index) => {
        const field = bonusFields[bonusType] as keyof Equipment
        const value = equip[field]
        return (
          <div key={index} style={{ fontSize: '12px' }}>
            • {equip.name}: +{value}
          </div>
        )
      })}
    </div>
  )

  return (
    <Tooltip title={tooltipContent} placement="top">
      {children}
    </Tooltip>
  )
}

export default EquipmentBonusesTooltip
