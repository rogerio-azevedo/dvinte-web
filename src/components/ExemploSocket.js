import React, { useState, useEffect } from 'react'
import { connect, disconnect, emit, on, off } from '../services/socket'

// Exemplo básico de como usar Socket.IO no frontend
export default function ExemploSocket() {
  const [mensagem, setMensagem] = useState('')
  const [mensagens, setMensagens] = useState([])
  const [conectado, setConectado] = useState(false)
  const [usuarios, setUsuarios] = useState([])

  // Conecta ao socket quando o componente monta
  useEffect(() => {
    console.log('🔌 Conectando ao Socket.IO...')
    connect()

    // Listeners para eventos de conexão
    on('connect', () => {
      console.log('✅ Conectado ao Socket.IO!')
      setConectado(true)
    })

    on('disconnect', () => {
      console.log('❌ Desconectado do Socket.IO!')
      setConectado(false)
    })

    // Listeners para eventos de chat
    on('chat.message', novaMensagem => {
      console.log('💬 Nova mensagem recebida:', novaMensagem)
      setMensagens(mensagensAtuais => [...mensagensAtuais, novaMensagem])
    })

    // Listeners para eventos de usuários
    on('USER_CONNECTED', usuario => {
      console.log('👤 Usuário conectado:', usuario)
      setUsuarios(usuariosAtuais => [...usuariosAtuais, usuario])
    })

    on('USER_DISCONNECTED', usuario => {
      console.log('👤 Usuário desconectado:', usuario)
      setUsuarios(usuariosAtuais =>
        usuariosAtuais.filter(u => u.id !== usuario.id)
      )
    })

    // Cleanup: remove listeners e desconecta quando componente desmonta
    return () => {
      console.log('🧹 Limpando listeners e desconectando...')
      off('connect')
      off('disconnect')
      off('chat.message')
      off('USER_CONNECTED')
      off('USER_DISCONNECTED')
      disconnect()
    }
  }, [])

  // Função para enviar mensagem
  const enviarMensagem = e => {
    e.preventDefault()

    if (mensagem.trim() && conectado) {
      const dadosMensagem = {
        user: 'Usuário Teste',
        user_id: 1,
        message: mensagem,
        timestamp: new Date().toISOString(),
        type: 1,
      }

      console.log('📤 Enviando mensagem:', dadosMensagem)

      // Emite evento para o servidor
      emit('chat.message', dadosMensagem)

      // Limpa o input
      setMensagem('')
    } else if (!conectado) {
      alert('Socket não conectado!')
    }
  }

  // Função para conectar usuário
  const conectarUsuario = () => {
    const usuario = {
      id: 1,
      name: 'Usuário Teste',
      avatar: null,
    }

    emit('USER_CONNECTED', usuario)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🔌 Exemplo Socket.IO</h2>

      {/* Status da conexão */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Status: </strong>
        <span style={{ color: conectado ? 'green' : 'red' }}>
          {conectado ? '✅ Conectado' : '❌ Desconectado'}
        </span>
      </div>

      {/* Botão para conectar usuário */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={conectarUsuario} disabled={!conectado}>
          👤 Conectar Usuário
        </button>
      </div>

      {/* Lista de usuários conectados */}
      <div style={{ marginBottom: '20px' }}>
        <h3>👥 Usuários Conectados ({usuarios.length})</h3>
        <ul>
          {usuarios.map((usuario, index) => (
            <li key={index}>{usuario.name}</li>
          ))}
        </ul>
      </div>

      {/* Chat */}
      <div style={{ marginBottom: '20px' }}>
        <h3>💬 Chat</h3>

        {/* Lista de mensagens */}
        <div
          style={{
            border: '1px solid #ccc',
            height: '200px',
            overflowY: 'scroll',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {mensagens.map((msg, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <strong>{msg.user}:</strong> {msg.message}
              <small style={{ color: '#666', marginLeft: '10px' }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>

        {/* Form para enviar mensagem */}
        <form onSubmit={enviarMensagem}>
          <input
            type="text"
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            style={{
              width: '70%',
              padding: '8px',
              marginRight: '10px',
            }}
            disabled={!conectado}
          />
          <button
            type="submit"
            disabled={!conectado || !mensagem.trim()}
            style={{ padding: '8px 15px' }}
          >
            📤 Enviar
          </button>
        </form>
      </div>

      {/* Outros eventos */}
      <div>
        <h3>🎮 Outros Eventos</h3>
        <button
          onClick={() =>
            emit('init.message', {
              user: 'Teste',
              initiative: Math.floor(Math.random() * 20) + 1,
              timestamp: new Date().toISOString(),
            })
          }
          disabled={!conectado}
          style={{ marginRight: '10px' }}
        >
          🎲 Enviar Iniciativa
        </button>

        <button
          onClick={() =>
            emit('token.message', {
              id: 1,
              x: Math.floor(Math.random() * 100),
              y: Math.floor(Math.random() * 100),
              timestamp: new Date().toISOString(),
            })
          }
          disabled={!conectado}
          style={{ marginRight: '10px' }}
        >
          🎮 Mover Token
        </button>

        <button
          onClick={() =>
            emit('note.message', {
              user: 'Teste',
              note: 'Nota de exemplo',
              timestamp: new Date().toISOString(),
            })
          }
          disabled={!conectado}
        >
          📝 Enviar Nota
        </button>
      </div>

      {/* Debug info */}
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>🔧 Debug Info</h4>
        <p>Socket URL: http://localhost:3000</p>
        <p>Mensagens recebidas: {mensagens.length}</p>
        <p>Usuários conectados: {usuarios.length}</p>
      </div>
    </div>
  )
}
