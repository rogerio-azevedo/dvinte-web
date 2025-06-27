/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../../services/api'
import history from '../../../services/history'

import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'

import ButtonPrev from '../../../components/ButtonPrev'
import ButtonNext from '../../../components/ButtonNext'

import * as Styles from './styles'

interface CharacterClass {
  id: number
  className: string
  level: number
}

interface Character {
  name: string
  age: string
  gender: string
  skin: string
  eye: string
  hair: string
  height: string
  weight: string
  level: string
  health: number
  health_now: number
  exp: number
  size: string
  user_id: number
  portrait_id: string
  alignment_id: string
  race_id: string
  divinity_id: string
  is_ativo: boolean
  classe: CharacterClass[]
  attributes: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
}

export default function CharPreview() {
  const { state, actions } = useCharacterCreation()

  const [character, setCharacter] = useState<Character | undefined>()
  const [portrait, setPortrait] = useState<string | undefined>()
  const [race, setRace] = useState<string | undefined>()
  const [divinity, setDivinity] = useState<string | undefined>()
  const [alignment, setAlignment] = useState<string | undefined>()

  function getGender(gender: string): string {
    if (gender === 'M' || gender === '1') {
      return 'MASCULINO'
    }
    if (gender === 'F' || gender === '2') {
      return 'FEMININO'
    }
    return 'MASCULINO' // fallback
  }

  function getSize(size: string): string {
    if (size === '1') {
      return 'PEQUENO'
    }
    if (size === '2') {
      return 'MEDIO'
    }
    if (size === '3') {
      return 'GRANDE'
    }
    return 'MEDIO' // fallback
  }

  useEffect(() => {
    // Carregar dados básicos se disponíveis
    if (state.base) {
      const characterData: Character = {
        name: state.base.name || '',
        age: state.base.age || '',
        gender: state.base.gender || '',
        skin: state.base.skin || '',
        eye: state.base.eye || '',
        hair: state.base.hair || '',
        height: state.base.height || '',
        weight: state.base.weight || '',
        level: state.base.level || '',
        health: 0,
        health_now: 0,
        exp: 0,
        size: state.base.size || '',
        user_id: state.base.user_id || 1,
        portrait_id: state.portrait || '',
        alignment_id: state.base.alignment || '',
        race_id: state.base.race || '',
        divinity_id: state.base.divinity || '',
        is_ativo: true,
        classe: state.classe || [],
        attributes: state.attributes || {
          str: 0,
          dex: 0,
          con: 0,
          int: 0,
          wis: 0,
          cha: 0,
        },
      }

      console.log('🔍 CharPreview - Estado do contexto:', {
        base: state.base,
        portrait: state.portrait,
        classe: state.classe,
        attributes: state.attributes,
      })

      console.log('🔍 CharPreview - Character montado:', characterData)

      setCharacter(characterData)
    }
  }, [state.base, state.portrait, state.classe, state.attributes])

  useEffect(() => {
    async function loadPortrait(): Promise<void> {
      try {
        const response = await api.get(`/portraits/${state.portrait}`)
        setPortrait(response.data.url)
      } catch (error) {
        console.error('Erro ao carregar portrait:', error)
        setPortrait('')
      }
    }

    if (state.portrait) {
      loadPortrait()
    } else {
      setPortrait('')
    }
  }, [state.portrait])

  useEffect(() => {
    if (!state.base?.race) {
      setRace('')
      return
    }

    async function loadRace(): Promise<void> {
      try {
        const response = await api.get(`races/${state.base.race}`)
        setRace(response.data.name)
      } catch (error) {
        console.error('Erro ao carregar raça:', error)
        setRace('')
      }
    }

    loadRace()
  }, [state.base?.race])

  useEffect(() => {
    if (!state.base?.divinity) {
      setDivinity('')
      return
    }

    async function loadDivinitie(): Promise<void> {
      try {
        const response = await api.get(`divinities/${state.base.divinity}`)
        setDivinity(response.data.name)
      } catch (error) {
        console.error('Erro ao carregar divindade:', error)
        setDivinity('')
      }
    }

    loadDivinitie()
  }, [state.base?.divinity])

  useEffect(() => {
    if (!state.base?.alignment) {
      setAlignment('')
      return
    }

    async function loadAlignment(): Promise<void> {
      try {
        const response = await api.get(`alignments/${state.base.alignment}`)
        setAlignment(response.data.name)
      } catch (error) {
        console.error('Erro ao carregar alinhamento:', error)
        setAlignment('')
      }
    }

    loadAlignment()
  }, [state.base?.alignment])

  async function handleSave(): Promise<void> {
    try {
      // Função auxiliar para converter string para número com fallback
      const toNumber = (
        value: string | undefined | null,
        fallback: number = 1
      ): number => {
        if (
          !value ||
          value === '' ||
          value === 'undefined' ||
          value === 'null'
        ) {
          return fallback
        }
        const parsed = parseInt(value, 10)
        return isNaN(parsed) ? fallback : parsed
      }

      // Função específica para converter gender
      const convertGender = (gender: string | undefined): number => {
        if (gender === 'M' || gender === '1') return 1
        if (gender === 'F' || gender === '2') return 2
        return 1 // fallback para masculino
      }

      // Função específica para converter size
      const convertSize = (size: string | undefined): number => {
        if (size === 'PEQUENO' || size === '1') return 1
        if (size === 'MEDIO' || size === '2') return 2
        if (size === 'GRANDE' || size === '3') return 3
        return 2 // fallback para médio
      }

      // Converter dados para o formato correto esperado pelo backend
      const characterData = {
        name: character?.name || '',
        age: toNumber(character?.age, 18),
        gender: convertGender(character?.gender),
        skin: character?.skin || '',
        eye: character?.eye || '',
        hair: character?.hair || '',
        height: character?.height || '',
        weight: character?.weight || '',
        level: toNumber(character?.level, 1),
        health: character?.health || 0,
        health_now: character?.health_now || 0,
        exp: character?.exp || 0,
        size: convertSize(character?.size),
        user_id: character?.user_id || 1,
        portrait_id: state.portrait ? toNumber(state.portrait, 1) : null,
        alignment_id: toNumber(character?.alignment_id, 1),
        race_id: toNumber(character?.race_id, 1),
        divinity_id: toNumber(character?.divinity_id, 1),
        is_ativo: character?.is_ativo || true,
        classe: character?.classe || [],
        attributes: character?.attributes || {
          str: 8,
          dex: 8,
          con: 8,
          int: 8,
          wis: 8,
          cha: 8,
        },
      }

      console.log('📤 Dados sendo enviados para o backend:', characterData)
      console.log('🔍 Verificando campos críticos:', {
        portrait_id: {
          original: character?.portrait_id,
          fromContext: state.portrait,
          converted: characterData.portrait_id,
          type: typeof characterData.portrait_id,
        },
        gender: {
          original: character?.gender,
          converted: characterData.gender,
          type: typeof characterData.gender,
        },
        size: {
          original: character?.size,
          converted: characterData.size,
          type: typeof characterData.size,
        },
      })

      await api.post('characters', characterData)
      toast.success('Personagem criado com sucesso!')
      actions.resetCharacter()
      localStorage.removeItem('character_creation_in_progress')
      history.push('/characters')
    } catch (error: any) {
      console.error('Erro ao criar personagem:', error)
      console.error('📋 Response data:', error.response?.data)
      toast.error('Houve um erro ao criar o Personagem')
    }
  }

  return (
    <Styles.Container>
      <ButtonPrev linkto="/charattributes" display="show" />

      <Styles.ContentContainer>
        <h1>Cadastro de Personagem - PREVIEW</h1>
        <Styles.FormContainer>
          <div>
            <Styles.Portrait>
              {portrait ? (
                <img src={portrait} alt="Portrait do personagem" />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                  }}
                >
                  Sem retrato
                </div>
              )}
            </Styles.Portrait>

            <Styles.BaseContainer>
              <Styles.LineContaniner>
                <div>
                  <Styles.InputLarge readOnly value={character?.name || ''} />
                  <label htmlFor="CharName">Nome do Personagem</label>
                </div>
                <div>
                  <Styles.InputShort readOnly value={character?.level || ''} />
                  <label htmlFor="CharAge">Level</label>
                </div>

                <div>
                  <Styles.InputLarge
                    readOnly
                    value={race ? race.toUpperCase() : ''}
                  />
                  <label htmlFor="CharRace">Raça</label>
                </div>
                <div>
                  <Styles.InputLarge
                    readOnly
                    value={alignment ? alignment.toUpperCase() : ''}
                  />
                  <label htmlFor="CharAlignment">Tendência</label>
                </div>
              </Styles.LineContaniner>

              <Styles.LineContaniner>
                <div>
                  <Styles.InputShort readOnly value={character?.age || ''} />
                  <label htmlFor="CharAge">Idade</label>
                </div>

                <div>
                  <Styles.InputMed
                    readOnly
                    value={getGender(character?.gender || '')}
                  />
                  <label htmlFor="CharGender">Sexo</label>
                </div>
                <div>
                  <Styles.InputMed
                    readOnly
                    value={getSize(character?.size || '')}
                  />
                  <label htmlFor="CharSize">Tamanho</label>
                </div>
                <div>
                  <Styles.InputLarge
                    readOnly
                    value={divinity ? divinity.toUpperCase() : ''}
                  />
                  <label htmlFor="CharDivinity">Divindade</label>
                </div>
              </Styles.LineContaniner>

              <Styles.LineContaniner>
                <div>
                  <Styles.InputShort value={character?.height || ''} />
                  <label htmlFor="CharHeight">Altura</label>
                </div>
                <div>
                  <Styles.InputShort readOnly value={character?.weight || ''} />
                  <label htmlFor="CharWeight">Peso</label>
                </div>
                <div>
                  <Styles.InputMed readOnly value={character?.eye || ''} />
                  <label htmlFor="CharEye">Olhos</label>
                </div>
                <div>
                  <Styles.InputMed readOnly value={character?.hair || ''} />
                  <label htmlFor="CharHair">Cabelos</label>
                </div>
                <div>
                  <Styles.InputMed readOnly value={character?.skin || ''} />
                  <label htmlFor="CharSkin">Pele</label>
                </div>
              </Styles.LineContaniner>
            </Styles.BaseContainer>
          </div>
          <Styles.AttrsContainer>
            <Styles.AttributesContainer>
              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="FOR" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.str || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="DES" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.dex || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="CON" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.con || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="INT" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.int || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="SAB" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.wis || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrsLabel readOnly value="CAR" />
                <Styles.ValueContainer>
                  <Styles.AttrsValue
                    readOnly
                    value={character?.attributes?.cha || 0}
                  />
                </Styles.ValueContainer>
              </Styles.GroupContainer>
            </Styles.AttributesContainer>
            <Styles.ClassContainer>
              <ul>
                {character?.classe?.map((item, index) => (
                  <li key={item.id || `class-${index}`}>
                    <Styles.ClassInput readOnly value={item.className || ''} />
                    <Styles.ClassValueInput readOnly value={item.level || 0} />
                  </li>
                ))}
              </ul>
            </Styles.ClassContainer>
          </Styles.AttrsContainer>
          <Styles.Button onClick={handleSave}>Gravar</Styles.Button>
        </Styles.FormContainer>

        <Styles.DivPage>
          <Link to="charactercreate">
            <Styles.Page />
          </Link>

          <Link to="charbase">
            <Styles.Page />
          </Link>

          <Link to="charclass">
            <Styles.Page />
          </Link>

          <Link to="charattributes">
            <Styles.Page />
          </Link>

          <Link to="charpreview">
            <Styles.ActivePage />
          </Link>
        </Styles.DivPage>
      </Styles.ContentContainer>

      <ButtonNext linkto="characters" display="show" handleSave={handleSave} />
    </Styles.Container>
  )
}
