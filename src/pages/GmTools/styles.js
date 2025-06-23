import styled from 'styled-components'
import { darken } from 'polished'
import { Table } from 'antd'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    margin-top: 10px;
  }
`

export const Tables = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin-bottom: 50px;
`

export const TableContainer = styled.div`
  width: 100%;
  padding: 30px;
  border-radius: 4px;
  max-height: 500px;
  overflow: auto;

  input {
    width: 45px;
    height: 30px;
    text-align: center;
    display: block;
    margin: auto;
  }

  button {
    height: 30px;
    width: 55px;
    background: #8e0e00;
    font-weight: bold;
    color: #fff;
    border: 0;
    border-radius: 4px;
    font-size: 14px;
    transition: background 0.3s;
    display: ${props => (props.loading ? 'none' : 'block')};
    display: block;
    margin: auto;

    &:hover {
      background: ${darken(0.09, '#8e0e00')};
    }
  }
`

export const MyTable = styled(Table)`
  thead {
    tr {
      th {
        text-align: center;
        height: 5px;
        padding: 4px;
      }
    }
  }

  tbody {
    tr {
      td {
        height: 5px;
        padding: 2px;
        text-align: center;
      }
    }
  }
`

export const Portrait = styled.div`
  height: 35px;
  width: 35px;
  display: block;
  margin: auto;

  img {
    width: 100%;
    height: 35px;
    object-fit: cover;
    border-radius: 50%;
  }
`
