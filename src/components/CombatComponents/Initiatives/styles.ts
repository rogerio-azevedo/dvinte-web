import styled from 'styled-components'
import { darken } from 'polished'

interface ButtonProps {
  disabled?: boolean
}

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

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    display: flex;
    align-items: center;
  }
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

export const InitItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 2px 0;
`

export const InitControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-right: 4px;
`

export const ArrowButton = styled.button<ButtonProps>`
  width: 24px;
  height: 20px;
  background: #6f0000;
  color: #fff;
  border: 0;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${darken(0.1, '#6f0000')};
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`

export const DeleteButton = styled.button`
  width: 24px;
  height: 20px;
  background: #dc2626;
  color: #fff;
  border: 0;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  transition: all 0.2s;

  &:hover {
    background: ${darken(0.1, '#dc2626')};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
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

export const ButtonInit = styled.button<ButtonProps>`
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
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};

  &:hover:not(:disabled) {
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
