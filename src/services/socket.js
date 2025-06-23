/* eslint-disable no-console */

import { io } from 'socket.io-client'

// Socket.IO está integrado no mesmo servidor Fastify
// Usa a mesma URL base da API
const getSocketURL = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  if (apiUrl) {
    return apiUrl
  }
  // Fallback para desenvolvimento local
  return 'http://localhost:9600'
}

const SOCKET_URL = getSocketURL()

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['polling', 'websocket'],
  upgrade: true,
  timeout: 20000,
  forceNew: false,
})

function connect() {
  if (!socket.connected) {
    socket.connect()
  }

  socket.on('connect', () => {
    // eslint-disable-next-line
    console.log('[IO] Connect => A new connection has been established')
    console.log('[IO] Socket ID:', socket.id)
  })

  socket.on('disconnect', reason => {
    console.log('[IO] Disconnected:', reason)
  })

  socket.on('connect_error', error => {
    console.error('[IO] Connection error:', error)
  })
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect()
  }
}

// Função utilitária para emitir eventos
function emit(event, data) {
  if (socket.connected) {
    socket.emit(event, data)
  } else {
    console.warn('[IO] Socket não conectado. Tentando conectar...')
    connect()
    // Retry após conexão
    setTimeout(() => {
      if (socket.connected) {
        socket.emit(event, data)
      }
    }, 1000)
  }
}

// Função utilitária para escutar eventos
function on(event, callback) {
  socket.on(event, callback)
}

// Função utilitária para remover listeners
function off(event, callback) {
  socket.off(event, callback)
}

export { connect, disconnect, socket, emit, on, off }
