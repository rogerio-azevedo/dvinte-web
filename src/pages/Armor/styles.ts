import styled from 'styled-components'
import { Table, Select } from 'antd'

interface FormContainerProps {
  showform: 'hide' | 'show'
}

interface InputContainerProps {
  loading: number
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    color: #333;
  }
`

export const FormContainer = styled.div<FormContainerProps>`
  display: ${props => (props.showform === 'show' ? 'block' : 'none')};
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-size: 14px;
    color: #333;
  }
`

export const TableContainer = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const MyTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #8e0e00;
    color: white;
    text-align: center;
  }

  .ant-table-tbody > tr > td {
    text-align: center;
  }
`

export const InputLarge = styled.input`
  width: 350px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`

export const InputMed = styled.input`
  width: 120px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`

export const SelectFormated = styled(Select)`
  width: 200px;

  .ant-select-selector {
    height: 40px !important;
    padding: 4px 10px !important;
  }

  .ant-select-selection-item {
    line-height: 30px !important;
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

export const InputShort = styled.input`
  width: 80px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;
  text-transform: uppercase;

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
