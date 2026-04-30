import styled from 'styled-components'
import { darken } from 'polished'

interface MapContainerProps {
  show: boolean
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  height: 100%;
`

export const MapContainer = styled.div<MapContainerProps>`
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
`

export const ArmoryContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 180px;
  width: 100%;

  h2 {
    margin-top: 20px;
  }
`

export const AttackContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  margin-bottom: 20px;

  button {
    color: #6f0000;
    flex: 1;
    min-width: 70px;
    height: 35px !important;
    padding: 0 4px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
    border-radius: 4px;
    border: 0;
    cursor: pointer;

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
  align-items: center;
  margin-bottom: 10px;
  width: 100%;

  label {
    margin-right: 10px;
    font-weight: 600;
    color: #6f0000;
  }

  p {
    color: #666;
    font-style: italic;
    margin: 0;
  }
`
