import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      -webkit-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.2);
      -moz-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.2);
      box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.2);
      width: 230px;
      height: 165px;
      background: #fdfdfd;
      border-radius: 6px;
      margin: 6px;
      transition: all 0.5s;

      &:hover {
        -webkit-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
        -moz-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.5);
      }

      div {
        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          align-self: flex-start;
          margin-top: 4px;
          margin-left: 4px;
          cursor: pointer;
        }

        div {
          margin-top: 15px;
          padding: 8px;
          border-radius: 50%;
          background: #fff;
        }

        h2 {
          margin-top: 5px;
          font-size: 30px;
          font-weight: 600;
          color: ${props => (props.perfil ? '#232947' : '#0d5b61')};
        }

        strong {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.6);
          font-weight: 500;
        }

        h4 {
          margin-top: 15px;
          color: ${props => (props.perfil ? '#232947' : '#0d5b61')};
          font-size: 16px;
        }
      }
    }
  }
`

export const DashHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    margin-left: 10px;
    font-weight: 500;
  }
`

export const DashContainer = styled.div`
  max-width: 970px;
  margin-top: 50px;
  opacity: ${props => (props.loading ? 0.2 : 1)};
`
