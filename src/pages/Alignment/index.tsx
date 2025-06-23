import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

export default function Alignment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('alignments')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit = (data: any, e: any) => {
    async function saveData() {
      setLoading(true)
      const classe = await api.post('alignments', data)

      const newList = [classe.data, ...list]

      setList(newList as never[])
      setLoading(false)

      e.target.reset()
    }
    saveData()
  }

  return (
    <Container>
      <h2>Cadastro de Alinhamentos</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <input
            {...register('name', { required: true })}
            placeholder="Informe a Alinhamento"
          />
          {errors.name && errors.name.type === 'required' && (
            <span>Essa informação é obrigatória</span>
          )}
          <Button loading={loading ? 1 : 0} type="submit" TextButton="Gravar" />
        </FormContainer>
      </form>

      <ListItens>
        <div>
          {list &&
            list.map((item: any) => (
              <ul key={item.id}>
                <li>{item.name.toUpperCase()}</li>
              </ul>
            ))}
        </div>
      </ListItens>
    </Container>
  )
}
