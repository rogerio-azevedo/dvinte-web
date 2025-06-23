import { Container } from './styles'

interface ButtonProps {
  type: 'button' | 'submit' | 'reset'
  TextButton: string
  loading?: number
  perfil?: number
}

const Button: React.FC<ButtonProps> = ({
  type,
  TextButton,
  loading,
  perfil,
}) => (
  <Container loading={loading} perfil={perfil}>
    <button type={type}>{TextButton}</button>
  </Container>
)

export default Button
