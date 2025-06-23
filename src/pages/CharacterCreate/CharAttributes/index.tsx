import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { useCharacterCreation } from '../../../contexts/CharacterCreationContext'

import ButtonPrev from '../../../components/ButtonPrev'
import ButtonNext from '../../../components/ButtonNext'

import * as Styles from './styles'

export default function CharAttributes() {
  const { state, actions } = useCharacterCreation()

  // Inicializar com dados do contexto ou valores padrão
  const [str, setStr] = useState(state.attributes?.str || 8)
  const [dex, setDex] = useState(state.attributes?.dex || 8)
  const [con, setCon] = useState(state.attributes?.con || 8)
  const [int, setInt] = useState(state.attributes?.int || 8)
  const [wis, setWis] = useState(state.attributes?.wis || 8)
  const [cha, setCha] = useState(state.attributes?.cha || 8)

  const points = 32
  const [spent, setSpent] = useState(0)

  // Função para calcular custo do atributo
  const getAttributeCost = (value: number) => {
    const costs: { [key: number]: number } = {
      8: 0,
      9: 1,
      10: 2,
      11: 3,
      12: 4,
      13: 5,
      14: 6,
      15: 8,
      16: 10,
      17: 13,
      18: 16,
    }
    return costs[value] || 0
  }

  // Calcular pontos gastos
  useEffect(() => {
    const totalSpent =
      getAttributeCost(str) +
      getAttributeCost(dex) +
      getAttributeCost(con) +
      getAttributeCost(int) +
      getAttributeCost(wis) +
      getAttributeCost(cha)

    setSpent(totalSpent)
  }, [str, dex, con, int, wis, cha])

  // Carregar dados do contexto quando componente monta
  useEffect(() => {
    if (state.attributes) {
      setStr(state.attributes.str || 8)
      setDex(state.attributes.dex || 8)
      setCon(state.attributes.con || 8)
      setInt(state.attributes.int || 8)
      setWis(state.attributes.wis || 8)
      setCha(state.attributes.cha || 8)
    }
  }, [state.attributes])

  function handleAdd(tipo: string) {
    // Verificar se tem pontos suficientes antes de adicionar
    const currentCost = spent
    let newCost = currentCost

    switch (tipo) {
      case 'str':
        if (str <= 17) {
          newCost =
            currentCost - getAttributeCost(str) + getAttributeCost(str + 1)
          if (newCost <= points) {
            setStr(str + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break

      case 'dex':
        if (dex <= 17) {
          newCost =
            currentCost - getAttributeCost(dex) + getAttributeCost(dex + 1)
          if (newCost <= points) {
            setDex(dex + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break

      case 'con':
        if (con <= 17) {
          newCost =
            currentCost - getAttributeCost(con) + getAttributeCost(con + 1)
          if (newCost <= points) {
            setCon(con + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break

      case 'int':
        if (int <= 17) {
          newCost =
            currentCost - getAttributeCost(int) + getAttributeCost(int + 1)
          if (newCost <= points) {
            setInt(int + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break

      case 'wis':
        if (wis <= 17) {
          newCost =
            currentCost - getAttributeCost(wis) + getAttributeCost(wis + 1)
          if (newCost <= points) {
            setWis(wis + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break

      case 'cha':
        if (cha <= 17) {
          newCost =
            currentCost - getAttributeCost(cha) + getAttributeCost(cha + 1)
          if (newCost <= points) {
            setCha(cha + 1)
          } else {
            toast.error('Pontos insuficientes!')
          }
        }
        break
      default:
    }
  }

  function handleRemove(tipo: string) {
    switch (tipo) {
      case 'str':
        if (str >= 9) {
          setStr(str - 1)
        }
        break

      case 'dex':
        if (dex >= 9) {
          setDex(dex - 1)
        }
        break

      case 'con':
        if (con >= 9) {
          setCon(con - 1)
        }
        break

      case 'int':
        if (int >= 9) {
          setInt(int - 1)
        }
        break

      case 'wis':
        if (wis >= 9) {
          setWis(wis - 1)
        }
        break

      case 'cha':
        if (cha >= 9) {
          setCha(cha - 1)
        }
        break

      default:
    }
  }

  function handleSave() {
    const attrs = {
      str,
      dex,
      con,
      int,
      wis,
      cha,
    }

    // Salvar no contexto em vez do Redux
    actions.setAttributes(attrs)
    toast.success('Atributos salvos com sucesso!')
  }

  return (
    <Styles.Container>
      <ButtonPrev linkto="/charclass" display="show" />

      <Styles.ContentContainer>
        <h1>{`Cadastro de Personagem - ATRIBUTOS - ${points} / ${spent}`}</h1>
        <Styles.FormContainer>
          <div>
            <Styles.AttributesContainer>
              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="FOR" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={str}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('str')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('str')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="DES" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={dex}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('dex')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('dex')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="CON" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={con}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('con')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('con')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="INT" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={int}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('int')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('int')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="SAB" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={wis}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('wis')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={22}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('wis')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>

              <Styles.GroupContainer>
                <Styles.AttrLabel readOnly defaultValue="CAR" />
                <Styles.ValueContainer>
                  <Styles.AttrValue
                    pattern="[0-9]*"
                    min="1"
                    max="9"
                    value={cha}
                    readOnly
                  />
                  <Styles.ButtonsContainer>
                    <Styles.ButtonBorder>
                      <FaPlusCircle
                        size={25}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleAdd('cha')}
                      />
                    </Styles.ButtonBorder>
                    <Styles.ButtonBorder>
                      <FaMinusCircle
                        size={25}
                        color="#8e0e00"
                        cursor="pointer"
                        onClick={() => handleRemove('cha')}
                      />
                    </Styles.ButtonBorder>
                  </Styles.ButtonsContainer>
                </Styles.ValueContainer>
              </Styles.GroupContainer>
            </Styles.AttributesContainer>
          </div>
        </Styles.FormContainer>

        {/* Debug - mostrar dados do contexto */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              fontSize: '12px',
              background: '#f0f0f0',
              padding: '10px',
              marginTop: '20px',
            }}
          >
            <strong>Debug - Atributos no contexto:</strong>
            <pre>{JSON.stringify(state.attributes, null, 2)}</pre>
          </div>
        )}

        <Styles.DivPage>
          <Link to="/charactercreate">
            <Styles.Page />
          </Link>

          <Link to="/charbase">
            <Styles.Page />
          </Link>

          <Link to="/charclass">
            <Styles.Page />
          </Link>

          <Link to="/charattributes">
            <Styles.ActivePage />
          </Link>

          <Link to="/charpreview">
            <Styles.Page />
          </Link>
        </Styles.DivPage>
      </Styles.ContentContainer>

      <ButtonNext
        linkto="/charpreview"
        display="show"
        handleSave={handleSave}
      />
    </Styles.Container>
  )
}
