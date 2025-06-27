import React from 'react'
import * as Styles from './styles'

interface CharacterStatus {
  fortitude: number
  reflex: number
  will: number
  charInit: number
  melee: number
  ranged: number
  totalCa: number
  health: number
  healthNow: number
}

interface CharStatusProps {
  charStatus: CharacterStatus | null
}

const CharStatus: React.FC<CharStatusProps> = ({ charStatus }) => {
  const fort = charStatus?.fortitude ?? 0
  const ref = charStatus?.reflex ?? 0
  const wil = charStatus?.will ?? 0
  const init = charStatus?.charInit ?? 0
  const mel = charStatus?.melee ?? 0
  const ran = charStatus?.ranged ?? 0
  const ca = charStatus?.totalCa ?? 0
  const heal = charStatus?.health ?? 0
  const healNow = charStatus?.healthNow ?? 0

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Meus Atributos</h2>
      </Styles.HeaderContainer>

      <Styles.StatusContainer>
        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="fortitude">Fortitude</label>
            <Styles.InputResume id="fortitude" readOnly defaultValue={fort} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="reflexos">Reflexos</label>
            <Styles.InputResume id="reflexos" readOnly defaultValue={ref} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="vontade">Vontade</label>
            <Styles.InputResume id="vontade" readOnly defaultValue={wil} />
          </Styles.Resume>
        </Styles.GroupStatus>

        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="iniciativa">Iniciativa</label>
            <Styles.InputResume id="iniciativa" readOnly defaultValue={init} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="melee">Melee</label>
            <Styles.InputResume id="melee" readOnly defaultValue={mel} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="ranged">Ranged</label>
            <Styles.InputResume id="ranged" readOnly defaultValue={ran} />
          </Styles.Resume>
        </Styles.GroupStatus>

        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="ca">CA</label>
            <Styles.InputResume id="ca" readOnly defaultValue={ca} />
          </Styles.Resume>

          <Styles.Resume>
            <label htmlFor="pv">PV</label>
            <Styles.InputResume id="pv" readOnly defaultValue={heal} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="pvAtual">PV Atual</label>
            <Styles.InputResume id="pvAtual" readOnly defaultValue={healNow} />
          </Styles.Resume>
        </Styles.GroupStatus>
      </Styles.StatusContainer>
    </Styles.Container>
  )
}

export default CharStatus
