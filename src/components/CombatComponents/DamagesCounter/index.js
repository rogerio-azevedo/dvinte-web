/* eslint-disable no-console */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../../../services/api'
import { socket, connect, emit } from '../../../services/socket'

import * as Styles from './styles'
import { useEffect } from 'react'

export default function DamagesCounter() {
  const profile = useSelector(state => state.user.profile)
  const [damages, setDamages] = useState([])

  async function loadDamage(type) {
    const response = await api.get('/damages', {
      params: {
        type: type,
      },
    })

    setDamages(response.data)
  }

  async function handleStartSession() {
    try {
      const message = {
        id: profile.id,
        user_id: profile.id,
        user: profile.name,
        message: 'Iniciou uma nova aventura',
        result: 0,
        type: 0,
        isCrit: 'false',
      }

      emit('chat.message', message)
      loadDamage('session')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar sessão:', err)
    }
  }

  async function handleStartCombat() {
    try {
      const message = {
        id: profile.id,
        user_id: profile.id,
        user: profile.name,
        message: 'Iniciou um novo combate',
        result: 0,
        type: 8,
        isCrit: 'false',
      }

      emit('chat.message', message)
      loadDamage('combat')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar combate:', err)
    }
  }

  useEffect(() => {
    loadDamage()

    // Escuta mensagens do chat
    socket.on('chat.message', message => {
      // Se for uma mensagem de início de sessão ou combate, atualiza a lista
      if (message.type === 0) {
        loadDamage('session')
      } else if (message.type === 8) {
        loadDamage('combat')
      } else if (message.type === 4) {
        // Se for dano, recarrega a lista atual
        loadDamage()
      }
    })

    // Conecta o websocket se ainda não estiver conectado
    if (!socket.connected) {
      connect()
    }

    return () => {
      socket.off('chat.message')
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
              .map(item => (
                <li key={Math.random()}>
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
