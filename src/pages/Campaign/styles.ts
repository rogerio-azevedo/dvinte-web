import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  align-self: center;
  flex-direction: column;
  margin: 20px;

  h2 {
    color: ${({ theme }) => theme.colors?.title || '#333'};
    margin-bottom: 20px;
  }
`

export const FormContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;

  div {
    width: 100%;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #bf1650;
    font-size: 14px;

    &::before {
      display: inline;
      content: '⚠ ';
    }
  }

  input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors?.border || '#ddd'};
    border-radius: 4px;
    height: 40px;
    padding: 0 15px;
    color: rgba(111, 0, 0, 1);
    font-weight: 500;
    font-size: 15px;
    transition: border-color 0.2s;

    &::placeholder {
      color: rgba(111, 0, 0, 0.6);
    }

    &:focus {
      border-color: rgba(111, 0, 0, 0.8);
    }
  }

  button {
    align-self: flex-end;
    width: auto;
    min-width: 120px;
  }
`

export const ListItens = styled.div`
  margin-top: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 400px;
  overflow: auto;
  padding: 0 4px;

  ul {
    list-style: none;
  }

  li {
    background: rgba(111, 0, 0, 0.3);
    font-weight: 600;
    font-size: 15px;
    margin: 8px 0;
    padding: 12px 16px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(111, 0, 0, 0.4);
    }
  }
`
