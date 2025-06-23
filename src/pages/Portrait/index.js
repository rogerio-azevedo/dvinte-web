/* eslint-disable no-console */

import { useState, useEffect } from 'react'

import api from '../../services/api'

import AvatarInput from '../../components/PortraitInput'

import { Container, ImageContainer, List, Item } from './styles'

export default function Portrait() {
  // const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadList() {
      try {
        console.log('Fazendo requisição para portraits...')
        const response = await api.get('/portraits')
        console.log('Resposta recebida:', response.data)

        setList(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar portraits:', error)
        setLoading(false)
      }
    }

    loadList()
  }, [])

  return (
    <Container loading={loading ? 1 : 0}>
      <AvatarInput style={{ marginTop: '15px' }} />

      <ImageContainer>
        {list.map(item => (
          <List key={item.id}>
            <li>
              <Item>
                <img src={item.url} alt="" />
              </Item>
            </li>
          </List>
        ))}
      </ImageContainer>
    </Container>
  )
}
