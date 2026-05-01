/* eslint-disable no-console */

import React, { useState } from 'react'
import { toast } from 'react-toastify'

import api from '../../../services/api'
import { useAuth } from '../../../contexts'

export function ChatMessageForm() {
  const { user } = useAuth()
  const from = user?.id
  const [message, setMessage] = useState<string>('')

  const handleFormSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    if (!message.trim()) return

    try {
      await api.post('combats', {
        id: from,
        user_id: user?.id,
        user: user?.name,
        message: message.trim(),
        result: 0,
        type: 1,
      })

      setMessage('')
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      toast.error('Erro ao enviar mensagem')
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-auto w-full flex-col gap-2 px-3 py-3"
    >
      <label htmlFor="play-chat-message" className="sr-only">
        Mensagem
      </label>
      <input
        id="play-chat-message"
        type="text"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        placeholder="Mensagem..."
        className="w-full rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#8e0e00]/40 focus:ring-2 focus:ring-[#8e0e00]/15"
      />
    </form>
  )
}
