import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import * as Styles from './styles'
import { FaTimes } from 'react-icons/fa'

import Button from '../../components/Button'
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
  const [size, setSize] = useState<string>()
  // const [type, setType] = useState<string>()
  // const [subType, setSubType] = useState<string>()
  const [alignment, setAlignment] = useState<string>()

  const [attacks, setAttacks] = useState<Attack[]>([])
  const [name, setName] = useState('')
  const [dice, setDice] = useState('')
  const [multiplier, setMultiplier] = useState('')
  const [critical, setCritical] = useState('')
  const [crit_from, setCrit_from] = useState('')
  const [range, setRange] = useState('')
  const [hit, setHit] = useState('')
  const [damage, setDamage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      is_ativo: true,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const newMonster = {
        data,
        attacks,
      }

      await api.post('monsters', newMonster)
      toast.success('Monstro criado com sucesso!')

      // Limpar formulário após sucesso
      reset()
      setAttacks([])
      setSize(undefined)
      setAlignment(undefined)

      // Limpar campos de ataque
      setName('')
      setDice('')
      setMultiplier('')
      setCritical('')
      setCrit_from('')
      setRange('')
      setHit('')
      setDamage('')
    } catch (error) {
      console.error('Erro ao criar monstro:', error)
      toast.error(
        'Erro ao criar monstro. Verifique os dados e tente novamente.'
      )
    }
  }

  const handleSize = useCallback(
    (value: string | null) => {
      setValue('size', value || '')
      setSize(value || undefined)
    },
    [setValue]
  )

  const handleType = useCallback(
    (value: string | null) => {
      setValue('type', value || '')
      // setType(value || undefined)
    },
    [setValue]
  )

  const handleSubType = useCallback(
    (value: string | null) => {
      setValue('subType', value || '')
      // setSubType(value || undefined)
    },
    [setValue]
  )

  const handleAlignment = useCallback(
    (value: string | null) => {
      setValue('alignment', value || '')
      setAlignment(value || undefined)
    },
    [setValue]
  )

  const handleAddAttack = useCallback(() => {
    const attack = {
      name,
      dice,
      multiplier,
      critical,
      crit_from,
      range,
      hit,
      damage,
    }
    setAttacks(prev => [...prev, attack])

    // Limpar campos após adicionar
    setName('')
    setDice('')
    setMultiplier('')
    setCritical('')
    setCrit_from('')
    setRange('')
    setHit('')
    setDamage('')
  }, [name, dice, multiplier, critical, crit_from, range, hit, damage])

  const handleRemove = useCallback((item: Attack) => {
    setAttacks(prev => prev.filter(c => c.name !== item.name))
  }, [])

  return (
    <Styles.Container>
      <Styles.ContentContainer>
        <h1>Cadastro de Monstros</h1>
        <Styles.FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Styles.InputContainer>
              <div>
                <label htmlFor="name">Nome</label>
                <Styles.InputLarge
                  {...register('name', { required: true })}
                  placeholder="Nome"
                />
                {errors.name && errors.name.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <Styles.LabelSelect htmlFor="size">Tamanho</Styles.LabelSelect>
                <SelectSize
                  value={size}
                  changeSize={handleSize}
                  sizes={SIZES}
                />
              </div>
              <div>
                <Styles.LabelSelect htmlFor="type">Tipo</Styles.LabelSelect>
                <SelectMonsterType
                  changeMonsterType={handleType}
                  monsterTypes={MONSTER_TYPES}
                />
              </div>
              <div>
                <Styles.LabelSelect htmlFor="subType">
                  Sub Tipo
                </Styles.LabelSelect>
                <SelectMonsterSubType
                  changeMonsterSubType={handleSubType}
                  monsterSubTypes={MONSTER_SUBTYPES}
                />
              </div>
            </Styles.InputContainer>
            <Styles.InputContainer>
              <div>
                <label htmlFor="health">Vida</label>
                <Styles.InputShort
                  {...register('health', { required: true })}
                  placeholder="Vida"
                />
                {errors.health && errors.health.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="initiative">Iniciativa</label>
                <Styles.InputShort
                  {...register('initiative', { required: true })}
                  placeholder="Iniciativa"
                />
                {errors.initiative && errors.initiative.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="displacement">Deslocamento</label>
                <Styles.InputShort
                  {...register('displacement', { required: true })}
                  placeholder="Desloc"
                />
                {errors.displacement &&
                  errors.displacement.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
              </div>
              <div>
                <label htmlFor="ca">CA</label>
                <Styles.InputShort
                  {...register('ca', { required: true })}
                  placeholder="CA"
                />
                {errors.ca && errors.ca.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="defense">Armadura</label>
                <Styles.InputLarge
                  {...register('defense', { required: true })}
                  placeholder="Armadura"
                />
                {errors.defense && errors.defense.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="grab">Agarrar</label>
                <Styles.InputShort
                  {...register('grab', { required: true })}
                  placeholder="Agarrar"
                />
                {errors.grab && errors.grab.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="challenge">Desafio</label>
                <Styles.InputShort
                  {...register('challenge', { required: true })}
                  placeholder="Desafio"
                />
                {errors.challenge && errors.challenge.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
            </Styles.InputContainer>
            <Styles.InputContainer>
              <div>
                <label htmlFor="attack_special">Ataque Especial</label>
                <Styles.InputExtraLarge
                  {...register('attack_special')}
                  placeholder="Ataque"
                />
              </div>
              <div>
                <label htmlFor="special_qualities">Habilidade Especial</label>
                <Styles.InputExtraLarge
                  {...register('special_qualities')}
                  placeholder="Habilidade Especial"
                />
              </div>
              <div>
                <label htmlFor="fort">Fortitude</label>
                <Styles.InputShort
                  {...register('fort', { required: true })}
                  placeholder="Fortitude"
                />
                {errors.fort && errors.fort.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="reflex">Reflexos</label>
                <Styles.InputShort
                  {...register('reflex', { required: true })}
                  placeholder="Reflexos"
                />
                {errors.reflex && errors.reflex.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="will">Vontade</label>
                <Styles.InputShort
                  {...register('will', { required: true })}
                  placeholder="Vontade"
                />
                {errors.will && errors.will.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="skills">Perícias</label>
                <Styles.InputExtraLarge
                  {...register('skills', { required: true })}
                  placeholder="Perícias"
                />
                {errors.skills && errors.skills.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="feats">Talentos</label>
                <Styles.InputExtraLarge
                  {...register('feats', { required: true })}
                  placeholder="Talentos"
                />
                {errors.feats && errors.feats.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="monster_url">Monster_URL</label>
                <Styles.InputLarge
                  {...register('monster_url')}
                  placeholder="Monster URL"
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <h2>Atributos</h2>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="strength">Força</label>
                <Styles.InputMed
                  {...register('strength', { required: true })}
                  placeholder="Força"
                />
                {errors.strength && errors.strength.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="dexterity">Destreza</label>
                <Styles.InputMed
                  {...register('dexterity', { required: true })}
                  placeholder="Destreza"
                />
                {errors.dexterity && errors.dexterity.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>

              <div>
                <label htmlFor="constitution">Constituição</label>
                <Styles.InputMed
                  {...register('constitution', { required: true })}
                  placeholder="Constituição"
                />
                {errors.constitution &&
                  errors.constitution.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
              </div>
              <div>
                <label htmlFor="intelligence">Inteligência</label>
                <Styles.InputMed
                  {...register('intelligence', { required: true })}
                  placeholder="Inteligência"
                />
                {errors.intelligence &&
                  errors.intelligence.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
              </div>
              <div>
                <label htmlFor="wisdom">Sabedoria</label>
                <Styles.InputMed
                  {...register('wisdom', { required: true })}
                  placeholder="Sabedoria"
                />
                {errors.wisdom && errors.wisdom.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="charisma">Carisma</label>
                <Styles.InputMed
                  {...register('charisma', { required: true })}
                  placeholder="Carisma"
                />
                {errors.charisma && errors.charisma.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="alignment">Alinhamento</label>
                <SelectAlignment
                  value={alignment || ''}
                  changeAlignment={handleAlignment}
                  alignments={ALIGNMENTS}
                />
              </div>
              <div>
                <label htmlFor="notes">Notas</label>
                <Styles.InputExtraLarge
                  {...register('notes')}
                  placeholder="Notas"
                />
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <h2>Ataques</h2>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="name">name</label>
                <Styles.InputAttackName
                  value={name}
                  placeholder="name"
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="hit">hit</label>
                <Styles.InputShort
                  value={hit}
                  placeholder="hit"
                  onChange={e => setHit(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="multiplier">multiplier</label>
                <Styles.InputShort
                  value={multiplier}
                  placeholder="multiplier"
                  onChange={e => setMultiplier(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="dice">dice</label>
                <Styles.InputShort
                  value={dice}
                  placeholder="dice"
                  onChange={e => setDice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="range">damage</label>
                <Styles.InputShort
                  value={damage}
                  placeholder="damage"
                  onChange={e => setDamage(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="critical">critical</label>
                <Styles.InputShort
                  value={critical}
                  placeholder="critical"
                  onChange={e => setCritical(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="crit_from">crit_from</label>
                <Styles.InputShort
                  value={crit_from}
                  placeholder="crit_from"
                  onChange={e => setCrit_from(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="range">range</label>
                <Styles.InputShort
                  value={range}
                  placeholder="range"
                  onChange={e => setRange(e.target.value)}
                />
              </div>
              <div>
                <Styles.ButtonAdd type="button" onClick={handleAddAttack}>
                  +
                </Styles.ButtonAdd>
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <ul>
                {attacks?.map(item => (
                  <li key={`${item.name}-${item.dice}-${item.damage}`}>
                    <Styles.InputMedThin readOnly defaultValue={item.name} />
                    <Styles.InputShortThin readOnly defaultValue={item.hit} />
                    <Styles.InputShortThin
                      readOnly
                      defaultValue={item.multiplier}
                    />
                    <Styles.InputShortThin readOnly defaultValue={item.dice} />
                    <Styles.InputShortThin
                      readOnly
                      defaultValue={item.damage}
                    />
                    <Styles.InputShortThin
                      readOnly
                      defaultValue={item.critical}
                    />
                    <Styles.InputShortThin
                      readOnly
                      defaultValue={item.crit_from}
                    />
                    <Styles.InputShortThin readOnly defaultValue={item.range} />
                    <FaTimes
                      onClick={() => handleRemove(item)}
                      size={20}
                      color="#8e0e00"
                    />
                  </li>
                ))}
              </ul>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <Button type="submit" TextButton="Gravar" />
            </Styles.InputContainer>
          </form>
        </Styles.FormContainer>
      </Styles.ContentContainer>
    </Styles.Container>
  )
}
