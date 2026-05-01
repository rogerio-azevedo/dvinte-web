/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown, FaTimes, FaUserClock } from 'react-icons/fa'
import { useAuth } from '../../../contexts'
import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'
import SelectCharacter from '../../SelectCharacter'

interface Profile {
  id: number
  name: string
}

interface Initiative {
  _id: string
  user_id: number
  user: string
  initiative: number
}

interface SocketInitiativeData {
  id: string
}

interface APICharacter {
  Cod: number
  Name: string
  DexMod?: number
  DexModTemp?: number
}

interface Character {
  id: number
  name: string
  DexMod?: number
  DexModTemp?: number
}

interface InitiativesProps {
  from?: number
  profile?: Profile
  charInit?: number
}

export default function Initiatives({
  from = 0,
  charInit = 0,
}: InitiativesProps) {
  const { user } = useAuth()
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [userCharacters, setUserCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  )
  const [isOpen, setIsOpen] = useState(true)
  const [position, setPosition] = useState({ x: 20, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  async function loadInitiative(): Promise<void> {
    try {
      const response = await api.get('/initiatives')
      const initiativesData: Initiative[] = Array.isArray(response.data)
        ? response.data
        : []
      setInitiatives(initiativesData)
    } catch (error) {
      console.error('Erro ao carregar iniciativas:', error)
      setInitiatives([])
    }
  }

  const loadUserCharacters = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.log('❌ Iniciativas - user.id não disponível')
      return
    }

    try {
      console.log('🔄 Iniciativas - Carregando personagens para user:', user.id)
      const response = await api.get(`/characters/user/${user.id}`)

      const characters = Array.isArray(response.data) ? response.data : []

      // Mapeia os campos da API para o formato esperado (igual ao ArmoryDelay)
      const mappedCharacters = characters.map((char: APICharacter) => ({
        id: char.Cod,
        name: char.Name,
        DexMod: char.DexMod,
        DexModTemp: char.DexModTemp,
      }))

      // Filtra apenas personagens válidos
      const validCharacters = mappedCharacters.filter(
        char => char && char.id && char.name
      )

      console.log('✅ Iniciativas - Personagens carregados:', validCharacters)
      setUserCharacters(validCharacters)

      // Auto-seleciona se houver apenas 1 personagem
      if (validCharacters.length === 1) {
        setSelectedCharacter(validCharacters[0])
        console.log('✅ Iniciativas - Auto-selecionado:', validCharacters[0])
      }
    } catch (error) {
      console.error('❌ Iniciativas - Erro ao carregar personagens:', error)
      setUserCharacters([])
    }
  }, [user?.id])

  function handleCharacterChange(value: string | null): void {
    if (!value) {
      setSelectedCharacter(null)
      return
    }

    const char = userCharacters.find(c => c.id.toString() === value)
    if (char) {
      setSelectedCharacter(char)
      console.log('Personagem selecionado:', char)
    }
  }

  // Formata personagens para o SelectCharacter
  const characterOptions = userCharacters.map(char => ({
    value: char.id.toString(),
    label: char.name,
  }))

  async function handleInitiative(): Promise<void> {
    try {
      setIsLoading(true)

      // Validação do personagem selecionado
      if (!selectedCharacter) {
        toast.error('Selecione um personagem')
        return
      }

      if (!user?.id) {
        toast.error('Usuário não identificado')
        return
      }

      // Usa DexModTemp se existir, senão DexMod, senão charInit (prop), senão 0
      const dext =
        Number(selectedCharacter.DexModTemp) ||
        Number(selectedCharacter.DexMod) ||
        Number(charInit) ||
        0
      const dice = Math.floor(Math.random() * 20) + 1
      const initTotal = dext + dice

      const rolled = `${selectedCharacter.name} rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

      // Log dos dados que serão enviados
      console.log('Dados da iniciativa:', {
        user_id: user.id,
        user: selectedCharacter.name,
        initiative: initTotal,
      })

      // Primeiro post para o log de combate
      await api.post('combats', {
        id: from,
        user_id: user.id,
        user: selectedCharacter.name, // Nome do personagem
        message: rolled,
        result: initTotal,
        type: 8,
      })

      // Post para a iniciativa
      await api.post('initiatives', {
        user_id: user.id,
        user: selectedCharacter.name, // Nome do personagem
        initiative: initTotal,
      })
    } catch (error: any) {
      console.error('Erro ao rolar iniciativa:', error)
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data)
      }
      toast.error('Erro ao rolar iniciativa')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleNewInit = (newInitiative: Initiative): void => {
      console.log('[SOCKET] Evento init.message recebido:', newInitiative)
      console.log('Nova iniciativa recebida:', newInitiative)
      setInitiatives(prevInitiatives => {
        // Verifica se a iniciativa já existe para evitar duplicatas
        const exists = prevInitiatives.some(
          init => init._id === newInitiative._id
        )
        if (!exists) {
          return [...prevInitiatives, newInitiative]
        }
        return prevInitiatives
      })
    }

    const handleClearInit = (): void => {
      console.log('[SOCKET] Evento init.clear recebido')
      console.log('Limpando iniciativas via socket')
      setInitiatives([])
    }

    const handleDeleteInit = (data: SocketInitiativeData): void => {
      console.log('[SOCKET] Evento init.delete recebido:', data)
      console.log('Removendo iniciativa:', data)
      if (data.id) {
        setInitiatives(prev => prev.filter(init => init._id !== data.id))
      }
    }

    const handleUpdateInit = (updatedInitiative: Initiative): void => {
      console.log('[SOCKET] Evento init.update recebido:', updatedInitiative)
      setInitiatives(prevInitiatives =>
        prevInitiatives.map(init =>
          init._id === updatedInitiative._id ? updatedInitiative : init
        )
      )
    }

    // Conecta ao socket se ainda não estiver conectado
    if (!socket.connected) {
      connect()
    }

    // Registra os listeners
    socket.on('init.message', handleNewInit)
    socket.on('init.clear', handleClearInit)
    socket.on('init.delete', handleDeleteInit)
    socket.on('init.update', handleUpdateInit)

    // Carrega as iniciativas iniciais
    loadInitiative()

    // Cleanup
    return () => {
      socket.off('init.message', handleNewInit)
      socket.off('init.clear', handleClearInit)
      socket.off('init.delete', handleDeleteInit)
      socket.off('init.update', handleUpdateInit)
    }
  }, [])

  // Carrega personagens do usuário
  useEffect(() => {
    loadUserCharacters()
  }, [loadUserCharacters])

  // Persistência do estado aberto/fechado e posição
  useEffect(() => {
    const savedOpen = localStorage.getItem('initiatives-panel-open')
    const savedPosition = localStorage.getItem('initiatives-panel-position')
    if (savedOpen !== null) setIsOpen(savedOpen === 'true')
    if (savedPosition) {
      try {
        const parsedPos = JSON.parse(savedPosition)
        setPosition(parsedPos)
      } catch {
        // Ignora erro de parse
      }
    }
  }, [])

  // Clamp position within container when it resizes or opens/closes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (panelRef.current && panelRef.current.parentElement) {
        const container = panelRef.current.parentElement
        const panelWidth = panelRef.current.offsetWidth
        const panelHeight = panelRef.current.offsetHeight
        
        const maxX = Math.max(0, container.clientWidth - panelWidth)
        const maxY = Math.max(0, container.clientHeight - panelHeight)
        
        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        }))
      }
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [isOpen])

  useEffect(() => {
    localStorage.setItem('initiatives-panel-open', isOpen ? 'true' : 'false')
  }, [isOpen])

  useEffect(() => {
    localStorage.setItem('initiatives-panel-position', JSON.stringify(position))
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
  }, [isDragging, dragOffset])

  async function clearInitiatives(): Promise<void> {
    try {
      await api.delete('initiatives')
      setInitiatives([])
      toast.success('Iniciativas limpas com sucesso')
    } catch (error) {
      console.error('Erro ao limpar iniciativas:', error)
      toast.error('Erro ao limpar iniciativas')
    }
  }

  async function deleteInitiative(initiativeId: string): Promise<void> {
    try {
      await api.delete(`/initiatives/${initiativeId}`)
      toast.success('Iniciativa removida com sucesso')
    } catch (error) {
      console.error('Erro ao remover iniciativa:', error)
      toast.error('Erro ao remover iniciativa')
    }
  }

  async function moveInitiative(
    initiativeId: string,
    currentInitiative: number,
    direction: 'up' | 'down'
  ): Promise<void> {
    try {
      const sortedInitiatives = [...initiatives].sort(
        (a, b) => b.initiative - a.initiative
      )
      const currentIndex = sortedInitiatives.findIndex(
        init => init._id === initiativeId
      )

      if (currentIndex === -1) return

      let newInitiative: number

      if (direction === 'up') {
        // Mover para cima: aumentar a iniciativa para ficar acima do item anterior
        if (currentIndex === 0) {
          // Já está no topo, aumentar em 1
          newInitiative = currentInitiative + 1
        } else {
          const previousInitiative = sortedInitiatives[currentIndex - 1].initiative
          // Colocar entre o anterior e o atual, ou acima do anterior
          newInitiative = previousInitiative + 1
        }
      } else {
        // Mover para baixo: diminuir a iniciativa para ficar abaixo do próximo item
        if (currentIndex === sortedInitiatives.length - 1) {
          // Já está no final, diminuir em 1
          newInitiative = Math.max(0, currentInitiative - 1)
        } else {
          const nextInitiative = sortedInitiatives[currentIndex + 1].initiative
          // Colocar entre o atual e o próximo, ou abaixo do próximo
          newInitiative = Math.max(0, nextInitiative - 1)
        }
      }

      await api.put(`/initiatives/${initiativeId}`, {
        initiative: newInitiative,
      })
    } catch (error) {
      console.error('Erro ao reordenar iniciativa:', error)
      toast.error('Erro ao reordenar iniciativa')
    }
  }

  const sortedInitiatives = [...initiatives].sort(
    (a, b) => b.initiative - a.initiative
  )

  return (
    <div
      ref={panelRef}
      className="absolute z-50 select-none pointer-events-auto"
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
          ${isOpen ? 'w-[380px] max-h-[600px]' : 'w-24 h-16'}
        `}
      >
        {/* Header - arrastável */}
        <div
          className="flex items-center justify-between px-4 py-3 cursor-move hover:bg-white/5 transition pointer-events-auto"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center aspect-square bg-red-500/20 rounded-lg">
              <FaUserClock className="text-red-400" size={18} />
            </div>
            {isOpen && (
              <span className="font-bold text-white text-lg tracking-tight">
                Iniciativas
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen((o) => !o)
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
          <div className="flex flex-col gap-4 px-4 pb-4 pt-2 animate-fade-in pointer-events-auto max-h-[550px] overflow-y-auto">
            {/* Seletor de Personagem */}
            <div className="w-full flex justify-center">
              {userCharacters.length > 1 ? (
                <div className="w-full max-w-xs">
                  <SelectCharacter
                    characters={characterOptions}
                    changeCharacter={handleCharacterChange}
                    value={selectedCharacter?.id.toString()}
                  />
                </div>
              ) : userCharacters.length === 1 ? (
                <div className="px-3 py-2 text-center font-semibold border-2 border-purple-500/50 rounded-lg bg-purple-500/10 text-white">
                  {userCharacters[0].name}
                </div>
              ) : (
                <div className="px-3 py-2 text-center text-gray-400">
                  Carregando personagens...
                </div>
              )}
            </div>

            {/* Botão de Iniciativa */}
            <button
              type="button"
              onClick={handleInitiative}
              disabled={isLoading || !selectedCharacter}
              className={`w-full py-2.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all duration-200 ${
                isLoading || !selectedCharacter
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 hover:scale-[1.02] active:scale-95'
              } focus:ring-2 focus:ring-red-500/50`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Rolando...</span>
                </div>
              ) : (
                '🎲 Rolar Iniciativa'
              )}
            </button>

            {/* Lista de Iniciativas */}
            <div className="space-y-2">
              {sortedInitiatives.length === 0 ? (
                <div className="text-center text-gray-400 py-4 text-sm">
                  Nenhuma iniciativa registrada
                </div>
              ) : (
                sortedInitiatives.map((item, index) => {
                  const isFirst = index === 0
                  const isLast = index === sortedInitiatives.length - 1
                  return (
                    <div
                      key={item._id || `initiative-${index}`}
                      className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                      {/* Setas - lado esquerdo */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            moveInitiative(item._id, item.initiative, 'up')
                          }
                          disabled={isFirst}
                          title="Mover para cima"
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition ${
                            isFirst
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:scale-110 active:scale-95'
                          }`}
                        >
                          <FaArrowUp size={8} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            moveInitiative(item._id, item.initiative, 'down')
                          }
                          disabled={isLast}
                          title="Mover para baixo"
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition ${
                            isLast
                              ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                              : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:scale-110 active:scale-95'
                          }`}
                        >
                          <FaArrowDown size={8} />
                        </button>
                      </div>

                      {/* Nome e Valor - centro */}
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          readOnly
                          value={item.user}
                          className="flex-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                        <input
                          readOnly
                          value={item.initiative}
                          className="w-14 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        />
                      </div>

                      {/* Botão de excluir - lado direito */}
                      <button
                        type="button"
                        onClick={() => deleteInitiative(item._id)}
                        title="Excluir iniciativa"
                        className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:scale-110 active:scale-95 transition flex-shrink-0"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={clearInitiatives}
                className="flex-1 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold text-sm transition hover:scale-[1.02] active:scale-95"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={loadInitiative}
                className="flex-1 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 font-semibold text-sm transition hover:scale-[1.02] active:scale-95"
              >
                Recarregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
