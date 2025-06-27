/* eslint-disable no-console */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

type AttackType = 'low' | 'medium' | 'high'
type SavingThrowType = 'low' | 'high'

interface ClassData {
  id: number
  name: string
  attack: AttackType
  fortitude: SavingThrowType
  reflex: SavingThrowType
  will: SavingThrowType
}

interface FormData {
  name: string
  attack: AttackType
  fortitude: SavingThrowType
  reflex: SavingThrowType
  will: SavingThrowType
}

export default function Classe() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [list, setList] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      try {
        const response = await api.get<ClassData[]>('classes')
        setList(response.data)
      } catch (error) {
        console.error('Erro ao carregar classes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadList()
  }, [])

  const onSubmit = async (data: FormData, e: any) => {
    try {
      setLoading(true)
      const response = await api.post<ClassData>('classes', data)
      setList([response.data, ...list])
      e.target.reset()
    } catch (error) {
      console.error('Erro ao salvar classe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <h2>Cadastro de Classes</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <div>
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              {...register('name', { required: true })}
              placeholder="Informe a Classe"
            />
            {errors.name && errors.name.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

          <div>
            <label htmlFor="attack">Attack</label>
            <select id="attack" {...register('attack', { required: true })}>
              <option value="">Selecione</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.attack && errors.attack.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

          <div>
            <label htmlFor="fortitude">Fortitude</label>
            <select
              id="fortitude"
              {...register('fortitude', { required: true })}
            >
              <option value="">Selecione</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
            {errors.fortitude && errors.fortitude.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

          <div>
            <label htmlFor="reflex">Reflex</label>
            <select id="reflex" {...register('reflex', { required: true })}>
              <option value="">Selecione</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
            {errors.reflex && errors.reflex.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

          <div>
            <label htmlFor="will">Will</label>
            <select id="will" {...register('will', { required: true })}>
              <option value="">Selecione</option>
              <option value="low">Low</option>
              <option value="high">High</option>
            </select>
            {errors.will && errors.will.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

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
