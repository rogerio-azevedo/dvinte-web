import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm, SubmitHandler } from 'react-hook-form'
import api from '../../services/api'

import Button from '../../components/Button'
import { Container, FormContainer, ListItens } from './styles'

interface CampaignData {
  name: string
  description: string
}

export default function Campaign() {
  const profile = useSelector((state: any) => state.user.profile)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignData>()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      const response = await api.get('campaigns')

      setList(response.data)
      setLoading(false)
    }

    loadList()
  }, [])

  const onSubmit: SubmitHandler<CampaignData> = (data, e) => {
    async function saveData() {
      setLoading(true)
      const classe = await api.post('campaigns', {
        name: data.name,
        description: data.description,
        user_id: profile.id,
      })

      const newList = [classe.data, ...list]

      setList(newList as never[])
      setLoading(false)

      e?.target.reset()
    }
    saveData()
  }

  return (
    <Container>
      <h2>Cadastro de Campanhas</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          <input
            {...register('name', { required: true })}
            placeholder="Informe a nome da Campanha"
          />
          {errors.name && <span>Essa informação é obrigatória</span>}
          <input
            {...register('description', { required: true })}
            placeholder="Informe uma breve descrição"
          />
          {errors.description && <span>Essa informação é obrigatória</span>}
          <Button type="submit" loading={loading ? 1 : 0} TextButton="Gravar" />
        </FormContainer>
      </form>

      <ListItens>
        <div>
          {list.map((item: any) => (
            <ul key={item.id}>
              <li>{item.name && item.name.toUpperCase()}</li>
            </ul>
          ))}
        </div>
      </ListItens>
    </Container>
  )
}
