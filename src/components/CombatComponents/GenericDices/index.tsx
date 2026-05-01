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
import { generateSecureRandomNumbers } from '../ArmoryDelay/genRandomNumber'

const DICE_META = [
  { key: 4, label: 'd4', img: d4Img },
  { key: 6, label: 'd6', img: d6Img },
  { key: 8, label: 'd8', img: d8Img },
  { key: 10, label: 'd10', img: d10Img },
  { key: 12, label: 'd12', img: d12Img },
  { key: 20, label: 'd20', img: d20Img },
  { key: 100, label: 'd100', img: d100Img },
] as const

export type GenericDicesVariant = 'floating' | 'mobile'

export interface GenericDicesProps {
  /** `mobile`: layout full-width no sheet, alto contraste e toque amplo. */
  variant?: GenericDicesVariant
}

type DiceSides = 4 | 6 | 8 | 10 | 12 | 20 | 100

/** Alinhado ao máximo de `diceMult` na API; 20 evita travamentos/piscada com muitas malhas 3D. */
const MAX_DICE_MULTIPLIER = 20

export default function GenericDices({ variant = 'floating' }: GenericDicesProps) {
  const isMobile = variant === 'mobile'
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

  // Persistência do estado aberto/fechado e posição (apenas card flutuante no mapa)
  useEffect(() => {
    if (isMobile) return
    const savedOpen = localStorage.getItem('generic-dice-card-open')
    const savedPosition = localStorage.getItem('generic-dice-card-position')
    if (savedOpen !== null) setIsOpen(savedOpen === 'true')
    if (savedPosition) {
      try {
        const parsedPos = JSON.parse(savedPosition)
        setPosition(parsedPos)
      } catch {
        // Ignora erro de parse
      }
    }
  }, [isMobile])

  // Clamp position within container when it resizes or opens/closes
  useEffect(() => {
    if (isMobile) return
    const timeoutId = setTimeout(() => {
      if (panelRef.current && panelRef.current.parentElement) {
        const container = panelRef.current.parentElement
        const panelWidth = panelRef.current.offsetWidth
        const panelHeight = panelRef.current.offsetHeight

        const maxX = Math.max(0, container.clientWidth - panelWidth)
        const maxY = Math.max(0, container.clientHeight - panelHeight)

        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY)),
        }))
      }
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [isOpen, isMobile])
  useEffect(() => {
    if (isMobile) return
    localStorage.setItem('generic-dice-card-open', isOpen ? 'true' : 'false')
  }, [isOpen, isMobile])
  useEffect(() => {
    if (isMobile) return
    localStorage.setItem('generic-dice-card-position', JSON.stringify(position))
  }, [position, isMobile])

  // Handlers de drag
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !panelRef.current) return
    const rect = panelRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  useEffect(() => {
    if (!isDragging || isMobile) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current || !panelRef.current.parentElement) return
      
      const container = panelRef.current.parentElement
      const containerRect = container.getBoundingClientRect()
      
      let newX = e.clientX - containerRect.left - dragOffset.x
      let newY = e.clientY - containerRect.top - dragOffset.y

      const panelWidth = panelRef.current.offsetWidth
      const panelHeight = panelRef.current.offsetHeight
      
      const maxX = Math.max(0, containerRect.width - panelWidth)
      const maxY = Math.max(0, containerRect.height - panelHeight)
      
      newX = Math.max(0, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))

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
  }, [isDragging, dragOffset, isMobile])

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
      const rolls = await generateSecureRandomNumbers(
        1,
        selectedDice,
        multiplier,
        user?.id,
        user?.name
      )

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
  const inc = () =>
    setMultiplier(m => Math.min(m + 1, MAX_DICE_MULTIPLIER))
  const dec = () => setMultiplier(m => Math.max(m - 1, 1))

  const panelOpen = isMobile || isOpen

  const dicePicker = (
    <div
      className={
        isMobile
          ? 'grid grid-cols-4 gap-1.5 px-0.5'
          : 'grid grid-cols-4 gap-2'
      }
    >
      {DICE_META.map(dice => (
        <button
          key={dice.key}
          type="button"
          onClick={() => setSelectedDice(dice.key as DiceSides)}
          className={
            isMobile
              ? `flex min-h-[2.85rem] flex-col items-center justify-center rounded-lg border px-1 py-1 transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  selectedDice === dice.key
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`
              : `flex flex-col items-center justify-center rounded-lg p-2 transition-all duration-150 focus:outline-none ${
                  selectedDice === dice.key
                    ? 'border border-purple-500/50 bg-purple-500/20 shadow-lg shadow-purple-500/10'
                    : 'border border-transparent bg-white/5 hover:bg-purple-500/10'
                }`
          }
        >
          <div className={isMobile ? 'mx-auto h-7 w-7' : 'h-6 w-6'}>
            <img
              src={dice.img}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <span
            className={
              isMobile
                ? 'mt-0.5 text-[10px] font-semibold leading-tight text-slate-700'
                : 'mt-1 text-xs font-medium text-gray-300'
            }
          >
            {dice.label}
          </span>
        </button>
      ))}
    </div>
  )

  const controlsAndRoll = (
    <>
      <div
        className={
          isMobile ? 'grid grid-cols-2 gap-3' : 'grid grid-cols-2 gap-3'
        }
      >
        <div className="space-y-1">
          <div
            className={
              isMobile
                ? 'text-xs font-semibold text-slate-700'
                : 'text-sm font-medium text-gray-400'
            }
          >
            Quantidade
          </div>
          <div className="flex items-center gap-1.5 sm:justify-start">
            <button
              type="button"
              onClick={dec}
              className={
                isMobile
                  ? 'flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg font-bold text-purple-800 transition active:bg-purple-200 disabled:pointer-events-none disabled:opacity-40'
                  : 'flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-lg font-bold text-purple-400 transition hover:bg-purple-500/30 disabled:opacity-50'
              }
              disabled={multiplier <= 1}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={MAX_DICE_MULTIPLIER}
              value={multiplier}
              onChange={e =>
                setMultiplier(
                  Math.max(
                    1,
                    Math.min(
                      MAX_DICE_MULTIPLIER,
                      parseInt(e.target.value, 10) || 1
                    )
                  )
                )
              }
              className={
                isMobile
                  ? 'h-9 w-full max-w-[3rem] shrink-0 rounded-lg border border-slate-300 bg-white px-1 text-center text-base font-bold text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40'
                  : 'w-14 rounded-lg border border-gray-700 bg-white/5 px-2 py-1 text-center text-lg font-semibold text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50'
              }
            />
            <button
              type="button"
              onClick={inc}
              className={
                isMobile
                  ? 'flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg bg-purple-100 text-lg font-bold text-purple-800 transition active:bg-purple-200 disabled:pointer-events-none disabled:opacity-40'
                  : 'flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-lg font-bold text-purple-400 transition hover:bg-purple-500/30 disabled:opacity-50'
              }
              disabled={multiplier >= MAX_DICE_MULTIPLIER}
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div
            className={
              isMobile
                ? 'text-xs font-semibold text-slate-700'
                : 'text-sm font-medium text-gray-400'
            }
          >
            Modificador
          </div>
          <input
            type="number"
            min={-99}
            max={99}
            value={modifier}
            onChange={e => setModifier(parseInt(e.target.value) || 0)}
            inputMode={isMobile ? 'numeric' : undefined}
            className={
              isMobile
                ? 'h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-center text-base font-bold text-slate-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40'
                : 'w-full rounded-lg border border-gray-700 bg-white/5 px-2 py-1 text-center text-lg font-semibold text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50'
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={rollDice}
        disabled={isRolling || !user}
        className={
          isMobile
            ? `flex min-h-[2.625rem] w-full touch-manipulation items-center justify-center rounded-xl text-sm font-bold text-white shadow-md transition active:scale-[0.98] disabled:opacity-60 ${
                isRolling ? 'bg-slate-500' : 'bg-gradient-to-r from-purple-600 to-purple-500'
              }`
            : `w-full rounded-xl py-3 text-lg font-bold text-white shadow-lg transition-all duration-200 ${
                isRolling
                  ? 'cursor-not-allowed bg-gray-700'
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:from-purple-500 hover:to-purple-400 active:scale-95'
              } focus:ring-2 focus:ring-purple-500/50`
        }
      >
        {isRolling ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

      {result !== null && (
        <div
          className={
            isMobile
              ? 'rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-center'
              : 'mt-1 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3 text-center'
          }
        >
          <div
            className={
              isMobile
                ? 'text-2xl font-extrabold text-slate-900'
                : 'text-xl font-bold text-white'
            }
          >
            {result}
          </div>
          <div
            className={
              isMobile
                ? 'mt-1 text-xs font-medium leading-snug text-slate-600'
                : 'mt-1 text-xs text-gray-400'
            }
          >
            {rollDetails}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div
      ref={panelRef}
      className={
        isMobile
          ? 'relative z-auto w-full max-w-full select-none'
          : 'pointer-events-auto absolute z-50 select-none'
      }
      style={
        isMobile
          ? undefined
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: isDragging ? 'grabbing' : 'default',
            }
      }
    >
      <div
        className={
          isMobile
            ? 'flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md'
            : `
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
        `
        }
      >
        {!isMobile && (
          <div
            className="pointer-events-auto flex cursor-move items-center justify-between px-4 py-3 transition hover:bg-white/5"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <div className="flex aspect-square h-7 w-7 items-center justify-center">
                <img src={d20Img} alt="" className="h-full w-full object-contain" />
              </div>
              {panelOpen && (
                <span className="text-lg font-bold tracking-tight text-white">
                  Lançador de Dados
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                setIsOpen(o => !o)
              }}
              className="text-gray-400 transition hover:text-white"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <FaChevronUp className="h-4 w-4" />
              ) : (
                <FaChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {panelOpen && (
          <div
            className={
              isMobile
                ? 'animate-fade-in pointer-events-auto flex flex-col gap-3 px-2 pb-3 pt-2 sm:px-3'
                : 'animate-fade-in pointer-events-auto flex flex-col gap-5 px-4 pb-4 pt-2'
            }
          >
            {dicePicker}
            {controlsAndRoll}
          </div>
        )}
      </div>
    </div>
  )
}
