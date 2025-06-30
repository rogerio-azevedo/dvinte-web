import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Form, Input } from '@rocketseat/unform'
import * as Yup from 'yup'
import { signInRequest } from '../../store/modules/auth/actions'

interface FormData {
  email: string
  password: string
}

interface RootState {
  auth: {
    loading: boolean
  }
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),

  password: Yup.string().required('A senha é obrigatória'),
})

const SignIn: React.FC = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state: RootState) => state.auth.loading)

  const handleSubimit = ({ email, password }: FormData): void => {
    dispatch(signInRequest(email, password))
  }

  return (
    <>
      <Form schema={schema} onSubmit={handleSubimit}>
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="password" type="password" placeholder="Senha" />

        <button type="submit">{loading ? 'Carregando...' : 'Acessar'}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  )
}

export default SignIn
