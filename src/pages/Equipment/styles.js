import styled from 'styled-components'
import { Select } from 'antd'
import { Table } from 'antd'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 50px;

  h1 {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 600px;
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const FormContainer = styled.div`
  width: 100%;
  height: 600px;

  form {
    display: ${props => (props.showform === 'hide' ? 'none' : 'block')};
  }
`

export const DivPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-top: 10px;
`

export const ActivePage = styled.div`
  background: #8e0e00;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const Page = styled.div`
  background: #bbb;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  padding: 15px;

  > div {
    display: flex;
    flex-direction: column;
  }

  span {
    color: #bf1650;
  }
`

export const InputLarge = styled.input`
  width: 280px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputMed = styled.input`
  width: 160px;
  border: 1px solid rgba(111, 0, 0, 1);
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputShort = styled.input`
  width: 120px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`
export const SelectContainer = styled.div`
  width: 280px;

  label {
    margin-bottom: 3px;
  }
`
export const SelectFormated = styled(Select)`
  border: 1px solid rgba(111, 0, 0, 1);
  border-radius: 4px;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
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
        padding: 3px;
        text-align: center;
      }
    }
  }
`

export const TableContainer = styled.div`
  width: 100%;
  padding: 30px;
  border-radius: 4px;
  max-height: 700px;
  overflow: auto;
`

export const Portrait = styled.div`
  height: 90px;
  width: 90px;

  img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    border-radius: 50%;
  }
`
