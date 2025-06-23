import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 50px;

  h1 {
    -webkit-user-select: none !important;
    -khtml-user-select: none !important;
    -moz-user-select: none !important;
    -o-user-select: none !important;
    user-select: none !important;
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

export const AttributesContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #6f0000;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px;
`

export const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const AttrLabel = styled.input`
  background: #6f0000;
  color: #fff;
  width: 70px;
  height: 58px;
  font-weight: 600;
  font-size: 24px;
  margin-right: 8px;
  text-align: center;
  border-radius: 4px;
  border: 0;

  -webkit-touch-callout: none !important; /* iOS Safari */
  -webkit-user-select: none !important; /* Safari */
  -khtml-user-select: none !important; /* Konqueror HTML */
  -moz-user-select: none !important; /* Old versions of Firefox */
  -ms-user-select: none !important; /* Internet Explorer/Edge */
  user-select: none !important; /* Non-prefixed version, currently*/

  -webkit-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
`

export const AttrValue = styled.input`
  background: #fff;
  color: #6f0000;
  width: 70px;
  height: 58px;
  font-weight: 600;
  font-size: 28px;
  margin-right: 10px;
  text-align: center;
  border-radius: 4px;
  border: 0;

  -webkit-touch-callout: none !important; /* iOS Safari */
  -webkit-user-select: none !important; /* Safari */
  -khtml-user-select: none !important; /* Konqueror HTML */
  -moz-user-select: none !important; /* Old versions of Firefox */
  -ms-user-select: none !important; /* Internet Explorer/Edge */
  user-select: none !important; /* Non-prefixed version, currently*/

  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ButtonBorder = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 29px;
  width: 30px;

  border-radius: 4px;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.5);
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
