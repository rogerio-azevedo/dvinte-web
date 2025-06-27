/* eslint-disable no-console */

import React from 'react'
import { useSelector } from 'react-redux'
import api from '../../../services/api'

import * as Styles from './styles'

// Interfaces
interface Profile {
  id: number
  name: string
}

interface RootState {
  user: {
    profile: Profile
  }
}

interface SavingsProps {
  fortitude?: number
  reflex?: number
  will?: number
  strength?: number
}

const Savings: React.FC<SavingsProps> = ({
  fortitude = 0,
  reflex = 0,
  will = 0,
  strength = 0,
}) => {
  const { profile } = useSelector((state: RootState) => state.user)
  const from = profile.id

  const handleFortitude = async (): Promise<void> => {
    try {
      const dice = Math.floor(Math.random() * 20) + 1
      const fortitudeTest = fortitude + dice
      const rolled = `Rolou teste de Fortitude d20: ${dice} + ${fortitude} de fortitude, com resultado: ${fortitudeTest}`

      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: fortitudeTest,
        type: 5,
      })
    } catch (error) {
      console.error('Erro ao realizar teste de Fortitude:', error)
    }
  }

  const handleReflex = async (): Promise<void> => {
    try {
      const dice = Math.floor(Math.random() * 20) + 1
      const reflexTest = reflex + dice
      const rolled = `Rolou teste de Reflexos d20: ${dice} + ${reflex} de reflexos, com resultado: ${reflexTest}`

      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: reflexTest,
        type: 6,
      })
    } catch (error) {
      console.error('Erro ao realizar teste de Reflexos:', error)
    }
  }

  const handleWill = async (): Promise<void> => {
    try {
      const dice = Math.floor(Math.random() * 20) + 1
      const willTest = will + dice
      const rolled = `Rolou teste de Vontade d20: ${dice} + ${will} de vontade, com resultado: ${willTest}`

      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: willTest,
        type: 7,
      })
    } catch (error) {
      console.error('Erro ao realizar teste de Vontade:', error)
    }
  }

  const handleStrength = async (): Promise<void> => {
    try {
      const dice = Math.floor(Math.random() * 20) + 1
      const strTest = strength + dice
      const rolled = `Rolou teste de Base contra Base d20: ${dice} + ${strength} de Base + Mod de Força, com resultado: ${strTest}`

      await api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message: rolled,
        result: strTest,
        type: 10,
      })
    } catch (error) {
      console.error('Erro ao realizar teste de Base:', error)
    }
  }

  return (
    <Styles.Container>
      <Styles.HeaderContainer>
        <h2>Testes de Resistência</h2>
      </Styles.HeaderContainer>

      <Styles.MainContainer>
        <Styles.SavesContainer>
          <Styles.ActionContainer>
            <div>
              <button type="button" onClick={handleFortitude}>
                Fortitude
              </button>
            </div>
            <div>
              <button type="button" onClick={handleReflex}>
                Reflexos
              </button>
            </div>
            <div>
              <button type="button" onClick={handleWill}>
                Vontade
              </button>
            </div>
          </Styles.ActionContainer>
          <Styles.ActionContainer>
            <div>
              <button type="button" onClick={handleStrength}>
                Base
              </button>
            </div>
          </Styles.ActionContainer>
        </Styles.SavesContainer>
      </Styles.MainContainer>
    </Styles.Container>
  )
}

export default Savings
