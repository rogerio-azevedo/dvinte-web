/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

interface Divinity {
  id: number
  name: string
}

interface FormData {
  name: string
}

export default function Divinity() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [list, setList] = useState<Divinity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get<Divinity[]>('divinities')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit = async (data: FormData, e: any) => {
    try {
      setLoading(true)
      const response = await api.post<Divinity>('divinities', data)

      setList([response.data, ...list])
      e.target.reset()
    } catch (error) {
      console.error('Erro ao salvar divindade:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h2>Cadastro de Divindades</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <input
            {...register('name', { required: true })}
            placeholder="Informe a Divindade"
          />
          {errors.name && errors.name.type === 'required' && (
            <span>Essa informação é obrigatória</span>
          )}
          <Button loading={loading ? 1 : 0} type="submit" TextButton="Gravar" />
        </FormContainer>
      </form>

      <ListItens>
        <div>
          {list.map(item => (
            <ul key={item.id}>
              <li>{item.name && item.name.toUpperCase()}</li>
            </ul>
          ))}
        </div>
      </ListItens>
    </Container>
  )
}
