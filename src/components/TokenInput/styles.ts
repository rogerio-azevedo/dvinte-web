import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;

  label {
    cursor: pointer;
    position: relative;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    &::after {
      content: 'Alterar token';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: rgba(111, 0, 0, 0.6);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover::after {
      opacity: 1;
    }

    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      border: 3px solid rgba(111, 0, 0, 0.3);
      background: #eee;
      object-fit: cover;
      transition: border-color 0.2s;

      &:hover {
        border-color: rgba(111, 0, 0, 0.5);
      }
    }

    input {
      display: none;
    }
  }
`
