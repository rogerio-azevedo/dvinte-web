/* eslint-disable no-console */

import React, { useState, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useAuth } from '../../../contexts'
import { format, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

interface Message {
  id: number | string
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
    const localDate = toZonedTime(convertedDate, 'America/Sao_Paulo')

    return format(localDate, 'dd-MM-yy HH:mm:ss')
  }

  async function loadAllMessages(): Promise<void> {
    try {
      const response = await api.get('/combats')
      const messagesData: Message[] = Array.isArray(response.data)
        ? response.data.map((m: any) => ({
            ...m,
            isCrit: typeof m.isCrit === 'string' 
              ? m.isCrit 
              : m.isCrit === true 
              ? 'HIT' 
              : m.isCrit === false 
              ? 'FAIL' 
              : 'NORMAL'
          }))
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
    const handleNewMessage = (newMessage: Message): void => {
      // Garantir que isCrit seja sempre string
      const normalizedMessage = {
        ...newMessage,
        isCrit: typeof newMessage.isCrit === 'string' 
          ? newMessage.isCrit 
          : newMessage.isCrit === true 
          ? 'HIT' 
          : newMessage.isCrit === false 
          ? 'FAIL' 
          : 'NORMAL'
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
  }, [])

  useEffect(() => {
    connect()
    loadAllMessages()
  }, [])

  return (
    <Styles.ChatContainer>
      <Styles.ChatHistory>
        <ul>
          {messages.map((m, index) => {
            const isOwnMessage = from === m.user_id
            return (
              <Styles.ListMessage
                ref={index === messages.length - 1 ? messagesEndRef : null}
                from={isOwnMessage ? 1 : 0}
                key={m.id || `message-${index}`}
              >
                <Styles.MessageData from={isOwnMessage ? 1 : 0}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' }}>
                    <Styles.MessageDateTime from={isOwnMessage ? 1 : 0}>
                      {formatDate(m.date)}
                    </Styles.MessageDateTime>
                    <Styles.MessageDataName from={isOwnMessage ? 1 : 0}>
                      {m.user}
                    </Styles.MessageDataName>
                    {user?.is_gm && (
                      <button
                        onClick={() => deleteMessage(m.id)}
                        title="Excluir mensagem"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#dc2626',
                          padding: '2px 4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#991b1b'
                          e.currentTarget.style.transform = 'scale(1.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#dc2626'
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                </Styles.MessageData>
              <Styles.Message 
                crit={m.isCrit === 'HIT' ? 'HIT' : m.isCrit === 'FAIL' ? 'FAIL' : 'NORMAL'} 
                from={isOwnMessage ? 1 : 0}
              >
                {m.message}
              </Styles.Message>
              </Styles.ListMessage>
            )
          })}
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
