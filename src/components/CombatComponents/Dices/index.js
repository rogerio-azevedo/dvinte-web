import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import api from '../../../services/api'

import * as Styles from './styles'

export default function Dices() {
  const profile = useSelector(state => state.user.profile)
  const [multiplier, setMultiplier] = useState(1)

  function handleCalculateTotal(sides) {
    let calc = 0
    const random = () => {
      return Math.floor(Math.random() * sides) + 1
    }

    // eslint-disable-next-line
    for (let i = 0; i < multiplier; i++) {
      calc += random()
    }

    const rolled = `Rolou ${multiplier} x d${sides} com resultado: ${calc}`

    api.post('combats', {
      id: profile.id,
      user_id: profile.id,
      user: profile.name,
      message: rolled,
      result: calc,
      type: 2,
    })
  }

  return (
    <Styles.Container>
      <h2>Rolagem de Dados</h2>
      <Styles.InputMulti
        className="multiplier"
        type="number"
        pattern="[0-9]*"
        min="1"
        max="10"
        placeholder="1"
        onChange={e => setMultiplier(e.target.value)}
      />
      <Styles.DiceContainer>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(4)
          }}
        >
          <strong>d4</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(6)
          }}
        >
          <strong>d6</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(8)
          }}
        >
          <strong>d8</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(10)
          }}
        >
          <strong>d10</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(12)
          }}
        >
          <strong>d12</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(20)
          }}
        >
          <strong>d20</strong>
        </Styles.Dice>
      </Styles.DiceContainer>
    </Styles.Container>
  )
}
