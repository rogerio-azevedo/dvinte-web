import React, { useState, useRef } from 'react'
//import { useSelector } from 'react-redux'

//import api from '../../../services/api'

import * as Styles from './styles'

export default function Dices() {
  //const profile = useSelector(state => state.user.profile)
  const [multiplier, setMultiplier] = useState(1)
  const [input, setInput] = useState('d20')
  const inputRef = useRef(null)

  function handleDice(type) {
    setInput(type)
  }

  function handleTest(type) {
    setTimeout(() => {
      console.log(inputRef.current)
    }, 3500)
  }

  // function handleCalculateTotal(sides) {
  //   let calc = 0
  //   const random = () => {
  //     return Math.floor(Math.random() * sides) + 1
  //   }

  //   // eslint-disable-next-line
  //   for (let i = 0; i < multiplier; i++) {
  //     calc += random()
  //   }

  //   const rolled = `Rolou ${multiplier} x d${sides} com resultado: ${calc}`

  //   api.post('combats', {
  //     id: profile.id,
  //     user_id: profile.id,
  //     user: profile.name,
  //     message: rolled,
  //     result: calc,
  //     type: 2,
  //   })
  // }

  return (
    <Styles.Container>
      <h2>Rolagem de Dados</h2>

      <Styles.PanelContainer>
        <Styles.InputMulti
          ref={inputRef}
          //style={{ display: 'none' }}
          id="dices"
          onChange={e => console.log(e)}
        />

        <Styles.InputMulti
          type="number"
          min="1"
          max="10"
          placeholder="1"
          onChange={e => setMultiplier(e.target.value)}
        />
        <Styles.DiceButton id="throw" onClick={handleTest}>
          Rolar
        </Styles.DiceButton>
      </Styles.PanelContainer>

      <div id="selector_div" style={{ display: 'none' }}>
        <input
          type="text"
          id="set"
          style={{ display: 'none' }}
          value={`${multiplier}${input}`}
          onChange={() => setInput()}
        />
      </div>

      <Styles.DiceContainer>
        <Styles.Dice4 input={input} onClick={() => handleDice('d4')}>
          <strong>d4</strong>
        </Styles.Dice4>

        <Styles.Dice6 input={input} onClick={() => handleDice('d6')}>
          <strong>d6</strong>
        </Styles.Dice6>

        <Styles.Dice8 input={input} onClick={() => handleDice('d8')}>
          <strong>d8</strong>
        </Styles.Dice8>

        <Styles.Dice10 input={input} onClick={() => handleDice('d10')}>
          <strong>d10</strong>
        </Styles.Dice10>

        <Styles.Dice12 input={input} onClick={() => handleDice('d12')}>
          <strong>d12</strong>
        </Styles.Dice12>

        <Styles.Dice20 input={input} onClick={() => handleDice('d20')}>
          <strong>d20</strong>
        </Styles.Dice20>
      </Styles.DiceContainer>
    </Styles.Container>
  )
}
