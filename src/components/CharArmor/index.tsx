/* eslint-disable no-console */

import { FaTimes } from "react-icons/fa"
import api from "../../services/api"
import { Container, InputLarge, InputMed, InputShort, LabelDel } from "./styles"

interface Armor {
  id: number
  name?: string
  type: number
  bonus: number
  defense: number
  dexterity: number
  penalty?: number
  displacement_m?: number
  displacement_s?: number
  weight?: number
  price?: number
}

export const ArmorType = {
  Armor: 1,
  Shield: 2,
  Natural: 3,
  Others: 5,
} as const

export type ArmorType = (typeof ArmorType)[keyof typeof ArmorType]

interface CharArmorProps {
  armors: Armor[]
  size: string
  char: number
  onArmorRemoved: () => void
}

const CharArmor: React.FC<CharArmorProps> = ({
  armors,
  size,
  char,
  onArmorRemoved,
}) => {
  const handleRemove = async (item: Armor): Promise<void> => {
    try {
      await api.delete(`characterarmors/${item.id}`, {
        params: {
          char: char,
        },
      })
      onArmorRemoved()
    } catch (error) {
      console.error("Erro ao remover armadura:", error)
    }
  }

  return (
    <Container>
      <ul>
        {armors.map((item) => (
          <li key={item.id}>
            <div>
              <label htmlFor="name">Nome</label>
              <InputLarge readOnly defaultValue={item.name} />
            </div>
            <div>
              <label htmlFor="type">Tipo</label>
              <InputShort readOnly defaultValue={getArmorType(item.type)} />
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
                  size === "MÉDIO" ? item.displacement_m : item.displacement_s
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

function getArmorType(type: number): string {
  switch (type) {
    case ArmorType.Armor:
      return "Armadura"
    case ArmorType.Shield:
      return "Escudo"
    case ArmorType.Natural:
      return "Natural"
    case ArmorType.Others:
      return "Outros"
    default:
      return "Desconhecido"
  }
}

export default CharArmor
