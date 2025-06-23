import { FaTimes } from 'react-icons/fa'
import api from '../../services/api'

import { Container, InputLarge, InputMed, InputShort, LabelDel } from './styles'

interface CharArmorProps {
  armors: any[]
  size: string
  char: number
}

export default function CharArmor({ armors, size, char }: CharArmorProps) {
  async function handleRemove(item: any) {
    await api.delete(`characterarmors/${item.id}`, {
      params: {
        char: char,
      },
    })
  }

  return (
    <Container>
      <ul>
        {armors.map(item => (
          <li key={Math.random()}>
            <div>
              <label htmlFor="name">Nome</label>
              <InputLarge readOnly defaultValue={item.name} />
            </div>
            <div>
              <label htmlFor="type">Tipo</label>
              <InputShort readOnly defaultValue={item.type} />
            </div>
            <div>
              <label htmlFor="bonus">Bônus</label>
              <InputShort readOnly defaultValue={item.bonus} />
            </div>
            <div>
              <label htmlFor="defense">Encant</label>
              <InputShort readOnly defaultValue={item.defense} />
            </div>
            <div>
              <label htmlFor="dexterity">Dest Max</label>
              <InputShort readOnly defaultValue={item.dexterity} />
            </div>
            <div>
              <label htmlFor="penalty">Penalidade</label>
              <InputShort readOnly defaultValue={item.penalty} />
            </div>
            <div>
              <label htmlFor="displacement">Deslocamento</label>
              <InputMed
                readOnly
                defaultValue={
                  size === 'MÉDIO' ? item.displacement_m : item.displacement_s
                }
              />
            </div>
            <div>
              <label htmlFor="weight">Peso</label>
              <InputShort readOnly defaultValue={`${item.weight} kg`} />
            </div>
            <div>
              <label htmlFor="price">Preço</label>
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
