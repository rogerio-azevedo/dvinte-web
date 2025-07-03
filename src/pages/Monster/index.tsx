import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import api from '../../services/api'

import { Container, TableContainer, Portrait } from './styles'

interface MonsterProps {
  id: number
  name: string
  challenge: number
  ca: number
  type: string
  sub_type: string | null
  size: string
  alignment: string
  monster_url: string
}

export default function Monster() {
  const [list, setList] = useState<MonsterProps[]>([])
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    setLoading(true)
    const response = await api.get('monsters')
    const result = response.data
    setList(result)
    setLoading(false)
  }

  useEffect(() => {
    loadChar()
  }, []) // eslint-disable-line

  const columns: ColumnsType<MonsterProps> = [
    {
      title: 'Portrait',
      dataIndex: 'monster_url',
      render: (monster_url: string) => (
        <Portrait>
          <img alt={monster_url} src={monster_url} />
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
      title: 'Desafio',
      dataIndex: 'challenge',
      key: 'challenge',
    },
    {
      title: 'Defesa',
      dataIndex: 'ca',
      key: 'ca',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Sub Tipo',
      dataIndex: 'sub_type',
      render: (_, item: MonsterProps) => item.sub_type || 'NENHUM',
    },
    {
      title: 'Tamanho',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Alinhamento',
      dataIndex: 'alignment',
      key: 'alignment',
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      render: (_, item: MonsterProps) => (
        <Link to={`/monsterview/${item.id}`}>Ver</Link>
      ),
    },
  ]

  return (
    <Container $loading={loading}>
      <TableContainer>
        <Table rowKey="id" dataSource={list} columns={columns} />
      </TableContainer>
    </Container>
  )
}
