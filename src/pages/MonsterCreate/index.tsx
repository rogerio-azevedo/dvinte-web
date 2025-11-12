import { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { FaTimes, FaPlus, FaSave, FaDragon } from 'react-icons/fa'

import SelectSize from '../../components/SelectSize'
import SelectMonsterType from '../../components/SelectMonsterType'
import SelectMonsterSubType from '../../components/SelectMonsterSubType'
import SelectAlignment from '../../components/SelectAlignment'

import api from '../../services/api'
import type { Attack, FormData } from './interfaces'

// Arrays estáticos para tamanhos, tipos e subtipos (agora com value/label)
const SIZES = [
  { value: 'Minúsculo', label: 'Minúsculo' },
  { value: 'Diminuto', label: 'Diminuto' },
  { value: 'Miúdo', label: 'Miúdo' },
  { value: 'Pequeno', label: 'Pequeno' },
  { value: 'Médio', label: 'Médio' },
  { value: 'Grande', label: 'Grande' },
  { value: 'Enorme', label: 'Enorme' },
  { value: 'Imenso', label: 'Imenso' },
  { value: 'Colossal', label: 'Colossal' },
]

const MONSTER_TYPES = [
  { value: 'Aberração', label: 'Aberração' },
  { value: 'Animal', label: 'Animal' },
  { value: 'Construto', label: 'Construto' },
  { value: 'Dragão', label: 'Dragão' },
  { value: 'Fada', label: 'Fada' },
  { value: 'Humanoide', label: 'Humanoide' },
  { value: 'Monstruosidade', label: 'Monstruosidade' },
  { value: 'Morto-vivo', label: 'Morto-vivo' },
  { value: 'Planta', label: 'Planta' },
  { value: 'Verme', label: 'Verme' },
  { value: 'Outros', label: 'Outros' },
]

const MONSTER_SUBTYPES = [
  { value: 'Aquático', label: 'Aquático' },
  { value: 'Voador', label: 'Voador' },
  { value: 'Subterrâneo', label: 'Subterrâneo' },
  { value: 'Metamorfo', label: 'Metamorfo' },
  { value: 'Outros', label: 'Outros' },
]

const ALIGNMENTS = [
  { value: 'Leal/Bom', label: 'Leal e Bom' },
  { value: 'Neutro/Bom', label: 'Neutro e Bom' },
  { value: 'Caótico/Bom', label: 'Caótico e Bom' },
  { value: 'Leal/Neutro', label: 'Leal e Neutro' },
  { value: 'Neutro/Neutro', label: 'Neutro' },
  { value: 'Caótico/Neutro', label: 'Caótico e Neutro' },
  { value: 'Leal/Mau', label: 'Leal e Mau' },
  { value: 'Neutro/Mau', label: 'Neutro e Mau' },
  { value: 'Caótico/Mau', label: 'Caótico e Mau' },
]

export default function MonsterCreate() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [attackForm, setAttackForm] = useState<Attack>({
    name: '',
    dice: '',
    multiplier: '',
    critical: '',
    crit_from: '',
    range: '',
    hit: '',
    damage: '',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      is_ativo: true,
      quantity: 1,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: FormData) => {
    // Validar se tem pelo menos um ataque
    if (attacks.length === 0) {
      toast.warning('Adicione pelo menos um ataque ao monstro!')
      return
    }

    try {
      const quantity = data.quantity || 1
      const baseName = data.name

      // Se quantidade for 1, cria apenas um monstro sem numeração
      if (quantity === 1) {
        const newMonster = {
          data,
          attacks,
        }
        await api.post('monsters', newMonster)
        toast.success('Monstro criado com sucesso!')
      } else {
        // Se quantidade > 1, cria múltiplos monstros numerados
        const promises = []
        for (let i = 1; i <= quantity; i++) {
          const monsterData = {
            ...data,
            name: `${baseName} ${i}`,
          }
          const newMonster = {
            data: monsterData,
            attacks,
          }
          promises.push(api.post('monsters', newMonster))
        }
        
        await Promise.all(promises)
        toast.success(`${quantity} monstros criados com sucesso!`)
      }

      // Limpar formulário após sucesso
      reset()
      setAttacks([])
      setAttackForm({
        name: '',
        dice: '',
        multiplier: '',
        critical: '',
        crit_from: '',
        range: '',
        hit: '',
        damage: '',
      })
    } catch (error) {
      console.error('Erro ao criar monstro:', error)
      toast.error(
        'Erro ao criar monstro(s). Verifique os dados e tente novamente.'
      )
    }
  }

  const handleAttackFieldChange = useCallback((field: keyof Attack, value: string) => {
    setAttackForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddAttack = useCallback(() => {
    // Validar campos obrigatórios do ataque
    if (!attackForm.name.trim()) {
      toast.warning('O nome do ataque é obrigatório!')
      return
    }

    if (!attackForm.hit.trim()) {
      toast.warning('O valor de acerto (hit) é obrigatório!')
      return
    }

    setAttacks(prev => [...prev, attackForm])
    
    // Limpar formulário de ataque
    setAttackForm({
      name: '',
      dice: '',
      multiplier: '',
      critical: '',
      crit_from: '',
      range: '',
      hit: '',
      damage: '',
    })
    
    toast.success('Ataque adicionado!')
  }, [attackForm])

  const handleRemove = useCallback((index: number) => {
    setAttacks(prev => prev.filter((_, i) => i !== index))
    toast.info('Ataque removido!')
  }, [])

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaDragon className="text-5xl text-red-900" />
            <h1 className="text-4xl font-bold text-red-900 select-none">
              Cadastro de Monstros
            </h1>
          </div>
          <p className="text-gray-600">Preencha os dados do monstro para adicionar ao bestiário</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Seção: Informações Básicas */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-red-900">
                    Nome *
                  </label>
                  <input
                    {...register('name', {
                      required: 'Nome é obrigatório',
                      minLength: {
                        value: 2,
                        message: 'Nome deve ter pelo menos 2 caracteres',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Nome do monstro"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.name.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="quantity" className="text-sm font-semibold text-red-900">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    {...register('quantity', {
                      min: {
                        value: 1,
                        message: 'Quantidade mínima é 1',
                      },
                      max: {
                        value: 50,
                        message: 'Quantidade máxima é 50',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="1"
                    defaultValue={1}
                  />
                  {errors.quantity && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.quantity.message}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    💡 Cria múltiplos monstros numerados (ex: Esqueleto 1, Esqueleto 2...)
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="size" className="text-sm font-semibold text-red-900">
                    Tamanho *
                  </label>
                  <Controller
                    name="size"
                    control={control}
                    rules={{ required: 'Tamanho é obrigatório' }}
                    render={({ field }) => (
                      <SelectSize
                        value={field.value}
                        changeSize={field.onChange}
                        sizes={SIZES}
                      />
                    )}
                  />
                  {errors.size && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.size.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="type" className="text-sm font-semibold text-red-900">
                    Tipo *
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: 'Tipo é obrigatório' }}
                    render={({ field }) => (
                      <SelectMonsterType
                        changeMonsterType={field.onChange}
                        monsterTypes={MONSTER_TYPES}
                      />
                    )}
                  />
                  {errors.type && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.type.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="subType" className="text-sm font-semibold text-red-900">
                    Sub Tipo
                  </label>
                  <Controller
                    name="subType"
                    control={control}
                    render={({ field }) => (
                      <SelectMonsterSubType
                        changeMonsterSubType={field.onChange}
                        monsterSubTypes={MONSTER_SUBTYPES}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Seção: Estatísticas de Combate */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Estatísticas de Combate
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="health" className="text-sm font-semibold text-red-900">
                    Vida *
                  </label>
                  <input
                    {...register('health', {
                      required: 'Vida é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: 45"
                    type="number"
                  />
                  {errors.health && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.health.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="initiative" className="text-sm font-semibold text-red-900">
                    Iniciativa *
                  </label>
                  <input
                    {...register('initiative', {
                      required: 'Iniciativa é obrigatória',
                      pattern: {
                        value: /^[+-]?\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: +2"
                  />
                  {errors.initiative && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.initiative.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="displacement" className="text-sm font-semibold text-red-900">
                    Deslocamento *
                  </label>
                  <input
                    {...register('displacement', {
                      required: 'Deslocamento é obrigatório',
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: 9m"
                  />
                  {errors.displacement && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.displacement.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="ca" className="text-sm font-semibold text-red-900">
                    CA *
                  </label>
                  <input
                    {...register('ca', {
                      required: 'CA é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: 15"
                    type="number"
                  />
                  {errors.ca && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.ca.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="defense" className="text-sm font-semibold text-red-900">
                    Armadura *
                  </label>
                  <input
                    {...register('defense', {
                      required: 'Armadura é obrigatória',
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: Couro batido"
                  />
                  {errors.defense && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.defense.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="grab" className="text-sm font-semibold text-red-900">
                    Agarrar *
                  </label>
                  <input
                    {...register('grab', {
                      required: 'Agarrar é obrigatório',
                      pattern: {
                        value: /^[+-]?\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: +5"
                  />
                  {errors.grab && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.grab.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="challenge" className="text-sm font-semibold text-red-900">
                    Desafio *
                  </label>
                  <input
                    {...register('challenge', {
                      required: 'Desafio é obrigatório',
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: 1/2"
                  />
                  {errors.challenge && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.challenge.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Habilidades e Resistências */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Habilidades e Resistências
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="attack_special" className="text-sm font-semibold text-red-900">
                    Ataque Especial
                  </label>
                  <input
                    {...register('attack_special')}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Descreva ataques especiais"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="special_qualities" className="text-sm font-semibold text-red-900">
                    Qualidades Especiais
                  </label>
                  <input
                    {...register('special_qualities')}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Descreva qualidades especiais"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="fort" className="text-sm font-semibold text-red-900">
                    Fortitude *
                  </label>
                  <input
                    {...register('fort', {
                      required: 'Fortitude é obrigatória',
                      pattern: {
                        value: /^[+-]?\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: +3"
                  />
                  {errors.fort && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.fort.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="reflex" className="text-sm font-semibold text-red-900">
                    Reflexos *
                  </label>
                  <input
                    {...register('reflex', {
                      required: 'Reflexos é obrigatório',
                      pattern: {
                        value: /^[+-]?\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: +4"
                  />
                  {errors.reflex && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.reflex.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="will" className="text-sm font-semibold text-red-900">
                    Vontade *
                  </label>
                  <input
                    {...register('will', {
                      required: 'Vontade é obrigatória',
                      pattern: {
                        value: /^[+-]?\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: +2"
                  />
                  {errors.will && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.will.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Perícias e Talentos */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Perícias e Talentos
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="skills" className="text-sm font-semibold text-red-900">
                    Perícias *
                  </label>
                  <input
                    {...register('skills', {
                      required: 'Perícias são obrigatórias',
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: Furtividade +8, Percepção +5"
                  />
                  {errors.skills && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.skills.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="feats" className="text-sm font-semibold text-red-900">
                    Talentos *
                  </label>
                  <input
                    {...register('feats', {
                      required: 'Talentos são obrigatórios',
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Ex: Esquiva, Mobilidade"
                  />
                  {errors.feats && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.feats.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="monster_url" className="text-sm font-semibold text-red-900">
                    URL de Referência
                  </label>
                  <input
                    {...register('monster_url')}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Seção: Atributos */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Atributos
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="strength" className="text-sm font-semibold text-red-900">
                    Força *
                  </label>
                  <input
                    {...register('strength', {
                      required: 'Força é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.strength && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.strength.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="dexterity" className="text-sm font-semibold text-red-900">
                    Destreza *
                  </label>
                  <input
                    {...register('dexterity', {
                      required: 'Destreza é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.dexterity && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.dexterity.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="constitution" className="text-sm font-semibold text-red-900">
                    Constituição *
                  </label>
                  <input
                    {...register('constitution', {
                      required: 'Constituição é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.constitution && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.constitution.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="intelligence" className="text-sm font-semibold text-red-900">
                    Inteligência *
                  </label>
                  <input
                    {...register('intelligence', {
                      required: 'Inteligência é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.intelligence && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.intelligence.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="wisdom" className="text-sm font-semibold text-red-900">
                    Sabedoria *
                  </label>
                  <input
                    {...register('wisdom', {
                      required: 'Sabedoria é obrigatória',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.wisdom && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.wisdom.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="charisma" className="text-sm font-semibold text-red-900">
                    Carisma *
                  </label>
                  <input
                    {...register('charisma', {
                      required: 'Carisma é obrigatório',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Deve ser um número',
                      },
                    })}
                    className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="10"
                    type="number"
                  />
                  {errors.charisma && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.charisma.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Seção: Informações Adicionais */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200">
                Informações Adicionais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="alignment" className="text-sm font-semibold text-red-900">
                    Alinhamento *
                  </label>
                  <Controller
                    name="alignment"
                    control={control}
                    rules={{ required: 'Alinhamento é obrigatório' }}
                    render={({ field }) => (
                      <SelectAlignment
                        value={field.value}
                        changeAlignment={field.onChange}
                        alignments={ALIGNMENTS}
                      />
                    )}
                  />
                  {errors.alignment && (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      ⚠ {errors.alignment.message}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="notes" className="text-sm font-semibold text-red-900">
                    Notas
                  </label>
                  <textarea
                    {...register('notes')}
                    className="w-full min-h-[100px] px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-y"
                    placeholder="Observações adicionais sobre o monstro"
                  />
                </div>
              </div>
            </div>

            {/* Seção: Ataques */}
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-4 pb-2 border-b-2 border-red-200 flex items-center gap-2">
                Ataques {attacks.length > 0 && (
                  <span className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    {attacks.length}
                  </span>
                )}
              </h2>
              
              {/* Formulário de Ataque */}
              <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  Adicionar Ataque
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4 items-end">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="attack_name" className="text-sm font-semibold text-red-900">
                      Nome *
                    </label>
                    <input
                      value={attackForm.name}
                      onChange={e => handleAttackFieldChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Ex: Mordida, Garra"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="hit" className="text-sm font-semibold text-red-900">
                      Acerto *
                    </label>
                    <input
                      value={attackForm.hit}
                      onChange={e => handleAttackFieldChange('hit', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="+5"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="dice" className="text-sm font-semibold text-red-900">
                      Dado
                    </label>
                    <input
                      value={attackForm.dice}
                      onChange={e => handleAttackFieldChange('dice', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="d6"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="multiplier" className="text-sm font-semibold text-red-900">
                      Qtd
                    </label>
                    <input
                      value={attackForm.multiplier}
                      onChange={e => handleAttackFieldChange('multiplier', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="1"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="damage" className="text-sm font-semibold text-red-900">
                      Dano
                    </label>
                    <input
                      value={attackForm.damage}
                      onChange={e => handleAttackFieldChange('damage', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="+3"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="critical" className="text-sm font-semibold text-red-900">
                      Crítico
                    </label>
                    <input
                      value={attackForm.critical}
                      onChange={e => handleAttackFieldChange('critical', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="x2"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="crit_from" className="text-sm font-semibold text-red-900">
                      Crít. de
                    </label>
                    <input
                      value={attackForm.crit_from}
                      onChange={e => handleAttackFieldChange('crit_from', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="20"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="range" className="text-sm font-semibold text-red-900">
                      Alcance
                    </label>
                    <input
                      value={attackForm.range}
                      onChange={e => handleAttackFieldChange('range', e.target.value)}
                      className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="1,5m"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddAttack}
                    className="h-10 w-full flex items-center justify-center bg-red-900 text-white rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow-md"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Lista de Ataques */}
              {attacks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">
                    Ataques Cadastrados
                  </h3>
                  <div className="space-y-3">
                    {attacks.map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="bg-red-100 border-l-4 border-red-600 rounded-lg p-4 flex justify-between items-center hover:bg-red-150 hover:translate-x-1 transition-all"
                      >
                        <div className="flex flex-col gap-1">
                          <strong className="text-red-900 text-lg font-bold">
                            {item.name}
                          </strong>
                          <div className="flex flex-wrap gap-3 text-sm text-red-800 font-medium">
                            <span>Acerto: {item.hit}</span>
                            {item.multiplier && item.dice && (
                              <span>
                                Dano: {item.multiplier}{item.dice}
                                {item.damage && ` ${item.damage}`}
                              </span>
                            )}
                            {item.critical && (
                              <span>
                                Crítico: {item.critical} ({item.crit_from || '20'})
                              </span>
                            )}
                            {item.range && <span>Alcance: {item.range}</span>}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="p-2 rounded-lg hover:bg-red-200 text-red-700 hover:text-red-900 active:scale-90 transition-all"
                          title="Remover ataque"
                        >
                          <FaTimes size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botão de Envio */}
            <div className="flex justify-center pt-6 border-t-2 border-red-100">
              <button
                type="submit"
                className="flex items-center gap-3 px-8 py-4 bg-red-900 text-white text-lg font-semibold rounded-lg hover:bg-red-800 active:scale-95 transition-all shadow-lg hover:shadow-xl"
              >
                <FaSave size={20} />
                Salvar Monstro
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
