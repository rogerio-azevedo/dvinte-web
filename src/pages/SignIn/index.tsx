import React from 'react'
import { Link } from 'react-router'
import { Form, Input } from '@rocketseat/unform'
import * as Yup from 'yup'
import { useAuth } from '../../contexts'
import dice from '../../assets/dices/d20.png'

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O e-mail é obrigatório'),

  password: Yup.string().required('A senha é obrigatória'),
})

const SignIn: React.FC = () => {
  const { signIn, loading } = useAuth()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubimit = (data: any): void => {
    const { email, password } = data
    signIn({ email, password })
  }

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-gray-900 relative"
      style={{
        backgroundImage: "url('/src/assets/dragon.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay para efeito escuro/glass */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md mx-auto p-8 rounded-2xl bg-white/10 border border-white/20 shadow-2xl flex flex-col items-center backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center">
          <img src={dice} alt="Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white tracking-tight mt-4">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-300 text-sm">
            Acesse sua conta para continuar
          </p>
        </div>
        <Form
          schema={schema}
          onSubmit={handleSubimit}
          className="w-full flex flex-col gap-4"
        >
          <Input
            name="email"
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-bold text-white text-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg transition-all duration-200 focus:ring-2 focus:ring-red-400"
          >
            {loading ? 'Carregando...' : 'Acessar'}
          </button>
        </Form>
        <div className="mt-4 w-full flex flex-col items-center gap-1">
          <Link to="/register" className="text-red-300 hover:underline text-sm">
            Criar conta gratuita
          </Link>
          <a href="#" className="text-gray-400 hover:underline text-xs">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  )
}

export default SignIn
