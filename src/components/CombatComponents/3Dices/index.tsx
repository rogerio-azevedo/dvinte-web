import React, { useState, useRef, ChangeEvent } from 'react'
//import { useSelector } from 'react-redux'

//import api from '../../../services/api'

import * as Styles from './styles'

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20'

const Dices: React.FC = () => {
  //const profile = useSelector(state => state.user.profile)
  const [multiplier, setMultiplier] = useState<number>(1)
  const [input, setInput] = useState<DiceType>('d20')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDice = (type: DiceType): void => {
    setInput(type)
  }

  const handleTest = (): void => {
    setTimeout(() => {
      console.log(inputRef.current)
    }, 3500)
  }

  const handleMultiplierChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setMultiplier(value)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value)
  }

  // function handleCalculateTotal(sides: number) {
  //   let calc = 0
  //   const random = (): number => {
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
          onChange={handleInputChange}
        />

        <Styles.InputMulti
          type="number"
          min="1"
          max="10"
          placeholder="1"
          onChange={handleMultiplierChange}
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
          readOnly
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

export default Dices
