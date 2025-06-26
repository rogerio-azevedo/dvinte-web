/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

export default function Initiatives({ from = 0, profile = {}, charInit = 0 }) {
  const [initiatives, setInitiatives] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function loadInitiative() {
    try {
      const response = await api.get('/initiatives')
      setInitiatives(response.data)
    } catch (error) {
      console.error('Erro ao carregar iniciativas:', error)
    }
  }

  async function handleInitiative() {
    try {
      setIsLoading(true)
      const dext = Number(charInit) || 0
      const dice = Math.floor(Math.random() * 20) + 1
      const initTotal = dext + dice

      const rolled = `Rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

      // Primeiro, vamos garantir que temos os dados necessários
      if (!profile || !profile.id || !profile.name) {
        console.error('Dados do perfil inválidos:', profile)
        return
      }

      // Log dos dados que serão enviados
      console.log('Dados da iniciativa:', {
        user_id: Number(profile.id),
        user: String(profile.name),
        initiative: initTotal,
      })

      // Primeiro post para o log de combate
      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: initTotal,
        type: 8,
      })

      // Post para a iniciativa
      const response = await api.post('initiatives', {
        user_id: Number(profile.id), // Garantir que é número
        user: String(profile.name), // Garantir que é string
        initiative: Number(initTotal), // Garantir que é número
      })

      // Atualiza localmente também para feedback imediato
      setInitiatives(prev => [...prev, response.data])
    } catch (error) {
      console.error('Erro ao rolar iniciativa:', error)
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleNewInit = newInitiative => {
      console.log('Nova iniciativa recebida:', newInitiative)
      setInitiatives(prevInitiatives => {
        // Verifica se a iniciativa já existe para evitar duplicatas
        const exists = prevInitiatives.some(
          init => init._id === newInitiative._id
        )
        if (!exists) {
          return [...prevInitiatives, newInitiative]
        }
        return prevInitiatives
      })
    }

    const handleClearInit = () => {
      console.log('Limpando iniciativas via socket')
      setInitiatives([])
    }

    const handleDeleteInit = data => {
      console.log('Removendo iniciativa:', data)
      if (data.id) {
        setInitiatives(prev => prev.filter(init => init._id !== data.id))
      }
    }

    // Conecta ao socket se ainda não estiver conectado
    if (!socket.connected) {
      connect()
    }

    // Registra os listeners
    socket.on('init.message', handleNewInit)
    socket.on('init.clear', handleClearInit)
    socket.on('init.delete', handleDeleteInit)

    // Carrega as iniciativas iniciais
    loadInitiative()

    // Cleanup
    return () => {
      socket.off('init.message', handleNewInit)
      socket.off('init.clear', handleClearInit)
      socket.off('init.delete', handleDeleteInit)
    }
  }, []) // Empty dependency array since we want this to run only once

  async function clearInitiatives() {
    try {
      await api.delete('initiatives')
      setInitiatives([])
    } catch (error) {
      console.error('Erro ao limpar iniciativas:', error)
    }
  }

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Iniciativas</h2>
      </Styles.HeaderContainer>

      <Styles.ButtonsContainer>
        <Styles.ButtonInit
          type="button"
          onClick={handleInitiative}
          disabled={isLoading}
        >
          {isLoading ? 'Rolando...' : 'Iniciativa'}
        </Styles.ButtonInit>
      </Styles.ButtonsContainer>

      <Styles.InitContainer>
        <Styles.InitBoardContainer>
          <ul>
            {initiatives
              ?.sort((a, b) => b.initiative - a.initiative)
              .map(item => (
                <li key={item._id || Math.random()}>
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
