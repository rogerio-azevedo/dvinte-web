import React from 'react'
import {
  Container,
  InputResitContainer,
  DefenseMainLabel,
  InputDefense,
} from './styles'
import { Armor } from '../../types/armor'

interface CharCaProps {
  armors: Armor[]
  dextMod: number
}

const CharCa: React.FC<CharCaProps> = ({ armors, dextMod }) => {
  const calculateArmorTypeTotal = (type: number): number => {
    return (
      armors
        ?.filter(t => t.type === type)
        ?.reduce((acc, val) => {
          return acc + (val.bonus + val.defense)
        }, 0) || 0
    )
  }

  const armor = calculateArmorTypeTotal(1) // Armadura
  const shield = calculateArmorTypeTotal(2) // Escudo
  const natural = calculateArmorTypeTotal(3) // Armadura Natural
  const deflex = calculateArmorTypeTotal(4) // Deflex
  const outros = calculateArmorTypeTotal(5) // Outros

  const maxDext = Math.min(
    ...armors?.filter(t => t.dexterity > 0).map(item => item.dexterity)
  )

  const calcDext = (value: number): number => {
    let dextBonus = 0

    if (value <= maxDext) {
      dextBonus = dextMod
    } else if (!maxDext || maxDext === 0) {
      dextBonus = dextMod
    } else {
      dextBonus = maxDext
    }

    return dextBonus
  }

  const bonusDext = calcDext(dextMod)
  const totalCa = 10 + shield + armor + bonusDext + natural + deflex + outros

  return (
    <Container>
      <InputResitContainer>
        <div>
          <DefenseMainLabel readOnly defaultValue="CA" />
        </div>

        <div>
          <label htmlFor="inputResist">total</label>
          <InputDefense readOnly defaultValue={totalCa} />
        </div>
        <div>
          <label htmlFor="inputResist">armad</label>
          <InputDefense readOnly defaultValue={armor} />
        </div>
        <div>
          <label htmlFor="inputResist">escudo</label>
          <InputDefense readOnly defaultValue={shield} />
        </div>
        <div>
          <label htmlFor="inputResist">dest</label>
          <InputDefense readOnly defaultValue={bonusDext} />
        </div>
        <div>
          <label htmlFor="inputResist">tam</label>
          <InputDefense readOnly defaultValue="0" />
        </div>
        <div>
          <label htmlFor="inputResist">arm nat</label>
          <InputDefense readOnly defaultValue={natural} />
        </div>
        <div>
          <label htmlFor="inputResist">deflex</label>
          <InputDefense readOnly defaultValue={deflex} />
        </div>
        <div>
          <label htmlFor="inputResist">outros</label>
          <InputDefense readOnly defaultValue={outros} />
        </div>
      </InputResitContainer>
    </Container>
  )
}

export default CharCa
