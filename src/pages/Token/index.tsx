/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Table } from 'antd'
import { toast } from 'react-toastify'

import api from '../../services/api'

import TokenInput from '../../components/TokenInput'
import * as Styles from './styles'

interface TokenProps {
  id: number
  url: string
  name: string
}

interface EnabledTokens {
  [key: number]: boolean
}

interface Combat {
  Cod: number
}

interface CharacterToken {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  character_id: number
  token_id: number
  enabled: boolean
}

const Token: React.FC = () => {
  const { user } = useAuth()
  const id = user?.id

  const [tokens, setTokens] = useState<TokenProps[]>([])
  const [loading, setLoading] = useState(false)
  const [enabledTokens, setEnabledTokens] = useState<EnabledTokens>({})

  useEffect(() => {
    async function loadTokens() {
      try {
        setLoading(true)
        console.log('Fazendo requisição para tokens...')
        const response = await api.get<TokenProps[]>('/tokens')
        console.log('Resposta recebida:', response.data)

        setTokens(response.data)
      } catch (error) {
        console.error('Erro ao carregar tokens:', error)
        toast.error('Erro ao carregar tokens!')
      } finally {
        setLoading(false)
      }
    }

    loadTokens()
  }, [])

  const handleCreateToken = async (tokenId: number) => {
    try {
      console.log('Criando token com ID:', tokenId)
      console.log('User ID:', id)

      const response = await api.get<Combat>(`combats/${id}`)
      const { data } = response

      const newToken: CharacterToken = {
        x: 250,
        y: 250,
        width: 90,
        height: 90,
        rotation: 90,
        character_id: data.Cod,
        token_id: tokenId,
        enabled: enabledTokens[tokenId] || false,
      }

      console.log('Criando character token:', newToken)
      await api.post('chartokens', newToken)
      toast.success('Token adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar token:', error)
      toast.error('Erro ao adicionar token!')
    }
  }

  return (
    <Styles.Container>
      <TokenInput />

      <Styles.TableContainer $loading={loading}>
        <Table<TokenProps>
          rowKey="id"
          dataSource={tokens}
          columns={[
            {
              title: 'Token',
              dataIndex: 'url',
              key: 'url',
              render: (url: string) => (
                <Styles.Portrait>
                  <img alt="Token" src={url} />
                </Styles.Portrait>
              ),
            },
            {
              title: 'Cod',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: 'Nome',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Habilitado',
              dataIndex: 'enabled',
              key: 'enabled',
              render: (_: any, record: TokenProps) => (
                <input
                  type="checkbox"
                  checked={enabledTokens[record.id] || false}
                  onChange={e =>
                    setEnabledTokens(prev => ({
                      ...prev,
                      [record.id]: e.target.checked,
                    }))
                  }
                />
              ),
            },
            {
              title: 'Adicionar',
              key: 'action',
              render: (_: any, record: TokenProps) => (
                <button
                  type="button"
                  onClick={() => handleCreateToken(record.id)}
                >
                  Adicionar
                </button>
              ),
            },
          ]}
          pagination={{ pageSize: 50 }}
          loading={loading}
        />
      </Styles.TableContainer>
    </Styles.Container>
  )
}

export default Token
