/* eslint-disable no-console */

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import api from '../../services/api'

import TokenInput from '../../components/TokenInput'
import { toast } from 'react-toastify'

import { Container, TableContainer, Portrait, MyTable } from './styles'

export default function Token() {
  const { id } = useSelector(state => state.user.profile)

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    async function loadList() {
      try {
        console.log('Fazendo requisição para tokens...')
        const response = await api.get('/tokens')
        console.log('Resposta recebida:', response.data)

        setList(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar tokens:', error)
        setLoading(false)
      }
    }

    loadList()
  }, [])

  async function handleCreateToken(tokenId) {
    try {
      console.log('Criando token com ID:', tokenId)
      console.log('User ID:', id)

      const response = await api.get(`combats/${id}`)
      const { data } = response

      const newToken = {
        x: 250,
        y: 250,
        width: 90,
        height: 90,
        rotation: 90,
        character_id: data.Cod,
        token_id: tokenId,
        enabled: enabled,
      }

      console.log('Criando character token:', newToken)
      await api.post(`chartokens`, newToken)
      toast.success('Token adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar token:', error)
      toast.error('Erro ao adicionar token!')
    }
  }

  const columns = [
    {
      title: 'Token',
      dataIndex: 'url',
      render: url => (
        <Portrait>
          <img alt={url} src={url} />
        </Portrait>
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
      render: () => (
        <input
          type="checkbox"
          value={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />
      ),
    },
    {
      title: 'Adicionar',
      dataIndex: 'Adicionar',
      render: (text, record) => (
        <button type="button" onClick={() => handleCreateToken(record.id)}>
          Adicionar
        </button>
      ),
    },
  ]

  return (
    <Container loading={loading ? 1 : 0}>
      <TokenInput style={{ marginTop: '15px' }} />

      <TableContainer>
        <MyTable
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={{ pageSize: 50 }}
        />
      </TableContainer>
    </Container>
  )
}
