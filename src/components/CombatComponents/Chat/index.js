import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { connect, socket } from '../../../services/socket'

import * as Styles from './styles'

export default function Chat() {
  const { profile } = useSelector(state => state.user)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const from = profile.id
  const messagesEndRef = React.createRef(null)

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function formatDate(date) {
    const convertedDate = parseISO(date)
    const localDate = utcToZonedTime(convertedDate, 'America/Sao_Paulo')

    return format(localDate, 'dd-MM-yy HH:mm:ss')
  }

  async function loadAllMessages() {
    try {
      const response = await api.get('/combats')
      setMessages(response.data)
    } catch (e) {
      toast.error('Houve um problema ao carregar as mensagens do Chat!')
    }
  }

  useEffect(() => {
    scrollToBottom()
  })

  const handleFormSubmit = event => {
    event.preventDefault()

    if (message.trim()) {
      api.post('combats', {
        id: from,
        user_id: profile.id,
        user: profile.name,
        message,
        result: 0,
        type: 1,
      })

      setMessage('')
    }
  }

  useEffect(() => {
    const handleNewMessage = newMessage =>
      setMessages([...messages, newMessage])

    socket.on('chat.message', handleNewMessage)

    return () => socket.off('chat.message', handleNewMessage)
  }, [messages])

  useEffect(() => {
    connect()
    loadAllMessages()
  }, []) // eslint-disable-line

  return (
    <Styles.ChatContainer>
      <Styles.ChatHistory>
        <ul>
          {messages.map((m, index) => (
            <Styles.ListMessage
              ref={messagesEndRef}
              from={from === m.id ? 1 : 0}
              key={index} // eslint-disable-line
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
          onChange={e => setMessage(e.target.value)}
          placeholder="Mensagem..."
          type="text"
          value={message}
        />
      </Styles.FormMessage>
    </Styles.ChatContainer>
  )
}
