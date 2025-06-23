import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input } from '@rocketseat/unform'
import * as Yup from 'yup'

import { signUpRequest } from '../../store/modules/auth/actions'

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),

  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),

  password: Yup.string()
    .min(6, 'No mĩnimo 6 caracteres')
    .required('A senha é obrigatória'),

  phone: Yup.string().required('O telefone é obrigatório'),

  city: Yup.string().required('A cidade é obrigatória'),

  state: Yup.string().required('O estado é obrigatório'),
})

export default function SignUp() {
  const dispatch = useDispatch()

  function handleSubimit({ name, email, password, phone, city, state }) {
    dispatch(signUpRequest(name, email, password, phone, city, state))
  }

  return (
    <>
      <Form schema={schema} onSubmit={handleSubimit}>
        <Input name="name" placeholder="Nome" />
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="password" type="password" placeholder="Senha" />
        <Input name="phone" placeholder="Telefone" />
        <Input name="city" placeholder="Cidade" />
        <Input name="state" placeholder="Estado" />

        <button type="submit">Criar conta</button>
        <Link to="/">Já tenho uma conta.</Link>
      </Form>
    </>
  )
}
