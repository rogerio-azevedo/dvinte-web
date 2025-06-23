import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

import { Container, InputLarge, InputMed, InputShort, LabelDel } from './styles'

interface CharEquipmentProps {
  equipments: any[]
  char: number
}

export default function CharEquipment({
  equipments,
  char,
}: CharEquipmentProps) {
  async function handleRemove(item: any) {
    await api.delete(`characterequipments/${item.id}`, {
      params: {
        char: char,
      },
    })
  }

  useEffect(() => {}, [equipments])

  return (
    <Container>
      <ul>
        {equipments?.map(item => (
          <li key={Math.random()}>
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
              <label htmlFor="inputResist">Peso</label>
              <InputShort readOnly defaultValue={`${item.weight} kg`} />
            </div>
            <div>
              <label htmlFor="inputResist">Preço</label>
              <InputMed readOnly defaultValue={`${item.price} PO`} />
            </div>
            <div>
              <LabelDel htmlFor="inputResist">Excluir</LabelDel>
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
