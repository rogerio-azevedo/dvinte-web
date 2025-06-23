import styled from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 100%;
`

export const MapContainer = styled.div`
  position: absolute;
  //width: ${props => (props.show ? '80%' : '100%')} !important;
  height: 100% !important;
  z-index: 2;

  top: 0px;
  left: 0px;
  position: relative;

  width: ${props => (props.show ? '80%' : '100%')};
  height: 100%;
  overflow: auto;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const ArmoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;
  width: 100%;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  h2 {
    margin-top: 20px;
  }
`

export const AttackContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 40px;

  button {
    color: #6f0000;
    width: 95px !important;
    height: 35px !important;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    border-radius: 4px;
    margin-right: 8px;
    margin-left: 8px;
    border: 0;

    &:hover {
      background: ${darken(0.1, '#200122')};
      color: #fff;
    }

    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  }
`

export const WeaponContainer = styled.div`
  display: flex;
`
