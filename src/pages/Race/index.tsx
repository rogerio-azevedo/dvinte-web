/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

interface RaceData {
  name: string
}

interface RaceItem {
  id: number
  name: string
}

const Race: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RaceData>()
  const [list, setList] = useState<RaceItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('races')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit = async (data: RaceData): Promise<void> => {
    try {
      setLoading(true)
      const response = await api.post('races', data)
      const newList = [response.data, ...list]
      setList(newList)
      reset()
    } catch (error) {
      console.error('Erro ao salvar raça:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h2>Cadastro de Raças</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <input
            {...register('name', { required: true })}
            placeholder="Informe a Raça"
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

export default Race
