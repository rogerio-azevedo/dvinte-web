import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const HeaderContainer = styled.div`
  display: flex;
  margin-top: 20px;
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const InitContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
  border: 0;
`

export const InitBoardContainer = styled.div`
  align-items: center;
  justify-content: center;
  max-height: 600px;
  overflow: auto;
`

export const InitUser = styled.input`
  color: #6f0000;
  width: 260px;
  height: 28px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  margin: 2px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const InitValue = styled.input`
  color: #6f0000;
  width: 50px;
  height: 28px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  margin: 2px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const Button = styled.button`
  color: #6f0000;
  width: 100px;
  height: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 4px;
  border: 0;
  margin-top: 20px;

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

export const ButtonInit = styled.button`
  color: #6f0000;
  width: 200px;
  height: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
  margin-left: 8px;
  border-radius: 4px;
  border: 0;
  margin-top: 20px;

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
