import styled from 'styled-components'
import { darken } from 'polished'

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
  width: 900px;
  height: 600px;
`

export const FormContainer = styled.div`
  width: 900px;
  height: 600px;
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
  justify-content: space-around;
  align-items: center;
  justify-items: center;
  padding: 15px;

  > div {
    display: flex;
    flex-direction: column;
  }

  ul {
    li {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

interface ButtonAddProps {
  loading?: boolean
}

export const ButtonAdd = styled.button<ButtonAddProps>`
  height: 40px;
  width: 120px;
  background: #8e0e00;
  font-weight: bold;
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 16px;
  transition: background 0.3s;
  display: ${props => (props.loading ? 'none' : 'block')};
  cursor: pointer;

  margin-top: 14px;

  &:hover {
    background: ${darken(0.09, '#8e0e00')};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

export const ClassInput = styled.input`
  width: 275px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;
  margin: 5px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const ClassValueInput = styled.input`
  width: 70px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;
  margin-right: 10px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`
