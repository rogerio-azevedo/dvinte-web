import { useState, useCallback, useEffect, useRef } from 'react'
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
  const [pendingChatMessage, setPendingChatMessage] = useState<{
    message: string
    result: number
  } | null>(null)
  const [position, setPosition] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  const { setDiceData, state: diceState } = useDices()
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Persistência do estado aberto/fechado e posição
  useEffect(() => {
    const savedOpen = localStorage.getItem('generic-dice-card-open')
    const savedPosition = localStorage.getItem('generic-dice-card-position')
    if (savedOpen !== null) setIsOpen(savedOpen === 'true')
    if (savedPosition) {
      try {
        const parsedPos = JSON.parse(savedPosition)
        if (typeof window !== 'undefined') {
          // Garante que pelo menos parte do painel esteja visível no carregamento (80px topnav, 330px sidebar)
          const safeX = Math.max(0, Math.min(parsedPos.x, window.innerWidth - 330 - 100))
          const safeY = Math.max(80, Math.min(parsedPos.y, window.innerHeight - 50))
          setPosition({ x: safeX, y: safeY })
        } else {
          setPosition(parsedPos)
        }
      } catch {
        // Ignora erro de parse
      }
    }
  }, [])
  useEffect(() => {
    localStorage.setItem('generic-dice-card-open', isOpen ? 'true' : 'false')
  }, [isOpen])
  useEffect(() => {
    localStorage.setItem('generic-dice-card-position', JSON.stringify(position))
  }, [position])

  // Handlers de drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.x
      let newY = e.clientY - dragOffset.y

      if (panelRef.current && typeof window !== 'undefined') {
        const panelWidth = panelRef.current.offsetWidth
        const panelHeight = panelRef.current.offsetHeight
        
        const maxX = Math.max(0, window.innerWidth - panelWidth - 330)
        const maxY = Math.max(80, window.innerHeight - panelHeight)
        
        newX = Math.max(0, Math.min(newX, maxX))
        newY = Math.max(80, Math.min(newY, maxY))
      }

      setPosition({
        x: newX,
        y: newY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Detecta quando a animação dos dados 3D termina para enviar mensagem para o chat
  useEffect(() => {
    if (pendingChatMessage && !isRolling) {
      // Para d100, usa timeout pois não tem animação 3D
      if (selectedDice === 100) {
        const timeoutId = setTimeout(async () => {
          try {
            await api.post('combats', {
              id: user?.id,
              user_id: user?.id,
              user: user?.name,
              message: pendingChatMessage.message,
              result: pendingChatMessage.result,
              type: 2,
            })
            toast.success('Rolagem enviada para o chat!')
          } catch {
            toast.error('Erro ao enviar para o chat')
          } finally {
            setPendingChatMessage(null)
          }
        }, 1500)

        animationTimeoutRef.current = timeoutId
      } else {
        // Para outros dados, monitora quando a animação 3D termina
        if (diceState.diceShow) {
          const timeoutId = setTimeout(async () => {
            try {
              await api.post('combats', {
                id: user?.id,
                user_id: user?.id,
                user: user?.name,
                message: pendingChatMessage.message,
                result: pendingChatMessage.result,
                type: 2,
              })
              toast.success('Rolagem enviada para o chat!')
            } catch {
              toast.error('Erro ao enviar para o chat')
            } finally {
              setPendingChatMessage(null)
            }
          }, 1500)

          animationTimeoutRef.current = timeoutId
        }
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }
    }
  }, [
    pendingChatMessage,
    isRolling,
    diceState.diceShow,
    diceState.diceRoll,
    selectedDice,
    user,
  ])

  // Função para rolar dados via API
  const rollDice = useCallback(async () => {
    if (!user || isRolling) return
    setIsRolling(true)
    setResult(null)
    setRollDetails('')
    setPendingChatMessage(null) // Limpa mensagem pendente anterior

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

      // Prepara mensagem para ser enviada após a animação terminar
      const rollsText =
        multiplier === 1 ? `${rolls[0]}` : `[${rolls.join(', ')}] = ${subtotal}`

      const modifierText =
        modifier !== 0
          ? modifier > 0
            ? ` + ${modifier} modificador`
            : ` ${modifier} modificador`
          : ''

      const rolled = `🎲 Rolou ${multiplier}x d${selectedDice}: ${rollsText}${modifierText}: ${total}`

      setPendingChatMessage({
        message: rolled,
        result: total,
      })
    } catch {
      toast.error('Erro ao rolar dados')
    } finally {
      setIsRolling(false)
    }
  }, [user, isRolling, multiplier, selectedDice, modifier, setDiceData])

  // Stepper handlers
  const inc = () => setMultiplier(m => Math.min(m + 1, 20))
  const dec = () => setMultiplier(m => Math.max(m - 1, 1))

  return (
    <div
      ref={panelRef}
      className="fixed z-50 select-none pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
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
          pointer-events-auto
          ${isOpen ? 'w-[340px] h-auto' : 'w-20 h-16'}
        `}
      >
        {/* Header - arrastável */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-move hover:bg-white/5 transition pointer-events-auto"
          onMouseDown={handleMouseDown}
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
          <button
            onClick={e => {
              e.stopPropagation()
              setIsOpen(o => !o)
            }}
            className="text-gray-400 hover:text-white transition"
          >
            {isOpen ? (
              <FaChevronUp className="w-4 h-4" />
            ) : (
              <FaChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Conteúdo */}
        {isOpen && (
          <div className="flex flex-col gap-5 px-4 pb-4 pt-2 animate-fade-in pointer-events-auto">
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
