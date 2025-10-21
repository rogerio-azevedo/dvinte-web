/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../../contexts'
import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'
import SelectCharacter from '../../SelectCharacter'

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

interface APICharacter {
  Cod: number
  Name: string
  DexMod?: number
  DexModTemp?: number
}

interface Character {
  id: number
  name: string
  DexMod?: number
  DexModTemp?: number
}

interface InitiativesProps {
  from?: number
  profile?: Profile
  charInit?: number
}

export default function Initiatives({
  from = 0,
  charInit = 0,
}: InitiativesProps) {
  const { user } = useAuth()
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )

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

  const loadUserCharacters = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.log('❌ Iniciativas - user.id não disponível')
      return
    }

    try {
      console.log('🔄 Iniciativas - Carregando personagens para user:', user.id)
      const response = await api.get(`/characters/user/${user.id}`)

      const characters = Array.isArray(response.data) ? response.data : []

      // Mapeia os campos da API para o formato esperado (igual ao ArmoryDelay)
      const mappedCharacters = characters.map((char: APICharacter) => ({
        id: char.Cod,
        name: char.Name,
        DexMod: char.DexMod,
        DexModTemp: char.DexModTemp,
      }))

      // Filtra apenas personagens válidos
      const validCharacters = mappedCharacters.filter(
        char => char && char.id && char.name
      )

      console.log('✅ Iniciativas - Personagens carregados:', validCharacters)
      setUserCharacters(validCharacters)

      // Auto-seleciona se houver apenas 1 personagem
      if (validCharacters.length === 1) {
        setSelectedCharacter(validCharacters[0])
        console.log('✅ Iniciativas - Auto-selecionado:', validCharacters[0])
      }
    } catch (error) {
      console.error('❌ Iniciativas - Erro ao carregar personagens:', error)
      setUserCharacters([])
    }
  }, [user?.id])

  function handleCharacterChange(value: string | null): void {
    if (!value) {
      setSelectedCharacter(null)
      return
    }

    const char = userCharacters.find(c => c.id.toString() === value)
    if (char) {
      setSelectedCharacter(char)
      console.log('Personagem selecionado:', char)
    }
  }

  // Formata personagens para o SelectCharacter
  const characterOptions = userCharacters.map(char => ({
    value: char.id.toString(),
    label: char.name,
  }))

  async function handleInitiative(): Promise<void> {
    try {
      setIsLoading(true)

      // Validação do personagem selecionado
      if (!selectedCharacter) {
        toast.error('Selecione um personagem')
        return
      }

      if (!user?.id) {
        toast.error('Usuário não identificado')
        return
      }

      // Usa DexModTemp se existir, senão DexMod, senão charInit (prop), senão 0
      const dext =
        Number(selectedCharacter.DexModTemp) ||
        Number(selectedCharacter.DexMod) ||
        Number(charInit) ||
        0
      const dice = Math.floor(Math.random() * 20) + 1
      const initTotal = dext + dice

      const rolled = `${selectedCharacter.name} rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

      // Log dos dados que serão enviados
      console.log('Dados da iniciativa:', {
        user_id: user.id,
        user: selectedCharacter.name,
        initiative: initTotal,
      })

      // Primeiro post para o log de combate
      await api.post('combats', {
        id: from,
        user_id: user.id,
        user: selectedCharacter.name, // Nome do personagem
        message: rolled,
        result: initTotal,
        type: 8,
      })

      // Post para a iniciativa
      await api.post('initiatives', {
        user_id: user.id,
        user: selectedCharacter.name, // Nome do personagem
        initiative: initTotal,
      })
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
      console.log('[SOCKET] Evento init.message recebido:', newInitiative)
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
      console.log('[SOCKET] Evento init.clear recebido')
      console.log('Limpando iniciativas via socket')
      setInitiatives([])
    }

    const handleDeleteInit = (data: SocketInitiativeData): void => {
      console.log('[SOCKET] Evento init.delete recebido:', data)
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

  // Carrega personagens do usuário
  useEffect(() => {
    loadUserCharacters()
  }, [loadUserCharacters])

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

      {/* Seletor de Personagem */}
      <div style={{ padding: '10px 0', width: '100%' }}>
        {userCharacters.length > 1 ? (
          <SelectCharacter
            characters={characterOptions}
            changeCharacter={handleCharacterChange}
            value={selectedCharacter?.id.toString()}
          />
        ) : userCharacters.length === 1 ? (
          <div
            style={{
              padding: '10px',
              textAlign: 'center',
              fontWeight: 'bold',
              border: '2px solid #4a90e2',
              borderRadius: '4px',
              backgroundColor: '#f0f7ff',
            }}
          >
            {userCharacters[0].name}
          </div>
        ) : (
          <div style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
            Carregando personagens...
          </div>
        )}
      </div>

      <Styles.ButtonsContainer>
        <Styles.ButtonInit
          type="button"
          onClick={handleInitiative}
          disabled={isLoading || !selectedCharacter}
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
