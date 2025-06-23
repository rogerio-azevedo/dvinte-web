import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

export default function Initiatives({ from = 0, profile = {}, charInit = 0 }) {
  const [initiatives, setInitiatives] = useState([])

  async function loadInitiative() {
    const response = await api.get('/initiatives')

    setInitiatives(response.data)
  }

  async function handleInitiative() {
    const dext = charInit

    const dice = Math.floor(Math.random() * 20) + 1

    const initTotal = dext + dice

    const rolled = `Rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

    api.post('combats', {
      id: from,
      user_id: profile.id,
      user: profile.name,
      message: rolled,
      result: initTotal,
      type: 8,
    })

    api.post('initiatives', {
      user_id: profile.id,
      user: profile.name,
      initiative: initTotal,
    })
  }

  useEffect(() => {
    const handleNewInit = newInitiative => {
      setInitiatives(prevInitiatives => [...prevInitiatives, newInitiative])
    }

    const handleClearInit = () => {
      setInitiatives([])
    }

    socket.on('init.message', handleNewInit)
    socket.on('init.clear', handleClearInit)

    return () => {
      socket.off('init.message', handleNewInit)
      socket.off('init.clear', handleClearInit)
    }
  }, []) // Removida dependência para evitar loop

  async function clearInitiatives() {
    await api.delete('initiatives')

    setInitiatives([])
  }

  useEffect(() => {
    loadInitiative()
    connect()
  }, []) // eslint-disable-line

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Iniciativas</h2>
      </Styles.HeaderContainer>

      <Styles.ButtonsContainer>
        <Styles.ButtonInit type="button" onClick={handleInitiative}>
          Iniciativa
        </Styles.ButtonInit>
      </Styles.ButtonsContainer>

      <Styles.InitContainer>
        <Styles.InitBoardContainer>
          <ul>
            {initiatives
              ?.sort((a, b) => b.initiative - a.initiative)
              .map(item => (
                <li key={Math.random()}>
                  <Styles.InitUser readOnly defaultValue={item.user} />
                  <Styles.InitValue readOnly defaultValue={item.initiative} />
                </li>
              ))}
          </ul>
        </Styles.InitBoardContainer>
      </Styles.InitContainer>
      <Styles.ButtonsContainer>
        <Styles.Button type="button" onClick={clearInitiatives}>
          Limpar
        </Styles.Button>
        <Styles.Button type="button" onClick={loadInitiative}>
          Recarregar
        </Styles.Button>
      </Styles.ButtonsContainer>
    </Styles.Container>
  )
}

Initiatives.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),

  charInit: PropTypes.number,
  from: PropTypes.number,
}
