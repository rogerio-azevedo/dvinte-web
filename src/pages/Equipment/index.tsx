/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Select, Modal } from 'antd'

import { FaPlusCircle, FaEdit, FaTrash } from 'react-icons/fa'
import ModalEquipmentBind from '../../components/Modals/ModalEquipmentBind'
import { toast } from 'react-toastify'

import api from '../../services/api'

interface FormData {
  name: string
  str_temp: string
  dex_temp: string
  con_temp: string
  int_temp: string
  wis_temp: string
  cha_temp: string
  attack_bonus: string
  damage_bonus: string
  armor_class_bonus: string
  fortitude_bonus: string
  reflex_bonus: string
  will_bonus: string
  price: string
  weight: string
  book: string
  version: string
}

interface Equipment {
  id: number
  name: string
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  attack_bonus: number
  damage_bonus: number
  armor_class_bonus: number
  fortitude_bonus: number
  reflex_bonus: number
  will_bonus: number
  price: number
  weight: number
  book: string
  version: string
}

const { Option } = Select

export default function Equipment() {
  const { handleSubmit, register, reset, control, setValue } =
    useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<Equipment[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const response = await api.get('equipments')
        const equipments = (response.data || []).map((item: any) => ({
          ...item,
          id: String(item.id),
        }))
        setList(equipments)
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error)
        setList([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (editingId) {
        // Edição
        const response = await api.put(`equipments/${editingId}`, data)
        const updatedEquipment = {
          ...response.data,
          id: String(response.data.id),
        }
        const newList = list.map(item =>
          item.id === editingId ? updatedEquipment : item
        )
        setList(newList)
        toast.success('Equipamento atualizado com sucesso!')
      } else {
        // Criação
        const response = await api.post('equipments', data)
        const newEquipment = {
          ...response.data,
          id: String(response.data.id),
        }
        const newList = [newEquipment, ...list]
        setList(newList)
        toast.success('Equipamento criado com sucesso!')
      }

      reset()
      setModalOpen(false)
      setEditingId(null)
    } catch (error) {
      console.error('Erro ao salvar equipamento:', error)
      toast.error('Erro ao salvar equipamento')
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal() {
    reset()
    setEditingId(null)
    setModalOpen(true)
  }

  function handleEdit(item: Equipment) {
    // Preenche o formulário com os dados do equipamento
    setValue('name', item.name)
    setValue('str_temp', String(item.str_temp))
    setValue('dex_temp', String(item.dex_temp))
    setValue('con_temp', String(item.con_temp))
    setValue('int_temp', String(item.int_temp))
    setValue('wis_temp', String(item.wis_temp))
    setValue('cha_temp', String(item.cha_temp))
    setValue('attack_bonus', String(item.attack_bonus))
    setValue('damage_bonus', String(item.damage_bonus))
    setValue('armor_class_bonus', String(item.armor_class_bonus))
    setValue('fortitude_bonus', String(item.fortitude_bonus))
    setValue('reflex_bonus', String(item.reflex_bonus))
    setValue('will_bonus', String(item.will_bonus))
    setValue('price', String(item.price))
    setValue('weight', String(item.weight))
    setValue('book', item.book)
    setValue('version', item.version)

    setEditingId(Number(item.id))
    setModalOpen(true)
  }

  function handleDelete(item: Equipment) {
    Modal.confirm({
      title: 'Confirmar Exclusão',
      content: `Tem certeza que deseja excluir "${item.name}"?`,
      okText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setLoading(true)
          await api.delete(`equipments/${item.id}`)
          const newList = list.filter(i => i.id !== item.id)
          setList(newList)
          toast.success('Equipamento excluído com sucesso!')
        } catch (error) {
          console.error('Erro ao excluir equipamento:', error)
          toast.error('Erro ao excluir equipamento')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  function handleCloseModal() {
    setModalOpen(false)
    setEditingId(null)
    reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          Cadastro de Equipamentos
        </h1>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-2 rounded-lg bg-[#8e0e00] px-6 py-3 text-white shadow-lg transition-all hover:bg-[#6f0000] hover:shadow-xl"
        >
          <FaPlusCircle size={20} />
          <span className="font-semibold">Novo Equipamento</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#8e0e00]"></div>
        </div>
      )}

      {/* Lista vazia */}
      {!loading && list.length === 0 && (
        <div className="rounded-lg bg-white p-12 text-center shadow-md">
          <p className="text-xl text-gray-500">
            Nenhum equipamento cadastrado ainda.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Clique em "Novo Equipamento" para começar.
          </p>
        </div>
      )}

      {/* Tabela Customizada */}
      {!loading && list.length > 0 && (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">Cod</th>
                  <th className="px-3 py-2 text-left">Nome</th>
                  <th className="px-2 py-2 text-center">FOR</th>
                  <th className="px-2 py-2 text-center">DES</th>
                  <th className="px-2 py-2 text-center">CON</th>
                  <th className="px-2 py-2 text-center">INT</th>
                  <th className="px-2 py-2 text-center">SAB</th>
                  <th className="px-2 py-2 text-center">CAR</th>
                  <th className="px-2 py-2 text-center">Acerto</th>
                  <th className="px-2 py-2 text-center">Dano</th>
                  <th className="px-2 py-2 text-center">CA</th>
                  <th className="px-2 py-2 text-center">Fort</th>
                  <th className="px-2 py-2 text-center">Refl</th>
                  <th className="px-2 py-2 text-center">Vont</th>
                  <th className="px-3 py-2 text-right">Preço</th>
                  <th className="px-3 py-2 text-right">Peso</th>
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
                    {/* Atributos */}
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.str_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.str_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.str_temp > 0 ? '+' : ''}
                        {item.str_temp}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.dex_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.dex_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.dex_temp > 0 ? '+' : ''}
                        {item.dex_temp}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.con_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.con_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.con_temp > 0 ? '+' : ''}
                        {item.con_temp}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.int_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.int_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.int_temp > 0 ? '+' : ''}
                        {item.int_temp}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.wis_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.wis_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.wis_temp > 0 ? '+' : ''}
                        {item.wis_temp}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.cha_temp > 0
                            ? 'bg-green-100 text-green-700'
                            : item.cha_temp < 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.cha_temp > 0 ? '+' : ''}
                        {item.cha_temp}
                      </span>
                    </td>
                    {/* Combate */}
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.attack_bonus > 0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.attack_bonus > 0 ? '+' : ''}
                        {item.attack_bonus}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.damage_bonus > 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.damage_bonus > 0 ? '+' : ''}
                        {item.damage_bonus}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.armor_class_bonus > 0
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.armor_class_bonus > 0 ? '+' : ''}
                        {item.armor_class_bonus}
                      </span>
                    </td>
                    {/* Resistências */}
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.fortitude_bonus > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.fortitude_bonus > 0 ? '+' : ''}
                        {item.fortitude_bonus}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.reflex_bonus > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.reflex_bonus > 0 ? '+' : ''}
                        {item.reflex_bonus}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          item.will_bonus > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.will_bonus > 0 ? '+' : ''}
                        {item.will_bonus}
                      </span>
                    </td>
                    {/* Info */}
                    <td className="px-3 py-2 text-right text-xs text-gray-600">
                      {item.price} PO
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-gray-600">
                      {item.weight} kg
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-600">
                      {item.book}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {item.version}
                      </span>
                    </td>
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
                        <ModalEquipmentBind equipment={item} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-[#8e0e00]">
            {editingId ? 'Editar Equipamento' : 'Novo Equipamento'}
          </div>
        }
        open={modalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
        centered
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {/* Nome */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nome do Equipamento *
            </label>
            <input
              {...register('name', { required: true })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-2 focus:ring-[#8e0e00] focus:ring-opacity-50"
              placeholder="Ex: Anel de Proteção +2"
            />
          </div>

          {/* Atributos */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Bônus de Atributos
            </h3>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  FOR
                </label>
                <input
                  type="number"
                  {...register('str_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  DES
                </label>
                <input
                  type="number"
                  {...register('dex_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  CON
                </label>
                <input
                  type="number"
                  {...register('con_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  INT
                </label>
                <input
                  type="number"
                  {...register('int_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  SAB
                </label>
                <input
                  type="number"
                  {...register('wis_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  CAR
                </label>
                <input
                  type="number"
                  {...register('cha_temp')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
            </div>
          </div>

          {/* Bônus de Combate */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Bônus de Combate e Resistências
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Acerto
                </label>
                <input
                  type="number"
                  {...register('attack_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Dano
                </label>
                <input
                  type="number"
                  {...register('damage_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  CA
                </label>
                <input
                  type="number"
                  {...register('armor_class_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Fortitude
                </label>
                <input
                  type="number"
                  {...register('fortitude_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Reflexos
                </label>
                <input
                  type="number"
                  {...register('reflex_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Vontade
                </label>
                <input
                  type="number"
                  {...register('will_bonus')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
            </div>
          </div>

          {/* Informações Gerais */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Informações Gerais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Preço (PO)
                </label>
                <input
                  type="number"
                  {...register('price')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('weight')}
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Livro *
                </label>
                <input
                  {...register('book', { required: true })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#8e0e00] focus:outline-none focus:ring-1 focus:ring-[#8e0e00]"
                  placeholder="Ex: Livro do Jogador"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Versão *
                </label>
                <Controller
                  control={control}
                  name="version"
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      className="w-full"
                      placeholder="Escolha a Versão"
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
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#8e0e00] px-6 py-2 font-semibold text-white shadow-md transition-all hover:bg-[#6f0000] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading
                ? 'Salvando...'
                : editingId
                ? 'Atualizar Equipamento'
                : 'Salvar Equipamento'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
