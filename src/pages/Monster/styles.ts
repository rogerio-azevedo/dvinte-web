import styled from 'styled-components'

interface ContainerProps {
  $loading: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  padding: 20px;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$loading ? 0.5 : 1)};
  pointer-events: ${props => (props.$loading ? 'none' : 'all')};
  transition: opacity 0.2s;
`

export const TableContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: auto;

  /* -webkit-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5); */
`

export const Portrait = styled.div`
  height: 80px;
  width: 80px;

  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
  }
`
