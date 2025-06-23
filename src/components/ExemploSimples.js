import React, { useState, useEffect } from 'react'
import { socket } from '../services/socket'

// EXEMPLO SUPER SIMPLES DE SOCKET.IO
export default function ExemploSimples() {
  const [mensagem, setMensagem] = useState('')
  const [mensagens, setMensagens] = useState([])
  const [conectado, setConectado] = useState(false)

  useEffect(() => {
    // 1. CONECTAR ao socket
    socket.connect()

    // 2. ESCUTAR eventos do servidor
    socket.on('connect', () => {
      console.log('Conectado!')
      setConectado(true)
    })

    socket.on('disconnect', () => {
      console.log('Desconectado!')
      setConectado(false)
    })

    socket.on('chat.message', novaMensagem => {
      console.log('Nova mensagem:', novaMensagem)
      setMensagens(mensagensAtuais => [...mensagensAtuais, novaMensagem])
    })

    // 3. CLEANUP quando componente desmonta
    return () => {
      socket.disconnect()
    }
  }, [])

  // 4. ENVIAR dados para o servidor
  const enviarMensagem = () => {
    if (mensagem.trim()) {
      const dados = {
        user: 'Teste',
        message: mensagem,
        timestamp: new Date().toISOString(),
      }

      // EMITIR evento para o servidor
      socket.emit('chat.message', dados)
      setMensagem('')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Socket.IO - Exemplo Simples</h2>

      <p>Status: {conectado ? '🟢 Conectado' : '🔴 Desconectado'}</p>

      <div>
        <input
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          placeholder="Digite uma mensagem"
        />
        <button onClick={enviarMensagem} disabled={!conectado}>
          Enviar
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Mensagens:</h3>
        {mensagens.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
    </div>
  )
}

/*
RESUMO DOS CONCEITOS:

1. CONECTAR:
   socket.connect()

2. ESCUTAR eventos:
   socket.on('nome-do-evento', (dados) => {
     // fazer algo com os dados
   })

3. ENVIAR eventos:
   socket.emit('nome-do-evento', dados)

4. DESCONECTAR:
   socket.disconnect()

EVENTOS PRINCIPAIS NO SEU SISTEMA:
- chat.message (mensagens do chat)
- init.message (iniciativas)
- token.message (movimentação de tokens)
- note.message (notas)
- map.message (mudanças de mapa)
- USER_CONNECTED (usuário conectou)
- USER_DISCONNECTED (usuário desconectou)

IMPORTANTE: Socket.IO está rodando na porta 9600 (mesma do servidor Fastify)
*/
