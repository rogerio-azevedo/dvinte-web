import styled from 'styled-components'

export const Container = styled.div`
  background: linear-gradient(-90deg, #200122, #8e0e00);
  padding: 0 30px;
  border-bottom: 1px solid;
`

export const Content = styled.div`
  height: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  aside {
    display: flex;
    align-items: center;
  }
`

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid #eee;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #fff;
    }

    a {
      display: block;
      margin-top: 2px;
      font-size: 13px;
      color: rgb(255, 255, 255, 0.7);
    }
  }

  img {
    margin-left: 10px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`
