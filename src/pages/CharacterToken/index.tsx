import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaTimesCircle, FaTrashAlt } from 'react-icons/fa'
import { ColumnsType } from 'antd/es/table'
import api from '../../services/api'
import * as Styles from './styles'

interface CharacterToken {
  id: number
  image: string
  enabled: boolean
}

export default function CharacterToken() {
  const [list, setList] = useState<CharacterToken[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      try {
        const response = await api.get<CharacterToken[]>('chartokens')
        setList(response.data)
      } catch (error) {
        toast.error('Erro ao carregar tokens!')
      } finally {
        setLoading(false)
      }
    }

    loadList()
  }, [])

  async function handleHabilitaToken(token: CharacterToken) {
    try {
      await api.put('chartokens', {
        id: token.id,
        enabled: !token.enabled,
      })

      if (token.enabled) {
        toast.error('Token desabilitado com sucesso!')
      } else {
        toast.success('Token habilitado com sucesso!')
      }

      const response = await api.get<CharacterToken[]>('chartokens')
      setList(response.data)
    } catch (error) {
      toast.error('Erro ao atualizar token!')
    }
  }

  async function handleRemoveToken(id: number) {
    try {
      await api.delete(`chartokens/${id}`)
      toast.error('Token removido com sucesso!')

      const response = await api.get<CharacterToken[]>('chartokens')
      setList(response.data)
    } catch (error) {
      toast.error('Erro ao remover token!')
    }
  }

  const columns: ColumnsType<CharacterToken> = [
    {
      title: 'Token',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Styles.Portrait>
          <img alt={image} src={image} />
        </Styles.Portrait>
      ),
    },
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ativo',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (_: unknown, item: CharacterToken) =>
        item.enabled ? (
          <FaCheckCircle size={30} color="#006400" />
        ) : (
          <FaTimesCircle size={30} color="#8e0e00" />
        ),
    },
    {
      title: 'Habilitar',
      key: 'habilitar',
      render: (_: unknown, item: CharacterToken) =>
        item.enabled ? (
          <Styles.ButtonRemove
            $loading={loading}
            onClick={() => handleHabilitaToken(item)}
          >
            Desabilitar
          </Styles.ButtonRemove>
        ) : (
          <Styles.ButtonAdd
            $loading={loading}
            onClick={() => handleHabilitaToken(item)}
          >
            Habilitar
          </Styles.ButtonAdd>
        ),
    },
    {
      title: 'Remover',
      key: 'remover',
      render: (_: unknown, item: CharacterToken) => (
        <FaTrashAlt
          size={30}
          color="#8e0e00"
          cursor="pointer"
          onClick={() => handleRemoveToken(item.id)}
        />
      ),
    },
  ]

  return (
    <Styles.Container $loading={loading}>
      <Styles.TableContainer>
        <Styles.MyTable rowKey="id" dataSource={list} columns={columns} />
      </Styles.TableContainer>
    </Styles.Container>
  )
}
