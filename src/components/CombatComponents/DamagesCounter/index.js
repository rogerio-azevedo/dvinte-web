import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import api from '../../../services/api'

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

  function handleStartSession() {
    api.post('combats', {
      id: 0,
      user_id: profile.id,
      user: profile.name,
      message: 'Sessão Iniciada!!!',
      result: 0,
      type: 0,
    })
  }

  function handleStartCombat() {
    api.post('combats', {
      id: 0,
      user_id: profile.id,
      user: profile.name,
      message: 'Combate Iniciado!!!',
      result: 0,
      type: 9,
    })
  }

  useEffect(() => {
    loadDamage()
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
