/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

type EventCallback = (data?: any) => void

interface SocketEventData {
  event: string
  data: any
}

const getSocketURL = (): string => {
  const apiUrl = import.meta.env.VITE_APP_API_URL
  if (apiUrl) {
    // Converter HTTP para WS
    return (
      apiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws'
    )
  }
  // Fallback para desenvolvimento local
  return 'ws://localhost:9600/ws'
}

const SOCKET_URL = getSocketURL()

class WebSocketService {
  private ws: WebSocket | null = null
  private connected: boolean = false
  private listeners: Map<string, EventCallback[]> = new Map()
  private reconnectInterval: number = 5000
  private shouldReconnect: boolean = true
  private connecting: boolean = false

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected')
      return
    }

    if (this.connecting) {
      console.log('[WS] Connection already in progress')
      return
    }

    this.connecting = true

    console.log(`[WS] Connecting to ${SOCKET_URL}...`)

    try {
      this.ws = new WebSocket(SOCKET_URL)

      this.ws.onopen = () => {
        this.connected = true
        this.connecting = false
        console.log('[WS] Connect => A new connection has been established')
        console.log('[WS] WebSocket connected')

        // Trigger connect listeners
        this.emit('connect')
      }

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          const data: SocketEventData = JSON.parse(event.data)
          console.log('[WS] Message received:', data)

          // Emit the event to listeners
          if (data.event) {
            this.emit(data.event, data.data)
          }
        } catch (error) {
          console.error('[WS] Error parsing message:', error)
        }
      }

      this.ws.onclose = (event: CloseEvent) => {
        this.connected = false
        this.connecting = false
        console.log('[WS] Disconnected:', event.reason || 'Unknown reason')

        // Trigger disconnect listeners
        this.emit('disconnect', event.reason || 'Connection closed')

        // Auto-reconnect
        if (this.shouldReconnect) {
          setTimeout(() => {
            console.log('[WS] Attempting to reconnect...')
            this.connect()
          }, this.reconnectInterval)
        }
      }

      this.ws.onerror = (error: Event) => {
        this.connecting = false
        console.error('[WS] Connection error:', error)
        this.emit('connect_error', error)
      }
    } catch (error) {
      this.connecting = false
      console.error('[WS] Failed to create WebSocket:', error)
      this.emit('connect_error', error)
    }
  }

  disconnect(): void {
    this.shouldReconnect = false
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.connected = false
    }
  }

  // Função para emitir eventos (enviar para servidor)
  send(event: string, data?: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event, data })
      this.ws.send(message)
    } else {
      console.warn('[WS] WebSocket não conectado. Tentando conectar...')
      this.connect()
      // Retry após conexão
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ event, data })
          this.ws.send(message)
        }
      }, 1000)
    }
  }

  // Função para escutar eventos (receber do servidor)
  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  // Função para remover listeners
  off(event: string, callback: EventCallback): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)!
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Função interna para emitir eventos para listeners
  private emit(event: string, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`[WS] Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  // Getter para status de conexão
  get isConnected(): boolean {
    return this.connected
  }
}

// Criar instância global
const socketService = new WebSocketService()

// API compatível com Socket.IO
const connect = (): void => socketService.connect()
const disconnect = (): void => socketService.disconnect()
const emit = (event: string, data?: any): void =>
  socketService.send(event, data)
const on = (event: string, callback: EventCallback): void =>
  socketService.on(event, callback)
const off = (event: string, callback: EventCallback): void =>
  socketService.off(event, callback)

// Interface para o objeto socket
interface SocketObject {
  readonly connected: boolean
  readonly id: string
  on: (event: string, callback: EventCallback) => void
  off: (event: string, callback: EventCallback) => void
  emit: (event: string, data?: any) => void
}

// Socket object para compatibilidade
const socket: SocketObject = {
  get connected(): boolean {
    return socketService.isConnected
  },
  id: 'websocket-client', // Compatibilidade
  on,
  off,
  emit,
}

export { connect, disconnect, socket, emit, on, off }
export type { EventCallback, SocketEventData, SocketObject }
