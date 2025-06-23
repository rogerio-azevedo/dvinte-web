import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-self: right;
  flex-direction: row;
  align-items: center;
`

interface ArrowRigthProps {
  display: string
}

export const ArrowRigth = styled.span<ArrowRigthProps>`
  margin-left: 20px;
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
