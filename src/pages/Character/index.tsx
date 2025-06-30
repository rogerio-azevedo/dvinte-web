import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import api from '../../services/api'

import { Container, TableContainer, Portrait } from './styles'

interface Character {
  id: number
  name: string
  level: number
  race: string
  alignment: string
  health: number
  exp: number
  skin: string
  user: string
  portrait?: string
}

export default function CharacterList() {
  // const profile = useSelector(state => state.user.profile)

  const [list, setList] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    try {
      setLoading(true)

      const response = await api.get('/characters')
      const result = response.data || []
      setList(result)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('🚨 Erro ao carregar personagens:', error)
      setList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChar()
  }, []) // eslint-disable-line

  function getPortraitUrl(portrait: string | undefined): string {
    if (!portrait) {
      return '/favicon.ico'
    }

    return portrait
  }

  const columns: ColumnsType<Character> = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Portrait',
      dataIndex: 'portrait',
      key: 'portrait',
      width: 100,
      render: (portrait: string, record: Character) => {
        const portraitUrl = getPortraitUrl(portrait)

        return (
          <Portrait>
            <img
              alt={`Portrait de ${record.name}`}
              src={portraitUrl}
              onError={e => {
                e.currentTarget.src = '/favicon.ico'
              }}
            />
          </Portrait>
        )
      },
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
    },
    {
      title: 'Raça',
      dataIndex: 'race',
      key: 'race',
    },
    {
      title: 'Tendência',
      dataIndex: 'alignment',
      key: 'alignment',
    },
    {
      title: 'Vida',
      dataIndex: 'health',
      key: 'health',
      width: 80,
    },
    {
      title: 'XP',
      dataIndex: 'exp',
      key: 'exp',
      width: 80,
    },
    {
      title: 'Pele',
      dataIndex: 'skin',
      key: 'skin',
    },
    {
      title: 'Jogador',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Ação',
      key: 'action',
      width: 100,
      render: (_: any, item: Character) => (
        <Link to={`/characterview/${item.id}`}>Ver</Link>
      ),
    },
  ]

  return (
    <Container loading={loading ? 0 : 1}>
      <TableContainer>
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          loading={loading}
          size="small"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} personagens`,
          }}
        />
      </TableContainer>
    </Container>
  )
}
