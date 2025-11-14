import { useState, useEffect } from 'react'
import { Modal, Select, Button as AntButton } from 'antd'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'

import api from '../../../services/api'

const { Option } = Select

interface Class {
  id: number
  name: string
}

interface CharacterClass {
  id: number
  name: string
  level: number
}

interface ModalEditCharacterProgressProps {
  characterId: number
  currentLevel: number
  currentHealth: number
  currentExp: number
  currentClasses: CharacterClass[]
  onSuccess: () => void
}

interface ClassEntry {
  tempId: string // ID temporário para controle local
  class_id: number
  class_name: string
  level: number
}

const ModalEditCharacterProgress: React.FC<ModalEditCharacterProgressProps> = ({
  characterId,
  currentLevel,
  currentHealth,
  currentExp,
  currentClasses,
  onSuccess,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [availableClasses, setAvailableClasses] = useState<Class[]>([])
  
  // Estados do formulário
  const [level, setLevel] = useState(currentLevel)
  const [health, setHealth] = useState(currentHealth)
  const [exp, setExp] = useState(currentExp)
  const [classes, setClasses] = useState<ClassEntry[]>([])

  useEffect(() => {
    if (modalIsOpen) {
      loadAvailableClasses()
      setLevel(currentLevel)
      setHealth(currentHealth)
      setExp(currentExp)
    }
  }, [modalIsOpen, currentLevel, currentHealth, currentExp])

  // Separar o efeito de inicialização das classes para garantir que availableClasses esteja carregado
  useEffect(() => {
    if (modalIsOpen && availableClasses.length > 0 && classes.length === 0) {
      // Inicializar classes com as atuais
      const initialClasses: ClassEntry[] = currentClasses.map((c, index) => {
        // Encontrar o class_id pelo nome da classe
        const matchedClass = availableClasses.find(
          (ac) => ac.name.toLowerCase() === c.name.toLowerCase()
        )
        return {
          tempId: `existing-${index}-${Date.now()}`,
          class_id: matchedClass?.id || 0,
          class_name: matchedClass?.name || c.name,
          level: c.level,
        }
      })
      setClasses(initialClasses)
    }
  }, [modalIsOpen, availableClasses, currentClasses, classes.length])

  async function loadAvailableClasses() {
    try {
      const response = await api.get<Class[]>('/classes')
      setAvailableClasses(response.data || [])
    } catch {
      toast.error('Erro ao carregar classes disponíveis')
    }
  }

  function handleAddClass() {
    const newClass: ClassEntry = {
      tempId: `new-${Date.now()}`,
      class_id: 0,
      class_name: '',
      level: 1,
    }
    setClasses([...classes, newClass])
  }

  function handleRemoveClass(tempId: string) {
    setClasses(classes.filter((c) => c.tempId !== tempId))
  }

  function handleClassChange(tempId: string, classId: number) {
    const selectedClass = availableClasses.find((c) => c.id === classId)
    if (selectedClass) {
      setClasses(
        classes.map((c) =>
          c.tempId === tempId
            ? { ...c, class_id: classId, class_name: selectedClass.name }
            : c
        )
      )
    }
  }

  function handleLevelChange(tempId: string, level: number) {
    setClasses(
      classes.map((c) => (c.tempId === tempId ? { ...c, level } : c))
    )
  }

  async function handleSubmit() {
    // Validações
    if (level < 1 || level > 20) {
      toast.error('Nível deve estar entre 1 e 20')
      return
    }

    if (health < 1) {
      toast.error('HP deve ser maior que 0')
      return
    }

    if (exp < 0) {
      toast.error('XP não pode ser negativo')
      return
    }

    // Verificar se todas as classes foram selecionadas
    const invalidClasses = classes.filter((c) => !c.class_id || c.level < 1)
    if (invalidClasses.length > 0) {
      toast.error('Todas as classes devem ser selecionadas e ter nível válido')
      return
    }

    // Verificar se a soma dos níveis das classes é igual ao nível total
    const totalClassLevels = classes.reduce((sum, c) => sum + c.level, 0)
    if (totalClassLevels !== level) {
      toast.error(
        `A soma dos níveis das classes (${totalClassLevels}) deve ser igual ao nível total do personagem (${level})`
      )
      return
    }

    try {
      setLoading(true)

      const updateData = {
        level,
        health,
        exp,
        classe: classes.map((c) => ({
          class_id: c.class_id,
          level: c.level,
        })),
      }

      await api.put(`/characters/${characterId}`, updateData)

      toast.success('Personagem atualizado com sucesso!')
      handleCloseModal()
      onSuccess()
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'Erro ao atualizar personagem'
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
    // Resetar estado para próxima abertura
    setClasses([])
    setLevel(currentLevel)
    setHealth(currentHealth)
    setExp(currentExp)
  }

  const totalClassLevels = classes.reduce((sum, c) => sum + c.level, 0)
  const levelsMatch = totalClassLevels === level

  return (
    <>
      <AntButton
        icon={<FaEdit />}
        size="small"
        onClick={handleOpenModal}
        title="Editar progresso do personagem (Level Up)"
      >
        Editar Progresso
      </AntButton>

      <Modal
        title="Editar Progresso do Personagem"
        open={modalIsOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        destroyOnClose
      >
        <div className="mt-4 space-y-6">
          {/* Nível, HP e XP */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nível Total <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                HP Máximo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={health}
                onChange={(e) => setHealth(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Experiência (XP) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={exp}
                onChange={(e) => setExp(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
              />
            </div>
          </div>

          {/* Classes */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Classes <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddClass}
                className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
              >
                <FaPlus size={12} />
                Adicionar Classe
              </button>
            </div>

            <div className="space-y-2">
              {classes.map((classEntry) => (
                <div
                  key={classEntry.tempId}
                  className="flex items-center gap-2 rounded border border-gray-200 p-3"
                >
                  <div className="flex-1">
                    <Select
                      size="large"
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Escolha a classe"
                      value={classEntry.class_id || undefined}
                      onChange={(value) => handleClassChange(classEntry.tempId, value)}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        String(option?.children)
                          ?.toLowerCase()
                          .includes(input.toLowerCase()) ?? false
                      }
                    >
                      {availableClasses.map((cls) => (
                        <Option key={cls.id} value={cls.id}>
                          {cls.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={classEntry.level}
                      onChange={(e) =>
                        handleLevelChange(classEntry.tempId, Number(e.target.value))
                      }
                      placeholder="Nível"
                      className="w-full rounded border border-gray-300 px-3 py-2 text-center focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveClass(classEntry.tempId)}
                    className="rounded p-2 text-red-600 transition-colors hover:bg-red-50"
                    title="Remover classe"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}

              {classes.length === 0 && (
                <div className="rounded border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                  Nenhuma classe adicionada. Clique em "Adicionar Classe" para começar.
                </div>
              )}
            </div>

            {/* Validação dos níveis */}
            <div className="mt-2 text-sm">
              <span className={levelsMatch ? 'text-green-600' : 'text-red-600'}>
                Soma dos níveis das classes: {totalClassLevels} / {level}
                {!levelsMatch && ' (deve ser igual ao nível total)'}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !levelsMatch || classes.length === 0}
              className="rounded-lg bg-red-800 px-6 py-2 font-semibold text-white transition-colors hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalEditCharacterProgress

