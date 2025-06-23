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

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 30px;
`

export const GroupStatus = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`
export const Resume = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;

  label {
    width: 70px;
    font-weight: 600;
    color: #6f0000;
    text-align: center;
  }
`

export const InputResume = styled.input`
  color: #6f0000;
  width: 70px !important;
  height: 30px !important;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin: 2px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const Button = styled.button`
  color: #6f0000;
  width: 80px;
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
