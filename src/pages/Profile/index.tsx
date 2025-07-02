import React from 'react'
import { Form, Input } from '@rocketseat/unform'

import { useAuth } from '../../contexts/AuthContext'
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

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth()

  const handleSubmit = (data: ProfileData): void => {
    updateProfile(data)
  }

  const handleSignOut = (): void => {
    signOut()
  }

  return (
    <Container>
      <Form initialData={user} onSubmit={handleSubmit}>
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
