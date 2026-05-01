/* eslint-disable no-console */

import React from 'react'
import { useAuth } from '../../../contexts'
import api from '../../../services/api'

interface SavingsProps {
  fortitude?: number
  reflex?: number
  will?: number
  strength?: number
}

interface SaveTest {
  label: string
  value: number
  type: number
  onRoll: () => Promise<void>
}

const Savings: React.FC<SavingsProps> = ({
  fortitude = 0,
  reflex = 0,
  will = 0,
  strength = 0,
}) => {
  const { user } = useAuth()
  const from = user?.id

  const rollTest = async (
    label: string,
    bonus: number,
    type: number,
    bonusLabel: string,
  ): Promise<void> => {
    const dice = Math.floor(Math.random() * 20) + 1
    const result = bonus + dice
    const message = `Rolou teste de ${label} d20: ${dice} + ${bonus} de ${bonusLabel}, com resultado: ${result}`

    await api.post('combats', {
      id: from,
      user_id: user?.id,
      user: user?.name,
      message,
      result,
      type,
    })
  }

  const tests: SaveTest[] = [
    {
      label: 'Fortitude',
      value: fortitude,
      type: 5,
      onRoll: () => rollTest('Fortitude', fortitude, 5, 'fortitude'),
    },
    {
      label: 'Reflexos',
      value: reflex,
      type: 6,
      onRoll: () => rollTest('Reflexos', reflex, 6, 'reflexos'),
    },
    {
      label: 'Vontade',
      value: will,
      type: 7,
      onRoll: () => rollTest('Vontade', will, 7, 'vontade'),
    },
    {
      label: 'Base',
      value: strength,
      type: 10,
      onRoll: () =>
        rollTest('Base contra Base', strength, 10, 'Base + Mod de Força'),
    },
  ]

  const handleClick = async (test: SaveTest) => {
    try {
      await test.onRoll()
    } catch (error) {
      console.error(`Erro ao realizar teste de ${test.label}:`, error)
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        {tests.map(test => (
          <button
            key={test.label}
            type="button"
            onClick={() => handleClick(test)}
            className="flex flex-col items-center justify-center rounded-md border border-stone-200 bg-white px-2 py-2.5 shadow-sm transition-colors hover:border-[#8e0e00]/40 hover:bg-[#8e0e00] hover:text-white"
          >
            <span className="text-xs font-semibold">{test.label}</span>
            <span className="mt-0.5 text-[10px] opacity-60">
              bônus: {test.value >= 0 ? '+' : ''}
              {test.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Savings
