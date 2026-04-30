import styled from 'styled-components'
import { type StyledProps } from './interfaces'


export const SavesConteiner = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  border: 0;
  overflow: hidden;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  h2 {
    margin-bottom: 16px;
    flex-shrink: 0;
  }
`

export const AttackContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 0;
  overflow: hidden;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  h2 {
    margin-bottom: 16px;
    flex-shrink: 0;
  }
`

export const ButtonsContainer = styled.div`
  height: auto;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  flex-shrink: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`
