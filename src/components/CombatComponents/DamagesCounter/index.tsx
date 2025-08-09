/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts'
import api from '../../../services/api'
import { socket, connect, emit } from '../../../services/socket'

import * as Styles from './styles'

interface DamageItem {
  user: string
  damage: number
}

interface Message {
  id: number
  user_id: number
  user: string
  message: string
  result: number
  type: number
  isCrit: string
}

type DamageType = 'session' | 'combat' | 'reload' | undefined

export default function DamagesCounter() {
  const { user } = useAuth()
  const [damages, setDamages] = useState<DamageItem[]>([])

  async function loadDamage(type?: DamageType): Promise<void> {
    try {
      const response = await api.get('/damages', {
        params: {
          type: type,
        },
      })

      const damagesData: DamageItem[] = Array.isArray(response.data)
        ? response.data
        : []
      setDamages(damagesData)
    } catch (error) {
      console.error('[DamagesCounter] Erro ao carregar danos:', error)
      setDamages([])
    }
  }

  async function handleStartSession(): Promise<void> {
    try {
      const message: Message = {
        id: user?.id || 0,
        user_id: user?.id || 0,
        user: user?.name || '',
        message: 'Iniciou uma nova aventura',
        result: 0,
        type: 0,
        isCrit: 'false',
      }

      emit('chat.message', message)
      await loadDamage('session')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar sessão:', err)
    }
  }

  async function handleStartCombat(): Promise<void> {
    try {
      const message: Message = {
        id: user?.id || 0,
        user_id: user?.id || 0,
        user: user?.name || '',
        message: 'Iniciou um novo combate',
        result: 0,
        type: 8,
        isCrit: 'false',
      }

      emit('chat.message', message)
      await loadDamage('combat')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar combate:', err)
    }
  }

  useEffect(() => {
    loadDamage()

    // Escuta mensagens do chat
    const handleChatMessage = (message: Message): void => {
      // Se for uma mensagem de início de sessão ou combate, atualiza a lista
      if (message.type === 0) {
        loadDamage('session')
      } else if (message.type === 8) {
        loadDamage('combat')
      } else if (message.type === 4) {
        // Se for dano, recarrega a lista atual
        loadDamage()
      }
    }

    socket.on('chat.message', handleChatMessage)

    // Conecta o websocket se ainda não estiver conectado
    if (!socket.connected) {
      connect()
    }

    return () => {
      socket.off('chat.message', handleChatMessage)
    }
  }, [])

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Dano total por Usuário</h2>
      </Styles.HeaderContainer>

      <Styles.ButtonsContainer>
        <Styles.Button type="button" onClick={() => loadDamage('reload')}>
          Recarregar
        </Styles.Button>
        <Styles.Button type="button" onClick={() => loadDamage('session')}>
          Aventura
        </Styles.Button>
        <Styles.Button type="button" onClick={() => loadDamage('combat')}>
          Combate
        </Styles.Button>
      </Styles.ButtonsContainer>

      <Styles.BoardContainer>
        <Styles.DamageContainer>
          <ul>
            {damages
              ?.sort((a, b) => b.damage - a.damage)
              .map((item, index) => (
                <li key={`damage-${item.user}-${index}`}>
                  <Styles.DamageUser readOnly defaultValue={item.user} />
                  <Styles.DamageValue readOnly defaultValue={item.damage} />
                </li>
              ))}
          </ul>
        </Styles.DamageContainer>
      </Styles.BoardContainer>
      <Styles.ResetButtonsContainer>
        <Styles.ButtonLarge type="button" onClick={handleStartSession}>
          Inicia Aventura
        </Styles.ButtonLarge>
        <Styles.ButtonLarge type="button" onClick={handleStartCombat}>
          Inicia Combate
        </Styles.ButtonLarge>
      </Styles.ResetButtonsContainer>
    </Styles.Container>
  )
}
