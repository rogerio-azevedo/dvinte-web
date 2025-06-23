import React, { useEffect, useState } from 'react'
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

export default function MonsterCreate() {
  const [size, setSize] = useState()
  const [type, setType] = useState()
  const [subType, setSubType] = useState()
  const [alignment, setAlignment] = useState()

  const [attacks, setAttacks] = useState([])
  const [name, setName] = useState('')
  const [dice, setDice] = useState('')
  const [multiplier, setMultiplier] = useState('')
  const [critical, setCritical] = useState('')
  const [crit_from, setCrit_from] = useState('')
  const [range, setRange] = useState('')
  const [hit, setHit] = useState('')
  const [damage, setDamage] = useState('')

  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      is_ativo: true,
    },
  })

  useEffect(() => {
    register({ name: 'type' })
    register({ name: 'subType' })
    register({ name: 'size' })
    register({ name: 'alignment' })
    register({ name: 'is_ativo' })
  }, [register])

  const onSubmit = data => {
    const newMonster = {
      data,
      attacks,
    }

    async function saveData() {
      await api.post('monsters', newMonster)
    }
    saveData()

    toast.success('Monstro criado com sucesso!')
  }

  function handleSize(data) {
    setValue('size', data)
    setSize(data)
  }

  function handleType(data) {
    setValue('type', data)
    setType(data)
  }

  function handleSubType(data) {
    setValue('subType', data)
    setSubType(data)
  }

  function handleAlignment(data) {
    setValue('alignment', data)
    setAlignment(data)
  }

  function handleAddAttack() {
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
    setAttacks([...attacks, attack])
  }

  function handleRemove(item) {
    const newAttacks = attacks.filter(c => c.name !== item.name)

    setAttacks(newAttacks)
  }

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
                  name="name"
                  ref={register({ required: true })}
                  placeholder="Nome"
                />
                {errors.name && errors.name.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <Styles.LabelSelect htmlFor="size">Tamanho</Styles.LabelSelect>
                <SelectSize
                  name="size"
                  defaultValue={size}
                  changeSize={e => handleSize(e?.value)}
                />
              </div>
              <div>
                <Styles.LabelSelect htmlFor="type">Tipo</Styles.LabelSelect>
                <SelectMonsterType
                  name="type"
                  defaultValue={type}
                  changeType={e => handleType(e?.value)}
                />
              </div>
              <div>
                <Styles.LabelSelect htmlFor="subType">
                  Sub Tipo
                </Styles.LabelSelect>
                <SelectMonsterSubType
                  name="subType"
                  defaultValue={subType}
                  changeSubType={e => handleSubType(e?.value)}
                />
              </div>
            </Styles.InputContainer>
            <Styles.InputContainer>
              <div>
                <label htmlFor="health">Vida</label>
                <Styles.InputShort
                  name="health"
                  ref={register({ required: true })}
                  placeholder="Vida"
                />
                {errors.health && errors.health.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="initiative">Iniciativa</label>
                <Styles.InputShort
                  name="initiative"
                  ref={register({ required: true })}
                  placeholder="Iniciativa"
                />
                {errors.initiative && errors.initiative.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="displacement">Deslocamento</label>
                <Styles.InputShort
                  name="displacement"
                  ref={register({ required: true })}
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
                  name="ca"
                  ref={register({ required: true })}
                  placeholder="CA"
                />
                {errors.ca && errors.ca.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="defense">Armadura</label>
                <Styles.InputLarge
                  name="defense"
                  ref={register({ required: true })}
                  placeholder="Armadura"
                />
                {errors.defense && errors.defense.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="grab">Agarrar</label>
                <Styles.InputShort
                  name="grab"
                  ref={register({ required: true })}
                  placeholder="Agarrar"
                />
                {errors.grab && errors.grab.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="challenge">Desafio</label>
                <Styles.InputShort
                  name="challenge"
                  ref={register({ required: true })}
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
                  name="attack_special"
                  ref={register()}
                  placeholder="Ataque"
                />
                {errors.hair && errors.hair.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="special_qualities">Habilidade Especial</label>
                <Styles.InputExtraLarge
                  name="special_qualities"
                  ref={register()}
                  placeholder="Habilidade Especial"
                />
                {errors.special_qualities &&
                  errors.special_qualities.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
              </div>
              <div>
                <label htmlFor="fort">Fortitude</label>
                <Styles.InputShort
                  name="fort"
                  ref={register({ required: true })}
                  placeholder="Fortitude"
                />
                {errors.fort && errors.fort.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="reflex">Reflexos</label>
                <Styles.InputShort
                  name="reflex"
                  ref={register({ required: true })}
                  placeholder="Reflexos"
                />
                {errors.reflex && errors.reflex.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="will">Vontade</label>
                <Styles.InputShort
                  name="will"
                  ref={register({ required: true })}
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
                  name="skills"
                  ref={register({ required: true })}
                  placeholder="Perícias"
                />
                {errors.skills && errors.skills.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="feats">Talentos</label>
                <Styles.InputExtraLarge
                  name="feats"
                  ref={register({ required: true })}
                  placeholder="Talentos"
                />
                {errors.feats && errors.feats.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="name">Monster_URL</label>
                <Styles.InputLarge
                  name="monster_url"
                  ref={register()}
                  placeholder="Monster URL"
                />
                {errors.monster_url &&
                  errors.monster_url.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <h2>Atributos</h2>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="strength">Força</label>
                <Styles.InputMed
                  name="strength"
                  ref={register({ required: true })}
                  placeholder="Força"
                />
                {errors.strength && errors.strength.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="dexterity">Destreza</label>
                <Styles.InputMed
                  name="dexterity"
                  ref={register({ required: true })}
                  placeholder="Destreza"
                />
                {errors.dexterity && errors.dexterity.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>

              <div>
                <label htmlFor="constitution">Constituição</label>
                <Styles.InputMed
                  name="constitution"
                  ref={register({ required: true })}
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
                  name="intelligence"
                  ref={register({ required: true })}
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
                  name="wisdom"
                  ref={register({ required: true })}
                  placeholder="Sabedoria"
                />
                {errors.wisdom && errors.wisdom.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
              <div>
                <label htmlFor="charisma">Carisma</label>
                <Styles.InputMed
                  name="charisma"
                  ref={register({ required: true })}
                  placeholder="Carisma"
                />
                {errors.charisma && errors.charisma.type === 'required' && (
                  <span>Essa informação é obrigatória</span>
                )}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="character">Alinhamento</label>
                <SelectAlignment
                  name="alignment"
                  defaultValue={alignment}
                  changeAlignment={e => handleAlignment(e?.value)}
                />
              </div>
              <div>
                <label htmlFor="description">Notas</label>
                <Styles.InputExtraLarge
                  name="notes"
                  ref={register()}
                  placeholder="Notas"
                />
                {errors.description &&
                  errors.description.type === 'required' && (
                    <span>Essa informação é obrigatória</span>
                  )}
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
                  <li key={Math.random()}>
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
