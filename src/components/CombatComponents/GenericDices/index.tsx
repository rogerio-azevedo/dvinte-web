/* eslint-disable no-console */

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import d4Img from '../../../assets/dices/d4.png'
import d6Img from '../../../assets/dices/d6.png'
import d8Img from '../../../assets/dices/d8.png'
import d10Img from '../../../assets/dices/d10.png'
import d12Img from '../../../assets/dices/d12.png'
import d20Img from '../../../assets/dices/d20.png'
import d100Img from '../../../assets/dices/d100.png'
import api from '../../../services/api'
import { useAuth, useDices } from '../../../contexts'
import { generateSecureRandomNumber } from '../ArmoryDelay/genRandomNumber'

// Tipos de dados suportados
const DICE_TYPES = [
  {
    key: 4,
    label: 'd4',
    icon: (
      <div className="w-6 h-6">
        <img src={d4Img} alt="d6" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 6,
    label: 'd6',
    icon: (
      <div className="w-6 h-6">
        <img src={d6Img} alt="d6" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 8,
    label: 'd8',
    icon: (
      <div className="w-6 h-6">
        <img src={d8Img} alt="d8" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 10,
    label: 'd10',
    icon: (
      <div className="w-6 h-6">
        <img src={d10Img} alt="d10" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 12,
    label: 'd12',
    icon: (
      <div className="w-6 h-6">
        <img src={d12Img} alt="d12" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 20,
    label: 'd20',
    icon: (
      <div className="w-6 h-6">
        <img src={d20Img} alt="d20" className="w-full h-full" />
      </div>
    ),
  },
  {
    key: 100,
    label: 'd100',
    icon: (
      <div className="w-6 h-6">
        <img src={d100Img} alt="d100" className="w-full h-full" />
      </div>
    ),
  },
]

type DiceSides = 4 | 6 | 8 | 10 | 12 | 20 | 100

export default function GenericDices() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [selectedDice, setSelectedDice] = useState<DiceSides>(20)
  const [multiplier, setMultiplier] = useState(1)
  const [modifier, setModifier] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [rollDetails, setRollDetails] = useState<string>('')

  const { setDiceData } = useDices()

  // Persistência do estado aberto/fechado
  useEffect(() => {
    const saved = localStorage.getItem('generic-dice-card-open')
    if (saved !== null) setIsOpen(saved === 'true')
  }, [])
  useEffect(() => {
    localStorage.setItem('generic-dice-card-open', isOpen ? 'true' : 'false')
  }, [isOpen])

  // Função para rolar dados via API
  const rollDice = useCallback(async () => {
    if (!user || isRolling) return
    setIsRolling(true)
    setResult(null)
    setRollDetails('')

    setDiceData({
      diceType: null,
      diceSides: null,
      diceMult: null,
      diceResult: null,
      diceShow: false,
      diceRoll: false,
    })

    try {
      const rolls: number[] = []
      for (let i = 0; i < multiplier; i++) {
        const roll = await generateSecureRandomNumber(
          1,
          selectedDice,
          user?.id,
          user?.name
        )
        rolls.push(roll)
      }

      if (selectedDice !== 100) {
        setDiceData({
          diceType: `d${selectedDice}`,
          diceSides: selectedDice,
          diceMult: multiplier,
          diceResult: rolls,
          diceShow: true,
          diceRoll: true,
        })
      }
      const subtotal = rolls.reduce((a, b) => a + b, 0)
      const total = subtotal + modifier
      setResult(total)
      setRollDetails(
        `${multiplier}x d${selectedDice}: [${rolls.join(', ')}]${
          modifier !== 0
            ? modifier > 0
              ? ` +${modifier}`
              : ` ${modifier}`
            : ''
        }`
      )
      // Envia para o chat/backend
      const rolled = `Rolou ${multiplier}x d${selectedDice}: [${rolls.join(
        ', '
      )}]${
        modifier !== 0 ? (modifier > 0 ? ` +${modifier}` : ` ${modifier}`) : ''
      } = ${total}`
      await api.post('combats', {
        id: user.id,
        user_id: user.id,
        user: user.name,
        message: rolled,
        result: total,
        type: 2,
      })
      toast.success('Rolagem enviada para o chat!')
    } catch (error) {
      console.log(error)
      toast.error('Erro ao rolar dados')
    } finally {
      setIsRolling(false)
    }
  }, [user, isRolling, multiplier, selectedDice, modifier])

  // Stepper handlers
  const inc = () => setMultiplier(m => Math.min(m + 1, 20))
  const dec = () => setMultiplier(m => Math.max(m - 1, 1))

  return (
    <div className="absolute top-4 left-4 z-20 select-none">
      <div
        className={`
          bg-white/10
          backdrop-blur-md
          border border-white/20
          shadow-2xl
          rounded-2xl
          transition-all duration-300
          overflow-hidden
          flex flex-col
          ${isOpen ? 'w-[340px] h-auto' : 'w-20 h-16'}
        `}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition"
          onClick={() => setIsOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center aspect-square">
              <img
                src={d20Img}
                alt="d20"
                className="w-full h-full object-contain"
              />
            </div>
            {isOpen && (
              <span className="font-bold text-white text-lg tracking-tight">
                Lançador de Dados
              </span>
            )}
          </div>
          {isOpen ? (
            <FaChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <FaChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Conteúdo */}
        {isOpen && (
          <div className="flex flex-col gap-5 px-4 pb-4 pt-2 animate-fade-in">
            {/* Seleção de Dados */}
            <div className="grid grid-cols-4 gap-2">
              {DICE_TYPES.map(dice => (
                <button
                  key={dice.key}
                  onClick={() => setSelectedDice(dice.key as DiceSides)}
                  className={`flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-150 focus:outline-none ${
                    selectedDice === dice.key
                      ? 'bg-purple-500/20 border border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-white/5 hover:bg-purple-500/10 border border-transparent'
                  }`}
                >
                  {dice.icon}
                  <span className="text-xs font-medium mt-1 text-gray-300">
                    {dice.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Controles */}
            <div className="grid grid-cols-2 gap-3">
              {/* Quantidade */}
              <div className="space-y-1.5">
                <div className="text-sm font-medium text-gray-400">
                  Quantidade
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={dec}
                    className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center transition disabled:opacity-50"
                    disabled={multiplier <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={multiplier}
                    onChange={e =>
                      setMultiplier(
                        Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-14 text-center bg-white/5 border border-gray-700 rounded-lg py-1 px-2 text-lg font-semibold text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  />
                  <button
                    onClick={inc}
                    className="w-8 h-8 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 font-bold text-lg flex items-center justify-center transition disabled:opacity-50"
                    disabled={multiplier >= 20}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Modificador */}
              <div className="space-y-1.5">
                <div className="text-sm font-medium text-gray-400">
                  Modificador
                </div>
                <input
                  type="number"
                  min={-99}
                  max={99}
                  value={modifier}
                  onChange={e => setModifier(parseInt(e.target.value) || 0)}
                  className="w-full text-center bg-white/5 border border-gray-700 rounded-lg py-1 px-2 text-lg font-semibold text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Botão de rolar */}
            <button
              onClick={rollDice}
              disabled={isRolling || !user}
              className={`w-full py-3 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-200 ${
                isRolling
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 hover:scale-[1.02] active:scale-95'
              } focus:ring-2 focus:ring-purple-500/50`}
            >
              {isRolling ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Rolando...</span>
                </div>
              ) : (
                <span>
                  🎲 Rolar {multiplier}x d{selectedDice}
                  {modifier !== 0
                    ? modifier > 0
                      ? ` +${modifier}`
                      : ` ${modifier}`
                    : ''}
                </span>
              )}
            </button>

            {/* Resultado visual */}
            {result !== null && (
              <div className="mt-1 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                <div className="font-bold text-xl text-white">{result}</div>
                <div className="text-xs mt-1 text-gray-400">{rollDetails}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
