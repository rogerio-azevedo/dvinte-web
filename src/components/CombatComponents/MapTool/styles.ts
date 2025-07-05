import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-top: 20px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  margin: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

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

export const InputLarge = styled.input`
  width: 300px;
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

export const InputMed = styled.input`
  width: 200px;
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

export const InputShort = styled.input`
  width: 110px;
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

export const RangeInput = styled.input`
  width: 150px;
  height: 6px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  margin-top: 8px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6f0000;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background 0.2s ease;

    &:hover {
      background: ${darken(0.1, '#6f0000')};
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6f0000;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: background 0.2s ease;

    &:hover {
      background: ${darken(0.1, '#6f0000')};
    }
  }
`

export const SelectMed = styled.select`
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
