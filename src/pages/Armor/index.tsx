import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Select } from 'antd'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '../../services/api'
import ModalArmorBind from '../../components/Modals/ModalArmorBind'

const { Option } = Select

interface FormData {
  name: string
  type: number
  bonus: number
  dexterity: number
  penalty: number
  magic: number
  displacement_s: number
  displacement_m: number
  weight: number
  price: number
  book: string
  version: string
}

interface Armor {
  id: number
  name: string
  type: number
  bonus: number
  dexterity: number
  penalty: number
  magic: number
  displacement_s: number
  displacement_m: number
  weight: number
  price: number
  book: string
  version: string
}

const defaultValues: Partial<FormData> = {
  name: '',
  type: undefined,
  bonus: undefined,
  dexterity: undefined,
  penalty: undefined,
  magic: undefined,
  displacement_s: undefined,
  displacement_m: undefined,
  weight: undefined,
  price: undefined,
  book: '',
  version: '',
}

const getArmorTypeName = (type: number): string => {
  switch (type) {
    case 1:
      return 'Armadura'
    case 2:
      return 'Escudo'
    case 3:
      return 'Natural'
    case 5:
      return 'Outros'
    default:
      return 'Desconhecido'
  }
}

export default function Armor() {
  const { handleSubmit, register, reset, control, setValue } =
    useForm<FormData>({
      defaultValues,
    })
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Armor[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const response = await api.get('/armors')
      setList(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar armaduras:', error)
      toast.error('Erro ao carregar armaduras')
      setList([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (editingId) {
        // Atualizar armadura existente
        const response = await api.put(`/armors/${editingId}`, data)
        setList(prevList =>
          prevList.map(item => (item.id === editingId ? response.data : item))
        )
        toast.success('Armadura atualizada com sucesso!')
      } else {
        // Criar nova armadura
        const response = await api.post('/armors', data)
        setList(prevList => [response.data, ...prevList])
        toast.success('Armadura criada com sucesso!')
      }

      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar armadura:', error)
      toast.error(
        editingId ? 'Erro ao atualizar armadura' : 'Erro ao criar armadura'
      )
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal() {
    setEditingId(null)
    reset(defaultValues)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setEditingId(null)
    reset(defaultValues)
  }

  function handleEdit(armor: Armor) {
    setEditingId(armor.id)
    setValue('name', armor.name)
    setValue('type', armor.type)
    setValue('bonus', armor.bonus)
    setValue('dexterity', armor.dexterity)
    setValue('penalty', armor.penalty)
    setValue('magic', armor.magic)
    setValue('displacement_s', armor.displacement_s)
    setValue('displacement_m', armor.displacement_m)
    setValue('weight', armor.weight)
    setValue('price', armor.price)
    setValue('book', armor.book)
    setValue('version', armor.version)
    setIsModalOpen(true)
  }

  async function handleDelete(armor: Armor) {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja excluir a armadura "${armor.name}"?`,
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          setLoading(true)
          await api.delete(`/armors/${armor.id}`)
          setList(prevList => prevList.filter(item => item.id !== armor.id))
          toast.success('Armadura excluída com sucesso!')
        } catch (error) {
          console.error('Erro ao excluir armadura:', error)
          toast.error('Erro ao excluir armadura')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Cadastro de Armaduras
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-900"
          >
            <FaPlus size={16} />
            Nova Armadura
          </button>
        </div>

        {/* Modal de Criação/Edição */}
        <Modal
          title={editingId ? 'Editar Armadura' : 'Nova Armadura'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          destroyOnClose
        >
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* Nome e Tipo */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nome da Armadura
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="Digite o nome da armadura"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha o Tipo"
                      optionFilterProp="children"
                    >
                      <Option value={1}>Armadura</Option>
                      <Option value={2}>Escudo</Option>
                      <Option value={3}>Natural</Option>
                      <Option value={5}>Outros</Option>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Bônus e Atributos */}
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bônus CA
                </label>
                <input
                  type="number"
                  {...register('bonus', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Destreza Máx
                </label>
                <input
                  type="number"
                  {...register('dexterity', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Penalidade
                </label>
                <input
                  type="number"
                  {...register('penalty', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Falha Mágica %
                </label>
                <input
                  type="number"
                  {...register('magic', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Deslocamento, Peso e Preço */}
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Desloc (P) m
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('displacement_s', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="6, 9..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Desloc (M) m
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('displacement_m', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="6, 9..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="5, 10, 20..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Preço (PO)
                </label>
                <input
                  type="number"
                  {...register('price', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="50, 100, 500..."
                />
              </div>
            </div>

            {/* Livro e Versão */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Livro
                </label>
                <input
                  type="text"
                  {...register('book', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="Livro do Jogador..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Versão
                </label>
                <Controller
                  name="version"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha a Versão"
                      optionFilterProp="children"
                    >
                      <Option value="V 1.0e">Versão 1.0e</Option>
                      <Option value="V 2.0e">Versão 2.0e</Option>
                      <Option value="V 3.0e">Versão 3.0e</Option>
                      <Option value="V 3.5e">Versão 3.5e</Option>
                      <Option value="V 4.0e">Versão 4.0e</Option>
                      <Option value="V 5.0e">Versão 5.0e</Option>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-red-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-900 disabled:opacity-50"
              >
                {loading
                  ? 'Salvando...'
                  : editingId
                  ? 'Atualizar Armadura'
                  : 'Salvar Armadura'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Loading State */}
        {loading && list.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-2 text-lg text-gray-600">Carregando...</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && list.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold text-gray-700">
                Nenhuma armadura cadastrada
              </h3>
              <p className="text-gray-500">
                Clique em "Nova Armadura" para começar
              </p>
            </div>
          </div>
        )}

        {/* Tabela Customizada */}
        {!loading && list.length > 0 && (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px]">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Cod</th>
                    <th className="px-3 py-2 text-left">Nome</th>
                    <th className="px-2 py-2 text-center">Tipo</th>
                    <th className="px-2 py-2 text-center">Bônus CA</th>
                    <th className="px-2 py-2 text-center">Dest Máx</th>
                    <th className="px-2 py-2 text-center">Penalidade</th>
                    <th className="px-2 py-2 text-center">Mágica %</th>
                    <th className="px-2 py-2 text-center">Desloc (P)</th>
                    <th className="px-2 py-2 text-center">Desloc (M)</th>
                    <th className="px-2 py-2 text-center">Peso</th>
                    <th className="px-3 py-2 text-right">Preço</th>
                    <th className="px-3 py-2 text-left">Livro</th>
                    <th className="px-3 py-2 text-center">Versão</th>
                    <th className="px-3 py-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map(item => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 text-sm text-gray-600">
                        {item.id}
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </td>
                      {/* Tipo */}
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                            item.type === 1
                              ? 'bg-blue-100 text-blue-700'
                              : item.type === 2
                              ? 'bg-green-100 text-green-700'
                              : item.type === 3
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {getArmorTypeName(item.type)}
                        </span>
                      </td>
                      {/* Bônus CA */}
                      <td className="px-2 py-2 text-center">
                        <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-700">
                          +{item.bonus}
                        </span>
                      </td>
                      {/* Destreza */}
                      <td className="px-2 py-2 text-center">
                        <span className="text-xs text-gray-600">
                          {item.dexterity > 0 ? `+${item.dexterity}` : '—'}
                        </span>
                      </td>
                      {/* Penalidade */}
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                            item.penalty < 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.penalty}
                        </span>
                      </td>
                      {/* Mágica */}
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                            item.magic > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {item.magic}%
                        </span>
                      </td>
                      {/* Deslocamento P */}
                      <td className="px-2 py-2 text-center text-xs text-gray-600">
                        {item.displacement_s}m
                      </td>
                      {/* Deslocamento M */}
                      <td className="px-2 py-2 text-center text-xs text-gray-600">
                        {item.displacement_m}m
                      </td>
                      {/* Peso */}
                      <td className="px-2 py-2 text-center text-xs text-gray-600">
                        {item.weight}kg
                      </td>
                      {/* Preço */}
                      <td className="px-3 py-2 text-right text-xs text-gray-600">
                        {item.price} PO
                      </td>
                      {/* Livro */}
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {item.book}
                      </td>
                      {/* Versão */}
                      <td className="px-3 py-2 text-center">
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                          {item.version}
                        </span>
                      </td>
                      {/* Ações */}
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded p-2 text-blue-600 transition-colors hover:bg-blue-50"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded p-2 text-[#8e0e00] transition-colors hover:bg-red-50"
                            title="Excluir"
                          >
                            <FaTrash size={16} />
                          </button>
                          <ModalArmorBind
                            armor={{ id: String(item.id), name: item.name }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
