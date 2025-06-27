import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input } from '@rocketseat/unform'

import { signOut } from '../../store/modules/auth/actions'
import { updateProfileRequest } from '../../store/modules/user/actions'
// import AvatarInput from './AvatarInput'

import { Container } from './styles'

interface ProfileData {
  name: string
  email: string
  oldPassword?: string
  password?: string
  confirmPassword?: string
  avatar_id?: number
}

interface RootState {
  user: {
    profile: ProfileData
  }
}

const Profile: React.FC = () => {
  const dispatch = useDispatch()

  const profile = useSelector((state: RootState) => state.user.profile)

  const handleSubmit = (data: ProfileData): void => {
    dispatch(updateProfileRequest(data))
  }

  const handleSignOut = (): void => {
    dispatch(signOut())
  }

  return (
    <Container>
      <Form initialData={profile} onSubmit={handleSubmit}>
        {/* <AvatarInput name="avatar_id" /> */}
        <Input name="name" placeholder="Nome completo" />
        <Input type="email" name="email" placeholder="Seu e-mail" />
        <hr />
        <Input
          type="password"
          name="oldPassword"
          placeholder="Sua senha atual"
        />
        <Input type="password" name="password" placeholder="Nova Senha" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
        />

        <button type="submit">Atualizar perfil</button>
      </Form>

      <button type="button" onClick={handleSignOut}>
        Sair
      </button>
    </Container>
  )
}

export default Profile
