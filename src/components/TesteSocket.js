import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

// Teste seguindo a documentação oficial
export default function TesteSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [transport, setTransport] = useState('N/A')

  useEffect(() => {
    const socket = io('http://localhost:9600')

    socket.on('connect', () => {
      setIsConnected(true)
      setTransport(socket.io.engine.transport.name)

      socket.io.engine.on('upgrade', transport => {
        setTransport(transport.name)
      })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      setTransport('N/A')
    })

    return () => socket.close()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Teste Socket.IO (Documentação Oficial)</h2>
      <p>Status: {isConnected ? '✅ connected' : '❌ disconnected'}</p>
      <p>Transport: {transport}</p>
    </div>
  )
}
