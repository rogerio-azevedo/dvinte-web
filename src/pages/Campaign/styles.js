import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  align-self: center;

  flex-direction: column;
  margin: 20px;
`

export const FormContainer = styled.div`
  display: flex;
  width: 430px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  margin-top: 20px;

  span {
    color: #bf1650;

    &::before {
      display: inline;
      content: '⚠ ';
    }
  }

  input {
    width: 280px;
    border: 1px solid;
    border-radius: 4px;
    height: 40px;
    padding: 0 15px;
    color: rgba(111, 0, 0, 1);
    font-weight: 500;
    font-size: 15px;

    &::placeholder {
      color: rgba(111, 0, 0, 0.6);
    }
  }
`

export const ListItens = styled.div`
  margin-top: 20px;
  max-height: 400px;
  overflow: auto;

  li {
    background: rgba(111, 0, 0, 0.3);
    font-weight: 600;
    font-size: 15px;
    margin: 3px;
    padding: 10px;
    width: 400px;
  }
`
