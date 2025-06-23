/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from 'react'
// import { useSelector } from 'react-redux'

import { Link } from 'react-router-dom'
import Select from 'react-select'

import api from '../../services/api'

// import SelectCharacter from '~/components/SelectCharacter'
import * as Styles from './styles'

export default function GmTools() {
  // const profile = useSelector(state => state.user.profile)
  const inputRef = useRef()

  const [health, setHealth] = useState(0)
  const [monsterHealth, setMonsterHealth] = useState(0)
  const [list, setList] = useState([])
  const [monsters, setMonsters] = useState([])
  const [selAttack, setSelAttack] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    setLoading(true)
    const response = await api.get('characters')
    const respMonster = await api.get('monsters')

    const newMonsters = await respMonster?.data?.map(item => ({
      ...item,
      attacks: item?.monster_attack?.map(a => ({
        value: a.id,
        label: a.name.toUpperCase(),
      })),
    }))

    setList(response.data)
    setMonsters(newMonsters)
    setLoading(false)
  }

  useEffect(() => {
    loadChar()
  }, [health, monsterHealth]) // eslint-disable-line

  async function handleInitiative(monsterId) {
    const monster = await monsters.filter(
      monster => monster.id === monsterId
    )[0]

    const dext = Number(monster.initiative)
    const monsterName = monster.name

    const dice = Math.floor(Math.random() * 20) + 1

    const initTotal = dext + dice

    const rolled = `Rolou iniciativa d20: ${dice} + ${dext} de destreza, com resultado: ${initTotal}`

    api.post('combats', {
      id: 0,
      user_id: 0,
      user: monsterName,
      message: rolled,
      result: initTotal,
      type: 8,
    })

    api.post('initiatives', {
      user_id: 0,
      user: monsterName,
      initiative: initTotal,
    })
  }

  async function handleAttack(monsterId) {
    const monster = await monsters.filter(
      monster => monster.id === monsterId
    )[0]

    const attacks = monster?.monster_attack?.filter(a => a.id === selAttack)[0]

    const monsterName = monster.name
    const base = Number(attacks?.hit)
    const critFrom = Number(attacks?.crit_from)
    const attackName = attacks?.name
    const dice = Math.floor(Math.random() * 20) + 1

    let isCrit = ''

    if (dice >= critFrom) {
      isCrit = 'HIT'
    } else if (dice === 1) {
      isCrit = 'FAIL'
    } else {
      isCrit = 'NORMAL'
    }

    const attackTotal = Number(base) + Number(dice)

    let rolled = ''

    if (isCrit === 'HIT') {
      rolled = `ACERTO CRÍTICO: ATACOU com ${attackName}: d20: ${dice} + ${base} de base de ataque, com resultado: ${attackTotal}`
    } else if (isCrit === 'FAIL') {
      rolled = `ERRO CRÍTICO: ATACOU com ${attackName}: d20: ${dice} + ${base} de base de ataque, com resultado: ${attackTotal}`
    } else {
      rolled = `ATACOU com ${attackName}: d20: ${dice} + ${base} de base de ataque, com resultado: ${attackTotal}`
    }

    api.post('combats', {
      id: 0,
      user_id: 0,
      user: monsterName,
      message: rolled,
      result: attackTotal,
      type: 3,
      isCrit: isCrit,
    })
  }

  async function handleDamage(monsterId) {
    const monster = await monsters.filter(
      monster => monster.id === monsterId
    )[0]

    const attacks = monster?.monster_attack?.filter(a => a.id === selAttack)[0]

    const monsterName = monster?.name
    const attackName = attacks?.name
    const monsterDice = Number(attacks?.dice) || 0
    const monsterMulti = Number(attacks?.multiplier) || 0
    const extraDamage = Number(attacks?.damage) || 0

    let result = 0
    const random = () => {
      return Math.floor(Math.random() * Number(monsterDice)) + 1
    }

    // eslint-disable-next-line
    for (let i = 0; i < monsterMulti; i++) {
      result += random()
    }

    const totalDamage = Number(result) + Number(extraDamage)

    const rolled = `CAUSOU DANO com ${attackName}: ${monsterMulti} x d${monsterDice}: ${result} + ${extraDamage} de bônus, com resultado: ${totalDamage}.`

    api.post('combats', {
      id: 0,
      user_id: 0,
      user: monsterName,
      message: rolled,
      result: totalDamage,
      type: 4,
    })
  }

  async function handleCritDamage(monsterId) {
    const monster = await monsters.filter(
      monster => monster.id === monsterId
    )[0]

    const attacks = monster?.monster_attack?.filter(a => a.id === selAttack)[0]

    const monsterName = monster.name
    const attackName = attacks?.name
    const monsterDice = Number(attacks?.dice) || 0
    const monsterMulti = Number(attacks?.multiplier) || 0
    const extraDamage = Number(attacks?.damage) || 0
    const monsterCrit = Number(attacks?.critical) || 0

    let result = 0
    const random = () => {
      return Math.floor(Math.random() * Number(monsterDice)) + 1
    }

    // eslint-disable-next-line
    for (let i = 0; i < monsterMulti; i++) {
      result += random()
    }

    const diceCrit = Number(result) * Number(monsterCrit)
    const damageCrit = Number(extraDamage) * Number(monsterCrit)

    const totalDamage =
      Number(result) * monsterCrit + Number(extraDamage) * monsterCrit

    const rolled = `CAUSOU DANO CRÍTICO com ${attackName}: ${monsterMulti} x d${monsterDice}: ${result} x ${monsterCrit} CRIT: ${diceCrit} + bônus de dano ${extraDamage} x ${monsterCrit}: ${damageCrit}, com resultado: ${totalDamage}.`

    api.post('combats', {
      id: 0,
      user_id: 0,
      user: monsterName,
      message: rolled,
      result: totalDamage,
      type: 4,
      isCrit: 'HIT',
    })
  }

  async function handleHealth(char) {
    await api.put(
      '/healthnow',
      { newHealth: health },
      {
        params: {
          id: char,
        },
      }
    )

    setHealth('')
  }

  async function handleMonsterHealth(monster) {
    await api.put(
      '/monsterhealthnow',
      { newHealth: monsterHealth },
      {
        params: {
          id: monster,
        },
      }
    )

    setMonsterHealth('')
  }

  const columns = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Portrait',
      dataIndex: 'portrait',
      render: portrait => (
        <Styles.Portrait>
          <img alt={portrait} src={portrait} />
        </Styles.Portrait>
      ),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'CA',
      dataIndex: 'armor',
      render: (text, item) =>
        `${
          10 +
          item.armor +
          item.shield +
          item.natural +
          item.deflex +
          item.others +
          (item.dexMod <= item.maxDex ? item.dexMod : item.maxDex)
        }`,
    },
    {
      title: 'Melee',
      dataIndex: 'melee',
      render: (text, item) => `${item.baseAttack + item.strMod}`,
    },
    {
      title: 'Range',
      dataIndex: 'range',
      render: (text, item) => `${item.baseAttack + item.dexMod}`,
    },
    {
      title: 'Vida',
      dataIndex: 'health',
      key: 'health',
    },
    {
      title: 'Saúde',
      dataIndex: 'health_now',
      key: 'health_now',
    },
    {
      title: 'Jogador',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Dano/Cura',
      dataIndex: 'pv',
      render: (text, item) => (
        <input
          ref={inputRef}
          onFocus={e => setHealth('')}
          value={health}
          onChange={e => setHealth(e.target.value)}
        />
      ),
    },
    {
      title: 'Salvar',
      dataIndex: 'Salvar',
      render: (text, item) => (
        <button onClick={() => handleHealth(item.id)}>Salvar</button>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      render: (text, item) => <Link to={`/characterview/${item.id}`}>Ver</Link>,
    },
  ]

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '32px',
      height: '32px',
      minWidth: '100px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
      ...provided,
      height: '32px',
      padding: '0 6px',
    }),

    input: (provided, state) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: state => ({
      display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '32px',
    }),
  }

  const monsterColumns = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Portrait',
      dataIndex: 'monster_url',
      render: monster_url => (
        <Styles.Portrait>
          <img alt={monster_url} src={monster_url} />
        </Styles.Portrait>
      ),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ND',
      dataIndex: 'challenge',
      key: 'challenge',
    },
    {
      title: 'CA',
      dataIndex: 'ca',
      key: 'ca',
    },
    {
      title: 'Dex',
      dataIndex: 'initiative',
      key: 'initiative',
    },
    {
      title: 'Vida',
      dataIndex: 'health',
      key: 'health',
    },
    {
      title: 'Saúde',
      dataIndex: 'health_now',
      key: 'health_now',
    },

    {
      title: 'Init',
      dataIndex: 'Init',
      render: (text, item) => (
        <button onClick={() => handleInitiative(item.id)}>Init</button>
      ),
    },
    {
      title: 'Arma',
      dataIndex: 'Arma',
      render: (text, item) => (
        <div>
          <Select
            styles={customStyles}
            maxMenuHeight={220}
            placeholder="ESCOLHA"
            onChange={e => setSelAttack(e?.value)}
            options={monsters.find(m => m.id === item.id)?.attacks}
            isClearable
          />
        </div>
      ),
    },

    {
      title: 'Attack',
      dataIndex: 'Attack',
      render: (text, item) => (
        <button onClick={() => handleAttack(item.id)}>Ataq</button>
      ),
    },
    {
      title: 'Dano',
      dataIndex: 'Dano',
      render: (text, item) => (
        <button onClick={() => handleDamage(item.id)}>Dano</button>
      ),
    },
    {
      title: 'Crit',
      dataIndex: 'Crit',
      render: (text, item) => (
        <button onClick={() => handleCritDamage(item.id)}>Crit</button>
      ),
    },
    {
      title: 'Dano/Cura',
      dataIndex: 'pv',
      render: (text, item) => (
        <input
          ref={inputRef}
          onFocus={e => setMonsterHealth('')}
          value={monsterHealth}
          onChange={e => setMonsterHealth(e.target.value)}
        />
      ),
    },
    {
      title: 'Salvar',
      dataIndex: 'Salvar',
      render: (text, item) => (
        <button onClick={() => handleMonsterHealth(item.id)}>Salvar</button>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      render: (text, item) => <Link to={`/monsterview/${item.id}`}>Ver</Link>,
    },
  ]

  return (
    <Styles.Container loading={loading ? 1 : 0}>
      <h2>GM Tools</h2>
      <Styles.Tables>
        <Styles.TableContainer>
          <Styles.MyTable rowKey="id" dataSource={list} columns={columns} />
        </Styles.TableContainer>

        <Styles.TableContainer>
          <Styles.MyTable
            rowKey="id"
            dataSource={monsters}
            columns={monsterColumns}
          />
        </Styles.TableContainer>
      </Styles.Tables>
    </Styles.Container>
  )
}
