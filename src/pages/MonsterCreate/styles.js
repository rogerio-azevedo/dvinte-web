import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 20px;

  h1 {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    user-select: none;
  }

  h2 {
    margin-bottom: -10px;
  }
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1100px;
  height: 600px;
`

export const FormContainer = styled.div`
  margin-bottom: 40px;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  padding: 10px;

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

export const ButtonAdd = styled.button`
  height: 35px;
  width: 35px;
  padding: 0 5px;
  color: rgba(111, 0, 0, 1);
  margin-top: 18px;
`

export const TextAreaField = styled.textarea`
  width: 450px;
  height: 35px;
  border: 1px solid;
  border-radius: 4px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;

  border-top: 0;
  border-left: 0;
  border-right: 0;
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const InputExtraLarge = styled.input`
  width: 350px;
  border: 1px solid;
  border-radius: 4px;
  height: 35px;
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

export const InputLarge = styled.input`
  width: 300px;
  border: 1px solid;
  border-radius: 4px;
  height: 35px;
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
  width: 130px;
  border: 1px solid;
  border-radius: 4px;
  height: 35px;
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
  width: 90px;
  border: 1px solid;
  border-radius: 4px;
  height: 35px;
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

export const LabelSelect = styled.label`
  margin-bottom: 3px;
`

export const InputAttackName = styled.input`
  width: 250px;
  border: 1px solid;
  border-radius: 4px;
  height: 35px;
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

export const InputShortThin = styled.input`
  width: 90px;
  border: 1px solid;
  border-radius: 4px;
  height: 25px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;
  margin-right: 20px;
`

export const InputMedThin = styled.input`
  width: 250px;
  border: 1px solid;
  border-radius: 4px;
  height: 25px;
  padding: 0 15px;
  color: rgba(111, 0, 0, 1);
  font-weight: 500;
  font-size: 15px;
  margin-top: 4px;
  margin-right: 20px;
`
