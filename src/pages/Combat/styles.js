import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const CombatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => (props.show ? '80%' : '100%')};

  height: 100%;
  overflow: auto;
  border: 0;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const MapContainer = styled.div`
  display: flex;
  width: 80%;
  flex-direction: column;
  border: 0;
`

export const TalkContainer = styled.div`
  display: ${props => (props.show ? 'flex' : 'none')};
  width: 20%;
  min-width: 350px;
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

  /* &:nth-child(3) {
        margin-bottom: 20px;
        color: red !important;
    } */
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

export const ButtonsContainer = styled.div`
  height: 280px;
  width: 100%;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
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
