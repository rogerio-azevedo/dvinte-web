import {
  Container,
  MainResistContainer,
  LabelContainer,
  ResistMainLabel,
  ResistLabel,
  InputResitContainer,
  InputResit,
} from './styles'

interface CharResistProps {
  resist: any
}

export default function CharResist({ resist }: CharResistProps) {
  const fortitude = resist.Fortitude
  const reflex = resist.Reflex
  const will = resist.Will

  const forMod = resist.ConModTemp ? resist.ConModTemp : resist.ConMod
  const refMod = resist.DexModTemp ? resist.DexModTemp : resist.DexMod
  const wisMod = resist.WisModTemp ? resist.WisModTemp : resist.WisMod

  const forTotal = Number(fortitude) + Number(forMod)
  const refTotal = Number(reflex) + Number(refMod)
  const wisTotal = Number(will) + Number(wisMod)

  return (
    <Container>
      <MainResistContainer>
        <LabelContainer>
          <ResistMainLabel readOnly defaultValue="FORTITUDE" />
          <ResistLabel readOnly defaultValue="(Constituição)" />
        </LabelContainer>
        <InputResitContainer>
          <div>
            <label htmlFor="inputResist">total</label>
            <InputResit readOnly defaultValue={forTotal} />
          </div>
          <div>
            <label htmlFor="inputResist">base</label>
            <InputResit readOnly defaultValue={fortitude} />
          </div>
          <div>
            <label htmlFor="inputResist">mod</label>
            <InputResit readOnly defaultValue={forMod} />
          </div>
          <div>
            <label htmlFor="inputResist">magic</label>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <label htmlFor="inputResist">outros</label>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <label htmlFor="inputResist">temp</label>
            <InputResit readOnly defaultValue="" />
          </div>
        </InputResitContainer>
      </MainResistContainer>

      <MainResistContainer>
        <LabelContainer>
          <ResistMainLabel readOnly defaultValue="REFLEXOS" />
          <ResistLabel readOnly defaultValue="(Destreza)" />
        </LabelContainer>
        <InputResitContainer>
          <div>
            <InputResit readOnly defaultValue={refTotal} />
          </div>
          <div>
            <InputResit readOnly defaultValue={reflex} />
          </div>
          <div>
            <InputResit readOnly defaultValue={refMod} />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
        </InputResitContainer>
      </MainResistContainer>

      <MainResistContainer>
        <LabelContainer>
          <ResistMainLabel readOnly defaultValue="VONTADE" />
          <ResistLabel readOnly defaultValue="(Sabedoria)" />
        </LabelContainer>
        <InputResitContainer>
          <div>
            <InputResit readOnly defaultValue={wisTotal} />
          </div>
          <div>
            <InputResit readOnly defaultValue={will} />
          </div>
          <div>
            <InputResit readOnly defaultValue={wisMod} />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
          <div>
            <InputResit readOnly defaultValue="" />
          </div>
        </InputResitContainer>
      </MainResistContainer>
    </Container>
  )
}
