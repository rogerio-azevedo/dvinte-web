import {
  Container,
  InputResitContainer,
  DefenseMainLabel,
  InputDefense,
} from './styles'

interface CharCaProps {
  armors: any[]
  dextMod: number
}

export default function CharCa({ armors, dextMod }: CharCaProps) {
  const armor =
    armors
      ?.filter(t => t.type === 1)
      ?.reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0) || 0

  const shield =
    armors
      ?.filter(t => t.type === 2)
      ?.reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0) || 0

  const natural =
    armors
      ?.filter(t => t.type === 3)
      ?.reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0) || 0

  const deflex =
    armors
      ?.filter(t => t.type === 4)
      ?.reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0) || 0

  const outros =
    armors
      ?.filter(t => t.type === 5)
      ?.reduce((acc, val) => {
        return acc + (val.bonus + val.defense)
      }, 0) || 0

  const maxDext = Math.min(
    ...armors?.filter(t => t.dexterity > 0).map(item => item.dexterity)
  )

  function calcDext(value: number) {
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
