# 🔌 Guia Socket.IO - Frontend

## 📋 Conceitos Básicos

Socket.IO permite comunicação em tempo real entre frontend e backend. É como um "telefone" que mantém uma linha aberta entre o navegador e o servidor.

### 🔄 Fluxo Básico:

1. **Frontend conecta** ao servidor
2. **Frontend escuta** eventos do servidor
3. **Frontend envia** eventos para o servidor
4. **Servidor responde** ou envia para outros clientes

---

## 🚀 Implementação Básica

### 1. Conectar ao Socket

```javascript
import { socket } from '../services/socket'

useEffect(() => {
  // Conecta ao servidor Socket.IO (porta 3000)
  socket.connect()

  // Escuta quando conecta com sucesso
  socket.on('connect', () => {
    console.log('✅ Conectado ao servidor!')
  })

  // Cleanup ao desmontar componente
  return () => {
    socket.disconnect()
  }
}, [])
```

### 2. Escutar Eventos do Servidor

```javascript
useEffect(() => {
  // Escuta mensagens de chat
  socket.on('chat.message', mensagem => {
    console.log('💬 Nova mensagem:', mensagem)
    setMensagens(msgs => [...msgs, mensagem])
  })

  // Escuta movimentação de tokens
  socket.on('token.message', token => {
    console.log('🎮 Token movido:', token)
    atualizarPosicaoToken(token)
  })

  // Remove listeners quando componente desmonta
  return () => {
    socket.off('chat.message')
    socket.off('token.message')
  }
}, [])
```

### 3. Enviar Eventos para o Servidor

```javascript
// Enviar mensagem de chat
const enviarMensagem = () => {
  const dados = {
    user: 'João',
    message: 'Olá pessoal!',
    timestamp: new Date().toISOString(),
  }

  socket.emit('chat.message', dados)
}

// Enviar movimento de token
const moverToken = (tokenId, novaX, novaY) => {
  socket.emit('token.message', {
    id: tokenId,
    x: novaX,
    y: novaY,
    timestamp: new Date().toISOString(),
  })
}
```

---

## 🎮 Eventos do Sistema DVinte

### 📨 Eventos que você pode ESCUTAR:

```javascript
// Chat
socket.on('chat.message', msg => {
  /* nova mensagem */
})

// Iniciativas
socket.on('init.message', init => {
  /* nova iniciativa */
})

// Tokens
socket.on('token.message', token => {
  /* token movido */
})

// Mapas
socket.on('map.message', map => {
  /* mapa mudou */
})

// Notas
socket.on('note.message', note => {
  /* nova nota */
})

// Usuários
socket.on('USER_CONNECTED', user => {
  /* usuário entrou */
})
socket.on('USER_DISCONNECTED', user => {
  /* usuário saiu */
})
```

### 📤 Eventos que você pode ENVIAR:

```javascript
// Enviar mensagem
socket.emit('chat.message', {
  user: 'Nome',
  message: 'Texto',
  timestamp: new Date().toISOString(),
})

// Enviar iniciativa
socket.emit('init.message', {
  user: 'Nome',
  initiative: 15,
  timestamp: new Date().toISOString(),
})

// Mover token
socket.emit('token.message', {
  id: 1,
  x: 100,
  y: 200,
  rotation: 0,
})

// Conectar usuário
socket.emit('USER_CONNECTED', {
  id: 1,
  name: 'João',
  avatar: 'url-da-imagem',
})
```

---

## 💡 Exemplo Prático - Chat Simples

```javascript
import React, { useState, useEffect } from 'react'
import { socket } from '../services/socket'

export default function ChatSimples() {
  const [mensagem, setMensagem] = useState('')
  const [mensagens, setMensagens] = useState([])
  const [conectado, setConectado] = useState(false)

  useEffect(() => {
    // Conectar
    socket.connect()

    // Listeners
    socket.on('connect', () => setConectado(true))
    socket.on('disconnect', () => setConectado(false))
    socket.on('chat.message', msg => {
      setMensagens(msgs => [...msgs, msg])
    })

    // Cleanup
    return () => {
      socket.disconnect()
    }
  }, [])

  const enviar = () => {
    if (mensagem.trim()) {
      socket.emit('chat.message', {
        user: 'Eu',
        message: mensagem,
        timestamp: new Date().toISOString(),
      })
      setMensagem('')
    }
  }

  return (
    <div>
      <div>Status: {conectado ? '🟢' : '🔴'}</div>

      <div>
        {mensagens.map((msg, i) => (
          <div key={i}>
            {msg.user}: {msg.message}
          </div>
        ))}
      </div>

      <input
        value={mensagem}
        onChange={e => setMensagem(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && enviar()}
      />
      <button onClick={enviar}>Enviar</button>
    </div>
  )
}
```

---

## 🛠️ Dicas Importantes

### ✅ Boas Práticas:

- Sempre remover listeners no cleanup (`socket.off()`)
- Verificar se socket está conectado antes de emitir
- Usar `useEffect` para gerenciar conexões
- Tratar erros de conexão

### ❌ Evitar:

- Conectar múltiplas vezes sem desconectar
- Esquecer de remover listeners
- Enviar dados desnecessários
- Não tratar desconexões

### 🔧 Debug:

```javascript
// Ver logs de conexão
socket.on('connect', () => console.log('Conectado!'))
socket.on('disconnect', () => console.log('Desconectado!'))
socket.on('connect_error', err => console.error('Erro:', err))

// Ver todos os eventos
socket.onAny((event, ...args) => {
  console.log('Evento recebido:', event, args)
})
```

---

## 🌐 Configuração de URL

O socket está configurado para conectar em:

- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: Variável `REACT_APP_API_URL`

Para alterar, edite `frontend/src/services/socket.js`

---

## 🚨 Troubleshooting

### Problema: Socket não conecta

- Verifique se o backend está rodando na porta 3000
- Confirme se o CORS está configurado
- Veja logs no console do navegador

### Problema: Eventos não chegam

- Verifique se está escutando o evento correto
- Confirme se o backend está emitindo o evento
- Use `socket.onAny()` para debug

### Problema: Múltiplas conexões

- Sempre use cleanup no `useEffect`
- Evite conectar em múltiplos componentes
- Centralize a conexão em um serviço

---

## 📚 Recursos Úteis

- [Documentação Socket.IO](https://socket.io/docs/v4/)
- [Exemplos React + Socket.IO](https://socket.io/how-to/use-with-react)
- Arquivos de exemplo: `ExemploSimples.js` e `ExemploSocket.js`
