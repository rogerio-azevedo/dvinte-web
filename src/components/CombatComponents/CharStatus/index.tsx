import * as Styles from './styles'

interface CharStatusProps {
  charStatus: any
}

export default function CharStatus({ charStatus }: CharStatusProps) {
  const fort = charStatus && charStatus.fortitude
  const ref = charStatus && charStatus.reflex
  const wil = charStatus && charStatus.will
  const init = charStatus && charStatus.charInit
  const mel = charStatus && charStatus.melee
  const ran = charStatus && charStatus.ranged
  const ca = charStatus && charStatus.totalCa
  const heal = charStatus && charStatus.health
  const healNow = charStatus && charStatus.healthNow

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Meus Atributos</h2>
      </Styles.HeaderContainer>

      <Styles.StatusContainer>
        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="inputResist">Fortitude</label>
            <Styles.InputResume readOnly defaultValue={fort} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="inputResist">Reflexos</label>
            <Styles.InputResume readOnly defaultValue={ref} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="inputResist">Vontade</label>
            <Styles.InputResume readOnly defaultValue={wil} />
          </Styles.Resume>
        </Styles.GroupStatus>

        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="inputResist">Iniciativa</label>
            <Styles.InputResume readOnly defaultValue={init} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="inputResist">Melee</label>
            <Styles.InputResume readOnly defaultValue={mel} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="inputResist">Ranged</label>
            <Styles.InputResume readOnly defaultValue={ran} />
          </Styles.Resume>
        </Styles.GroupStatus>

        <Styles.GroupStatus>
          <Styles.Resume>
            <label htmlFor="inputResist">CA</label>
            <Styles.InputResume readOnly defaultValue={ca} />
          </Styles.Resume>

          <Styles.Resume>
            <label htmlFor="inputResist">PV</label>
            <Styles.InputResume readOnly defaultValue={heal} />
          </Styles.Resume>
          <Styles.Resume>
            <label htmlFor="inputResist">PV Atual</label>
            <Styles.InputResume readOnly defaultValue={healNow} />
          </Styles.Resume>
        </Styles.GroupStatus>
      </Styles.StatusContainer>
    </Styles.Container>
  )
}
