import styled from 'styled-components'
import { darken } from 'polished'
import { Table } from 'antd'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
`

export const MyTable = styled(Table)`
  tbody {
    tr {
      td {
        height: 5px;
        padding: 2px;
      }
    }
  }
`

export const TableContainer = styled.div`
  width: 1000px;
  padding: 20px;
  border-radius: 4px;
  height: 100%;
  max-height: 100vh;
  overflow: auto;
  /*
  -webkit-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5); */
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
    display: ${props => (props.loading ? 'none' : 'block')};
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
