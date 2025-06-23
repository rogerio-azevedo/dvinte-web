//eslint-disable no-unused-vars

import styled from 'styled-components'
import { darken } from 'polished'

interface ContainerProps {
  loading?: number
  perfil?: number
}

export const Container = styled.div<ContainerProps>`
  button {
    height: 40px;
    transition: background 0.3s;
    display: ${props => (props.loading ? 'none' : 'block')};
    opacity: ${props => (props.loading ? 0.5 : 1)};

    &:hover {
      background: ${darken(0.1, '#fff')};
    }
  }
`
