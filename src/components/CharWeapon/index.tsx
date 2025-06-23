import React from 'react'
import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

import { Container, InputLarge, InputMed, InputShort, LabelDel } from './styles'

interface CharWeaponProps {
  weapons: any[]
  size: string
  char: number
}

export default function CharWeapon({ weapons, size, char }: CharWeaponProps) {
  async function handleRemove(item: any) {
    await api.delete(`characterweapons/${item.id}`, {
      params: {
        char: char,
      },
    })
  }
  return (
    <Container>
      <ul>
        {weapons?.map(item => (
          <li key={Math.random()}>
            <div>
              <label htmlFor="inputResist">Nome</label>
              <InputLarge
                readOnly
                defaultValue={
                  item.nickname !== '' &&
                  item.nickname !== undefined &&
                  item.nickname !== null
                    ? item.nickname
                    : item.name
                }
              />
            </div>
            <div>
              <label htmlFor="inputResist">Qtde</label>
              <InputShort
                readOnly
                defaultValue={
                  size === 'MÉDIO' ? item.multiplier_m : item.multiplier_s
                }
              />
            </div>
            <div>
              <label htmlFor="inputResist">Dado</label>
              <InputShort
                readOnly
                defaultValue={`d${
                  size === 'MÉDIO' ? item.dice_m : item.dice_s
                }`}
              />
            </div>
            <div>
              <label htmlFor="inputResist">Crítico</label>
              <InputMed
                readOnly
                defaultValue={`${
                  item.crit_from_mod > 0 ? item.crit_from_mod : item.crit_from
                }-20 / ${item.crit_mod > 0 ? item.crit_mod : item.critical}x`}
              />
            </div>
            <div>
              <label htmlFor="inputResist">Elemento</label>
              <InputShort readOnly defaultValue={`d${item.element}`} />
            </div>
            <div>
              <label htmlFor="inputResist">Alcance</label>
              <InputShort readOnly defaultValue={item.range} />
            </div>
            <div>
              <label htmlFor="inputResist">Tipo</label>
              <InputMed readOnly defaultValue={item.type} />
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
