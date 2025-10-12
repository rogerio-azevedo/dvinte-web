import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal, Select } from 'antd'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '../../services/api'
import ModalWeaponBind from '../../components/Modals/ModalWeaponBind'

const { Option } = Select

interface FormData {
  name: string
  dice_s: number
  dice_m: number
  multiplier_s: number
  multiplier_m: number
  critical: number
  crit_from: number
  range: number
  price: number
  weight: number
  type: string
  material: string
  book: string
  version: string
  str_bonus: number
}

interface Weapon {
  id: number
  name: string
  dice_s: number
  dice_m: number
  multiplier_s: number
  multiplier_m: number
  critical: number
  crit_from: number
  range: number
  price: number
  weight: number
  type: string
  material: string
  book: string
  version: string
  str_bonus: number
}

const defaultValues: Partial<FormData> = {
  name: '',
  dice_s: undefined,
  dice_m: undefined,
  multiplier_s: undefined,
  multiplier_m: undefined,
  critical: undefined,
  crit_from: undefined,
  range: undefined,
  price: undefined,
  weight: undefined,
  type: '',
  material: '',
  book: '',
  version: '',
  str_bonus: undefined,
}

export default function Weapon() {
  const { handleSubmit, register, reset, control, setValue } =
    useForm<FormData>({
      defaultValues,
    })
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Weapon[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const response = await api.get('/weapons')
      setList(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar armas:', error)
      toast.error('Erro ao carregar armas')
      setList([])
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (editingId) {
        // Atualizar arma existente
        const response = await api.put(`/weapons/${editingId}`, data)
        setList(prevList =>
          prevList.map(item =>
            Number(item.id) === editingId ? response.data : item
          )
        )
        toast.success('Arma atualizada com sucesso!')
      } else {
        // Criar nova arma
        const response = await api.post('/weapons', data)
        setList(prevList => [response.data, ...prevList])
        toast.success('Arma criada com sucesso!')
      }

      handleCloseModal()
    } catch (error) {
      console.error('Erro ao salvar arma:', error)
      toast.error(editingId ? 'Erro ao atualizar arma' : 'Erro ao criar arma')
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

  function handleEdit(weapon: Weapon) {
    setEditingId(weapon.id)
    setValue('name', weapon.name)
    setValue('dice_s', weapon.dice_s)
    setValue('dice_m', weapon.dice_m)
    setValue('multiplier_s', weapon.multiplier_s)
    setValue('multiplier_m', weapon.multiplier_m)
    setValue('critical', weapon.critical)
    setValue('crit_from', weapon.crit_from)
    setValue('range', weapon.range)
    setValue('price', weapon.price)
    setValue('weight', weapon.weight)
    setValue('type', weapon.type)
    setValue('material', weapon.material)
    setValue('book', weapon.book)
    setValue('version', weapon.version)
    setValue('str_bonus', weapon.str_bonus)
    setIsModalOpen(true)
  }

  async function handleDelete(weapon: Weapon) {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: `Tem certeza que deseja excluir a arma "${weapon.name}"?`,
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          setLoading(true)
          await api.delete(`/weapons/${weapon.id}`)
          setList(prevList => prevList.filter(item => item.id !== weapon.id))
          toast.success('Arma excluída com sucesso!')
        } catch (error) {
          console.error('Erro ao excluir arma:', error)
          toast.error('Erro ao excluir arma')
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
            Cadastro de Armas
          </h1>
          <button
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-900"
          >
            <FaPlus size={16} />
            Nova Arma
          </button>
        </div>

        {/* Modal de Criação/Edição */}
        <Modal
          title={editingId ? 'Editar Arma' : 'Nova Arma'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={900}
          destroyOnClose
        >
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* Nome */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome da Arma
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                placeholder="Digite o nome da arma"
              />
            </div>

            {/* Dano - Grid para P e M */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 font-semibold text-gray-700">
                  Dano (Pequeno)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Tipo de Dado
                    </label>
                    <input
                      type="number"
                      {...register('dice_s', { required: true })}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                      placeholder="Ex: 4, 6, 8..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      {...register('multiplier_s', { required: true })}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                      placeholder="Ex: 1, 2, 3..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-gray-700">
                  Dano (Médio)
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Tipo de Dado
                    </label>
                    <input
                      type="number"
                      {...register('dice_m', { required: true })}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                      placeholder="Ex: 6, 8, 10..."
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      {...register('multiplier_m', { required: true })}
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                      placeholder="Ex: 1, 2, 3..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Crítico e Combate */}
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Crítico Mínimo
                </label>
                <input
                  type="number"
                  {...register('crit_from', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="18, 19, 20..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Multiplicador
                </label>
                <input
                  type="number"
                  {...register('critical', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="2, 3, 4..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Alcance (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('range', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="1.5, 3, 9..."
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
                  placeholder="0.5, 1, 2..."
                />
              </div>
            </div>

            {/* Tipo, Material, Preço */}
            <div className="mb-4 grid grid-cols-3 gap-4">
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
                      <Option value="CONCUSSÃO">CONCUSSÃO</Option>
                      <Option value="CORTANTE">CORTANTE</Option>
                      <Option value="PERFURANTE">PERFURANTE</Option>
                    </Select>
                  )}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Material
                </label>
                <input
                  type="text"
                  {...register('material', { required: true })}
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="Aço, Ferro, Prata..."
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
                  placeholder="10, 50, 100..."
                />
              </div>
            </div>

            {/* Livro, Versão, Bônus de Força */}
            <div className="mb-4 grid grid-cols-3 gap-4">
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
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bônus de Força
                </label>
                <Controller
                  name="str_bonus"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha o Bônus"
                      optionFilterProp="children"
                    >
                      <Option value={0}>Sem bônus de Força</Option>
                      <Option value={0.5}>Bônus de 0.5x a Força</Option>
                      <Option value={1}>Bônus de 1x a Força</Option>
                      <Option value={1.5}>Bônus de 1.5x a Força</Option>
                      <Option value={2}>Bônus de 2x a Força</Option>
                      <Option value={2.5}>Bônus de 2.5x a Força</Option>
                      <Option value={3}>Bônus de 3x a Força</Option>
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
                  ? 'Atualizar Arma'
                  : 'Salvar Arma'}
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
                Nenhuma arma cadastrada
              </h3>
              <p className="text-gray-500">
                Clique em "Nova Arma" para começar
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
                    <th className="px-2 py-2 text-center">Dano (P)</th>
                    <th className="px-2 py-2 text-center">Dano (M)</th>
                    <th className="px-2 py-2 text-center">Crítico</th>
                    <th className="px-2 py-2 text-center">Tipo</th>
                    <th className="px-2 py-2 text-center">Alcance</th>
                    <th className="px-2 py-2 text-center">Peso</th>
                    <th className="px-2 py-2 text-center">For. Bon</th>
                    <th className="px-3 py-2 text-right">Preço</th>
                    <th className="px-3 py-2 text-left">Material</th>
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
                      {/* Danos */}
                      <td className="px-2 py-2 text-center">
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                          {item.multiplier_s}d{item.dice_s}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-700">
                          {item.multiplier_m}d{item.dice_m}
                        </span>
                      </td>
                      {/* Crítico */}
                      <td className="px-2 py-2 text-center">
                        <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs font-semibold text-purple-700">
                          {item.crit_from}-20/x{item.critical}
                        </span>
                      </td>
                      {/* Tipo */}
                      <td className="px-2 py-2 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                            item.type === 'CORTANTE'
                              ? 'bg-blue-100 text-blue-700'
                              : item.type === 'PERFURANTE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      {/* Alcance */}
                      <td className="px-2 py-2 text-center text-xs text-gray-600">
                        {item.range}m
                      </td>
                      {/* Peso */}
                      <td className="px-2 py-2 text-center text-xs text-gray-600">
                        {item.weight}kg
                      </td>
                      {/* Bônus Força */}
                      <td className="px-2 py-2 text-center">
                        <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-semibold text-orange-700">
                          {item.str_bonus}x
                        </span>
                      </td>
                      {/* Preço */}
                      <td className="px-3 py-2 text-right text-xs text-gray-600">
                        {item.price} PO
                      </td>
                      {/* Material */}
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {item.material}
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
                          <ModalWeaponBind
                            weapon={{ ...item, id: String(item.id) }}
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
