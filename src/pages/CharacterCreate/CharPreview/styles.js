import styled from 'styled-components'
import { darken } from 'polished'

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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 900px;
  height: 600px;
  border-radius: 6px;
  padding: 2px;

  > div {
    display: flex;
    flex-direction: row;
  }
`

export const Portrait = styled.div`
  height: 150px;
  width: 110px;
  margin-right: 5px;

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 6%;

    background: #eee;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  }
`

export const BaseContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const LineContaniner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 4px;

    label {
      margin-top: 2px;
      font-size: 15px;
    }
  }
`

export const InputMini = styled.input`
  width: 100px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputShort = styled.input`
  width: 90px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputMed = styled.input`
  width: 165px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputLarge = styled.input`
  width: 215px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const ClassContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px;
`

export const ClassInput = styled.input`
  width: 275px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;
  margin-right: 8px;
  margin-bottom: 8px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const ClassValueInput = styled.input`
  width: 70px !important;
  height: 30px !important;
  border-radius: 4px;
  border: 1px solid #333;
  color: #6f0000;
  font-weight: 600;
  font-size: 16px !important;
  text-align: center;
  margin-right: 10px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const AttrsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`

export const AttributesContainer = styled.div`
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 250px;
  align-items: center;
  padding: 5px;

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 2px;
  }
`

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const AttrsLabel = styled.input`
  background: #6f0000;
  color: #fff;
  width: 58px;
  height: 38px;
  font-weight: 600;
  font-size: 18px;
  margin-right: 8px;
  text-align: center;
  border-radius: 4px;
  border: 0;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/

  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
`

export const AttrsValue = styled.input`
  background: #fff;
  color: #6f0000;
  width: 58px;
  height: 38px;
  font-weight: 600;
  font-size: 20px;
  margin-right: 10px;
  text-align: center;
  border-radius: 4px;
  border: 0;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently*/

  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
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
export const Button = styled.button`
  height: 40px;
  width: 120px;
  background: #8e0e00;
  font-weight: bold;
  color: #fff;
  border: 0;
  border-radius: 4px;
  font-size: 16px;
  transition: background 0.3s;
  display: ${props => (props.loading ? 'none' : 'block')};

  &:hover {
    background: ${darken(0.09, '#8e0e00')};
  }
`
