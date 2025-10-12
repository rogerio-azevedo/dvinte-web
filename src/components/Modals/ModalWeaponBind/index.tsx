import { useState, useEffect } from 'react'
import { Modal, Select, Switch } from 'antd'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import api from '../../../services/api'

const { Option } = Select

interface Character {
  id: number
  name: string
}

interface ModalWeaponBindProps {
  weapon: {
    id: string
    name: string
  }
}

interface FormData {
  character_id: number
  dex_damage: boolean
  price: number
  nickname: string
  hit: number
  damage: number
  element: number
  crit_from_mod: number
  crit_mod: number
  description: string
}

const ModalWeaponBind: React.FC<ModalWeaponBindProps> = ({ weapon }) => {
  const { handleSubmit, register, setValue, watch, reset } = useForm<FormData>()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [dexDamage, setDexDamage] = useState(false)

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

      const weaponData = {
        weapon: weapon.id,
        hit: Number(data.hit || 0),
        damage: Number(data.damage || 0),
        element: Number(data.element || 0),
        crit_mod: Number(data.crit_mod || 0),
        crit_from_mod: Number(data.crit_from_mod || 0),
        dex_damage: dexDamage,
        price: Number(data.price || 0),
        nickname: data.nickname || '',
        description: data.description || '',
      }

      await api.post(`/characters/${data.character_id}/weapons`, weaponData)

      toast.success('Arma vinculada com sucesso!')
      handleCloseModal()
    } catch {
      toast.error('Erro ao vincular arma ao personagem')
    } finally {
      setLoading(false)
    }
  }

  function handleOpenModal() {
    setModalIsOpen(true)
  }

  function handleCloseModal() {
    setModalIsOpen(false)
    setDexDamage(false)
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
        title="Compra / Vinculação de Arma"
        open={modalIsOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Info da Arma */}
          <div className="mb-4 grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Código
              </label>
              <input
                type="text"
                value={weapon.id}
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600"
              />
            </div>
            <div className="col-span-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nome da Arma
              </label>
              <input
                type="text"
                value={weapon.name.toUpperCase()}
                readOnly
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 font-medium text-gray-900"
              />
            </div>
          </div>

          {/* Preço e Apelido */}
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
                Apelido
              </label>
              <input
                type="text"
                {...register('nickname')}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                placeholder="Ex: Espada Flamejante"
              />
            </div>
          </div>

          {/* Modificadores de Combate */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Modificadores de Combate
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Acerto Extra
                </label>
                <input
                  type="number"
                  {...register('hit')}
                  defaultValue={0}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Dano Extra
                </label>
                <input
                  type="number"
                  {...register('damage')}
                  defaultValue={0}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Elemento (dado)
                </label>
                <input
                  type="number"
                  {...register('element')}
                  defaultValue={0}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Dex no Dano
                </label>
                <div className="flex h-10 items-center">
                  <Switch
                    checked={dexDamage}
                    onChange={checked => {
                      setDexDamage(checked)
                      setValue('dex_damage', checked)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modificadores de Crítico */}
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-800">
              Modificadores de Crítico
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Crítico Mínimo (Modificador)
                </label>
                <input
                  type="number"
                  {...register('crit_from_mod')}
                  defaultValue={0}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="Ex: -2 para 18-20 virar 16-20"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-600">
                  Multiplicador (Modificador)
                </label>
                <input
                  type="number"
                  {...register('crit_mod')}
                  defaultValue={0}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                  placeholder="Ex: +1 para x2 virar x3"
                />
              </div>
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
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              placeholder="Adicione observações sobre esta arma..."
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

export default ModalWeaponBind
