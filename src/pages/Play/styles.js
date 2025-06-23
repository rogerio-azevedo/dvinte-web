import styled from 'styled-components'

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
  position: relative;

  width: ${props => (props.show ? '80%' : '100%')};
  height: 100%;
  overflow: auto;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const DiceRollerContainer = styled.div`
  position: absolute;
  width: ${props => (props.show ? '80%' : '100%')} !important;
  height: 100% !important;
  z-index: 1;

  top: 0px;
  left: 0px;
`

export const ToolsContainer = styled.div`
  display: ${props => (props.show ? 'flex' : 'none')};
  width: 20%;
  min-width: 350px;
  max-width: 400px;
  flex-direction: column;
  height: 100%;
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 5px;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  div {
    margin-right: 5px;
    margin-left: 5px;
  }
`

export const SavesConteiner = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  border: 0;
  overflow: auto;
  align-items: center;
  justify-content: center;

  h2 {
    margin-top: 10px;
  }
`

export const AttackContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 0;
  overflow: auto;

  align-items: center;
  justify-content: center;

  h2 {
    margin-top: 10px;
  }
`

export const ButtonsContainer = styled.div`
  height: 280px;
  width: 100%;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`
