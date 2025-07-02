/* eslint-disable no-console */

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

interface Message {
  id: number
  user_id: number
  user: string
  message: string
  result: number
  type: number
  date: string
  isCrit?: 'HIT' | 'FAIL' | 'NORMAL'
}

export default function Chat() {
  const { user } = useAuth()

  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  const from = user?.id
  const messagesEndRef = useRef<HTMLLIElement>(null)

  function scrollToBottom(): void {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function formatDate(date: string): string {
    const convertedDate = parseISO(date)
    const localDate = utcToZonedTime(convertedDate, 'America/Sao_Paulo')

    return format(localDate, 'dd-MM-yy HH:mm:ss')
  }

  async function loadAllMessages(): Promise<void> {
    try {
      const response = await api.get('/combats')
      const messagesData: Message[] = Array.isArray(response.data)
        ? response.data
        : []
      setMessages(messagesData)
    } catch (error) {
      console.error('Erro ao carregar mensagens do chat:', error)
      toast.error('Houve um problema ao carregar as mensagens do Chat!')
    }
  }

  useEffect(() => {
    scrollToBottom()
  })

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (message.trim()) {
      try {
        await api.post('combats', {
          id: from,
          user_id: user?.id,
          user: user?.name,
          message,
          result: 0,
          type: 1,
        })

        setMessage('')
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        toast.error('Erro ao enviar mensagem')
      }
    }
  }

  useEffect(() => {
    const handleNewMessage = (newMessage: Message): void => {
      setMessages(prevMessages => [...prevMessages, newMessage])
    }

    socket.on('chat.message', handleNewMessage)

    return () => {
      socket.off('chat.message', handleNewMessage)
    }
  }, [])

  useEffect(() => {
    connect()
    loadAllMessages()
  }, [])

  return (
    <Styles.ChatContainer>
      <Styles.ChatHistory>
        <ul>
          {messages.map((m, index) => (
            <Styles.ListMessage
              ref={index === messages.length - 1 ? messagesEndRef : null}
              from={from === m.id ? 1 : 0}
              key={m.id || `message-${index}`}
            >
              <Styles.MessageData from={from === m.id ? 1 : 0}>
                <Styles.MessageDateTime from={from === m.id ? 1 : 0}>
                  {formatDate(m.date)}
                </Styles.MessageDateTime>
                <Styles.MessageDataName from={from === m.id ? 1 : 0}>
                  {m.user}
                </Styles.MessageDataName>
              </Styles.MessageData>
              <Styles.Message crit={m.isCrit} from={from === m.id ? 1 : 0}>
                {m.message}
              </Styles.Message>
            </Styles.ListMessage>
          ))}
        </ul>
      </Styles.ChatHistory>

      <Styles.FormMessage onSubmit={handleFormSubmit}>
        <Styles.InputMessage
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          placeholder="Mensagem..."
          type="text"
          value={message}
        />
      </Styles.FormMessage>
    </Styles.ChatContainer>
  )
}
