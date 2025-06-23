import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

export default function Divinity() {
  const { register, handleSubmit, errors } = useForm()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('divinities')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit = (data, e) => {
    async function saveData() {
      setLoading(true)
      const classe = await api.post('divinities', data)

      const newList = [classe.data, ...list]

      setList(newList)
      setLoading(false)

      e.target.reset()
    }
    saveData()
  }

  return (
    <Container>
      <h2>Cadastro de Divindades</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <input
            name="name"
            ref={register({ required: true })}
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
