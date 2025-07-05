/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../contexts'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

interface LogMessage {
  id: number
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
      setMessages(response.data)
    } catch (error) {
      console.error('Erro ao carregar mensagens do LogBoard:', error)
      toast.error('Houve um problema ao carregar as mensagens do Chat!')
    }
  }

  useEffect(() => {
    scrollToBottom()
  })

  useEffect(() => {
    const handleNewMessage = (newMessage: LogMessage): void => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    }

    socket.on('chat.message', handleNewMessage)

    return () => {
      socket.off('chat.message', handleNewMessage)
    }
  }, [messages])

  useEffect(() => {
    connect()
    loadAllMessages()
  }, [])

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-white rounded-lg p-2">
      <div className="w-full flex-1 flex flex-row font-sans">
        <div className="w-full p-4 border-b-2 border-white">
          <ul>
            {messages.map((message, index) => (
              <li
                ref={index === messages.length - 1 ? messagesEndRef : null}
                className={`mb-4 ${
                  from === message.user ? 'text-right' : 'text-left'
                }`}
                key={`message-${message.id}-${index}`}
              >
                <div
                  className={`mb-[10px] ${
                    from === message.user ? 'text-right' : 'text-left'
                  }`}
                >
                  <span className="text-gray-500 text-xs pl-1">
                    {formatDate(message.date)}
                  </span>
                  <span
                    className={`text-black text-sm pl-1 ${
                      from === message.user ? 'float-right' : 'float-left'
                    }`}
                  >
                    {message.user}
                  </span>
                </div>
                <div
                  className={`relative inline-block px-3 py-2 rounded-lg w-full mb-4 ${
                    from === message.user
                      ? 'bg-green-300 float-right'
                      : 'bg-blue-200 float-left'
                  } ${
                    message.isCrit === 'HIT'
                      ? 'text-blue-700'
                      : message.isCrit === 'FAIL'
                      ? 'text-red-700'
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
