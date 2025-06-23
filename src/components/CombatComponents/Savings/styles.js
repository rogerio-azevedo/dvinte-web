import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;
`

export const HeaderContainer = styled.div`
  display: flex;
  margin-top: 20px;
`
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const SavesContainer = styled.div`
  display: flex;
`

export const DicesContainer = styled.div`
  display: flex;
`

export const BoardContainer = styled.div`
  display: flex;
`

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;

  > div {
    display: flex;
    flex-direction: row;

    button {
      color: #6f0000;
      width: 72px;
      height: 35px !important;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      margin-right: 6px;
      margin-left: 6px;
      border-radius: 4px;
      border: 0;

      &:hover {
        background: ${darken(0.1, '#200122')};
        color: #fff;
      }

      -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
      -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    }
  }
`
