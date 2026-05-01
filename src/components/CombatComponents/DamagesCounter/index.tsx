/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts'
import api from '../../../services/api'
import { socket, connect, emit } from '../../../services/socket'

interface DamageItem {
  user: string
  damage: number
}

interface Message {
  id: number
  user_id: number
  user: string
  message: string
  result: number
  type: number
  isCrit: string
}

type DamageType = 'session' | 'combat' | 'reload' | undefined

type FilterKey = 'reload' | 'session' | 'combat'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'reload', label: 'Recarregar' },
  { key: 'session', label: 'Aventura' },
  { key: 'combat', label: 'Combate' },
]

export default function DamagesCounter() {
  const { user } = useAuth()
  const [damages, setDamages] = useState<DamageItem[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterKey>('reload')

  async function loadDamage(type?: DamageType): Promise<void> {
    try {
      const response = await api.get('/damages', { params: { type } })
      const damagesData: DamageItem[] = Array.isArray(response.data)
        ? response.data
        : []
      setDamages(damagesData)
    } catch (error) {
      console.error('[DamagesCounter] Erro ao carregar danos:', error)
      setDamages([])
    }
  }

  function handleFilter(key: FilterKey) {
    setActiveFilter(key)
    loadDamage(key)
  }

  async function handleStartSession(): Promise<void> {
    try {
      const message: Message = {
        id: user?.id || 0,
        user_id: user?.id || 0,
        user: user?.name || '',
        message: 'Iniciou uma nova aventura',
        result: 0,
        type: 0,
        isCrit: 'false',
      }
      await api.post('/combats', message)
      emit('chat.message', message)
      setActiveFilter('session')
      await loadDamage('session')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar sessão:', err)
    }
  }

  async function handleStartCombat(): Promise<void> {
    try {
      const message: Message = {
        id: user?.id || 0,
        user_id: user?.id || 0,
        user: user?.name || '',
        message: 'Iniciou um novo combate',
        result: 0,
        type: 8,
        isCrit: 'false',
      }
      await api.post('/combats', message)
      emit('chat.message', message)
      setActiveFilter('combat')
      await loadDamage('combat')
    } catch (err) {
      console.error('[DamagesCounter] Erro ao iniciar combate:', err)
    }
  }

  useEffect(() => {
    loadDamage()

    const handleChatMessage = (message: Message): void => {
      if (message.type === 0) {
        loadDamage('session')
      } else if (message.type === 8) {
        loadDamage('combat')
      } else if (message.type === 4) {
        loadDamage()
      }
    }

    socket.on('chat.message', handleChatMessage)

    if (!socket.connected) {
      connect()
    }

    return () => {
      socket.off('chat.message', handleChatMessage)
    }
  }, [])

  const sorted = [...damages].sort((a, b) => b.damage - a.damage)

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Filtros */}
      <div className="flex w-full gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleFilter(key)}
            className={`flex-1 rounded-md border py-2 text-xs font-semibold transition-colors ${
              activeFilter === key
                ? 'border-[#8e0e00] bg-[#8e0e00] text-white shadow-sm'
                : 'border-stone-200 bg-white text-slate-700 hover:border-[#8e0e00]/40 hover:bg-[#8e0e00]/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de danos */}
      <div className="flex w-full flex-col gap-1.5 overflow-y-auto" style={{ maxHeight: 320 }}>
        {sorted.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            Nenhum dano registrado
          </p>
        ) : (
          sorted.map((item, index) => (
            <div
              key={`${item.user}-${index}`}
              className="flex items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 shadow-sm"
            >
              <span className="truncate text-sm font-medium text-slate-700">
                {item.user}
              </span>
              <span className="ml-2 flex-shrink-0 rounded-md bg-[#8e0e00]/10 px-2.5 py-0.5 text-sm font-bold text-[#8e0e00]">
                {item.damage}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Ações */}
      <div className="flex w-full gap-2 border-t border-stone-200 pt-3">
        <button
          type="button"
          onClick={handleStartSession}
          className="flex-1 rounded-md border border-stone-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#8e0e00]/40 hover:bg-[#8e0e00] hover:text-white"
        >
          Inicia Aventura
        </button>
        <button
          type="button"
          onClick={handleStartCombat}
          className="flex-1 rounded-md border border-stone-200 bg-white py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#8e0e00]/40 hover:bg-[#8e0e00] hover:text-white"
        >
          Inicia Combate
        </button>
      </div>
    </div>
  )
}
