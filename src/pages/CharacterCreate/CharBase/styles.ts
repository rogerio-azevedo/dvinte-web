import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 50px;

  h1 {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 900px;
  height: 600px;
`

export const FormContainer = styled.div`
  width: 900px;
  height: 600px;
`

export const DivPage = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-top: 10px;
`

export const ActivePage = styled.div`
  background: #8e0e00;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const Page = styled.div`
  background: #bbb;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  justify-items: center;
  padding: 15px;

  > div {
    display: flex;
    flex-direction: column;
  }

  span {
    color: #bf1650;

    /* &::before {
      display: inline;
      content: '⚠ ';
    } */
  }
`

export const InputLarge = styled.input`
  width: 250px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputMed = styled.input`
  width: 150px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputShort = styled.input`
  width: 80px;
  border: 1px solid;
  border-radius: 4px;
  height: 40px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  &::placeholder {
    color: rgba(111, 0, 0, 0.5);
  }

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`
