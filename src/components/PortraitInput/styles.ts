import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  gap: 16px;

  label {
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
      border: 3px solid rgba(111, 0, 0, 0.3);
      background: #eee;
      object-fit: cover;
    }

    input {
      display: none;
    }
  }
`

export const SelectContainer = styled.div`
  width: 220px;

  /* Estilização do react-select para manter consistência com o tema */
  .select__control {
    border-color: #ddd;
    box-shadow: none;

    &:hover {
      border-color: #999;
    }
  }

  .select__placeholder {
    color: rgba(111, 0, 0, 0.6);
  }

  .select__single-value {
    color: rgba(111, 0, 0, 1);
    font-weight: 500;
  }

  .select__menu {
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`
