/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

interface Profile {
  id: number
  name: string
}

interface Initiative {
  _id: string
  user_id: number
  user: string
  initiative: number
}

interface SocketInitiativeData {
  id: string
}

interface InitiativesProps {
  from?: number
  profile?: Profile
  charInit?: number
}

export default function Initiatives({
  from = 0,
  profile = { id: 0, name: '' },
  charInit = 0,
}: InitiativesProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function loadInitiative(): Promise<void> {
    try {
      const response = await api.get('/initiatives')
      const initiativesData: Initiative[] = Array.isArray(response.data)
        ? response.data
        : []
      setInitiatives(initiativesData)
    } catch (error) {
      console.error('Erro ao carregar iniciativas:', error)
      setInitiatives([])
    }
  }

  async function handleInitiative(): Promise<void> {
    try {
      setIsLoading(true)

      // Validação dos dados do perfil
      if (!profile || !profile.id || !profile.name) {
        console.error('Dados do perfil inválidos:', profile)
        toast.error('Dados do perfil inválidos')
        return
      }

      const dext = Number(charInit) || 0
      const dice = Math.floor(Math.random() * 20) + 1
      const initTotal = dext + dice

      const rolled = `Rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

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
        user_id: Number(profile.id),
        user: String(profile.name),
        initiative: Number(initTotal),
      })

      // Atualiza localmente também para feedback imediato
      if (response.data) {
        setInitiatives(prev => [...prev, response.data])
      }
    } catch (error: any) {
      console.error('Erro ao rolar iniciativa:', error)
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data)
      }
      toast.error('Erro ao rolar iniciativa')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleNewInit = (newInitiative: Initiative): void => {
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

    const handleClearInit = (): void => {
      console.log('Limpando iniciativas via socket')
      setInitiatives([])
    }

    const handleDeleteInit = (data: SocketInitiativeData): void => {
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
  }, [])

  async function clearInitiatives(): Promise<void> {
    try {
      await api.delete('initiatives')
      setInitiatives([])
      toast.success('Iniciativas limpas com sucesso')
    } catch (error) {
      console.error('Erro ao limpar iniciativas:', error)
      toast.error('Erro ao limpar iniciativas')
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
              .sort((a, b) => b.initiative - a.initiative)
              .map((item, index) => (
                <li key={item._id || `initiative-${index}`}>
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
