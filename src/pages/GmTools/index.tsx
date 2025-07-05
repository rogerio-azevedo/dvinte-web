/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
// import { useSelector } from 'react-redux'

import { Link } from 'react-router'
import Select from 'react-select'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import api from '../../services/api'

// import SelectCharacter from '~/components/SelectCharacter'
import * as Styles from './styles'
import { Container, TableContainer } from './styles'

interface Character {
  id: number
  portrait: string
  name: string
  level: number
  armor: number
  shield: number
  natural: number
  deflex: number
  others: number
  dexMod: number
  maxDex: number
  baseAttack: number
  strMod: number
  health: number
  health_now: number
  user: string
}

interface MonsterAttack {
  id: number
  name: string
  hit: number
  crit_from: number
  dice: number
  multiplier: number
  damage: number
  critical: number
}

interface Monster {
  id: number
  monster_url: string
  name: string
  challenge: string
  ca: number
  initiative: number
  health: number
  health_now: number
  monster_attack: MonsterAttack[]
  attacks: SelectOption[]
}

interface SelectOption {
  value: number
  label: string
}

export default function GmTools() {
  // const profile = useSelector(state => state.user.profile)
  const inputRef = useRef<HTMLInputElement>(null)

  const [monsterHealth, setMonsterHealth] = useState<number>(0)
  const [list, setList] = useState<Character[]>([])
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [selAttack, setSelAttack] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    setLoading(true)
    const response = await api.get('characters')
    const respMonster = await api.get('monsters')

    const newMonsters = await respMonster?.data?.map((item: Monster) => ({
      ...item,
      attacks: item?.monster_attack?.map(a => ({
        value: a.id,
        label: a.name.toUpperCase(),
      })),
    }))

    console.log('Characters:', response.data)
    console.log('Monsters:', newMonsters)

    setList(response.data)
    setMonsters(newMonsters)
    setLoading(false)
  }

  useEffect(() => {
    loadChar()
  }, [monsterHealth]) // eslint-disable-line

  async function handleInitiative(monsterId: number) {
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

  async function handleAttack(monsterId: number) {
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

  async function handleDamage(monsterId: number) {
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

  async function handleCritDamage(monsterId: number) {
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

  async function handleMonsterHealth(monster: number) {
    await api.put(
      '/monsterhealthnow',
      { newHealth: monsterHealth },
      {
        params: {
          id: monster,
        },
      }
    )

    setMonsterHealth(0)
  }

  const handleMonsterHealthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (!isNaN(value)) {
      setMonsterHealth(value)
    }
  }

  const columns: ColumnsType<Character> = [
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
      render: (_, item) =>
        `${
          10 +
          (item.armor ?? 0) +
          (item.shield ?? 0) +
          (item.natural ?? 0) +
          (item.deflex ?? 0) +
          (item.others ?? 0) +
          ((item.dexMod ?? 0) <= (item.maxDex ?? 0)
            ? item.dexMod ?? 0
            : item.maxDex ?? 0)
        }`,
    },
    {
      title: 'Melee',
      dataIndex: 'melee',
      render: (_, item) => `${(item.baseAttack ?? 0) + (item.strMod ?? 0)}`,
    },
    {
      title: 'Range',
      dataIndex: 'range',
      render: (_, item) => `${(item.baseAttack ?? 0) + (item.dexMod ?? 0)}`,
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
      render: () => (
        <input
          ref={inputRef}
          onFocus={() => setMonsterHealth(0)}
          value={monsterHealth}
          onChange={handleMonsterHealthChange}
          type="number"
        />
      ),
    },
    {
      title: 'Salvar',
      dataIndex: 'Salvar',
      render: (_, item) => (
        <button onClick={() => handleMonsterHealth(item.id)}>Salvar</button>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      render: (_, item) => <Link to={`/characterview/${item.id}`}>Ver</Link>,
    },
  ]

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      background: '#fff',
      borderColor: '#9e9e9e',
      minHeight: '32px',
      height: '32px',
      minWidth: '100px',
      boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided: any) => ({
      ...provided,
      height: '32px',
      padding: '0 6px',
    }),

    input: (provided: any) => ({
      ...provided,
      margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '32px',
    }),
  }

  const monsterColumns: ColumnsType<Monster> = [
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Portrait',
      dataIndex: 'monster_url',
      key: 'monster_url',
      render: (url: string, record: Monster) => (
        <Styles.Portrait>
          <img alt={record.name} src={url} />
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
      render: (_, item) => (
        <button onClick={() => handleInitiative(item.id)}>Init</button>
      ),
    },
    {
      title: 'Arma',
      dataIndex: 'Arma',
      render: (_, item) => (
        <div>
          <Select
            styles={customStyles}
            maxMenuHeight={220}
            placeholder="ESCOLHA"
            onChange={(e: SelectOption | null) =>
              setSelAttack(e?.value || null)
            }
            options={monsters.find(m => m.id === item.id)?.attacks}
            isClearable
          />
        </div>
      ),
    },
    {
      title: 'Attack',
      dataIndex: 'Attack',
      render: (_, item) => (
        <button onClick={() => handleAttack(item.id)}>Ataq</button>
      ),
    },
    {
      title: 'Dano',
      dataIndex: 'Dano',
      render: (_, item) => (
        <button onClick={() => handleDamage(item.id)}>Dano</button>
      ),
    },
    {
      title: 'Crit',
      dataIndex: 'Crit',
      render: (_, item) => (
        <button onClick={() => handleCritDamage(item.id)}>Crit</button>
      ),
    },
    {
      title: 'Dano/Cura',
      dataIndex: 'pv',
      render: () => (
        <input
          ref={inputRef}
          onFocus={() => setMonsterHealth(0)}
          value={monsterHealth}
          onChange={handleMonsterHealthChange}
          type="number"
        />
      ),
    },
    {
      title: 'Salvar',
      dataIndex: 'Salvar',
      render: (_, item) => (
        <button onClick={() => handleMonsterHealth(item.id)}>Salvar</button>
      ),
    },
    {
      title: 'Ação',
      dataIndex: 'ver',
      render: (_, item) => <Link to={`/monsterview/${item.id}`}>Ver</Link>,
    },
  ]

  return (
    <Container $loading={!loading}>
      <h2>GM Tools</h2>
      <TableContainer>
        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          loading={loading}
          size="small"
          scroll={{ x: 400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} personagens`,
          }}
        />
      </TableContainer>

      <TableContainer>
        <Table
          rowKey="id"
          dataSource={monsters}
          columns={monsterColumns}
          loading={loading}
          size="small"
          scroll={{ x: 400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} monstros`,
          }}
        />
      </TableContainer>
    </Container>
  )
}
