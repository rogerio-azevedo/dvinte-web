/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
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
  range?: number
}

interface Monster {
  id: number
  monster_url: string
  name: string
  challenge: number
  ca: number
  initiative: number
  health: number
  health_now: number
  monster_attack?: MonsterAttack[]
  attacks?: SelectOption[]
}

interface SelectOption {
  value: number
  label: string
}

export default function GmTools() {
  // const profile = useSelector(state => state.user.profile)

  const [characterHealth, setCharacterHealth] = useState<{
    [characterId: number]: number
  }>({})
  const [monsterHealth, setMonsterHealth] = useState<{
    [monsterId: number]: number
  }>({})
  const [list, setList] = useState<Character[]>([])
  const [monsters, setMonsters] = useState<Monster[]>([])
  const [selectedAttacks, setSelectedAttacks] = useState<{
    [monsterId: number]: number | null
  }>({})
  const [loading, setLoading] = useState(false)

  async function loadChar() {
    setLoading(true)
    try {
      const response = await api.get('characters')
      const respMonster = await api.get('monsters')

      const newMonsters = await respMonster?.data?.map((item: Monster) => {
        const attacks =
          item?.monster_attack?.map(a => ({
            value: a.id,
            label: a.name.toUpperCase(),
          })) || []
        return {
          ...item,
          attacks,
        }
      })

      setList(response.data)
      setMonsters(newMonsters)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChar()
  }, []) // eslint-disable-line

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

    const selectedAttackId = selectedAttacks[monsterId]
    const attacks = monster?.monster_attack?.filter(
      a => a.id === selectedAttackId
    )[0]

    if (!attacks) {
      console.error('No attack selected for monster:', monster.name)
      return
    }

    const monsterName = monster.name
    const base = Number(attacks.hit)
    const critFrom = Number(attacks.crit_from)
    const attackName = attacks.name
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

    const selectedAttackId = selectedAttacks[monsterId]
    const attacks = monster?.monster_attack?.filter(
      a => a.id === selectedAttackId
    )[0]

    if (!attacks) {
      console.error('No attack selected for monster:', monster.name)
      return
    }

    const monsterName = monster?.name
    const attackName = attacks.name
    const monsterDice = Number(attacks.dice) || 0
    const monsterMulti = Number(attacks.multiplier) || 0
    const extraDamage = Number(attacks.damage) || 0

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

    const selectedAttackId = selectedAttacks[monsterId]
    const attacks = monster?.monster_attack?.filter(
      a => a.id === selectedAttackId
    )[0]

    if (!attacks) {
      console.error('No attack selected for monster:', monster.name)
      return
    }

    const monsterName = monster.name
    const attackName = attacks.name
    const monsterDice = Number(attacks.dice) || 0
    const monsterMulti = Number(attacks.multiplier) || 0
    const extraDamage = Number(attacks.damage) || 0
    const monsterCrit = Number(attacks.critical) || 0

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

  async function handleCharacterHealth(characterId: number) {
    try {
      const health = characterHealth[characterId] || 0
      await api.put(
        '/healthnow',
        { newHealth: health },
        {
          params: {
            id: characterId,
          },
        }
      )

      // Limpar o valor do personagem específico
      setCharacterHealth(prev => ({
        ...prev,
        [characterId]: 0,
      }))

      // Recarregar os dados para atualizar a interface
      loadChar()
    } catch (error) {
      console.error('Erro ao atualizar saúde do personagem:', error)
    }
  }

  async function handleMonsterHealth(monsterId: number) {
    try {
      const health = monsterHealth[monsterId] || 0
      await api.put(
        '/monsterhealthnow',
        { newHealth: health },
        {
          params: {
            id: monsterId,
          },
        }
      )

      // Limpar o valor do monstro específico
      setMonsterHealth(prev => ({
        ...prev,
        [monsterId]: 0,
      }))

      // Recarregar os dados para atualizar a interface
      await loadChar()
    } catch (error) {
      console.error('Erro ao atualizar saúde do monstro:', error)
    }
  }

  const handleCharacterHealthChange = (
    characterId: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value)
    if (!isNaN(value)) {
      setCharacterHealth(prev => ({
        ...prev,
        [characterId]: value,
      }))
    }
  }

  const handleMonsterHealthChange = (
    monsterId: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value)
    if (!isNaN(value)) {
      setMonsterHealth(prev => ({
        ...prev,
        [monsterId]: value,
      }))
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
      render: (_, item) => (
        <input
          value={characterHealth[item.id] || 0}
          onChange={e => handleCharacterHealthChange(item.id, e)}
          type="number"
        />
      ),
    },
    {
      title: 'Salvar',
      dataIndex: 'Salvar',
      render: (_, item) => (
        <button onClick={() => handleCharacterHealth(item.id)}>Salvar</button>
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
      render: (challenge: number) => challenge?.toString() || '0',
    },
    {
      title: 'CA',
      dataIndex: 'ca',
      key: 'ca',
      render: (ca: number) => ca?.toString() || '0',
    },
    {
      title: 'Dex',
      dataIndex: 'initiative',
      key: 'initiative',
      render: (initiative: number) => initiative?.toString() || '0',
    },
    {
      title: 'Vida',
      dataIndex: 'health',
      key: 'health',
      render: (health: number) => health?.toString() || '0',
    },
    {
      title: 'Saúde',
      dataIndex: 'health_now',
      key: 'health_now',
      render: (health_now: number) => health_now?.toString() || '0',
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
      render: (_, item) => {
        const monster = monsters.find(m => m.id === item.id)
        const monsterAttacks = monster?.attacks || []
        return (
          <div>
            <Select
              styles={customStyles}
              maxMenuHeight={220}
              placeholder="ESCOLHA"
              onChange={(e: SelectOption | null) =>
                setSelectedAttacks(prev => ({
                  ...prev,
                  [item.id]: e?.value || null,
                }))
              }
              value={monsterAttacks.find(
                option => option.value === selectedAttacks[item.id]
              )}
              options={monsterAttacks}
              isClearable
            />
          </div>
        )
      },
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
      render: (_, item) => (
        <input
          value={monsterHealth[item.id] || 0}
          onChange={e => handleMonsterHealthChange(item.id, e)}
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
