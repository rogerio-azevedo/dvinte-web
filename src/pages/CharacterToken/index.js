import React, { useState, useEffect } from 'react'

import api from '../../services/api'
import { toast } from 'react-toastify'

import { FaCheckCircle, FaTimesCircle, FaTrashAlt } from 'react-icons/fa'
import * as Styles from './styles'

export default function CharacterToken() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('chartokens')
      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  async function handleHabilitaToken(token) {
    await api.put('chartokens', {
      id: token.id,
      enabled: !token.enabled,
    })

    if (token.enabled) {
      toast.error('Token desabilitado com sucesso!')
    } else {
      toast.success('Token habilitado com sucesso!')
    }

    const response = await api.get('chartokens')
    setList(response.data)
  }

  async function handleRemoveToken(id) {
    await api.delete(`chartokens/${id}`)

    toast.error('Token removido com sucesso!')

    const response = await api.get('chartokens')
    setList(response.data)
  }

  const columns = [
    {
      title: 'Token',
      dataIndex: 'image',
      render: image => (
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
      render: (text, item) =>
        item.enabled ? (
          <FaCheckCircle size={30} color="#006400" />
        ) : (
          <FaTimesCircle size={30} color="#8e0e00" />
        ),
    },
    {
      title: 'Habilitar',
      dataIndex: 'Habilitar',
      render: (text, item) =>
        item.enabled ? (
          <Styles.ButtonRemove onClick={() => handleHabilitaToken(item)}>
            Desabilitar
          </Styles.ButtonRemove>
        ) : (
          <Styles.ButtonAdd onClick={() => handleHabilitaToken(item)}>
            Habilitar
          </Styles.ButtonAdd>
        ),
    },
    {
      title: 'Remover',
      dataIndex: 'Remover',
      render: (text, item) => (
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
    <Styles.Container loading={loading ? 1 : 0}>
      <Styles.TableContainer>
        <Styles.MyTable rowKey="id" dataSource={list} columns={columns} />
      </Styles.TableContainer>
    </Styles.Container>
  )
}
