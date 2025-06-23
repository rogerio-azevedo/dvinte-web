import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const HeaderContainer = styled.fieldset`
  margin-top: 15px;
  border: 1px solid #6f0000;
  border-radius: 4px;

  legend {
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 160px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 4px;
    border-radius: 4px;
  }

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 1200px;
    border-radius: 6px;
    padding: 2px;
  }

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const Portrait = styled.div`
  height: 160px;
  width: 130px;

  img {
    width: 100%;
    height: 160px;
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
  width: 110px !important;
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
  width: 190px !important;
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
  width: 240px !important;
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

export const StatsContainer = styled.div`
  display: flex;
  width: 1200px;
  border-radius: 6px;
`

export const AttributesContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;

  legend {
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 180px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  display: flex;
  flex-direction: column;
  width: 320px;
  align-items: center;
  padding: 10px;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 4px;

    > div {
      display: flex;
      flex-direction: column;
      margin-right: 5px;
      margin-top: 1px;
      align-items: center;
      justify-content: center;
      margin: 2px;
    }

    input {
      color: #6f0000;
      width: 50px;
      height: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 20px;
      margin: 2px;
      border-radius: 4px;

      border: 0;
      -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
      -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
    }
  }
`

export const NotesContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;

  legend {
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 180px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  display: flex;
  flex-direction: column;
  width: 560px;
  align-items: center;
  padding: 10px;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 4px;

    > div {
      display: flex;
      flex-direction: column;
      margin-right: 5px;
      margin-top: 1px;
      align-items: center;
      justify-content: center;
      margin: 2px;
    }

    input {
      color: #6f0000;
      width: 50px;
      height: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 20px;
      margin: 2px;
      border-radius: 4px;

      border: 0;
      -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
      -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
    }
  }
`

export const AttrLabel = styled.input`
  background: #6f0000;
  color: #fff !important;
  width: 60px !important;
  font-weight: 600;
  font-size: 18px;

  margin-right: 8px !important;
  text-align: center !important;
  border-radius: 4px;
`

export const AttrLabel1 = styled.input`
  background: #6f0000;
  color: #fff !important;
  width: 60px !important;
  font-weight: 600;
  font-size: 18px;

  margin-top: 18px !important;
  margin-right: 8px !important;
  text-align: center !important;
  border-radius: 4px;
`

export const HealthClassContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;

  legend {
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 160px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  display: flex;
  width: 390px;
  flex-direction: column;
  align-items: center;
  justify-items: center;

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const HealthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-items: center;
  padding: 20px;

  border-top: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    justify-items: center;

    margin-top: -10px;
    margin-left: 10px;
    margin-right: 10px;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      justify-items: center;
      margin-bottom: 10px;
      margin-right: 5px;
      margin-left: 5px;
    }
  }

  input {
    color: #6f0000;
    width: 80px;
    height: 40px;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    margin: 2px;

    border: 0;
    -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
  }
`

export const ClassContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-items: center;

  > ul {
    justify-content: center;
    align-items: center;
    justify-items: center;
    max-height: 225px;
    overflow: auto;

    li {
      input {
        color: #6f0000;
        width: 80px;
        height: 40px;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        margin: 5px;

        border: 0;
        -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
        -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
      }
    }
  }
`

export const ResistContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;
  width: 490px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  legend {
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 210px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const DefenseContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 5px;
`

export const ArmoryContainer = styled.div`
  display: flex;
  width: 1200px;
  margin-top: 3px;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  justify-items: center;

  &:last-child {
    margin-bottom: 60px;
  }
`

export const ArmorContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-items: center;
  padding: 2px;

  legend {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    margin-left: 20px;
    width: 250px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
`

export const WeaponContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;

  legend {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    margin-left: 5px;
    width: 130px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  div {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;

    ul {
      overflow-y: auto;

      li {
        display: flex;
        flex-direction: row;

        div {
          display: flex;
          flex-direction: column;

          > label {
            margin-left: 10px !important;
          }

          input {
            color: #6f0000;
            width: 65px;
            height: 30px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            margin: 5px;
            margin-right: 10px;

            border: 0;
            -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
            -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
`

export const EquipmentContainer = styled.fieldset`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 40px;

  legend {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    margin-left: 5px;
    width: 180px;
    color: #6f0000;
    background: #fff;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
    padding: 5px;
    border-radius: 4px;
  }

  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);

  div {
    ul {
      overflow-y: auto;

      li {
        display: flex;
        flex-direction: row;

        div {
          display: flex;
          flex-direction: column;

          > label {
            margin-left: 10px !important;
          }

          input {
            color: #6f0000;
            width: 65px;
            height: 30px;
            text-align: center;
            font-weight: 600;
            font-size: 16px;
            margin: 5px;
            margin-right: 10px;

            border: 0;
            -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
            -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
            box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
`
