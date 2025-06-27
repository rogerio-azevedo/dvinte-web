import styled from 'styled-components'

export const Container = styled.div``

export const MainResistContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: -25px;
  margin-bottom: 10px;
`
export const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`

export const ResistMainLabel = styled.input`
  background: #6f0000;
  color: #fff !important;
  font-weight: 600;
  font-size: 18px;
  padding: 5px;
  width: 125px;
  text-align: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  margin-top: 15px !important;
  margin-right: 10px !important;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const ResistLabel = styled.input`
  border: 0;
  width: 125px;
  text-align: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  font-size: 16px;
`
export const InputResitContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-items: center;
  justify-content: center;

  > div {
    display: flex;
    flex-direction: column;
  }
`

export const InputResit = styled.input`
  color: #6f0000;
  width: 48px;
  height: 44px;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin: 2px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`
