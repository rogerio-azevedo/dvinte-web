import styled from 'styled-components'

interface ArrowLeftProps {
  display: string
}

export const ArrowLeft = styled.span<ArrowLeftProps>`
  margin-right: 20px;
  border-radius: 50%;
  cursor: ${props => (props.display === 'show' ? 'pointer' : 'default')};

  &:hover {
    -webkit-box-shadow: ${props =>
      props.display === 'show'
        ? '0px 0px 16px 0px rgba(142, 14, 0, 0.5)'
        : '0px 0px 0px 0px rgba(0, 0, 0, 0)'};

    -moz-box-shadow: ${props =>
      props.display === 'show'
        ? '0px 0px 16px 0px rgba(142, 14, 0, 0.5)'
        : '0px 0px 0px 0px rgba(0, 0, 0, 0)'};

    box-shadow: ${props =>
      props.display === 'show'
        ? '0px 0px 16px 0px rgba(142, 14, 0, 0.5)'
        : '0px 0px 0px 0px rgba(0, 0, 0, 0)'};
  }
`
