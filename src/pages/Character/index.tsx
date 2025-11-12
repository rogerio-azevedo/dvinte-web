import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FaEye, FaPlus, FaUserShield } from 'react-icons/fa'
import api from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

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
  user_is_gm: boolean
  portrait?: string
}

export default function CharacterList() {
  const { user } = useAuth()

  const [list, setList] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    try {
      setLoading(true)
      const response = await api.get('/characters')
      const result = response.data || []
      setList(result)
    } catch (error) {
      console.error('🚨 Erro ao carregar personagens:', error)
      setList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChar()
  }, [])

  // Filtrar personagens do mestre: jogadores NÃO veem personagens de GMs
  const filteredList = useMemo(() => {
    // Se é GM, vê todos
    if (user?.is_gm) {
      return list
    }

    // Se não é GM, filtra e NÃO mostra personagens criados por GMs
    return list.filter(char => !char.user_is_gm)
  }, [list, user?.is_gm])

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
      width: 60,
      render: (id: number) => (
        <span className="font-semibold text-gray-700">{id}</span>
      ),
    },
    {
      title: 'Portrait',
      dataIndex: 'portrait',
      key: 'portrait',
      width: 60,
      render: (portrait: string, record: Character) => {
        const portraitUrl = getPortraitUrl(portrait)

        return (
          <div className="flex items-center justify-center">
            <img
              alt={`Portrait de ${record.name}`}
              src={portraitUrl}
              onError={e => {
                e.currentTarget.src = '/favicon.ico'
              }}
              className="w-10 h-10 rounded-full object-cover border-2 border-red-200"
            />
          </div>
        )
      },
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: Character) => {
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-red-900">{name}</span>
            {record.user_is_gm && (
              <FaUserShield
                className="text-purple-600"
                size={14}
                title="Personagem do Mestre"
              />
            )}
          </div>
        )
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: number) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Nv {level}
        </span>
      ),
    },
    {
      title: 'Raça',
      dataIndex: 'race',
      key: 'race',
      width: 120,
      render: (race: string) => (
        <span className="text-sm text-gray-700">{race}</span>
      ),
    },
    {
      title: 'Tendência',
      dataIndex: 'alignment',
      key: 'alignment',
      width: 130,
      render: (alignment: string) => (
        <span className="text-sm text-gray-700">{alignment}</span>
      ),
    },
    {
      title: 'Vida',
      dataIndex: 'health',
      key: 'health',
      width: 70,
      render: (health: number) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {health}
        </span>
      ),
    },
    {
      title: 'XP',
      dataIndex: 'exp',
      key: 'exp',
      width: 90,
      render: (exp: number) => (
        <span className="text-sm font-semibold text-gray-700">
          {exp.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Pele',
      dataIndex: 'skin',
      key: 'skin',
      width: 120,
      render: (skin: string) => (
        <span className="text-sm text-gray-700">{skin}</span>
      ),
    },
    {
      title: 'Jogador',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (userName: string, record: Character) => (
        <span
          className={`text-sm font-medium ${
            record.user_is_gm ? 'text-purple-700' : 'text-gray-700'
          }`}
        >
          {userName}
        </span>
      ),
    },
    {
      title: 'Ação',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, item: Character) => (
        <Link
          to={`/characterview/${item.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-900 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          <FaEye size={12} />
          Ver
        </Link>
      ),
    },
  ]

  return (
    <div
      className={`p-6 transition-opacity duration-200 ${
        loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">Personagens</h1>
            <p className="text-gray-600">Gerencie os personagens da campanha</p>
          </div>
          <Link
            to="/charactercreate"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow-md"
          >
            <FaPlus />
            Novo Personagem
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table
            rowKey="id"
            dataSource={filteredList}
            columns={columns}
            size="small"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} personagens`,
              className: 'px-4 py-3',
            }}
            loading={loading}
            scroll={{ x: 1200 }}
            className="character-table"
          />
        </div>
      </div>

      {/* Custom CSS for more compact table */}
      <style>{`
        .character-table .ant-table {
          font-size: 13px;
        }
        
        .character-table .ant-table-thead > tr > th {
          background-color: rgb(127 29 29); /* red-900 */
          color: white;
          font-weight: 600;
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .character-table .ant-table-tbody > tr > td {
          padding: 6px 12px;
        }
        
        .character-table .ant-table-tbody > tr:hover > td {
          background-color: rgb(254 242 242); /* red-50 */
        }
        
        .character-table .ant-pagination {
          margin: 16px 0;
        }
        
        .character-table .ant-table-cell {
          border-bottom: 1px solid rgb(254 226 226); /* red-100 */
        }
      `}</style>
    </div>
  )
}
