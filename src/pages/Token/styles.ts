import styled from 'styled-components'
import { darken } from 'polished'

interface ContainerProps {
  $loading?: boolean
}

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`

export const TableContainer = styled.div<ContainerProps>`
  width: 1000px;
  padding: 20px;
  border-radius: 4px;
  height: 100%;
  max-height: 100vh;
  overflow: auto;

  .ant-table {
    tbody {
      tr {
        td {
          height: 5px;
          padding: 2px;
        }
      }
    }
  }

  input {
    width: 60px;
    height: 30px;
    text-align: center;
  }

  button {
    height: 30px;
    width: 80px;
    background: #8e0e00;
    font-weight: bold;
    color: #fff;
    border: 0;
    border-radius: 4px;
    font-size: 14px;
    transition: background 0.3s;
    display: ${({ $loading }) => ($loading ? 'none' : 'block')};
    margin: 0 10px;

    &:hover {
      background: ${darken(0.09, '#8e0e00')};
    }
  }
`

export const Portrait = styled.div`
  height: 58px;
  width: 58px;

  img {
    width: 100%;
    height: 58px;
    object-fit: cover;
  }
`
