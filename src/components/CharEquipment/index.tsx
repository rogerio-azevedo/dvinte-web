/* eslint-disable no-console */

import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'
import BonusBadge from '../EquipmentBonusBadge/BonusBadge'

interface Equipment {
  id: number
  name: string
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  attack_bonus: number
  damage_bonus: string | number
  armor_class_bonus: number
  fortitude_bonus: number
  reflex_bonus: number
  will_bonus: number
  weight: number
  price: number
  CharacterEquipment?: {
    id: number
  }
}

interface CharEquipmentProps {
  equipments: Equipment[]
  char: number
  onEquipmentRemoved: () => void
}

const CharEquipment: React.FC<CharEquipmentProps> = ({
  equipments,
  char,
  onEquipmentRemoved,
}) => {
  const handleRemove = async (item: Equipment): Promise<void> => {
    try {
      if (!item.CharacterEquipment?.id) {
        console.error('ID do vínculo não encontrado')
        return
      }

      await api.delete(`characterequipments/${item.CharacterEquipment.id}`, {
        params: {
          char: char,
        },
      })
      onEquipmentRemoved()
    } catch (error) {
      console.error('Erro ao remover equipamento:', error)
    }
  }

  return (
    <div className="w-full">
      {equipments?.map(item => (
        <div
          key={item.id}
          className="flex flex-wrap items-center gap-2 p-3 mb-2 bg-white border border-gray-300 rounded shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Nome do Equipamento */}
          <div className="flex items-center min-w-[200px] flex-1">
            <span className="font-semibold text-[#6f0000] text-sm">
              {item.name}
            </span>
          </div>

          {/* Bônus - Mostrar apenas se diferente de zero */}
          <div className="flex flex-wrap gap-1.5 flex-1">
            <BonusBadge
              label="FOR"
              value={item.str_temp}
              color="bg-red-100 text-red-700"
            />
            <BonusBadge
              label="DES"
              value={item.dex_temp}
              color="bg-blue-100 text-blue-700"
            />
            <BonusBadge
              label="CON"
              value={item.con_temp}
              color="bg-green-100 text-green-700"
            />
            <BonusBadge
              label="INT"
              value={item.int_temp}
              color="bg-purple-100 text-purple-700"
            />
            <BonusBadge
              label="SAB"
              value={item.wis_temp}
              color="bg-yellow-100 text-yellow-700"
            />
            <BonusBadge
              label="CAR"
              value={item.cha_temp}
              color="bg-pink-100 text-pink-700"
            />
            <BonusBadge
              label="Acerto"
              value={item.attack_bonus}
              color="bg-orange-100 text-orange-700"
            />
            <BonusBadge
              label="Dano"
              value={item.damage_bonus}
              color="bg-red-100 text-red-700"
            />
            <BonusBadge
              label="CA"
              value={item.armor_class_bonus}
              color="bg-indigo-100 text-indigo-700"
            />
            <BonusBadge
              label="Fort"
              value={item.fortitude_bonus}
              color="bg-green-100 text-green-700"
            />
            <BonusBadge
              label="Refl"
              value={item.reflex_bonus}
              color="bg-blue-100 text-blue-700"
            />
            <BonusBadge
              label="Vont"
              value={item.will_bonus}
              color="bg-purple-100 text-purple-700"
            />
          </div>

          {/* Peso e Preço */}
          <div className="flex gap-2 items-center">
            {item.weight > 0 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {item.weight} kg
              </span>
            )}
            {item.price > 0 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {item.price} PO
              </span>
            )}
          </div>

          {/* Botão de Remover */}
          <button
            onClick={() => handleRemove(item)}
            className="p-2 text-[#8e0e00] hover:bg-red-50 rounded transition-colors"
            title="Remover equipamento"
          >
            <FaTimes size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default CharEquipment
