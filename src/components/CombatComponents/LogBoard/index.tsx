import React, { useState, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useAuth } from '../../../contexts'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

interface LogMessage {
  id: number | string
  user: string
  message: string
  date: string
  isCrit?: 'HIT' | 'FAIL' | null
}

const LogBoard: React.FC = () => {
  const { user } = useAuth()

  const [messages, setMessages] = useState<LogMessage[]>([])

  const from = user?.name
  const messagesEndRef = useRef<HTMLLIElement>(null)

  function scrollToBottom(): void {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function formatDate(date: string): string {
    const convertedDate = parseISO(date)
    const localDate = toZonedTime(convertedDate, 'America/Sao_Paulo')

    return format(localDate, 'dd-MM-yy HH:mm:ss')
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
      // Garantir que isCrit seja sempre string ou null
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
    <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-white rounded-lg px-1 py-2">
      <div className="w-full flex-1 flex flex-row font-sans">
        <div className="w-full border-b-2 border-white">
          <ul className="w-full p-0 m-0">
            {messages.map((message, index) => (
              <li
                ref={index === messages.length - 1 ? messagesEndRef : null}
                className={`mb-4 clear-both ${
                  from === message.user ? 'text-right' : 'text-left'
                }`}
                key={`message-${message.id}-${index}`}
              >
                <div
                  className={`mb-[10px] ${
                    from === message.user ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-flex items-center gap-2 ${
                      from === message.user ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <span className="text-gray-500 text-xs">
                      {formatDate(message.date)}
                    </span>
                    <span className="text-black text-sm">{message.user}</span>
                    {user?.is_gm && (
                      <button
                        onClick={() => deleteMessage(message.id)}
                        title="Excluir mensagem"
                        className="text-red-500 hover:text-red-700 transition hover:scale-110"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px 4px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`relative inline-block px-2 py-2 rounded-lg max-w-full mb-4 ${
                    from === message.user
                      ? 'bg-green-300 float-right'
                      : 'bg-blue-200 float-left'
                  } ${
                    message.isCrit === 'HIT'
                      ? 'border-2 border-blue-500'
                      : message.isCrit === 'FAIL'
                      ? 'border-2 border-red-500'
                      : ''
                  } ${
                    message.isCrit === 'HIT'
                      ? 'text-blue-800 font-bold'
                      : message.isCrit === 'FAIL'
                      ? 'text-red-800 font-bold'
                      : 'text-black'
                  }`}
                >
                  <span
                    className={`absolute w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent -top-2
                      ${
                        from === message.user
                          ? 'right-2 border-b-8 border-b-green-300'
                          : 'left-2 border-b-8 border-b-blue-200'
                      }`}
                  />
                  {message.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LogBoard
