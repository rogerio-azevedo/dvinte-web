import styled from 'styled-components'

export const Container = styled.div``

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

export const DefenseMainLabel = styled.input`
  background: #6f0000;
  color: #fff !important;
  font-weight: 600;
  font-size: 18px;
  padding: 5px;
  width: 65px;
  height: 50px;
  text-align: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  margin-top: 16px !important;
  margin-right: 10px !important;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const InputDefense = styled.input`
  color: #6f0000;
  width: 45px;
  height: 50px;
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
