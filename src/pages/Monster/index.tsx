import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FaEye, FaPlus } from 'react-icons/fa'
import api from '../../services/api'

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
      width: 60,
      render: (monster_url: string) => (
        <div className="flex items-center justify-center">
          <img
            alt={monster_url}
            src={monster_url}
            className="w-10 h-10 rounded-full object-cover border-2 border-red-200"
          />
        </div>
      ),
    },
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: number) => (
        <span className="font-semibold text-gray-700">{id}</span>
      ),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string) => (
        <span className="font-semibold text-red-900">{name}</span>
      ),
    },
    {
      title: 'Desafio',
      dataIndex: 'challenge',
      key: 'challenge',
      width: 90,
      render: (challenge: number) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          {challenge}
        </span>
      ),
    },
    {
      title: 'Defesa',
      dataIndex: 'ca',
      key: 'ca',
      width: 80,
      render: (ca: number) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {ca}
        </span>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => (
        <span className="text-sm text-gray-700">{type}</span>
      ),
    },
    {
      title: 'Sub Tipo',
      dataIndex: 'sub_type',
      width: 130,
      render: (_, item: MonsterProps) => (
        <span className="text-sm text-gray-600">
          {item.sub_type || <span className="text-gray-400 italic">Nenhum</span>}
        </span>
      ),
    },
    {
      title: 'Tamanho',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: string) => (
        <span className="text-sm text-gray-700">{size}</span>
      ),
    },
    {
      title: 'Alinhamento',
      dataIndex: 'alignment',
      key: 'alignment',
      width: 130,
      render: (alignment: string) => (
        <span className="text-sm text-gray-700">{alignment}</span>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      width: 80,
      fixed: 'right',
      render: (_, item: MonsterProps) => (
        <Link
          to={`/monsterview/${item.id}`}
          className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-900 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          <FaEye size={12} />
          Ver
        </Link>
      ),
    },
  ]

  return (
    <div className={`p-6 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              Monstros e Criaturas
            </h1>
            <p className="text-gray-600">
              Gerencie o bestiário da campanha
            </p>
          </div>
          <Link
            to="/monstercreate"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow-md"
          >
            <FaPlus />
            Novo Monstro
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table
            rowKey="id"
            dataSource={list}
            columns={columns}
            size="small"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} monstros`,
              className: 'px-4 py-3',
            }}
            loading={loading}
            scroll={{ x: 1200 }}
            className="monster-table"
          />
        </div>
      </div>

      {/* Custom CSS for more compact table */}
      <style>{`
        .monster-table .ant-table {
          font-size: 13px;
        }
        
        .monster-table .ant-table-thead > tr > th {
          background-color: rgb(127 29 29);
          color: white;
          font-weight: 600;
          padding: 8px 12px;
          font-size: 13px;
        }
        
        .monster-table .ant-table-tbody > tr > td {
          padding: 6px 12px;
        }
        
        .monster-table .ant-table-tbody > tr:hover > td {
          background-color: rgb(254 242 242);
        }
        
        .monster-table .ant-pagination {
          margin: 16px 0;
        }
        
        .monster-table .ant-table-cell {
          border-bottom: 1px solid rgb(254 226 226);
        }
      `}</style>
    </div>
  )
}
