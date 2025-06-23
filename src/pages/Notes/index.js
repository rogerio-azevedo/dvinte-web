import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { format, parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import api from '../../services/api'

import * as Styles from './styles'

import { connect, socket } from '../../services/socket'

export default function Notes() {
  const profile = useSelector(state => state.user.profile)

  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])

  const messagesEndRef = React.createRef(null)

  function formatDate(date) {
    const convertedDate = parseISO(date)
    const localDate = utcToZonedTime(convertedDate, 'America/Sao_Paulo')

    return format(localDate, 'dd-MM-yy HH:mm:ss')
  }

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  async function loadAllMessages() {
    try {
      const response = await api.get('/notes', {
        params: {
          user_id: profile.id,
        },
      })

      setNotes(response.data)
    } catch (e) {
      toast.error('Conexao com a API mal sucedida.')
    }
  }

  useEffect(() => {
    scrollToBottom()
  })

  useEffect(() => {
    connect()
    loadAllMessages()
  }, []) // eslint-disable-line

  useEffect(() => {
    const handleNewMessage = newMessage => setNotes([...notes, newMessage])

    socket.on('note.message', handleNewMessage)

    return () => socket.off('note.message', handleNewMessage)
  }, [notes])

  const handleFormSubmit = event => {
    event.preventDefault()

    if (note.trim()) {
      api.post('notes', {
        user_id: profile.id,
        user: profile.name,
        note,
      })

      setNote('')
    }
  }

  return (
    <Styles.Container>
      <h1>Minhas Notas</h1>
      <Styles.ChatContainer>
        <Styles.ChatHistory>
          <Styles.List>
            {notes.map((m, index) => (
              <Styles.ListMessage
                ref={messagesEndRef}
                key={index} // eslint-disable-line
              >
                <Styles.MessageData>
                  <Styles.MessageDateTime>
                    {formatDate(m.date)}
                  </Styles.MessageDateTime>
                  <Styles.MessageDataName>{m.user}</Styles.MessageDataName>
                </Styles.MessageData>
                <Styles.Message>{m.note}</Styles.Message>
              </Styles.ListMessage>
            ))}
          </Styles.List>
        </Styles.ChatHistory>

        <Styles.FormMessage onSubmit={handleFormSubmit}>
          <Styles.InputMessage
            onChange={e => setNote(e.target.value)}
            placeholder="Nota..."
            type="text"
            value={note}
          />
        </Styles.FormMessage>
      </Styles.ChatContainer>
    </Styles.Container>
  )
}
