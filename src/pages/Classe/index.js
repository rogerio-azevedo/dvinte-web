import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

export default function Classe() {
  const { register, handleSubmit, errors } = useForm()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('classes')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit = (data, e) => {
    async function saveData() {
      setLoading(true)
      const classe = await api.post('classes', data)

      const newList = [classe.data, ...list]

      setList(newList)
      setLoading(false)

      e.target.reset()
    }
    saveData()
  }

  return (
    <Container>
      <h2>Cadastro de Classes</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <div>
            <label htmlFor="Nome">Nome</label>
            <input
              name="name"
              ref={register({ required: true })}
              placeholder="Informe a Classe"
            />
            {errors.name && errors.name.type === 'required' && (
              <span>Essa informação é obrigatória</span>
            )}
          </div>

          <div>
            <label htmlFor="Attack">Attack</label>
            <select name="attack" ref={register({ required: true })}>
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
            <select name="fortitude" ref={register({ required: true })}>
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
            <select name="reflex" ref={register({ required: true })}>
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
            <select name="will" ref={register({ required: true })}>
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
