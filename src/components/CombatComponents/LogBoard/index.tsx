import React, { useState, useEffect, useRef } from 'react'
import { FaTimes, FaSkull, FaStar, FaBolt } from 'react-icons/fa'
import { useAuth } from '../../../contexts'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

interface LogMessage {
  id: number | string
  user_id?: number
  user: string
  message: string
  date: string
  isCrit?: 'HIT' | 'FAIL' | null
  type?: number
}

/** HIT/FAIL no payload vale para ataque (d20). Dano nunca deve herdar “acerto crítico”. */
function effectiveAttackCrit(m: LogMessage): 'HIT' | 'FAIL' | null | undefined {
  const isDamageLog =
    m.type === 4 || /CAUSOU DANO/i.test(m.message)
  if (isDamageLog && m.isCrit === 'HIT') return null
  return m.isCrit
}

/** Dano crítico (botão / rolagem extra): sempre pelo texto, funciona em logs antigos. */
function isCriticalDamageMessage(m: LogMessage): boolean {
  return /CAUSOU DANO CR[ÍI]TICO/i.test(m.message)
}

function formatDate(date: string): string {
  const convertedDate = parseISO(date)
  const localDate = toZonedTime(convertedDate, 'America/Sao_Paulo')
  return format(localDate, 'dd-MM-yy HH:mm:ss')
}

function getMessageStyles(
  isMine: boolean,
  attackCrit: 'HIT' | 'FAIL' | null | undefined,
  critDamage: boolean
) {
  if (attackCrit === 'FAIL') {
    return {
      bubble:
        'bg-red-50 border border-red-200 shadow-sm ring-1 ring-red-100/80',
      text: 'text-red-800 font-bold',
      tail: 'border-b-red-50',
    }
  }
  if (attackCrit === 'HIT') {
    return {
      bubble:
        'bg-sky-50 border border-blue-200 shadow-sm ring-1 ring-blue-100/80',
      text: 'text-blue-800 font-bold',
      tail: 'border-b-sky-50',
    }
  }
  if (critDamage) {
    if (isMine) {
      return {
        bubble:
          'bg-emerald-50 border border-emerald-200/90 shadow-sm ring-1 ring-emerald-100/60',
        text: 'text-blue-800 font-bold',
        tail: 'border-b-emerald-50',
      }
    }
    return {
      bubble:
        'bg-slate-100 border border-slate-200 shadow-sm ring-1 ring-slate-200/60',
      text: 'text-blue-800 font-bold',
      tail: 'border-b-slate-100',
    }
  }
  if (isMine) {
    return {
      bubble: 'bg-emerald-500 shadow-sm',
      text: 'text-white',
      tail: 'border-b-emerald-500',
    }
  }
  return {
    bubble: 'bg-slate-200 shadow-sm',
    text: 'text-slate-800',
    tail: 'border-b-slate-200',
  }
}

const LogBoard: React.FC = () => {
  const { user } = useAuth()

  const [messages, setMessages] = useState<LogMessage[]>([])

  const messagesEndRef = useRef<HTMLLIElement>(null)

  function isMyMessage(message: LogMessage): boolean {
    if (user?.id != null && message.user_id != null) {
      return Number(message.user_id) === Number(user.id)
    }
    return user?.name != null && message.user === user.name
  }

  function scrollToBottom(): void {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  async function loadAllMessages(): Promise<void> {
    try {
      const response = await api.get<LogMessage[]>('/combats')
      const normalizedMessages = response.data.map((m: LogMessage) => ({
        ...m,
        isCrit:
          typeof m.isCrit === 'string' &&
          (m.isCrit === 'HIT' || m.isCrit === 'FAIL')
            ? m.isCrit
            : null,
      }))
      setMessages(normalizedMessages)
    } catch (error) {
      console.error('Erro ao carregar mensagens do LogBoard:', error)
      toast.error('Houve um problema ao carregar as mensagens do Chat!')
    }
  }

  useEffect(() => {
    scrollToBottom()
  })

  async function deleteMessage(messageId: string | number): Promise<void> {
    try {
      await api.delete(`/combats/${messageId}`)
      toast.success('Mensagem excluída com sucesso')
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error)
      toast.error('Erro ao excluir mensagem')
    }
  }

  useEffect(() => {
    const handleNewMessage = (newMessage: LogMessage): void => {
      const normalizedMessage = {
        ...newMessage,
        isCrit:
          typeof newMessage.isCrit === 'string'
            ? newMessage.isCrit === 'HIT' || newMessage.isCrit === 'FAIL'
              ? newMessage.isCrit
              : null
            : null,
      }
      setMessages(prevMessages => [...prevMessages, normalizedMessage])
    }

    const handleDeleteMessage = (data: { id: string | number }): void => {
      setMessages(prevMessages =>
        prevMessages.filter(msg => String(msg.id) !== String(data.id))
      )
    }

    socket.on('chat.message', handleNewMessage)
    socket.on('chat.delete', handleDeleteMessage)

    return () => {
      socket.off('chat.message', handleNewMessage)
      socket.off('chat.delete', handleDeleteMessage)
    }
  }, [messages])

  useEffect(() => {
    connect()
    loadAllMessages()
  }, [])

  return (
    <div className="flex flex-col w-full h-full min-h-0 flex-1 overflow-y-auto scrollbar-hide bg-stone-50 rounded-lg px-2 py-2">
      <ul className="w-full p-0 m-0 flex flex-col gap-3">
        {messages.map((message, index) => {
          const isMine = isMyMessage(message)
          const attackCrit = effectiveAttackCrit(message)
          const critDamage = isCriticalDamageMessage(message)
          const styles = getMessageStyles(isMine, attackCrit, critDamage)

          return (
            <li
              ref={index === messages.length - 1 ? messagesEndRef : null}
              key={`message-${message.id}-${index}`}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
            >
              {/* Cabeçalho: nome + data + botão delete */}
              <div
                className={`flex items-center gap-1.5 mb-1 ${
                  isMine ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <span className={`text-xs font-semibold ${isMine ? 'text-emerald-700' : 'text-slate-600'}`}>
                  {message.user}
                </span>
                <span className="text-[10px] text-slate-400">
                  {formatDate(message.date)}
                </span>
                {user?.is_gm && (
                  <button
                    onClick={() => deleteMessage(message.id)}
                    title="Excluir mensagem"
                    className="text-slate-300 hover:text-red-500 transition-colors p-0.5 rounded"
                  >
                    <FaTimes size={10} />
                  </button>
                )}
              </div>

              <div
                className={`flex max-w-[90%] flex-col ${isMine ? 'items-end' : 'items-start'}`}
              >
                {/* Só ataque usa HIT (acerto crítico no d20); FAIL = erro crítico (1) */}
                {attackCrit === 'HIT' && (
                  <div
                    className={`mb-1 flex items-center gap-1 text-[10px] font-bold text-blue-600 ${isMine ? 'self-end' : 'self-start'}`}
                  >
                    <FaStar size={8} />
                    <span>ACERTO CRÍTICO</span>
                    <FaStar size={8} />
                  </div>
                )}
                {attackCrit === 'FAIL' && (
                  <div
                    className={`mb-1 flex items-center gap-1 text-[10px] font-bold text-red-600 ${isMine ? 'self-end' : 'self-start'}`}
                  >
                    <FaSkull size={8} />
                    <span>ERRO CRÍTICO</span>
                    <FaSkull size={8} />
                  </div>
                )}
                {critDamage && (
                  <div
                    className={`mb-1 flex items-center gap-1 text-[10px] font-bold text-blue-700 ${isMine ? 'self-end' : 'self-start'}`}
                  >
                    <FaBolt size={8} />
                    <span>DANO CRÍTICO</span>
                    <FaBolt size={8} />
                  </div>
                )}

                {/* Bico fixo no topo do balão (relative só aqui, evita setinha “quebrada”) */}
                <div className="relative inline-block max-w-full">
                  <span
                    className={`pointer-events-none absolute z-10 h-0 w-0 border-x-8 border-x-transparent border-b-8 ${styles.tail} -top-2 ${
                      isMine ? 'right-3' : 'left-3'
                    }`}
                    aria-hidden
                  />
                  <div
                    className={`relative z-0 rounded-xl px-3 py-2 text-xs leading-relaxed ${styles.bubble} ${styles.text}`}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LogBoard
