import styled from 'styled-components'

export const Container = styled.div`
  width: 250px;
  margin-right: 15px;
  margin-top: 4px;

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
