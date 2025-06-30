import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from '../../services/api'

import * as Styles from './styles'

interface Attack {
  name: string
  multiplier: number
  dice: number
  crit_from: number
  critical: number
  range: number
  hit: number
  damage: number
}

interface Monster {
  id: number
  name: string
  type: string
  sub_type: string
  challenge: number
  grab: number
  initiative: number
  size: string
  alignment: string
  health: number
  health_now: number
  displacement: number
  ca: number
  defense: string
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
  fort: number
  reflex: number
  will: number
  attack_special: string
  special_qualities: string
  skills: string
  feats: string
  notes: string
  monster_url: string
  attacks: Attack[]
}

export default function MonsterDetail() {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [monster, setMonster] = useState<Monster | null>(null)

  useEffect(() => {
    async function loadChar() {
      const response = await api.get(`monsters/${id}`)
      const { data } = response
      setMonster(data)
      setLoading(false)
    }

    loadChar()
  }, [id])

  return (
    <Styles.Container loading={loading}>
      <Styles.HeaderContainer>
        <legend>Dados Básicos</legend>
        <div>
          <Styles.Portrait>
            <img src={monster?.monster_url} alt="" />
          </Styles.Portrait>

          <Styles.BaseContainer>
            <Styles.LineContaniner>
              <div>
                <Styles.InputLarge readOnly defaultValue={monster?.name} />
                <label htmlFor="name">Nome do Monstro</label>
              </div>

              <div>
                <Styles.InputLarge readOnly defaultValue={monster?.type} />
                <label htmlFor="type">Tipo</label>
              </div>
              <div>
                <Styles.InputLarge readOnly defaultValue={monster?.sub_type} />
                <label htmlFor="subtype">Sub Tipo</label>
              </div>
            </Styles.LineContaniner>

            <Styles.LineContaniner>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.challenge} />
                <label htmlFor="challenge">Desafio</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.grab} />
                <label htmlFor="grab">Agarrar</label>
              </div>
              <div>
                <Styles.InputShort
                  readOnly
                  defaultValue={monster?.initiative}
                />
                <label htmlFor="initiative">Iniciativa</label>
              </div>
              <div>
                <Styles.InputMed readOnly defaultValue={monster?.size} />
                <label htmlFor="size">Tamanho</label>
              </div>
              <div>
                <Styles.InputLarge readOnly defaultValue={monster?.alignment} />
                <label htmlFor="alignment">Alinhamento</label>
              </div>
            </Styles.LineContaniner>

            <Styles.LineContaniner>
              <div>
                <Styles.InputShort defaultValue={monster?.health} />
                <label htmlFor="health">Vida</label>
              </div>
              <div>
                <Styles.InputShort
                  readOnly
                  defaultValue={monster?.health_now}
                />
                <label htmlFor="health_now">Saúde</label>
              </div>
              <div>
                <Styles.InputShort
                  readOnly
                  defaultValue={monster?.displacement}
                />
                <label htmlFor="displacement">Deslocamento</label>
              </div>

              <div>
                <Styles.InputShort readOnly defaultValue={monster?.ca} />
                <label htmlFor="ca">CA</label>
              </div>
              <div>
                <Styles.InputLarge readOnly defaultValue={monster?.defense} />
                <label htmlFor="defense">Defesa</label>
              </div>
            </Styles.LineContaniner>
            <Styles.LineContaniner>
              <div>
                <Styles.InputShort defaultValue={monster?.str} />
                <label htmlFor="str">Força</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.dex} />
                <label htmlFor="dex">Destreza</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.con} />
                <label htmlFor="con">Contituição</label>
              </div>

              <div>
                <Styles.InputShort readOnly defaultValue={monster?.int} />
                <label htmlFor="int">Inteligência</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.wis} />
                <label htmlFor="wis">Sabedoria</label>
              </div>
              <div>
                <Styles.InputShort readOnly defaultValue={monster?.cha} />
                <label htmlFor="cha">Carisma</label>
              </div>
            </Styles.LineContaniner>
          </Styles.BaseContainer>
        </div>
      </Styles.HeaderContainer>
      <Styles.StatsContainer>
        <Styles.HealthClassContainer>
          <legend>Testes</legend>
          <Styles.HealthContainer>
            <div>
              <div>
                <Styles.InputMini readOnly defaultValue={monster?.fort} />
                <label htmlFor="fort">Fortitude</label>
              </div>
              <div>
                <Styles.InputMini readOnly defaultValue={monster?.reflex} />
                <label htmlFor="reflex">Reflexos</label>
              </div>
              <div>
                <Styles.InputMini readOnly defaultValue={monster?.will} />
                <label htmlFor="will">Vontade</label>
              </div>
            </div>
          </Styles.HealthContainer>
        </Styles.HealthClassContainer>
        <Styles.AttributesContainer>
          <legend>Ataque Especial</legend>
          <p>{monster?.attack_special}</p>
        </Styles.AttributesContainer>
        <Styles.ResistContainer>
          <legend>Perícias</legend>
          <p>{monster?.special_qualities}</p>
        </Styles.ResistContainer>
      </Styles.StatsContainer>
      <Styles.StatsContainer>
        <Styles.AttributesContainer>
          <legend>Perícias</legend>
          <p>{monster?.skills}</p>
        </Styles.AttributesContainer>
        <Styles.AttributesContainer>
          <legend>Talentos</legend>
          <p>{monster?.feats}</p>
        </Styles.AttributesContainer>
        <Styles.NotesContainer>
          <legend>Notas</legend>
          <p>{monster?.notes}</p>
        </Styles.NotesContainer>
      </Styles.StatsContainer>

      <Styles.ArmoryContainer>
        <Styles.WeaponContainer>
          <legend>Armas</legend>
          <div>
            <ul>
              {monster?.attacks.map(item => (
                <li key={`${item.name}-${item.dice}-${item.damage}`}>
                  <div>
                    <label htmlFor="inputResist">Nome</label>
                    <Styles.InputLarge readOnly defaultValue={item.name} />
                  </div>
                  <div>
                    <label htmlFor="inputResist">Qtde</label>
                    <Styles.InputShort
                      readOnly
                      defaultValue={item.multiplier}
                    />
                  </div>
                  <div>
                    <label htmlFor="inputResist">Dado</label>
                    <Styles.InputShort
                      readOnly
                      defaultValue={`d${item.dice}`}
                    />
                  </div>
                  <div>
                    <label htmlFor="inputResist">Crítico</label>
                    <Styles.InputMed
                      readOnly
                      defaultValue={`${item.crit_from}-20 / ${item.critical}x`}
                    />
                  </div>

                  <div>
                    <label htmlFor="inputResist">Alcance</label>
                    <Styles.InputShort readOnly defaultValue={item.range} />
                  </div>
                  <div>
                    <label htmlFor="inputResist">Acerto</label>
                    <Styles.InputShort readOnly defaultValue={item.hit} />
                  </div>
                  <div>
                    <label htmlFor="inputResist">Dano</label>
                    <Styles.InputShort
                      readOnly
                      defaultValue={`${item.damage}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Styles.WeaponContainer>
      </Styles.ArmoryContainer>
    </Styles.Container>
  )
}
