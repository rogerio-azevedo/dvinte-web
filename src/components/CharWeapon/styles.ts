import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;

  ul {
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-items: center;

      &:first-child {
        div {
          display: flex;
          flex-direction: column;

          label {
            text-align: center;
            font-size: 15px;
            display: block;
            font-weight: bold;
          }
        }
      }

      div {
        display: flex;
        flex-direction: column;

        label {
          display: none;
        }

        span {
          display: flex;
          justify-content: center;
          align-items: center;
          justify-items: center;
          width: 55px;
          height: 30px;
          border: 0;
          border-radius: 4px;

          -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
          -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
          box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
        }
      }
    }
  }
`

export const LabelDel = styled.label`
  margin-top: -4px;
  margin-bottom: 4px;
`

export const InputLarge = styled.input`
  color: #6f0000;
  width: 220px !important;
  height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 14px !important;
  margin: 5px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const InputMed = styled.input`
  color: #6f0000;
  width: 120px !important;
  height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 15px !important;
  margin: 5px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`

export const InputShort = styled.input`
  color: #6f0000;
  width: 75px !important;
  height: 30px;
  text-align: center;
  font-weight: 600;
  font-size: 15px !important;
  margin: 5px;
  border-radius: 4px;

  border: 0;
  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
`
