import styled from 'styled-components'
import { type StyledProps } from './interfaces'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  height: calc(100vh - 51px);
  max-width: 2000px;
  margin: 0 auto;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
`

export const MapContainer = styled.div<StyledProps>`
  display: ${props => (props.show ? 'flex' : 'none')};
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden; /* Mudado para hidden para conter o scroll dentro do ScrollContainer */
  background: #fff;
  border-radius: 8px;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  /* Estilização da barra de rolagem */
  & > div {
    height: 100% !important;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.4);
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
  }
`

export const DiceRollerContainer = styled.div<StyledProps>`
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  z-index: 1;
  top: 0px;
  left: 0px;
`

export const ToolsContainer = styled.div<StyledProps>`
  display: ${props => (props.show ? 'flex' : 'none')};
  width: 450px;
  flex-direction: column;
  height: 100%;
  gap: 16px;
  overflow: hidden; /* Container pai não deve scrollar */

  /* Estilização da barra de rolagem para containers internos */
  & > div {
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.4);
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0.1);
  }
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  flex-shrink: 0; /* Previne o container de ícones de encolher */
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  div {
    margin-right: 8px;
    margin-left: 8px;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
`

export const SavesConteiner = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  border: 0;
  overflow: auto; /* Permite scroll apenas no conteúdo interno */
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  h2 {
    margin-bottom: 16px;
    flex-shrink: 0; /* Previne o título de encolher */
  }
`

export const AttackContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 0;
  overflow: auto; /* Permite scroll apenas no conteúdo interno */
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  h2 {
    margin-bottom: 16px;
    flex-shrink: 0; /* Previne o título de encolher */
  }
`

export const ButtonsContainer = styled.div`
  height: 280px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  flex-shrink: 0; /* Previne o container de botões de encolher */
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`
