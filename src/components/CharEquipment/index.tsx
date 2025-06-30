/* eslint-disable no-console */

import { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

import { Container, InputLarge, InputMed, InputShort, LabelDel } from './styles'

interface Equipment {
  id: number
  name: string
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
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

  useEffect(() => {
    // Efeito executado quando equipments muda
  }, [equipments])

  return (
    <Container>
      <ul>
        {equipments?.map(item => (
          <li key={item.id}>
            <div>
              <label htmlFor="inputEquip">Nome</label>
              <InputLarge readOnly defaultValue={item.name} />
            </div>
            <div>
              <label htmlFor="inputEquip">FOR</label>
              <InputShort readOnly defaultValue={item.str_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">DES</label>
              <InputShort readOnly defaultValue={item.dex_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">CON</label>
              <InputShort readOnly defaultValue={item.con_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">INT</label>
              <InputShort readOnly defaultValue={item.int_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">SAB</label>
              <InputShort readOnly defaultValue={item.wis_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">CAR</label>
              <InputShort readOnly defaultValue={item.cha_temp} />
            </div>
            <div>
              <label htmlFor="inputEquip">Peso</label>
              <InputShort readOnly defaultValue={`${item.weight} kg`} />
            </div>
            <div>
              <label htmlFor="inputEquip">Preço</label>
              <InputMed readOnly defaultValue={`${item.price} PO`} />
            </div>
            <div>
              <LabelDel htmlFor="inputEquip">Excluir</LabelDel>
              <span>
                <FaTimes
                  size={20}
                  color="#8e0e00"
                  cursor="pointer"
                  onClick={() => handleRemove(item)}
                />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default CharEquipment
