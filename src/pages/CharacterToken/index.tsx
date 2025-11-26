/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaCheckCircle, FaTimesCircle, FaTrashAlt } from 'react-icons/fa'
import type { ColumnsType } from 'antd/es/table'
import Select, { type SingleValue } from 'react-select'
import api from '../../services/api'
import * as Styles from './styles'

interface User {
  id: number
  name: string
  email: string
  is_gm: boolean
  is_ativo: boolean
}

interface Character {
  id: number
  name: string
  user_id: number
  user?: User
}

interface CharacterToken {
  id: number
  image: string
  enabled: boolean
  character?: Character
}

interface UserOption {
  value: string
  label: string
}

export default function CharacterToken() {
  const [list, setList] = useState<CharacterToken[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingUser, setUpdatingUser] = useState<number | null>(null)

  useEffect(() => {
    async function loadList() {
      try {
        setLoading(true)
        const [tokensResponse, usersResponse] = await Promise.all([
          api.get<CharacterToken[]>('chartokens'),
          api.get<User[]>('users'),
        ])
        setList(tokensResponse.data)
        setUsers(usersResponse.data)
      } catch (error) {
        console.error('Erro ao carregar tokens:', error)
        toast.error('Erro ao carregar tokens!')
      } finally {
        setLoading(false)
      }
    }

    loadList()
  }, [])

  async function handleHabilitaToken(token: CharacterToken) {
    try {
      await api.put('chartokens', {
        id: token.id,
        enabled: !token.enabled,
      })

      if (token.enabled) {
        toast.error('Token desabilitado com sucesso!')
      } else {
        toast.success('Token habilitado com sucesso!')
      }

      const response = await api.get<CharacterToken[]>('chartokens')
      setList(response.data)
    } catch (error) {
      console.error('Erro ao atualizar token:', error)
      toast.error('Erro ao atualizar token!')
    }
  }

  async function handleRemoveToken(id: number) {
    try {
      await api.delete(`chartokens/${id}`)
      toast.success('Token removido com sucesso!')

      const response = await api.get<CharacterToken[]>('chartokens')
      setList(response.data)
    } catch (error) {
      console.error('Erro ao remover token:', error)
      toast.error('Erro ao remover token!')
    }
  }

  async function handleUpdateUser(
    token: CharacterToken,
    userId: number | null
  ) {
    try {
      setUpdatingUser(token.id)

      if (!userId) {
        toast.error('Selecione um usuário válido!')
        return
      }

      await api.put('chartokens', {
        id: token.id,
        user_id: userId,
      })

      toast.success('Usuário atribuído com sucesso!')

      const response = await api.get<CharacterToken[]>('chartokens')
      setList(response.data)
    } catch (error) {
      console.error('Erro ao atribuir usuário ao token:', error)
      toast.error('Erro ao atribuir usuário ao token!')
    } finally {
      setUpdatingUser(null)
    }
  }

  const userOptions: UserOption[] = users.map(user => ({
    value: user.id.toString(),
    label: user.name,
  }))

  const columns: ColumnsType<CharacterToken> = [
    {
      title: 'Token',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Styles.Portrait>
          <img alt={image} src={image} />
        </Styles.Portrait>
      ),
    },
    {
      title: 'Cod',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ativo',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (_: unknown, item: CharacterToken) =>
        item.enabled ? (
          <FaCheckCircle size={30} color="#006400" />
        ) : (
          <FaTimesCircle size={30} color="#8e0e00" />
        ),
    },
    {
      title: 'Habilitar',
      key: 'habilitar',
      render: (_: unknown, item: CharacterToken) =>
        item.enabled ? (
          <Styles.ButtonRemove
            $loading={loading}
            onClick={() => handleHabilitaToken(item)}
          >
            Desabilitar
          </Styles.ButtonRemove>
        ) : (
          <Styles.ButtonAdd
            $loading={loading}
            onClick={() => handleHabilitaToken(item)}
          >
            Habilitar
          </Styles.ButtonAdd>
        ),
    },
    {
      title: 'Usuário',
      key: 'user',
      render: (_: unknown, item: CharacterToken) => {
        const currentUserId = item.character?.user_id?.toString() || null
        const selectedOption = currentUserId
          ? userOptions.find(opt => opt.value === currentUserId)
          : null

        return (
          <div style={{ width: '200px' }}>
            <Select<UserOption>
              value={selectedOption}
              options={userOptions}
              placeholder="Selecione o usuário"
              isLoading={updatingUser === item.id}
              onChange={(selected: SingleValue<UserOption>) => {
                if (selected) {
                  const newUserId = parseInt(selected.value)
                  handleUpdateUser(item, newUserId)
                }
              }}
              styles={{
                input: (styles: any) => ({
                  ...styles,
                  height: '30px',
                  minHeight: '30px',
                }),
                control: (styles: any) => ({
                  ...styles,
                  minHeight: '30px',
                }),
              }}
            />
          </div>
        )
      },
    },
    {
      title: 'Remover',
      key: 'remover',
      render: (_: unknown, item: CharacterToken) => (
        <FaTrashAlt
          size={30}
          color="#8e0e00"
          cursor="pointer"
          onClick={() => handleRemoveToken(item.id)}
        />
      ),
    },
  ]

  return (
    <Styles.Container $loading={loading}>
      <Styles.TableContainer>
        <Styles.MyTable rowKey="id" dataSource={list} columns={columns} />
      </Styles.TableContainer>
    </Styles.Container>
  )
}
