import styled from 'styled-components'

// interface ButtonProps {
//   disabled?: boolean
// }

export const Container = styled.div`
  display: flex;
  margin-left: 6px;
  margin-right: 6px;
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  div {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 5px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Button = styled.button`
  width: 100%;
  height: 40px;
  background: #8e0e00;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #600900;
  }
`

export const WeaponShort = styled.input`
  width: 80px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`

export const WeaponMed = styled.input`
  width: 120px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`

export const WeaponLarge = styled.input`
  width: 300px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`

export const WeaponExtLarge = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  resize: none;
`
