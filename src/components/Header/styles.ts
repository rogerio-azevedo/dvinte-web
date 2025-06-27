import styled from 'styled-components'

export const Container = styled.div`
  background: linear-gradient(-90deg, #200122, #8e0e00);
  padding: 0 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

export const Content = styled.div`
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  aside {
    display: flex;
    align-items: center;
    gap: 16px;
  }
`

export const MenuButton = styled.button`
  background: none;
  border: 0;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  svg {
    color: #fff;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`

export const Profile = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);

  div {
    text-align: right;
    margin-right: 16px;

    strong {
      display: block;
      color: #fff;
      font-size: 14px;
    }

    a {
      display: block;
      margin-top: 4px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      transition: color 0.2s;

      &:hover {
        color: #fff;
      }
    }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: #eee;
    object-fit: cover;
  }
`
