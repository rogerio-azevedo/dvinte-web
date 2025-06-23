import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  align-items: center !important;
  justify-content: center !important;
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between !important;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  div {
    display: flex;
    flex-direction: column;
  }
`

export const Button = styled.button`
  color: #6f0000;
  width: 90px;
  height: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  border-radius: 4px;
  border: 0;

  &:hover {
    background: ${darken(0.1, '#200122')};
    color: #fff;

    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.5);
  }

  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  padding-bottom: 10px;
  padding-top: 10px;

  > div {
    display: flex;
    flex-direction: column;
  }
`

export const WeaponExtLarge = styled.textarea`
  width: 380px;
  height: 80px;
  border: 1px solid;
  border-radius: 4px;
  padding: 5px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const WeaponLarge = styled.input`
  width: 350px;
  border: 1px solid;
  border-radius: 4px;
  height: 38px;
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

export const WeaponMed = styled.input`
  width: 100px;
  border: 1px solid;
  border-radius: 4px;
  height: 38px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;
  text-align: center;

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

export const WeaponShort = styled.input`
  width: 60px;
  border: 1px solid;
  border-radius: 4px;
  height: 38px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;
  text-align: center;

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
