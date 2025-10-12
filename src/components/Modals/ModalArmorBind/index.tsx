import { useState, useEffect } from 'react'
import { Modal, Select } from 'antd'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import api from '../../../services/api'

const { Option } = Select

interface Character {
  id: number
  name: string
}

interface ModalArmorBindProps {
  armor: {
    id: string
    name: string
  }
}

interface FormData {
  character_id: number
  price: number
  defense: number
  description: string
}

const ModalArmorBind: React.FC<ModalArmorBindProps> = ({ armor }) => {
  const { handleSubmit, register, setValue, watch, reset } = useForm<FormData>()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  const selectedCharacter = watch('character_id')

  useEffect(() => {
    if (modalIsOpen) {
      loadCharacters()
    }
  }, [modalIsOpen])

  async function loadCharacters() {
    try {
      const response = await api.get('/characters')
      setCharacters(response.data || [])
    } catch {
      toast.error('Erro ao carregar personagens')
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const armorData = {
        character_id: data.character_id,
        armor_id: Number(armor.id),
        defense: Number(data.defense || 0),
        price: Number(data.price || 0),
        description: data.description || '',
      }

      await api.post(`/characters/${data.character_id}/armors`, armorData)

      toast.success('Armadura vinculada com sucesso!')
      handleCloseModal()
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Erro ao vincular armadura ao personagem'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal() {
    setModalIsOpen(true)
  }

  function handleCloseModal() {
    setModalIsOpen(false)
    reset()
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="rounded p-2 text-green-700 transition-colors hover:bg-green-50"
        title="Comprar/Vincular"
      >
        <FaRegMoneyBillAlt size={20} />
      </button>

      <Modal
        title="Compra / Vinculação de Armadura"
        open={modalIsOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Info da Armadura */}
          <div className="mb-4 grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Código
              </label>
              <input
                type="text"
                value={armor.id}
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600"
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome da Armadura
              </label>
              <input
                type="text"
                value={armor.name.toUpperCase()}
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Preço e Defesa Extra */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preço (PO)
              </label>
              <input
                type="number"
                {...register('price')}
                defaultValue={0}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Defesa Extra
              </label>
              <input
                type="number"
                {...register('defense')}
                defaultValue={0}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                placeholder="0"
              />
            </div>
          </div>

          {/* Selecionar Personagem */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Personagem <span className="text-red-500">*</span>
            </label>
            <Select
              size="large"
              showSearch
              style={{ width: '100%' }}
              placeholder="Escolha o personagem"
              optionFilterProp="children"
              onChange={value => setValue('character_id', value)}
              filterOption={(input, option) =>
                String(option?.children)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) ?? false
              }
            >
              {characters.map(char => (
                <Option key={char.id} value={char.id}>
                  {char.name}
                </Option>
              ))}
            </Select>
          </div>

          {/* Observação */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Observação
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              placeholder="Adicione observações sobre esta armadura..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCharacter}
              className="rounded-lg bg-red-800 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Vinculando...' : 'Vincular'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default ModalArmorBind
