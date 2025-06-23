import styled from 'styled-components'

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
`

export const Logo = styled.img`
  margin-right: 20px;
  padding-right: 20px;
  width: 130px;
`

export const Container = styled.div`
  ul {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;

    a {
      border-left: 1px solid #999;
      font-weight: bold;
      color: #fff;
      margin-right: 25px;
      padding-left: 10px;
      cursor: pointer;
    }

    li {
      position: relative;
      font-weight: bold;
      margin-right: 25px;
      padding-left: 10px;

      strong {
        border-left: 1px solid #999;
        font-weight: bold;
        color: #fff;
        padding-left: 10px;
        cursor: pointer;
      }
    }
  }
`

export const Dropmenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  width: 260px;
  left: calc(50% - 130px);
  top: calc(100% + 23px);
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #919aa1;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: ${props => (props.dig || props.rel ? 'block' : 'none')};

  &::before {
    content: '';
    position: absolute;
    left: calc(50% - 20px);
    top: -20px;
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid rgba(255, 255, 255, 0.75);
  }

  ul {
    li {
      width: 100%;
      padding: 0.25rem 1.5rem;
      clear: both;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;

      > a {
        border-left: 0;
        font-weight: 200;
        font-size: 13px;
        color: ${props => (props.perfil ? '#232947' : '#307958')};
        margin-right: 0;
        padding-left: 0;
      }
    }
  }
`
